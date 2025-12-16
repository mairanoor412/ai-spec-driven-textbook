"""FastAPI application entry point for RAG Chatbot"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from app.rate_limiter import rate_limiter
from app.models import HealthResponse
from datetime import datetime
import asyncio

# Create FastAPI application
app = FastAPI(
    title="RAG Chatbot API",
    description="Retrieval-Augmented Generation chatbot for AI/Spec-Driven Physical AI & Humanoid Robotics textbook",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
cors_origins = settings.cors_origins.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Note: Rate limiting is now handled via FastAPI dependencies in route handlers
# to avoid middleware conflicts with StreamingResponse


# Startup event
@app.on_event("startup")
async def startup_event():
    """
    Initialize services on application startup
    """
    print("Starting RAG Chatbot API...")
    print(f"Environment: {settings.environment}")
    print(f"CORS origins: {cors_origins}")
    print(f"Rate limit: {settings.rate_limit_queries} queries per {settings.rate_limit_window_seconds}s")

    # Initialize Qdrant collection
    try:
        from app.utils.qdrant_client import vector_search_client
        vector_search_client.ensure_collection_exists()
        print(f"Qdrant collection '{settings.qdrant_collection_name}' ready")
    except Exception as e:
        print(f"WARNING: Qdrant initialization warning: {str(e)}")

    # Start background task for rate limiter cleanup
    asyncio.create_task(cleanup_rate_limiter())


# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """
    Cleanup on application shutdown
    """
    print("Shutting down RAG Chatbot API...")


async def cleanup_rate_limiter():
    """
    Background task to periodically clean up old rate limiter sessions
    """
    while True:
        await asyncio.sleep(3600)  # Run every hour
        rate_limiter.cleanup_old_sessions()
        print("Rate limiter sessions cleaned up")


# Health check endpoint
@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """
    Service health check

    Returns:
        Health status of all services
    """
    services = {
        "api": "healthy",
        "rate_limiter": "healthy"
    }

    # Check Qdrant connectivity
    try:
        from app.utils.qdrant_client import vector_search_client
        collection_info = vector_search_client.get_collection_info()
        services["qdrant"] = {
            "status": "healthy",
            "collection": collection_info.get("collection_name"),
            "vectors_count": collection_info.get("vectors_count", 0)
        }
    except Exception as e:
        services["qdrant"] = {
            "status": "unhealthy",
            "error": str(e)
        }

    # Determine overall status
    overall_status = "healthy" if all(
        s == "healthy" or (isinstance(s, dict) and s.get("status") == "healthy")
        for s in services.values()
    ) else "degraded"

    return HealthResponse(
        status=overall_status,
        timestamp=datetime.utcnow(),
        services=services
    )


# Root endpoint
@app.get("/", tags=["Info"])
async def root():
    """
    API information endpoint
    """
    return {
        "name": "RAG Chatbot API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


# Register routers
from app.routers import health, query

app.include_router(health.router, tags=["Health"])
app.include_router(query.router, tags=["Query"])


# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    """Handle 404 errors"""
    return JSONResponse(
        status_code=404,
        content={
            "error": "not_found",
            "message": "The requested resource was not found",
            "path": str(request.url.path)
        }
    )


@app.exception_handler(500)
async def internal_error_handler(request, exc):
    """Handle 500 errors"""
    return JSONResponse(
        status_code=500,
        content={
            "error": "internal_server_error",
            "message": "An unexpected error occurred",
            "detail": str(exc) if settings.environment == "development" else None
        }
    )
