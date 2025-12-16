# Research Document: RAG Chatbot Architecture Decisions

**Feature**: Integrated RAG Chatbot for AI/Spec-Driven Textbook
**Created**: 2025-12-15
**Status**: Complete

## Purpose

This document captures research findings and architectural decisions for implementing a RAG-based chatbot that answers questions from the Physical AI & Humanoid Robotics textbook. All decisions prioritize the user experience requirements for a calm, professional, premium interface while meeting technical constraints (free tier services, sub-second performance, zero hallucination).

---

## Decision 1: Frontend UI Framework & Integration Strategy

### Context
Need to embed a chatbot interface in an existing Docusaurus site without disrupting the build or modifying book content (FR-001, FR-013).

### Options Considered

**Option A: Pure JavaScript/HTML/CSS (Vanilla)**
- **Pros**: No dependencies, minimal bundle size, direct DOM manipulation
- **Cons**: Manual state management, verbose code, harder to maintain complex UI

**Option B: React Component (Docusaurus Native)**
- **Pros**: Seamless Docusaurus integration, component-based, reusable, access to Docusaurus theme context
- **Cons**: Requires Docusaurus customization knowledge, must avoid breaking existing theme

**Option C: Web Component (Custom Element)**
- **Pros**: Framework-agnostic, encapsulated styles, can be injected via script tag
- **Cons**: Limited browser support for older devices, complexity in state management

### Decision: **Option B - React Component with Docusaurus Swizzling**

### Rationale
- Docusaurus is React-based, making React components the natural choice
- Swizzling allows us to safely extend the theme without breaking existing functionality
- React's component model aligns perfectly with the modular UI requirements (chat bubble, input, header, etc.)
- Access to Docusaurus theme variables ensures consistent styling with the textbook
- Can leverage Docusaurus plugins architecture for clean integration

### Implementation Strategy
1. Create a custom React component (`ChatbotWidget`) in `src/components/`
2. Swizzle the `Root` component to inject the chatbot on all pages
3. Use React hooks for state management (conversation history, loading states, rate limiting)
4. Store conversation in `localStorage` for persistence across navigation (User Story 4)
5. Use CSS modules for scoped styling with glassmorphism effects

### Trade-offs
- ✅ Native integration, no bundle duplication
- ✅ Access to Docusaurus routing for citation navigation
- ⚠️ Requires understanding Docusaurus swizzling (well-documented)
- ⚠️ Must test across Docusaurus versions for compatibility

---

## Decision 2: UI Design System & Glassmorphism Implementation

### Context
User requires a professional, calm, premium chatbot with glassmorphism effect, muted pastel colors, and soft shadows (UI/UX requirements).

### Options Considered

**Option A: CSS Backdrop Filter (Modern)**
- **Pros**: True glassmorphism with blur, hardware-accelerated, minimal code
- **Cons**: Limited browser support (IE, older Safari), fallback needed

**Option B: Frosted Glass SVG Filter**
- **Pros**: Wider browser support, customizable blur
- **Cons**: Performance overhead on mobile, complex implementation

**Option C: Semi-Transparent Background (No Blur)**
- **Pros**: Universal browser support, performant
- **Cons**: Not true glassmorphism, less premium feel

### Decision: **Option A - CSS Backdrop Filter with Fallback**

### Rationale
- Modern browsers (Chrome 76+, Firefox 70+, Safari 14+) cover 95%+ of users
- Fallback to semi-transparent background for unsupported browsers is acceptable
- Performance is critical for educational site (no complex SVG filters)
- Achieves the desired premium, calm aesthetic with minimal code

### Design Specifications

