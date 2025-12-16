"""Health check endpoint"""
from fastapi import APIRouter
from app.models import HealthResponse
from app.utils.qdrant_client import vector_search_client
from datetime import datetime

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """
    Service health check endpoint

    Returns:
        HealthResponse with status of all services

    Example:
        GET /health
        Response: {"status": "healthy", "timestamp": "2025-12-16T...", "services": {...}}
    """
    services = {
        "api": "healthy",
        "rate_limiter": "healthy"
    }

    # Check Qdrant connectivity and collection status
    try:
        collection_info = vector_search_client.get_collection_info()
        services["qdrant"] = {
            "status": "healthy",
            "collection": collection_info.get("collection_name"),
            "vectors_count": collection_info.get("vectors_count", 0),
            "points_count": collection_info.get("points_count", 0)
        }
    except Exception as e:
        services["qdrant"] = {
            "status": "unhealthy",
            "error": str(e)
        }

    # Determine overall status
    overall_status = "healthy"
    for service_name, service_info in services.items():
        if isinstance(service_info, dict):
            if service_info.get("status") == "unhealthy":
                overall_status = "degraded"
                break
        elif service_info != "healthy":
            overall_status = "degraded"
            break

    return HealthResponse(
        status=overall_status,
        timestamp=datetime.utcnow(),
        services=services
    )
