# Data Model: RAG Chatbot

**Feature**: Integrated RAG Chatbot for AI/Spec-Driven Textbook
**Created**: 2025-12-15
**Status**: Complete

## Purpose

This document defines the data structures and entities for the RAG chatbot feature. All models are technology-agnostic representations that map to the frontend (TypeScript), backend (Python), and vector database (Qdrant).

---

## Core Entities

### 1. Query

Represents a user question submitted to the chatbot.

**Fields**:
- `query_id` (string, UUID): Unique identifier for the query
- `session_id` (string, UUID): Session this query belongs to
- `question` (string, 1-2000 chars): The user's question text
- `selected_text` (string | null, 0-5000 chars): Optional context from text selection
- `timestamp` (datetime, ISO 8601): When the query was submitted
- `conversation_history` (array of Message): Previous messages in the session for context

**Validation Rules**:
- `question` must not be empty and must not exceed 2000 characters
- `selected_text` if provided, must not exceed 5000 characters
- `session_id` must be a valid UUID v4
- `conversation_history` limited to last 10 messages (performance)

**Relationships**:
- Belongs to one `Session`
- May have one or more `Response` objects

**State Transitions**:
```
[Pending] → [Processing] → [Completed | Failed]
```

**Example**:
```json
{
  "query_id": "550e8400-e29b-41d4-a716-446655440000",
  "session_id": "123e4567-e89b-12d3-a456-426614174000",
  "question": "What is inverse kinematics?",
  "selected_text": null,
  "timestamp": "2025-12-15T14:30:00Z",
  "conversation_history": [
    {
      "role": "user",
      "content": "What are the main types of robot joints?",
      "timestamp": "2025-12-15T14:28:00Z"
    },
    {
      "role": "assistant",
      "content": "The main types are revolute, prismatic, and spherical joints...",
      "timestamp": "2025-12-15T14:28:05Z"
    }
  ]
}
```

---

### 2. Embedding

Vector representation of a textbook passage with metadata.

**Fields**:
- `embedding_id` (string, UUID): Unique identifier
- `vector` (array of float, 1024 dimensions): Cohere embedding
- `text` (string): Original passage text
- `chapter` (string): Chapter title (e.g., "Chapter 3: Kinematics")
- `chapter_number` (integer): Numeric chapter identifier
- `section` (string): Section title (e.g., "Section 2: Inverse Kinematics")
- `section_number` (integer): Numeric section identifier
- `heading` (string | null): Subsection heading if applicable
- `file_path` (string): Source file path in repository
- `doc_url` (string): Docusaurus URL path (e.g., "/docs/chapter-3/inverse-kinematics")
- `word_count` (integer): Number of words in the passage
- `tags` (array of string): Topical tags for filtering

**Validation Rules**:
- `vector` must have exactly 1024 dimensions (Cohere embed-english-v3.0)
- `text` must not be empty
- `chapter_number` and `section_number` must be positive integers
- `doc_url` must be a valid relative URL path
- `word_count` must match actual text length

**Relationships**:
- Many `Embedding` objects belong to one textbook document
- Many `Embedding` objects may be retrieved for one `Query`

**Example**:
```json
{
  "embedding_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "vector": [0.023, -0.145, 0.089, ...],  // 1024 floats
  "text": "Inverse kinematics (IK) is the process of determining joint angles that achieve a desired end-effector position. Unlike forward kinematics, IK often has multiple solutions...",
  "chapter": "Chapter 3: Kinematics",
  "chapter_number": 3,
  "section": "Section 2: Inverse Kinematics",
  "section_number": 2,
  "heading": "Analytical IK Solutions",
  "file_path": "docs/chapter-3/inverse-kinematics.md",
  "doc_url": "/docs/chapter-3/inverse-kinematics#analytical-ik-solutions",
  "word_count": 450,
  "tags": ["kinematics", "inverse-kinematics", "analytical", "mathematics"]
}
```

---

### 3. Response

The chatbot's answer to a query.

**Fields**:
- `response_id` (string, UUID): Unique identifier
- `query_id` (string, UUID): The query this answers
- `content` (string): Generated response text
- `citations` (array of Citation): Source references
- `retrieved_passages` (array of Embedding): Passages used for context
- `confidence_score` (float, 0.0-1.0 | null): Optional relevance score
- `generation_time_ms` (integer): Time taken to generate (milliseconds)
- `timestamp` (datetime, ISO 8601): When the response was generated
- `status` (enum): "streaming" | "completed" | "failed"