**Color Palette (Muted Pastels)**:
```css
--chatbot-bg: hsla(210, 25%, 98%, 0.75)    /* Soft white with blue tint */
--chatbot-border: hsla(210, 15%, 85%, 0.5) /* Subtle gray border */
--chatbot-accent: hsla(230, 30%, 85%, 1)   /* Soft lavender */
--chatbot-text: hsla(220, 15%, 25%, 1)     /* Muted dark blue-gray */
--chatbot-bubble-user: hsla(210, 30%, 90%, 0.9)     /* Light blue */
--chatbot-bubble-assistant: hsla(270, 20%, 92%, 0.9) /* Soft lavender */
--chatbot-shadow: 0 4px 16px hsla(220, 15%, 50%, 0.08) /* Subtle shadow */
```

**Glassmorphism Effect**:
```css
.chatbot-container {
  background: var(--chatbot-bg);
  backdrop-filter: blur(12px) saturate(150%);
  -webkit-backdrop-filter: blur(12px) saturate(150%);
  border: 1px solid var(--chatbot-border);
  border-radius: 16px;
  box-shadow: var(--chatbot-shadow);
}

/* Fallback for unsupported browsers */
@supports not (backdrop-filter: blur(12px)) {
  .chatbot-container {
    background: hsla(210, 25%, 98%, 0.95); /* Higher opacity */
  }
}
```

