# Quickstart Guide: RAG Chatbot Development

**Feature**: Integrated RAG Chatbot for AI/Spec-Driven Textbook
**Created**: 2025-12-15
**Audience**: Developers implementing the RAG chatbot feature

## Purpose

This guide provides step-by-step instructions for setting up the development environment, running the backend and frontend locally, and generating embeddings for the textbook content.

---

## Prerequisites

### Required Accounts & API Keys

1. **Cohere Account** (Free Tier)
   - Sign up at: https://cohere.com
   - Get API key from Dashboard → API Keys
   - Free tier: 1000 requests/month

2. **Qdrant Cloud Account** (Free Tier)
   - Sign up at: https://qdrant.tech/cloud/
   - Create a cluster (free tier: 1GB storage)
   - Get API URL and API key from cluster settings

3. **Google AI Studio** (Gemini API)
   - Sign up at: https://makersuite.google.com/app/apikey
   - Generate API key for Gemini access
   - Free tier: 60 requests/minute

4. **Render Account** (Free Tier - for deployment)
   - Sign up at: https://render.com
   - Free tier: 750 hours/month

5. **GitHub Account** (for GitHub Pages deployment)
   - Textbook already on GitHub Pages
   - No additional setup needed for development

### Software Requirements

- **Node.js**: v20.x or higher (Docusaurus 3 requirement)
- **Python**: 3.10 or higher
- **Git**: Latest version
- **Code Editor**: VS Code recommended (with ESLint, Prettier, Python extensions)

---

## Repository Structure

```
humanoid-robotics/
├── textbook/                    # Docusaurus site (existing)
│   ├── docs/                    # Textbook content (MDX files)
│   ├── src/
│   │   ├── components/
│   │   │   └── ChatbotWidget/   # New chatbot component
│   │   │       ├── index.jsx
│   │   │       ├── ChatbotUI.jsx
│   │   │       ├── useChatbot.js
│   │   │       ├── useRateLimit.js
│   │   │       └── styles.module.css
│   │   └── theme/
│   │       └── Root.js          # Swizzled (chatbot injection point)
│   ├── package.json
│   └── docusaurus.config.js
│
├── backend/                     # FastAPI backend (new)
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── config.py            # Environment variables
│   │   ├── models.py            # Pydantic models
│   │   ├── rag_pipeline.py      # Core RAG logic
│   │   ├── rate_limiter.py      # Rate limiting middleware
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── query.py         # Query endpoints
│   │       └── health.py        # Health check endpoint
│   ├── scripts/
│   │   └── generate_embeddings.py  # Embedding generation script
│   ├── tests/
│   │   ├── test_rag_pipeline.py
│   │   ├── test_rate_limiter.py
│   │   └── test_api.py
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   ├── .env.example
│   ├── Dockerfile
│   └── README.md
│
├── specs/
│   └── 001-rag-chatbot/
│       ├── spec.md
│       ├── plan.md
│       ├── research.md
│       ├── data-model.md
│       ├── contracts/
│       │   └── openapi.yaml
│       └── quickstart.md (this file)
│
├── .github/
│   └── workflows/
│       ├── deploy-backend.yml
│       └── deploy-frontend.yml
│
└── README.md
```

---

## Step 1: Clone and Initial Setup

```bash
# Clone the repository
git clone https://github.com/mairanoor412/humanoid-robotics.git
cd humanoid-robotics

# Checkout the feature branch
git checkout 001-rag-chatbot

# Install Node.js dependencies for Docusaurus
cd textbook
npm install
cd ..
```

---

## Step 2: Backend Setup

### 2.1 Create Backend Directory Structure

```bash
# Create backend directory (if it doesn't exist)
mkdir -p backend/app/routers
mkdir -p backend/scripts
mkdir -p backend/tests

# Create Python package markers
touch backend/app/__init__.py
touch backend/app/routers/__init__.py
touch backend/tests/__init__.py
```

### 2.2 Create requirements.txt

```bash
# Navigate to backend directory
cd backend

# Create requirements.txt with these contents:
cat > requirements.txt << 'EOF'
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.6.0
pydantic-settings==2.1.0
python-dotenv==1.0.0
cohere==4.37.0
qdrant-client==1.7.0
openai==1.10.0
python-multipart==0.0.6
httpx==0.26.0
EOF

# Create development requirements
cat > requirements-dev.txt << 'EOF'
-r requirements.txt
pytest==7.4.3
pytest-asyncio==0.23.3
pytest-cov==4.1.0
black==23.12.1
isort==5.13.2
flake8==7.0.0
mypy==1.8.0
EOF
```

### 2.3 Create Python Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements-dev.txt
```

### 2.4 Configure Environment Variables

```bash
# Create .env file from example
cat > .env << 'EOF'
# API Keys
COHERE_API_KEY=your_cohere_api_key_here
QDRANT_URL=https://your-cluster-id.aws.cloud.qdrant.io
QDRANT_API_KEY=your_qdrant_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI SDK Configuration (for Gemini)
OPENAI_API_BASE=https://generativelanguage.googleapis.com/v1beta/openai/