**Validation Rules**:
- `content` must not be empty
- `citations` must include at least one citation if content is not "no information found"
- `confidence_score` if provided, must be between 0.0 and 1.0
- `generation_time_ms` must be non-negative
- `retrieved_passages` limited to top 5 by relevance

**Relationships**:
- Belongs to one `Query`
- Contains one or more `Citation` objects

**State Transitions**:
```
[Streaming] → [Completed | Failed]
```

**Example**:
```json
{
  "response_id": "8f14e45f-ceea-467a-9d8d-4e6f0d6f9f3a",
  "query_id": "550e8400-e29b-41d4-a716-446655440000",
  "content": "Inverse kinematics (IK) is the process of determining the joint angles required to achieve a desired end-effector position. Unlike forward kinematics, which calculates position from angles, IK often has multiple solutions and requires numerical or analytical methods. [Chapter 3, Section 2]",
  "citations": [
    {
      "text": "Chapter 3, Section 2",
      "url": "/docs/chapter-3/inverse-kinematics#analytical-ik-solutions",
      "chapter": "Chapter 3: Kinematics",
      "section": "Section 2: Inverse Kinematics"
    }
  ],
  "retrieved_passages": [
    {
      "embedding_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "text": "Inverse kinematics (IK) is the process...",
      "relevance_score": 0.92
    }
  ],
  "confidence_score": 0.92,
  "generation_time_ms": 2450,
  "timestamp": "2025-12-15T14:30:02Z",
  "status": "completed"
}
```

---

### 4. Session

Represents a user's interaction with the chatbot across page navigation.

**Fields**:
- `session_id` (string, UUID): Unique session identifier
- `created_at` (datetime, ISO 8601): When the session started
- `last_activity` (datetime, ISO 8601): Last query timestamp
- `query_count` (integer): Total queries in this session
- `queries_last_minute` (array of datetime): Timestamps of recent queries (for rate limiting)
- `conversation_history` (array of Message): Full conversation
- `metadata` (object): Browser info, page context, etc.

**Validation Rules**:
- `session_id` must be a valid UUID v4
- `query_count` must be non-negative
- `queries_last_minute` limited to last 60 seconds
- `conversation_history` limited to last 50 messages (storage limit)

**Relationships**:
- Has many `Query` objects

**Storage Location**:
- Frontend: `localStorage` (persists across page navigation)
- Backend: In-memory store (transient, for rate limiting)

**Example**:
```json
{
  "session_id": "123e4567-e89b-12d3-a456-426614174000",
  "created_at": "2025-12-15T14:25:00Z",
  "last_activity": "2025-12-15T14:30:02Z",
  "query_count": 5,
  "queries_last_minute": [
    "2025-12-15T14:30:00Z",
    "2025-12-15T14:29:45Z"
  ],
  "conversation_history": [
    {
      "role": "user",
      "content": "What are the main types of robot joints?",
      "timestamp": "2025-12-15T14:28:00Z"
    },
    {
      "role": "assistant",
      "content": "The main types are revolute, prismatic, and spherical joints...",
      "timestamp": "2025-12-15T14:28:05Z"
    },
    {
      "role": "user",
      "content": "What is inverse kinematics?",
      "timestamp": "2025-12-15T14:30:00Z"
    },
    {
      "role": "assistant",
      "content": "Inverse kinematics (IK) is the process...",
      "timestamp": "2025-12-15T14:30:02Z"
    }
  ],
  "metadata": {
    "user_agent": "Mozilla/5.0...",
    "initial_page": "/docs/chapter-3/forward-kinematics",
    "current_page": "/docs/chapter-3/inverse-kinematics"
  }
}
```

---

### 5. Citation

Reference to a specific location in the textbook.

**Fields**:
- `citation_id` (string, UUID): Unique identifier
- `text` (string): Display text (e.g., "Chapter 3, Section 2")
- `url` (string): Docusaurus URL path
- `chapter` (string): Chapter title
- `chapter_number` (integer): Numeric chapter identifier
- `section` (string | null): Section title if applicable
- `section_number` (integer | null): Numeric section identifier
- `heading` (string | null): Subsection heading if applicable