**Typography**:
- Font: System font stack for performance (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`)
- Line height: 1.6 for readability
- Font sizes: 14px body, 12px metadata/timestamps
- Letter spacing: 0.01em for clean, professional feel

**Layout**:
- Right-aligned floating panel (320px width desktop, full-screen mobile)
- Bottom-right trigger button (60px diameter, rounded circle)
- Max height: 600px with scrollable message area
- Padding: 16px (generous whitespace for calm aesthetic)

### Trade-offs
- ✅ Premium, professional aesthetic achieved
- ✅ Performant on modern devices
- ⚠️ Fallback experience slightly less premium on old browsers
- ✅ Accessible contrast ratios maintained (WCAG AA)

---

## Decision 3: Backend Architecture & RAG Pipeline

### Context
Need to process queries through embedding → vector search → LLM generation pipeline with strict constraints (FastAPI, Cohere, Qdrant, Gemini via OpenAI SDK).

### Options Considered

**Option A: Synchronous Request-Response**
- **Pros**: Simple implementation, easy error handling
- **Cons**: User waits for full pipeline (<3s required), blocks other requests

**Option B: Asynchronous with Server-Sent Events (SSE)**
- **Pros**: Stream response tokens as generated, better perceived performance
- **Cons**: More complex implementation, requires client-side SSE handling

**Option C: Asynchronous with WebSockets**
- **Pros**: Bidirectional communication, real-time updates
- **Cons**: Overkill for simple query-response, complex state management

### Decision: **Option B - Async FastAPI with SSE for Streaming**

### Rationale
- Streaming responses improve perceived performance (user sees words appear, not blank screen)
- FastAPI has excellent async support with `async def` and `yield`
- SSE is simpler than WebSockets for one-way streaming (server → client)
- Meets performance requirement: p95 < 3s (vector search <500ms + streaming LLM)
- Better user experience: "thinking" indicator immediately, then streaming text

### Pipeline Architecture

```
[Frontend] → [FastAPI Backend] → [RAG Pipeline]
                                      ↓
                            ┌─────────┴─────────┐
                            ↓                   ↓
                   [Qdrant Vector Search]  [Session Manager]
                            ↓
                   [Cohere Embeddings]
                            ↓
                   [Gemini LLM via OpenAI SDK]
                            ↓
                   [Citation Formatter]
                            ↓
                   [Response Stream] → Frontend
```

**API Endpoints**:

1. `POST /query` - Main query endpoint
   ```json
   Request: {
     "question": "What is inverse kinematics?",
     "session_id": "uuid",
     "selected_text": null | "text content",
     "conversation_history": [...]
   }
   Response: SSE stream of {
     "type": "chunk" | "citation" | "done",
     "content": "...",
     "metadata": {...}
   }
   ```

2. `POST /query-selection` - Selection-based query (Priority P2)
   ```json
   Request: {
     "question": "Explain this in simpler terms",
     "selected_text": "Inverse kinematics is...",
     "session_id": "uuid"
   }
   Response: Same as /query
   ```

3. `GET /health` - Health check
   ```json
   Response: {
     "status": "healthy",
     "qdrant": "connected",
     "embedding_service": "available"
   }
   ```

### RAG Pipeline Details

**Step 1: Query Embedding**
- Use Cohere `embed-english-v3.0` model (free tier: 1000 req/month)
- Cache embeddings for common questions (optional optimization)

**Step 2: Vector Search**
- Qdrant similarity search with cosine distance
- Top-k = 5 passages (balance between context and relevance)
- Metadata filters: chapter, section (if provided)
- Score threshold: 0.7 (filter irrelevant results)

**Step 3: Context Assembly**
- Rank passages by relevance score
- Include selected text (if provided) as highest priority context
- Format: `[Chapter X, Section Y] {passage text}\n\n`
- Max context: 2000 tokens (leave room for question + response)

**Step 4: LLM Generation**
- Use Gemini via OpenAI SDK (`openai.ChatCompletion.create` with custom base URL)
- System prompt: "You are a helpful assistant. Answer based ONLY on the provided passages. Include citations [Chapter X, Section Y]. If unsure, say 'I couldn't find information about this in the textbook.'"
- Stream response with `stream=True`
- Temperature: 0.3 (consistent, factual responses)

**Step 5: Citation Extraction**
- Parse response for citation markers `[Chapter X, Section Y]`
- Convert to clickable links with Docusaurus routes
- Example: `[Chapter 3, Section 2.1]` → `/docs/chapter-3/section-2-1`

### Trade-offs
- ✅ Streaming improves UX significantly
- ✅ Async handles 50 concurrent users (free tier limit)
- ⚠️ SSE requires client-side EventSource API (well-supported)
- ✅ Modular pipeline easy to test and maintain

---

## Decision 4: Rate Limiting & Session Management

### Context
Must prevent abuse with 10 queries/minute/session limit (FR-012, Edge Case requirement). Session must persist across page navigation (User Story 4).

### Options Considered

**Option A: Backend Rate Limiting (IP-based)**
- **Pros**: Secure, cannot be bypassed by client
- **Cons**: Shared IPs (schools, offices) affect multiple users

**Option B: Frontend Rate Limiting (localStorage)**
- **Pros**: Per-browser session, easy to implement
- **Cons**: Easily bypassed, not secure

**Option C: Hybrid (Frontend + Backend)**
- **Pros**: Best UX (immediate feedback) + security (backend enforcement)
- **Cons**: Duplicate logic

### Decision: **Option C - Hybrid Rate Limiting**

### Rationale
- Frontend tracking provides immediate UI feedback (countdown timer, disable button)
- Backend enforcement prevents actual abuse (malicious scripts)
- Session ID ties frontend and backend together

### Implementation Strategy

**Frontend (React State)**:
```javascript
// localStorage schema
{
  "chatbot_session_id": "uuid-v4",
  "chatbot_queries": [
    { "timestamp": 1702654800000, "question": "..." },
    // ... last 10 queries
  ],
  "chatbot_conversation": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}

// Rate limit check
const recentQueries = queries.filter(q =>
  Date.now() - q.timestamp < 60000 // 1 minute
);
if (recentQueries.length >= 10) {
  // Show countdown timer: "Wait {X} seconds"
  // Disable input field
}
```

**Backend (FastAPI Middleware)**:
```python
from fastapi import Request, HTTPException
from datetime import datetime, timedelta
from collections import defaultdict

# In-memory store (good enough for free tier, no persistence needed)
rate_limit_store = defaultdict(list)

async def rate_limit_middleware(request: Request, call_next):
    session_id = request.json().get("session_id")
    now = datetime.now()

    # Clean old entries
    rate_limit_store[session_id] = [
        ts for ts in rate_limit_store[session_id]
        if now - ts < timedelta(minutes=1)
    ]

    # Check limit
    if len(rate_limit_store[session_id]) >= 10:
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Wait before asking another question."
        )

    # Record query
    rate_limit_store[session_id].append(now)

    response = await call_next(request)
    return response
