"""Pydantic models for API request/response schemas"""
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from datetime import datetime
from enum import Enum
import uuid


class MessageRole(str, Enum):
    """Message role in conversation"""
    user = "user"
    assistant = "assistant"


class ResponseStatus(str, Enum):
    """Response generation status"""
    streaming = "streaming"
    completed = "completed"
    failed = "failed"


class Message(BaseModel):
    """Individual message in conversation history"""
    role: MessageRole
    content: str = Field(..., min_length=1)
    timestamp: datetime

    @field_validator('content')
    @classmethod
    def content_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Content must not be empty')
        return v


class Citation(BaseModel):
    """Reference to a specific location in the textbook"""
    citation_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    text: str = Field(..., min_length=1)
    url: str = Field(..., pattern=r'^/docs/.*')
    chapter: str
    chapter_number: int = Field(..., gt=0)
    section: Optional[str] = None
    section_number: Optional[int] = Field(None, gt=0)
    heading: Optional[str] = None


class RetrievedPassage(BaseModel):
    """Passage retrieved from vector search"""
    embedding_id: str
    text: str
    relevance_score: float = Field(..., ge=0.0, le=1.0)
    chapter: Optional[str] = None
    section: Optional[str] = None


class Query(BaseModel):
    """Query request from the frontend"""
    query_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    question: str = Field(..., min_length=1, max_length=2000)
    selected_text: Optional[str] = Field(None, max_length=5000)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    conversation_history: List[Message] = Field(default_factory=list, max_length=50)

    @field_validator('session_id')
    @classmethod
    def validate_session_id(cls, v):
        """Validate UUID format"""
        try:
            uuid.UUID(v)
        except ValueError:
            raise ValueError('session_id must be a valid UUID')
        return v


class Response(BaseModel):
    """Response from the chatbot"""
    response_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    query_id: str
    content: str = Field(..., min_length=1)
    citations: List[Citation] = Field(default_factory=list)
    retrieved_passages: List[RetrievedPassage] = Field(default_factory=list, max_length=5)
    confidence_score: Optional[float] = Field(None, ge=0.0, le=1.0)
    generation_time_ms: int = Field(..., ge=0)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    status: ResponseStatus = ResponseStatus.completed


class RateLimitInfo(BaseModel):
    """Rate limiting information for a session"""
    session_id: str
    queries_last_minute: List[datetime] = Field(default_factory=list)
    is_limited: bool = False
    wait_seconds: int = Field(0, ge=0)
    reset_at: Optional[datetime] = None


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    services: dict = Field(default_factory=dict)


class ErrorResponse(BaseModel):
    """Error response"""
    error: str
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    retry_after: Optional[int] = None


# SSE Event types for streaming responses
class StreamEvent(BaseModel):
    """Base class for SSE events"""
    event: str
    data: dict


class ChunkEvent(StreamEvent):
    """Chunk of streaming response"""
    event: str = "chunk"


class CitationEvent(StreamEvent):
    """Citation added to response"""
    event: str = "citation"


class DoneEvent(StreamEvent):
    """Response complete"""
    event: str = "done"