**Validation Rules**:
- `text` must not be empty
- `url` must be a valid relative URL path starting with `/docs/`
- `chapter_number` must be a positive integer

**Relationships**:
- Belongs to one `Response`
- References one `Embedding` source

**Example**:
```json
{
  "citation_id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
  "text": "Chapter 3, Section 2",
  "url": "/docs/chapter-3/inverse-kinematics#analytical-ik-solutions",
  "chapter": "Chapter 3: Kinematics",
  "chapter_number": 3,
  "section": "Section 2: Inverse Kinematics",
  "section_number": 2,
  "heading": "Analytical IK Solutions"
}
```

---

### 6. Message (Conversation History)

Individual message in a conversation.

**Fields**:
- `role` (enum): "user" | "assistant"
- `content` (string): Message text
- `timestamp` (datetime, ISO 8601): When the message was sent/received

**Validation Rules**:
- `role` must be either "user" or "assistant"
- `content` must not be empty

**Relationships**:
- Part of `Session.conversation_history`
- Part of `Query.conversation_history`

**Example**:
```json
{
  "role": "user",
  "content": "What is inverse kinematics?",
  "timestamp": "2025-12-15T14:30:00Z"
}
```

---

### 7. RateLimitInfo

Rate limiting metadata for a session.

**Fields**:
- `session_id` (string, UUID): Session identifier
- `queries_last_minute` (array of datetime): Timestamps of queries in last 60 seconds
- `is_limited` (boolean): Whether session is currently rate-limited
- `wait_seconds` (integer): Seconds until next query allowed
- `reset_at` (datetime, ISO 8601): When rate limit resets

**Validation Rules**:
- `queries_last_minute` limited to 10 entries
- `wait_seconds` must be non-negative

**Storage Location**:
- Backend: In-memory dictionary (transient)
- Frontend: Computed from `localStorage` query timestamps

**Example**:
```json
{
  "session_id": "123e4567-e89b-12d3-a456-426614174000",
  "queries_last_minute": [
    "2025-12-15T14:30:00Z",
    "2025-12-15T14:29:55Z",
    "2025-12-15T14:29:50Z",
    // ... 7 more
  ],
  "is_limited": true,
  "wait_seconds": 15,
  "reset_at": "2025-12-15T14:30:15Z"
}
```

---

## Entity Relationships

```
Session (1) ──< (N) Query
Query (1) ──< (1..N) Response
Response (1) ──< (1..N) Citation
Response (N) ──> (N) Embedding (retrieved_passages)
```

**Cardinality**:
- One `Session` has many `Query` objects
- One `Query` has one primary `Response` (may have retries, but only one displayed)
- One `Response` has one or more `Citation` objects
- One `Response` references many `Embedding` objects (top-k retrieval)

---

## Frontend State Schema (TypeScript)

```typescript
// Core Types
type SessionId = string; // UUID v4
type QueryId = string;   // UUID v4
type ResponseId = string; // UUID v4

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // ISO 8601
}

interface Citation {
  citation_id: string;
  text: string;
  url: string;
  chapter: string;
  chapter_number: number;
  section?: string;
  section_number?: number;
  heading?: string;
}

interface Response {
  response_id: string;
  query_id: string;
  content: string;
  citations: Citation[];
  generation_time_ms: number;
  timestamp: string;
  status: 'streaming' | 'completed' | 'failed';
}

interface Query {
  query_id: string;
  session_id: string;
  question: string;
  selected_text?: string;
  timestamp: string;
  response?: Response;
}

interface Session {
  session_id: string;
  created_at: string;
  last_activity: string;
  query_count: number;
  conversation_history: Message[];
}

// LocalStorage Schema
interface ChatbotStorage {
  session: Session;
  queries_last_minute: string[]; // ISO 8601 timestamps
}

// React State
interface ChatbotState {
  isOpen: boolean;
  isLoading: boolean;
  error: ErrorInfo | null;
  session: Session;
  currentQuery: string;
  selectedText: string | null;
  rateLimitInfo: {
    isLimited: boolean;
    waitSeconds: number;
  };
}
```

---

## Backend Schema (Python/Pydantic)