```

### Trade-offs
- ✅ Excellent UX with frontend feedback
- ✅ Secure with backend enforcement
- ⚠️ In-memory backend store resets on deployment (acceptable for free tier)
- ✅ Simple to implement and test

---

## Decision 5: Embedding Generation & Qdrant Schema

### Context
Need to convert textbook Markdown/MDX to embeddings with metadata (chapter, section, heading) for accurate retrieval (FR-002, FR-003).

### Options Considered

**Option A: Embed Full Chapters**
- **Pros**: Simple, fewer API calls
- **Cons**: Poor retrieval precision, exceeds token limits

**Option B: Embed by Section**
- **Pros**: Good granularity, manageable size
- **Cons**: May miss context from adjacent sections

**Option C: Embed by Paragraph with Sliding Window**
- **Pros**: Highest precision, captures local context
- **Cons**: Many API calls, complex overlap logic

### Decision: **Option B - Embed by Section with Metadata**

### Rationale
- Textbook follows standardized structure (Constitution: Overview → Concepts → Examples → Code → Exercises)
- Sections are natural semantic units (~500-1000 words)
- Metadata filters allow narrowing search to specific chapters
- Balance between precision and API quota (free tier: 1000 embeds/month)

### Qdrant Collection Schema

```python
from qdrant_client.models import Distance, VectorParams, PointStruct

collection_name = "textbook_sections"

# Create collection
client.create_collection(
    collection_name=collection_name,
    vectors_config=VectorParams(
        size=1024,  # Cohere embed-english-v3.0 dimension
        distance=Distance.COSINE
    )
)

# Point structure
PointStruct(
    id=uuid.uuid4(),
    vector=[...],  # 1024-dim embedding from Cohere
    payload={
        "text": "Section content...",
        "chapter": "Chapter 3: Kinematics",
        "chapter_number": 3,
        "section": "Section 2: Inverse Kinematics",
        "section_number": 2,
        "heading": "Analytical IK Solutions",
        "file_path": "docs/chapter-3/inverse-kinematics.md",
        "doc_url": "/docs/chapter-3/inverse-kinematics#analytical-ik-solutions",
        "word_count": 450,
        "tags": ["kinematics", "analytical", "mathematics"]
    }
)
```

### Embedding Generation Script

**Location**: `scripts/generate-embeddings.py`

**Process**:
1. Scan `textbook/docs/` directory for all `.md` and `.mdx` files
2. Parse markdown to extract:
   - Chapter number and title (from frontmatter or H1)
   - Section headings (H2)
   - Content under each section
3. For each section:
   - Generate embedding via Cohere API
   - Create Qdrant point with metadata
   - Batch upsert (100 points at a time)
4. Log statistics: total sections embedded, API calls, errors

**Metadata Extraction**:
```python
import frontmatter
import re

def extract_metadata(file_path: str):
    with open(file_path, 'r') as f:
        post = frontmatter.load(f)

    # Extract from frontmatter
    chapter_num = post.metadata.get('chapter')
    chapter_title = post.metadata.get('title')

    # Or parse from content
    content = post.content
    chapter_match = re.search(r'^#\s+Chapter\s+(\d+)[:\-]\s+(.+)$', content, re.M)

    sections = []
    for match in re.finditer(r'^##\s+(.+)$', content, re.M):
        section_title = match.group(1)
        # Extract content until next ## or EOF
        start = match.end()
        next_match = re.search(r'^##\s+', content[start:], re.M)
        end = start + next_match.start() if next_match else len(content)
        section_content = content[start:end].strip()

        sections.append({
            "title": section_title,
            "content": section_content,
            "word_count": len(section_content.split())
        })

    return {
        "chapter": chapter_title,
        "chapter_number": chapter_num,
        "sections": sections,
        "file_path": file_path
    }
