"""Rate limiting for query endpoints"""
from fastapi import Request, HTTPException, Depends
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from datetime import datetime, timedelta
from typing import Dict, List
from app.config import settings
from app.models import RateLimitInfo, Query
import time


class RateLimiter:
    """
    In-memory rate limiter tracking queries per session

    Limits: 10 queries per minute per session (configurable)
    """

    def __init__(self):
        # session_id -> list of query timestamps
        self.query_log: Dict[str, List[datetime]] = {}
        self.max_queries = settings.rate_limit_queries
        self.window_seconds = settings.rate_limit_window_seconds

    def is_rate_limited(self, session_id: str) -> RateLimitInfo:
        """
        Check if a session is rate-limited

        Args:
            session_id: Session identifier

        Returns:
            RateLimitInfo with is_limited and wait_seconds
        """
        now = datetime.utcnow()
        cutoff = now - timedelta(seconds=self.window_seconds)

        # Get queries for this session
        if session_id not in self.query_log:
            self.query_log[session_id] = []

        # Filter to queries within the time window
        self.query_log[session_id] = [
            ts for ts in self.query_log[session_id]
            if ts > cutoff
        ]

        recent_queries = self.query_log[session_id]

        # Check if limit exceeded
        if len(recent_queries) >= self.max_queries:
            oldest_query = min(recent_queries)
            reset_at = oldest_query + timedelta(seconds=self.window_seconds)
            wait_seconds = int((reset_at - now).total_seconds()) + 1

            return RateLimitInfo(
                session_id=session_id,
                queries_last_minute=recent_queries,
                is_limited=True,
                wait_seconds=max(wait_seconds, 1),
                reset_at=reset_at
            )

        return RateLimitInfo(
            session_id=session_id,
            queries_last_minute=recent_queries,
            is_limited=False,
            wait_seconds=0,
            reset_at=None
        )

    def record_query(self, session_id: str):
        """
        Record a query for rate limiting

        Args:
            session_id: Session identifier
        """
        now = datetime.utcnow()

        if session_id not in self.query_log:
            self.query_log[session_id] = []

        self.query_log[session_id].append(now)

    def cleanup_old_sessions(self):
        """
        Remove old session data to prevent memory growth

        Called periodically to clean up sessions with no recent activity
        """
        now = datetime.utcnow()
        cutoff = now - timedelta(hours=1)  # Clean up sessions older than 1 hour

        sessions_to_remove = []

        for session_id, queries in self.query_log.items():
            if not queries or max(queries) < cutoff:
                sessions_to_remove.append(session_id)

        for session_id in sessions_to_remove:
            del self.query_log[session_id]


# Global rate limiter instance
rate_limiter = RateLimiter()


async def check_rate_limit(query: Query) -> Query:
    """
    FastAPI dependency to check rate limits for streaming endpoints

    Args:
        query: Query object containing session_id

    Returns:
        Query object if not rate-limited

    Raises:
        HTTPException: If rate limit is exceeded
    """
    limit_info = rate_limiter.is_rate_limited(query.session_id)

    if limit_info.is_limited:
        raise HTTPException(
            status_code=429,
            detail={
                "error": "rate_limit_exceeded",
                "message": f"Rate limit exceeded. Please wait {limit_info.wait_seconds} seconds.",
                "retry_after": limit_info.wait_seconds,
                "reset_at": limit_info.reset_at.isoformat() if limit_info.reset_at else None
            },
            headers={"Retry-After": str(limit_info.wait_seconds)}
        )

    # Record this query
    rate_limiter.record_query(query.session_id)

    return query


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    FastAPI middleware to enforce rate limiting on query endpoints
    """

    async def dispatch(self, request: Request, call_next):
        """
        Check rate limit before processing query requests

        Args:
            request: FastAPI request object
            call_next: Next middleware/handler in chain

        Returns:
            Response or error if rate-limited
        """
        # Only apply rate limiting to query endpoints
        if request.url.path not in ["/query", "/query-selection"]:
            return await call_next(request)

        # Extract session_id from request body (for POST requests)
        if request.method == "POST":
            try:
                # Read body without consuming it
                body = await request.body()

                # Parse session_id from JSON
                import json
                data = json.loads(body)
                session_id = data.get("session_id")

                # Re-create request with body (since we consumed it)
                async def receive():
                    return {"type": "http.request", "body": body}

                request._receive = receive

                if not session_id:
                    return JSONResponse(
                        status_code=400,
                        content={"error": "missing_session_id", "message": "session_id is required"}
                    )

                # Check rate limit
                limit_info = rate_limiter.is_rate_limited(session_id)

                if limit_info.is_limited:
                    return JSONResponse(
                        status_code=429,
                        content={
                            "error": "rate_limit_exceeded",
                            "message": f"Rate limit exceeded. Please wait {limit_info.wait_seconds} seconds.",
                            "retry_after": limit_info.wait_seconds,
                            "reset_at": limit_info.reset_at.isoformat() if limit_info.reset_at else None
                        },
                        headers={"Retry-After": str(limit_info.wait_seconds)}
                    )

                # Record this query
                rate_limiter.record_query(session_id)

            except Exception as e:
                # If parsing fails, continue without rate limiting
                pass

        # Proceed with request
        response = await call_next(request)
        return response