```python
from pydantic import BaseModel, Field, UUID4
from typing import Optional, List
from datetime import datetime
from enum import Enum

class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"

class Message(BaseModel):
    role: MessageRole
    content: str = Field(..., min_length=1)
    timestamp: datetime

class Citation(BaseModel):
    citation_id: UUID4
    text: str = Field(..., min_length=1)
    url: str
    chapter: str
    chapter_number: int = Field(..., gt=0)
    section: Optional[str] = None
    section_number: Optional[int] = Field(None, gt=0)
    heading: Optional[str] = None

class ResponseStatus(str, Enum):
    STREAMING = "streaming"
    COMPLETED = "completed"
    FAILED = "failed"

class Response(BaseModel):
    response_id: UUID4
    query_id: UUID4
    content: str
    citations: List[Citation] = []
    generation_time_ms: int = Field(..., ge=0)
    timestamp: datetime
    status: ResponseStatus

class Query(BaseModel):
    query_id: UUID4
    session_id: UUID4
    question: str = Field(..., min_length=1, max_length=2000)
    selected_text: Optional[str] = Field(None, max_length=5000)
    timestamp: datetime
    conversation_history: List[Message] = Field(default_factory=list, max_length=10)

class Session(BaseModel):
    session_id: UUID4
    created_at: datetime
    last_activity: datetime
    query_count: int = Field(..., ge=0)
    queries_last_minute: List[datetime] = Field(default_factory=list, max_length=10)
    conversation_history: List[Message] = Field(default_factory=list, max_length=50)
```

---

## Qdrant Schema

```python
from qdrant_client.models import Distance, VectorParams, PointStruct

# Collection Configuration
collection_config = {
    "collection_name": "textbook_sections",
    "vectors_config": VectorParams(
        size=1024,  # Cohere embed-english-v3.0
        distance=Distance.COSINE
    )
}

# Point Structure (Embedding)
point_schema = {
    "id": "uuid-string",
    "vector": [float] * 1024,
    "payload": {
        "text": str,
        "chapter": str,
        "chapter_number": int,
        "section": str,
        "section_number": int,
        "heading": Optional[str],
        "file_path": str,
        "doc_url": str,
        "word_count": int,
        "tags": List[str]
    }
}
```

---

## Data Flow

### Query Submission Flow

```
User Input
   ↓
Frontend Validation (length, rate limit)
   ↓
Create Query object with session_id
   ↓
POST /query with Query JSON
   ↓
Backend Validation (rate limit, input)
   ↓
Generate query embedding (Cohere)
   ↓
Vector search in Qdrant (top-k=5)
   ↓
Assemble context from retrieved Embeddings
   ↓
LLM generation (Gemini) with streaming
   ↓
Parse citations from response
   ↓
Stream Response chunks to frontend (SSE)
   ↓
Frontend updates Message in conversation_history
   ↓
Save Session to localStorage
```

### Text Selection Flow

```
User selects text on page
   ↓
Frontend captures selection
   ↓
Show "Ask about this" button
   ↓
User clicks button
   ↓
Open chatbot with selected_text pre-populated
   ↓
User enters question
   ↓
Create Query with selected_text field
   ↓
Backend prioritizes selected_text in context assembly
   ↓
[Rest of flow same as Query Submission]
```

---

## Storage Locations

| Entity | Frontend | Backend | Database |
|--------|----------|---------|----------|
| **Session** | `localStorage` (full) | In-memory (rate limit only) | Not persisted |
| **Query** | In-memory (current) | Transient (request scope) | Not persisted |
| **Response** | In-memory (conversation) | Transient (request scope) | Not persisted |
| **Embedding** | Not stored | Cached (optional) | Qdrant (permanent) |
| **Citation** | Part of Response | Generated on-the-fly | Not persisted |
| **RateLimitInfo** | Computed from queries | In-memory dict | Not persisted |

**Privacy Note**: No user data is persisted on the backend. All conversation history stays in the user's browser (`localStorage`). The backend is stateless except for transient rate limiting.

---

## Next Steps

Data model complete. Proceed to:
1. Generate OpenAPI contract in `/contracts/`
2. Create `quickstart.md` for development setup
3. Write comprehensive `plan.md` with UI/UX specifications