```

### Trade-offs
- ✅ Section-level granularity balances precision and performance
- ✅ Metadata enables filtered search (e.g., "search only Chapter 3")
- ⚠️ Requires textbook to follow consistent section structure (enforced by Constitution)
- ✅ Free tier quotas sufficient: ~50 chapters × 5 sections = 250 embeddings

---

## Decision 6: Docusaurus Integration & Text Selection Handling

### Context
Must integrate chatbot on all pages without breaking Docusaurus build (FR-001). Support text selection for contextual queries (User Story 2, Priority P2).

### Options Considered

**Option A: Inject via Custom Plugin**
- **Pros**: Clean separation, follows Docusaurus best practices
- **Cons**: Plugin API learning curve, potential version compatibility

**Option B: Swizzle Root Component**
- **Pros**: Simple, direct control over rendering
- **Cons**: Must update manually if Docusaurus changes Root

**Option C: Inject via Script Tag in HTML Template**
- **Pros**: No build modifications, can work across frameworks
- **Cons**: Loses access to Docusaurus context, harder state management

### Decision: **Option B - Swizzle Root Component + Selection API**

### Rationale
- Root component wraps all pages, ensures chatbot appears everywhere (User Story 4)
- Access to Docusaurus routing for citation links
- Can use React Context for shared state
- Swizzling is stable and documented by Docusaurus

### Implementation: Text Selection

**Selection Detection**:
```javascript
// In ChatbotWidget component
useEffect(() => {
  const handleSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText.length > 10) { // Minimum 10 chars
      // Show "Ask about this" button near selection
      showSelectionButton(selectedText, selection.getRangeAt(0).getBoundingClientRect());
    } else {
      hideSelectionButton();
    }
  };

  document.addEventListener('mouseup', handleSelection);
  document.addEventListener('keyup', handleSelection); // Support keyboard selection

  return () => {
    document.removeEventListener('mouseup', handleSelection);
    document.removeEventListener('keyup', handleSelection);
  };
}, []);
```

**Selection Button UI**:
- Floating button appears near selection (absolute positioning)
- Styled consistently with chatbot (glassmorphism, muted colors)
- Click opens chatbot with selected text pre-populated
- Selected text shown as quoted context in chat

**Swizzling Commands**:
```bash
cd textbook
npm run swizzle @docusaurus/theme-classic Root -- --wrap
```

This creates `src/theme/Root.js`:
```javascript
import React from 'react';
import ChatbotWidget from '@site/src/components/ChatbotWidget';

