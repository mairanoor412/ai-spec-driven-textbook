# RAG Chatbot Backend

FastAPI backend for the Integrated RAG Chatbot feature in the AI/Spec-Driven Physical AI & Humanoid Robotics textbook.

## Quick Start

For detailed setup instructions, see the [Quickstart Guide](../specs/001-rag-chatbot/quickstart.md).

### Prerequisites

- Python 3.10 or higher
- Cohere API key (free tier: https://cohere.com)
- Qdrant Cloud account (free tier: https://qdrant.tech/cloud/)
- Gemini API key (https://makersuite.google.com/app/apikey)

### Installation

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from example
cp .env.example .env
# Edit .env with your actual API keys
```

### Running Locally

```bash
# Ensure virtual environment is activated
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The server will be available at http://localhost:8000

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

### Generate Embeddings

Before testing queries, generate embeddings for the textbook content:

```bash
python scripts/generate_embeddings.py --textbook-path ../textbook/docs
```

## API Endpoints

- `POST /query` - Submit question with SSE streaming response
- `POST /query-selection` - Submit question with selected text context
- `GET /health` - Service health check

See [OpenAPI Specification](../specs/001-rag-chatbot/contracts/openapi.yaml) for full API documentation.

## Testing

```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=app --cov-report=html

# Open coverage report
# Open htmlcov/index.html in browser
```

## Deployment

This backend is configured for deployment on Render Free Tier.

See [Quickstart Guide - Step 8](../specs/001-rag-chatbot/quickstart.md#step-8-deployment) for deployment instructions.

## Architecture

- **Framework**: FastAPI with async/await
- **Embedding Service**: Cohere API (embed-english-v3.0)
- **Vector Database**: Qdrant Cloud
- **LLM**: Google Gemini (via OpenAI SDK)
- **Rate Limiting**: Hybrid (in-memory + frontend localStorage)

## Directory Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Environment variables
│   ├── models.py            # Pydantic models
│   ├── rag_pipeline.py      # Core RAG logic
│   ├── rate_limiter.py      # Rate limiting middleware
│   ├── routers/
│   │   ├── query.py         # Query endpoints
│   │   └── health.py        # Health check endpoint
│   └── utils/
│       ├── cohere_client.py
│       ├── qdrant_client.py
│       ├── llm_client.py
│       └── citation_parser.py
├── scripts/
│   └── generate_embeddings.py
├── tests/
│   ├── test_rag_pipeline.py
│   ├── test_rate_limiter.py
│   └── test_api.py
├── requirements.txt
├── requirements-dev.txt
├── .env.example
├── Dockerfile
└── README.md
```

## Contributing

See the [Implementation Plan](../specs/001-rag-chatbot/plan.md) for architecture details and design decisions.

## License

Part of the AI/Spec-Driven Physical AI & Humanoid Robotics textbook project.