# Environment
ENVIRONMENT=development

# CORS (for local development)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Qdrant Collection
QDRANT_COLLECTION_NAME=textbook_sections

# Rate Limiting
RATE_LIMIT_QUERIES=10
RATE_LIMIT_WINDOW_SECONDS=60
EOF

# IMPORTANT: Replace placeholder values with your actual API keys
# Edit .env with your keys:
nano .env  # or use any text editor
```

**Security Note**: Never commit `.env` to Git. Add `.env` to `.gitignore`.

---

## Step 3: Generate Embeddings for Textbook Content

### 3.1 Create Embedding Generation Script

The script `backend/scripts/generate_embeddings.py` will:
1. Scan `textbook/docs/` for all `.md` and `.mdx` files
2. Parse each file to extract chapter, section, and content
3. Generate embeddings using Cohere API
4. Upload embeddings to Qdrant with metadata

```bash
# Ensure you're in the backend directory
cd backend

# Run the embedding generation script
python scripts/generate_embeddings.py --textbook-path ../textbook/docs --dry-run

# Review the output, then run for real
python scripts/generate_embeddings.py --textbook-path ../textbook/docs
```

**Expected Output**:
```
Scanning textbook directory: ../textbook/docs
Found 45 markdown files

Processing Chapter 1: Introduction to Physical AI & Humanoid Robotics
  - Section 1: Overview (350 words) ✓
  - Section 2: Key Concepts (480 words) ✓
  - Section 3: Applications (520 words) ✓

Processing Chapter 2: Fundamentals of Robotics
  - Section 1: Robot Components (410 words) ✓
  ...

Total sections embedded: 187
Total API calls (Cohere): 187
Total points uploaded (Qdrant): 187
Time elapsed: 4m 32s
```

**Troubleshooting**:
- **Error: "Cohere API key invalid"**: Check your `.env` file, ensure key is correct
- **Error: "Qdrant connection failed"**: Verify `QDRANT_URL` and `QDRANT_API_KEY`, check cluster is running
- **Error: "Rate limit exceeded"**: Wait 60 seconds (Cohere free tier: 100 req/min), script will retry

---

## Step 4: Run Backend Locally

### 4.1 Start FastAPI Server

```bash
# Ensure you're in the backend directory and venv is activated
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Run the server with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output**:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using watchfiles
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### 4.2 Test Backend with cURL

Open a new terminal and run:

```bash
# Test health endpoint
curl http://localhost:8000/health

# Expected response:
# {"status":"healthy","timestamp":"2025-12-15T14:30:00Z","services":{"qdrant":"connected","embedding_service":"available","llm_service":"available"},"version":"1.0.0"}

# Test query endpoint
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "123e4567-e89b-12d3-a456-426614174000",
    "question": "What is inverse kinematics?",
    "selected_text": null,
    "conversation_history": []
  }'

# Expected: SSE stream with chunks and citations
```

### 4.3 View Interactive API Docs

Open your browser and navigate to:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

You can test all endpoints interactively from the Swagger UI.

---

## Step 5: Run Frontend (Docusaurus) Locally

### 5.1 Configure Frontend Environment

```bash
# Navigate to textbook directory
cd ../textbook

# Create .env.local file
cat > .env.local << 'EOF'
REACT_APP_CHATBOT_API_URL=http://localhost:8000
EOF
```

### 5.2 Start Docusaurus Development Server

```bash
# Ensure you're in the textbook directory
cd textbook

# Start the development server
npm start
```

**Expected Output**:
```
[INFO] Starting the development server...
[SUCCESS] Docusaurus website is running at: http://localhost:3000/

✔ Client
  Compiled successfully in 8.45s

webpack compiled successfully
```

### 5.3 Access the Textbook with Chatbot

1. Open your browser and navigate to http://localhost:3000
2. You should see the chatbot trigger button in the bottom-right corner
3. Click the button to open the chatbot interface
4. Try asking a question: "What is inverse kinematics?"
5. Verify that the response includes citations and is grounded in the textbook

---

## Step 6: Development Workflow

### 6.1 Making Changes to the Chatbot UI

```bash
# Frontend changes (React components)
cd textbook/src/components/ChatbotWidget

# Edit the component files
# After saving, Docusaurus will hot-reload automatically

# Test your changes in the browser
```

### 6.2 Making Changes to the Backend

```bash
# Backend changes (FastAPI)
cd backend/app

# Edit the Python files
# Uvicorn will auto-reload on file save (if --reload flag is used)

# Run tests
cd ..
pytest tests/ -v

# Check code quality
black app/
isort app/
flake8 app/
```

### 6.3 Running Tests

**Backend Tests**:
```bash
cd backend

# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=app --cov-report=html

# Open coverage report
# Open htmlcov/index.html in your browser
```

**Frontend Tests**:
```bash
cd textbook

# Run Jest tests (if configured)
npm test

# Run Docusaurus build to check for errors
npm run build
```

---

## Step 7: Testing End-to-End Functionality

### 7.1 Test User Stories