export default function Root({children}) {
  return (
    <>
      {children}
      <ChatbotWidget />
    </>
  );
}
```

### Trade-offs
- ✅ Seamless integration with Docusaurus
- ✅ Access to routing and theme context
- ⚠️ Must test after Docusaurus upgrades
- ✅ Clean separation of concerns (chatbot in own component)

---

## Decision 7: Deployment Strategy & Environment Variables

### Context
Backend must deploy on Render Free Tier with zero downtime for API keys (FR-011, FR-018). Frontend deploys via GitHub Pages.

### Options Considered

**Option A: Monorepo (Backend + Frontend in same repo)**
- **Pros**: Single repo, unified versioning
- **Cons**: Complex CI/CD, frontend deploy affects backend

**Option B: Separate Repos**
- **Pros**: Independent deployments, clear boundaries
- **Cons**: Cross-repo coordination, duplicate workflows

**Option C: Monorepo with Separate Deploy Workflows**
- **Pros**: Code proximity, independent CI/CD per service
- **Cons**: Requires careful workflow design

### Decision: **Option C - Monorepo with Separate GitHub Actions Workflows**

### Rationale
- Code proximity aids development (shared types, API contracts)
- GitHub Actions can trigger on path changes (`backend/**` vs `textbook/**`)
- Render free tier supports GitHub repo integration
- Frontend already on GitHub Pages (no change needed)

### Repository Structure

```
humanoid-robotics/
├── textbook/               # Docusaurus site (existing)
│   ├── docs/
│   ├── src/
│   │   ├── components/
│   │   │   └── ChatbotWidget/
│   │   │       ├── index.jsx
│   │   │       ├── styles.module.css
│   │   │       └── useChatbot.js
│   │   └── theme/
│   │       └── Root.js      # Swizzled
│   └── docusaurus.config.js
├── backend/                 # FastAPI backend (new)
│   ├── app/
│   │   ├── main.py
│   │   ├── rag_pipeline.py
│   │   ├── rate_limiter.py
│   │   └── routers/
│   │       └── query.py
│   ├── scripts/
│   │   └── generate_embeddings.py
│   ├── requirements.txt
│   └── Dockerfile
├── .github/
│   └── workflows/
│       ├── deploy-backend.yml
│       └── deploy-frontend.yml
└── README.md
```

### Environment Variables

**Backend (Render Dashboard)**:
```bash
COHERE_API_KEY=<secret>
QDRANT_URL=https://<cluster-id>.aws.cloud.qdrant.io
QDRANT_API_KEY=<secret>
GEMINI_API_KEY=<secret>
OPENAI_API_BASE=https://generativelanguage.googleapis.com/v1beta/openai/
ENVIRONMENT=production
CORS_ORIGINS=https://mairanoor412.github.io
```

**Frontend (GitHub Repository Secrets → exposed as `process.env` at build)**:
```bash
REACT_APP_CHATBOT_API_URL=https://rag-chatbot-backend.onrender.com
```

### CI/CD Workflows

**Backend Deployment** (`.github/workflows/deploy-backend.yml`):
```yaml
name: Deploy Backend to Render
on:
  push:
    branches: [main]
    paths: ['backend/**']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Trigger Render Deploy
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK_URL }}
```

**Frontend Deployment** (`.github/workflows/deploy-frontend.yml`):
```yaml
name: Deploy Textbook to GitHub Pages
on:
  push:
    branches: [main]
    paths: ['textbook/**']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: cd textbook && npm ci
      - name: Build Docusaurus
        run: cd textbook && npm run build
        env:
          REACT_APP_CHATBOT_API_URL: ${{ secrets.CHATBOT_API_URL }}
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./textbook/build
```

### Trade-offs
- ✅ Independent deployments avoid cascading failures
- ✅ Secrets managed securely (Render + GitHub)
- ⚠️ Requires initial setup for both platforms
- ✅ Free tier limits: Render (750hrs/month), GitHub Pages (unlimited public)

---

## Decision 8: Accessibility & Mobile Responsiveness

### Context
Must support keyboard navigation, screen readers (WCAG 2.1 AA goal), and mobile devices (SC-010).

### Options Considered

**Option A: Minimal Accessibility (Basic ARIA)**
- **Pros**: Quick implementation
- **Cons**: Excludes users with disabilities, poor SEO

**Option B: Full WCAG 2.1 AAA**
- **Pros**: Maximum accessibility
- **Cons**: Significant development overhead, diminishing returns

**Option C: WCAG 2.1 AA with Focus on Core Interactions**
- **Pros**: Good balance, covers most users, reasonable effort
- **Cons**: Some edge cases may not be perfect

### Decision: **Option C - WCAG 2.1 AA Compliance**

### Rationale
- Educational content should be accessible (aligns with Constitution's "Educational Excellence and Accessibility")
- AA level covers 95%+ of accessibility requirements
- Focus on keyboard navigation and screen reader support for chatbot

### Implementation Requirements

**Keyboard Navigation**:
- `Tab`: Focus chatbot trigger button → input field → send button → message actions
- `Enter`: Submit query (when input focused)
- `Escape`: Close chatbot
- `Ctrl + /`: Open chatbot (global shortcut)
- Arrow keys: Navigate message history (optional enhancement)

**ARIA Attributes**:
```jsx
<div role="complementary" aria-label="Textbook Assistant Chatbot">
  <button
    aria-label="Open chatbot assistant"
    aria-expanded={isOpen}
    aria-controls="chatbot-panel"
    onClick={toggleChatbot}
  >
    💬
  </button>

  <div
    id="chatbot-panel"
    role="region"
    aria-live="polite"
    hidden={!isOpen}
  >
    <h2 id="chatbot-title">Textbook Assistant</h2>

    <div
      role="log"
      aria-label="Chat messages"
      aria-describedby="chatbot-title"
    >
      {messages.map(msg => (
        <div role="article" aria-label={`Message from ${msg.role}`}>
          {msg.content}
        </div>
      ))}
    </div>

    <form onSubmit={handleSubmit}>
      <label htmlFor="chatbot-input" className="sr-only">
        Ask a question about the textbook
      </label>
      <input
        id="chatbot-input"
        aria-describedby="chatbot-hint"
        aria-invalid={error ? "true" : "false"}
        placeholder="Ask a question..."
      />
      <span id="chatbot-hint" className="sr-only">
        Type your question and press Enter to submit
      </span>
      <button type="submit" aria-label="Send question">
        Send
      </button>
    </form>
  </div>
</div>
```

**Screen Reader Announcements**:
- Loading state: "Processing your question..."
- Response received: "Answer received, {first 50 chars}..."
- Error: "Error: {error message}"
- Rate limit: "Query limit reached. Wait {X} seconds."

**Color Contrast**:
- Text on background: Minimum 4.5:1 ratio
- Interactive elements: Minimum 3:1 ratio
- Tested with Chrome DevTools Accessibility panel

**Mobile Responsiveness**:

```css
/* Desktop: Floating panel on right */
@media (min-width: 768px) {
  .chatbot-container {
    position: fixed;
    right: 24px;
    bottom: 24px;
    width: 360px;
    max-height: 600px;
  }
}

