"""Application configuration using Pydantic Settings"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # API Keys
    cohere_api_key: str
    qdrant_url: str
    qdrant_api_key: str
    gemini_api_key: str

    # OpenAI SDK Configuration (for Gemini)
    openai_api_base: str = "https://generativelanguage.googleapis.com/v1beta/openai/"

    # Environment
    environment: str = "development"

    # CORS Configuration
    cors_origins: str = "http://localhost:3000,http://localhost:3001"

    # Qdrant Configuration
    qdrant_collection_name: str = "textbook_sections"

    # Rate Limiting
    rate_limit_queries: int = 10
    rate_limit_window_seconds: int = 60

    # Embedding Configuration
    cohere_model: str = "embed-english-v3.0"
    embedding_dimension: int = 1024

    # LLM Configuration
    # Note: gemini-1.5-flash is deprecated. Using gemini-2.5-flash (latest stable model)
    gemini_model: str = "gemini-2.5-flash"
    max_tokens: int = 1000
    temperature: float = 0.7

    # RAG Configuration
    top_k_results: int = 5
    min_similarity_score: float = 0.7

    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()