**User Story 1: Ask Questions from Full Book**
1. Open chatbot
2. Ask: "What are the main types of robot joints?"
3. Verify response includes citations
4. Ask follow-up: "Can you explain revolute joints?"
5. Verify context is maintained

**User Story 2: Ask Questions from Selected Text**
1. Navigate to a chapter page
2. Select/highlight a paragraph
3. Click "Ask about this" button (or right-click)
4. Chatbot opens with selected text shown
5. Ask: "Explain this in simpler terms"
6. Verify response focuses on selected text

**User Story 4: Access Across Pages**
1. Open chatbot on Chapter 1
2. Ask a question
3. Navigate to Chapter 3
4. Verify chatbot remains visible
5. Verify conversation history persists

### 7.2 Test Edge Cases

**Rate Limiting**:
1. Ask 10 questions rapidly
2. On 11th query, verify error message: "Query limit reached"
3. Verify countdown timer appears
4. Wait for timer to expire, verify query works again

**No Results**:
1. Ask: "What is quantum entanglement?" (not in textbook)
2. Verify response: "I couldn't find information about this in the textbook"

**Long Question**:
1. Type a question longer than 2000 characters
2. Verify warning or truncation

**API Unavailable**:
1. Stop the backend server (Ctrl+C)
2. Ask a question
3. Verify error message: "Chatbot temporarily unavailable"
4. Verify retry button appears

---

## Step 8: Deployment

### 8.1 Deploy Backend to Render

1. **Create a new Web Service on Render**:
   - Go to https://dashboard.render.com/
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select branch: `001-rag-chatbot`
   - Configure build settings:
     - **Build Command**: `cd backend && pip install -r requirements.txt`
     - **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
     - **Environment**: Python 3.10

2. **Set Environment Variables**:
   - Add all variables from `.env` (without `CORS_ORIGINS=http://localhost:3000`)
   - Set `CORS_ORIGINS=https://mairanoor412.github.io`
   - Set `ENVIRONMENT=production`

3. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy the service URL (e.g., `https://rag-chatbot-backend.onrender.com`)

### 8.2 Deploy Frontend to GitHub Pages

1. **Update Frontend Environment Variable**:
   ```bash
   # In textbook/.env.production
   REACT_APP_CHATBOT_API_URL=https://rag-chatbot-backend.onrender.com
   ```

2. **Build and Deploy**:
   ```bash
   cd textbook
   npm run build
   npm run deploy  # Or use GitHub Actions workflow
   ```

3. **Verify Deployment**:
   - Visit https://mairanoor412.github.io/ai-spec-driven-textbook/
   - Test chatbot functionality
   - Check browser console for any CORS errors

---

## Common Issues and Solutions

### Issue 1: "Module not found" errors in backend

**Solution**:
```bash
# Ensure virtual environment is activated
source venv/bin/activate  # or venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt

# Verify installation
pip list | grep fastapi
```

### Issue 2: Docusaurus fails to start

**Solution**:
```bash
# Clear cache and node_modules
cd textbook
rm -rf node_modules .docusaurus build
npm install
npm start
```

### Issue 3: Embeddings generation fails halfway

**Solution**:
```bash
# The script is idempotent (safe to re-run)
# It will skip already-embedded sections
python scripts/generate_embeddings.py --textbook-path ../textbook/docs --resume
```

### Issue 4: CORS errors in browser console

**Solution**:
```bash
# Update backend .env
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Restart backend server
uvicorn app.main:app --reload
```

### Issue 5: Rate limiting not working

**Solution**:
- Check that `session_id` is being generated and persisted in `localStorage`
- Verify backend rate limiter middleware is registered in `app/main.py`
- Clear browser `localStorage` and test again

---

## Next Steps

1. **Implement Backend**: Follow `plan.md` to implement FastAPI routes and RAG pipeline
2. **Implement Frontend**: Follow `plan.md` to implement React chatbot component
3. **Write Tests**: Achieve 80%+ test coverage for backend
4. **Review Accessibility**: Use Lighthouse and axe DevTools to verify WCAG 2.1 AA compliance
5. **Performance Testing**: Load test backend with 50 concurrent users
6. **Deploy to Production**: Follow Step 8 above

---

## Additional Resources

- **Docusaurus Swizzling Guide**: https://docusaurus.io/docs/swizzling
- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **Cohere Embeddings API**: https://docs.cohere.com/docs/embed-models
- **Qdrant Python Client**: https://qdrant.tech/documentation/quick-start/
- **Gemini API**: https://ai.google.dev/gemini-api/docs
- **Render Deployment**: https://render.com/docs/deploy-fastapi

---

## Support

For issues or questions:
1. Check the [OpenAPI spec](./contracts/openapi.yaml) for API contract details
2. Review [data-model.md](./data-model.md) for entity schemas
3. Consult [research.md](./research.md) for architecture decisions and rationale
4. Open an issue on GitHub with logs and steps to reproduce

**Development Environment**: ✅ Ready
**Next Phase**: Implementation (Tasks generation and execution)