/* Mobile: Full-screen overlay */
@media (max-width: 767px) {
  .chatbot-container {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
  }

  .chatbot-header {
    padding: 16px;
    display: flex;
    justify-content: space-between;
  }

  .chatbot-close-button {
    /* Visible on mobile for easy closing */
  }
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Touch Targets** (Mobile):
- Minimum 44x44px tap targets
- Adequate spacing between interactive elements (8px minimum)
- Swipe gestures: Swipe down to close chatbot (mobile)

### Trade-offs
- ✅ Inclusive design benefits all users
- ✅ Improves SEO and discoverability
- ⚠️ Requires testing with screen readers (NVDA, JAWS, VoiceOver)
- ✅ Mobile-first approach ensures usability on all devices

---

## Decision 9: Error Handling & Graceful Degradation

### Context
Must handle API failures gracefully with user-friendly messages (FR-013, Edge Cases). Free tier services may have downtime.

### Options Considered

**Option A: Generic Error Messages**
- **Pros**: Simple, no logic needed
- **Cons**: Poor UX, doesn't guide user

**Option B: Specific Error Messages per Type**
- **Pros**: Clear guidance, better UX
- **Cons**: Requires error classification logic

**Option C: Retry Logic + Fallback + Offline Mode**
- **Pros**: Resilient, handles transient failures
- **Cons**: Complex implementation, may mask real issues

### Decision: **Option B with Exponential Backoff Retry**

### Rationale
- User-friendly error messages improve trust (calm, professional tone)
- Exponential backoff handles transient network issues (common on free tiers)
- Clear guidance helps users understand what went wrong

### Error Classification

```javascript
const ERROR_MESSAGES = {
  NETWORK_ERROR: {
    title: "Connection Issue",
    message: "Unable to reach the chatbot service. Please check your internet connection and try again.",
    retry: true,
    icon: "🔌"
  },
  RATE_LIMIT: {
    title: "Query Limit Reached",
    message: "You've asked too many questions recently. Please wait {seconds} seconds before trying again.",
    retry: false,
    icon: "⏱️"
  },
  TIMEOUT: {
    title: "Request Timed Out",
    message: "The chatbot is taking longer than usual. Please try again or simplify your question.",
    retry: true,
    icon: "⏳"
  },
  SERVICE_UNAVAILABLE: {
    title: "Chatbot Temporarily Unavailable",
    message: "The chatbot service is currently down. Please try again in a few moments.",
    retry: true,
    icon: "🔧"
  },
  NO_RESULTS: {
    title: "No Information Found",
    message: "I couldn't find information about this in the textbook. Try rephrasing your question or asking about a different topic.",
    retry: false,
    icon: "🔍"
  },
  INVALID_INPUT: {
    title: "Invalid Question",
    message: "Your question is too long (max 2000 characters) or empty. Please try a shorter question.",
    retry: false,
    icon: "⚠️"
  },
  UNKNOWN: {
    title: "Something Went Wrong",
    message: "An unexpected error occurred. Please try again later or contact support if the issue persists.",
    retry: true,
    icon: "❌"
  }
};
```

**Retry Logic**:
```javascript
async function queryWithRetry(queryData, maxRetries = 3) {
  let attempt = 0;
  let delay = 1000; // Start with 1 second

  while (attempt < maxRetries) {
    try {
      const response = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(queryData),
        signal: AbortSignal.timeout(10000) // 10s timeout
      });

      if (response.status === 429) {
        throw new RateLimitError(response);
      }

      if (!response.ok) {
        throw new APIError(response);
      }

      return await response.json();
    } catch (error) {
      attempt++;

      if (attempt >= maxRetries) {
        throw error;
      }

      // Exponential backoff
      await sleep(delay);
      delay *= 2;
    }
  }
}
```

**UI Error Display**:
```jsx
{error && (
  <div className="chatbot-error" role="alert">
    <span className="error-icon">{error.icon}</span>
    <div>
      <strong>{error.title}</strong>
      <p>{error.message}</p>
      {error.retry && (
        <button onClick={retryLastQuery}>
          Try Again
        </button>
      )}
    </div>
  </div>
)}
```

### Trade-offs
- ✅ Clear, actionable error messages improve UX
- ✅ Retry logic handles transient failures
- ⚠️ Must balance retries vs user wait time
- ✅ Calm, professional tone matches UI design

---

## Summary of Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Frontend Framework** | React component with Docusaurus swizzling | Native integration, component-based, theme access |
| **UI Design** | Glassmorphism with CSS backdrop-filter | Premium feel, performant, modern browser support |
| **Backend Architecture** | Async FastAPI with SSE streaming | Streaming UX, meets performance goals |
| **Rate Limiting** | Hybrid (frontend + backend) | Immediate feedback + security |
| **Embedding Strategy** | Section-level with metadata | Balance precision and API quota |
| **Docusaurus Integration** | Swizzle Root component | Simple, clean, stable |
| **Deployment** | Monorepo with separate CI/CD | Code proximity, independent deploys |
| **Accessibility** | WCAG 2.1 AA compliance | Inclusive, aligns with Constitution |
| **Error Handling** | Specific messages + retry | Clear guidance, handles transient issues |

---

## Research Citations

- Docusaurus Swizzling Guide: https://docusaurus.io/docs/swizzling
- FastAPI Streaming: https://fastapi.tiangolo.com/advanced/custom-response/#streamingresponse
- Qdrant Python Client: https://qdrant.tech/documentation/quick-start/
- Cohere Embeddings API: https://docs.cohere.com/docs/embed-models
- CSS Backdrop Filter: https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- Web Content Accessibility: https://www.a11yproject.com/

---

## Next Steps

All research complete. Proceed to:
1. **Phase 1**: Generate `data-model.md` with entity schemas
2. **Phase 1**: Create API contracts in `/contracts/`
3. **Phase 1**: Write `quickstart.md` for development setup
4. **Phase 2**: Write comprehensive `plan.md` with detailed UI/UX specifications
