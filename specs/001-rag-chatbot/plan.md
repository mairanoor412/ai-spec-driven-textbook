# Implementation Plan: Integrated RAG Chatbot for AI/Spec-Driven Textbook

**Branch**: `001-rag-chatbot` | **Date**: 2025-12-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-rag-chatbot/spec.md`

## Summary

Build a Retrieval-Augmented Generation (RAG) chatbot that answers questions exclusively from the Physical AI & Humanoid Robotics textbook content. The chatbot will be embedded in the existing Docusaurus website with a professional, calm, premium interface featuring glassmorphism effects and muted pastel colors. Users can ask questions from the full book or about selected text, receiving grounded answers with source citations.

**Technical Approach**:
- **Frontend**: React component integrated via Docusaurus swizzling, with glassmorphism UI using CSS backdrop-filter
- **Backend**: FastAPI with async Server-Sent Events (SSE) for streaming responses
- **RAG Pipeline**: Cohere embeddings → Qdrant vector search → Gemini LLM generation
- **Deployment**: GitHub Pages (frontend) + Render Free Tier (backend)
- **Rate Limiting**: 10 queries/minute/session (frontend + backend hybrid enforcement)

---

## Technical Context

**Language/Version**:
- Frontend: JavaScript (ES2020+), React 18.x (Docusaurus 3.x)
- Backend: Python 3.10+

**Primary Dependencies**:
- Frontend: React, Docusaurus 3.6.3, localStorage API, EventSource (SSE)
- Backend: FastAPI 0.109+, Cohere 4.37+, Qdrant Client 1.7+, OpenAI SDK 1.10+ (Gemini via OpenAI-compatible interface)

**Storage**:
- Vector DB: Qdrant Cloud (Free Tier, 1GB)
- Session: Browser localStorage (frontend only)
- Rate Limiting: In-memory dictionary (backend, transient)

**Testing**:
- Frontend: Jest + React Testing Library
- Backend: pytest + pytest-asyncio
- Integration: Playwright for end-to-end

**Target Platform**:
- Frontend: Modern browsers (Chrome 76+, Firefox 70+, Safari 14+), mobile responsive
- Backend: Linux server (Render Free Tier)

**Project Type**: Web (dual deployment: static site + API backend)

**Performance Goals**:
- p95 latency < 3 seconds (query to first response token)
- Vector search < 500ms
- Support 50 concurrent users
- Chatbot UI loads on all pages within 100ms

**Constraints**:
- Free tier limits: Cohere (1000 embeds/month), Qdrant (1GB), Render (750hrs/month)
- No hallucination (responses must cite textbook only)
- WCAG 2.1 AA accessibility compliance
- Mobile-first responsive design
- Sub-second interaction feedback (loading states, errors)

**Scale/Scope**:
- ~187 textbook sections to embed
- ~1000 queries/month estimated initial usage
- 4 user stories (2 P1, 1 P2, 1 P3)
- 18 functional requirements

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### From Constitution: Educational Excellence and Accessibility

**Requirement**: "All educational content must prioritize clarity and correctness, maintaining high-quality writing suitable for beginner-intermediate learners."

**Compliance**:
- ✅ Chatbot provides grounded answers from textbook (no hallucination)
- ✅ Source citations enable learners to verify and dive deeper
- ✅ Error messages are clear and user-friendly (calm, professional tone)
- ✅ Accessible design (keyboard navigation, screen reader support)

**Gate**: PASS ✅

### From Constitution: Modular and Maintainable Structure

**Requirement**: "Textbook content must follow a modular structure optimized for Docusaurus."

**Compliance**:
- ✅ Chatbot integrates via Docusaurus swizzling (non-invasive)
- ✅ Does not modify textbook content (FR-001: "must not modify or regenerate book content")
- ✅ Embeddings preserve section structure (chapter, section, heading metadata)
- ✅ Clear separation: frontend component, backend API, vector DB

**Gate**: PASS ✅

### From Constitution: Technical Accuracy and Clarity

**Requirement**: "Every technical explanation must prioritize correctness while maintaining clarity for the target audience."

**Compliance**:
- ✅ RAG pipeline ensures responses are grounded in textbook passages
- ✅ Strict prompt engineering: "Answer based ONLY on provided passages"
- ✅ Fallback for no results: "I couldn't find information about this in the textbook"
- ✅ Citations allow verification of sources

**Gate**: PASS ✅

### From Constitution: Docusaurus-Optimized Presentation

**Requirement**: "All content must be structured for export to Docusaurus pages."

**Compliance**:
- ✅ Chatbot UI built as React component (Docusaurus native)
- ✅ Citations link to Docusaurus URLs (e.g., `/docs/chapter-3/inverse-kinematics`)
- ✅ Respects Docusaurus theme variables for consistent styling
- ✅ Works with Docusaurus routing and navigation

**Gate**: PASS ✅

**Overall Constitution Compliance**: PASS ✅ - All principles satisfied.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-rag-chatbot/
├── spec.md              # Feature specification (requirements, user stories, success criteria)
├── plan.md              # This file (architecture, UI/UX design, implementation plan)
├── research.md          # Phase 0 output (architecture decisions, research findings)
├── data-model.md        # Phase 1 output (entity schemas, data flows)
├── quickstart.md        # Phase 1 output (development setup guide)
├── contracts/           # Phase 1 output (API contracts)
│   └── openapi.yaml     # OpenAPI 3.0 specification for backend API
├── checklists/          # Quality validation
│   └── requirements.md  # Spec validation checklist (completed)
└── tasks.md             # Phase 2 output (NOT created yet - awaits /sp.tasks command)
```

### Source Code (repository root)

```text
humanoid-robotics/
├── textbook/                    # Docusaurus site (existing, will be extended)
│   ├── docs/                    # Textbook content (Markdown/MDX)
│   │   ├── chapter-1/
│   │   ├── chapter-2/
│   │   └── ...
│   ├── src/
│   │   ├── components/
│   │   │   └── ChatbotWidget/   # NEW: Chatbot UI component
│   │   │       ├── index.jsx           # Main component export
│   │   │       ├── ChatbotUI.jsx       # UI layout and styling
│   │   │       ├── ChatMessage.jsx     # Individual message component
│   │   │       ├── ChatInput.jsx       # Input field with validation
│   │   │       ├── SelectionButton.jsx # "Ask about this" button
│   │   │       ├── useChatbot.js       # State management hook
│   │   │       ├── useRateLimit.js     # Rate limiting logic hook
│   │   │       ├── useTextSelection.js # Text selection detection hook
│   │   │       ├── api.js              # Backend API client
│   │   │       ├── styles.module.css   # Glassmorphism styles
│   │   │       └── __tests__/          # Unit tests
│   │   │           ├── ChatbotWidget.test.jsx
│   │   │           └── useChatbot.test.js
│   │   ├── theme/
│   │   │   └── Root.js          # MODIFIED: Swizzled Root for chatbot injection
│   │   └── css/
│   │       └── custom.css       # MODIFIED: Add chatbot theme variables
│   ├── static/
│   │   └── img/
│   │       └── chatbot-icon.svg # NEW: Chatbot trigger icon
│   ├── package.json             # MODIFIED: Add new dependencies
│   ├── docusaurus.config.js     # Potentially modified for plugins
│   └── .env.local               # NEW: Local dev config (API URL)
│
├── backend/                     # NEW: FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── config.py            # Environment variable management
│   │   ├── models.py            # Pydantic models (Query, Response, etc.)
│   │   ├── rag_pipeline.py      # Core RAG logic (embed, search, generate)
│   │   ├── rate_limiter.py      # Rate limiting middleware
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── query.py         # /query and /query-selection endpoints
│   │   │   └── health.py        # /health endpoint
│   │   └── utils/
│   │       ├── cohere_client.py  # Cohere API wrapper
│   │       ├── qdrant_client.py  # Qdrant API wrapper
│   │       ├── llm_client.py     # Gemini via OpenAI SDK wrapper
│   │       └── citation_parser.py # Extract citations from responses
│   ├── scripts/
│   │   └── generate_embeddings.py # Embedding generation script
│   ├── tests/
│   │   ├── test_rag_pipeline.py
│   │   ├── test_rate_limiter.py
│   │   ├── test_api.py
│   │   └── conftest.py           # Pytest fixtures
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   ├── .env.example
│   ├── Dockerfile               # For Render deployment
│   └── README.md
│
├── .github/
│   └── workflows/
│       ├── deploy-backend.yml   # NEW: Render deployment CI/CD
│       └── deploy-frontend.yml  # MODIFIED: Add API URL env var
│
└── README.md                    # MODIFIED: Add chatbot section
```

---

## Phase 0: Research & Architecture (COMPLETED ✅)

**Artifacts Generated**:
- ✅ `research.md`: 9 key decisions documented with rationale, alternatives, and trade-offs

**Key Decisions Summary**:
1. **Frontend Framework**: React with Docusaurus swizzling
2. **UI Design**: Glassmorphism with CSS backdrop-filter, muted pastels
3. **Backend Architecture**: Async FastAPI with SSE streaming
4. **Rate Limiting**: Hybrid (frontend feedback + backend enforcement)
5. **Embedding Strategy**: Section-level with metadata (Cohere + Qdrant)
6. **Docusaurus Integration**: Swizzle Root component + text selection API
7. **Deployment**: Monorepo with separate CI/CD workflows
8. **Accessibility**: WCAG 2.1 AA compliance (keyboard, screen readers)
9. **Error Handling**: Specific messages per error type + exponential backoff retry

**Research Sources Cited**:
- Docusaurus Swizzling Guide: https://docusaurus.io/docs/swizzling
- FastAPI Streaming: https://fastapi.tiangolo.com/advanced/custom-response/#streamingresponse
- Qdrant Python Client: https://qdrant.tech/documentation/quick-start/
- Cohere Embeddings: https://docs.cohere.com/docs/embed-models
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/

---

## Phase 1: Design & Contracts (COMPLETED ✅)

**Artifacts Generated**:
- ✅ `data-model.md`: 7 core entities with validation rules, relationships, state transitions
- ✅ `contracts/openapi.yaml`: OpenAPI 3.0 spec with 3 endpoints, SSE streaming schema, error responses
- ✅ `quickstart.md`: Development setup guide with 8 steps, troubleshooting, deployment instructions

**Key Deliverables**:
- Entity schemas for Query, Embedding, Response, Session, Citation, Message, RateLimitInfo
- API contract with `/query`, `/query-selection`, `/health` endpoints
- Full development environment setup (frontend + backend + embeddings)

---

## Phase 2: Detailed UI/UX Design & Implementation Architecture

### UI/UX Design Specifications

#### Design Principles

1. **Calm & Professional Aesthetic**
   - Soft, muted pastel color palette (no bright/neon colors)
   - Generous whitespace for breathing room
   - Subtle animations (respect `prefers-reduced-motion`)
   - Clean, readable typography

2. **Glassmorphism Effect**
   - Semi-transparent backgrounds with blur
   - Layered depth with subtle shadows
   - Frosted glass appearance
   - Premium, modern feel

3. **Accessibility First**
   - Keyboard navigation (Tab, Enter, Escape)
   - Screen reader announcements
   - Sufficient color contrast (WCAG AA)
   - Focus indicators visible

4. **Mobile Responsive**
   - Desktop: Floating panel (right side, 360px width)
   - Mobile: Full-screen overlay
   - Touch-friendly targets (44px minimum)
   - Swipe gestures for closing

---

### Visual Design System

#### Color Palette (Muted Pastels)

```css
:root {
  /* Backgrounds */
  --chatbot-bg-primary: hsla(210, 25%, 98%, 0.75);      /* Soft white with blue tint */
  --chatbot-bg-secondary: hsla(210, 20%, 96%, 0.85);    /* Slightly more opaque */

  /* Borders */
  --chatbot-border-soft: hsla(210, 15%, 85%, 0.5);      /* Subtle gray */
  --chatbot-border-focus: hsla(230, 30%, 80%, 0.8);     /* Lavender (focus state) */

  /* Accent Colors */
  --chatbot-accent-primary: hsla(230, 30%, 85%, 1);     /* Soft lavender */
  --chatbot-accent-secondary: hsla(210, 30%, 88%, 1);   /* Light blue */

  /* Text */
  --chatbot-text-primary: hsla(220, 15%, 25%, 1);       /* Muted dark blue-gray */
  --chatbot-text-secondary: hsla(220, 10%, 45%, 1);     /* Medium gray */
  --chatbot-text-tertiary: hsla(220, 8%, 65%, 1);       /* Light gray (timestamps) */

  /* Chat Bubbles */
  --chatbot-bubble-user: hsla(210, 30%, 90%, 0.9);      /* Light blue */
  --chatbot-bubble-assistant: hsla(270, 20%, 92%, 0.9); /* Soft lavender */

  /* States */
  --chatbot-hover: hsla(230, 25%, 90%, 1);              /* Hover state */
  --chatbot-active: hsla(230, 30%, 85%, 1);             /* Active/pressed */
  --chatbot-disabled: hsla(220, 10%, 70%, 0.5);         /* Disabled */

  /* Shadows */
  --chatbot-shadow-soft: 0 4px 16px hsla(220, 15%, 50%, 0.08);  /* Subtle elevation */
  --chatbot-shadow-medium: 0 8px 24px hsla(220, 15%, 50%, 0.12); /* Moderate elevation */
  --chatbot-shadow-strong: 0 12px 32px hsla(220, 15%, 50%, 0.16); /* High elevation */
}
```

#### Typography

```css
.chatbot {
  /* Font Stack: System fonts for performance */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
               "Helvetica Neue", Arial, sans-serif;

  /* Font Sizes */
  --chatbot-font-xs: 0.75rem;   /* 12px - timestamps, metadata */
  --chatbot-font-sm: 0.875rem;  /* 14px - body text */
  --chatbot-font-md: 1rem;      /* 16px - headings, buttons */
  --chatbot-font-lg: 1.125rem;  /* 18px - title */

  /* Line Heights */
  --chatbot-line-height-tight: 1.3;   /* Headings */
  --chatbot-line-height-normal: 1.6;  /* Body text (readability) */
  --chatbot-line-height-loose: 1.8;   /* Long-form content */

  /* Letter Spacing */
  letter-spacing: 0.01em;  /* Subtle tracking for professional feel */
}
```

#### Spacing & Layout

```css
.chatbot {
  /* Spacing Scale (8px base) */
  --chatbot-space-xs: 0.5rem;  /* 8px */
  --chatbot-space-sm: 0.75rem; /* 12px */
  --chatbot-space-md: 1rem;    /* 16px */
  --chatbot-space-lg: 1.5rem;  /* 24px */
  --chatbot-space-xl: 2rem;    /* 32px */

  /* Border Radius */
  --chatbot-radius-sm: 8px;   /* Small elements (buttons) */
  --chatbot-radius-md: 12px;  /* Medium elements (input fields) */
  --chatbot-radius-lg: 16px;  /* Large elements (chat panel) */
  --chatbot-radius-xl: 24px;  /* Extra large (chat bubbles) */
  --chatbot-radius-full: 9999px; /* Circular (trigger button) */

  /* Component Dimensions */
  --chatbot-trigger-size: 60px;      /* Floating trigger button */
  --chatbot-panel-width: 360px;      /* Desktop panel width */
  --chatbot-panel-max-height: 600px; /* Desktop max height */
  --chatbot-input-height: 48px;      /* Input field height */
}
```

---

### Component Design Specifications

#### 1. Chatbot Trigger Button (Floating)

**Position**: Fixed bottom-right corner, 24px from edges (desktop)

**Design**:
```css
.chatbot-trigger {
  /* Layout */
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: var(--chatbot-trigger-size);
  height: var(--chatbot-trigger-size);

  /* Glassmorphism */
  background: var(--chatbot-bg-primary);
  backdrop-filter: blur(12px) saturate(150%);
  -webkit-backdrop-filter: blur(12px) saturate(150%);

  /* Shape */
  border-radius: var(--chatbot-radius-full);
  border: 1px solid var(--chatbot-border-soft);
  box-shadow: var(--chatbot-shadow-medium);

  /* Center Icon */
  display: flex;
  align-items: center;
  justify-content: center;

  /* Interaction */
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chatbot-trigger:hover {
  transform: translateY(-2px);
  box-shadow: var(--chatbot-shadow-strong);
  background: var(--chatbot-hover);
}

.chatbot-trigger:active {
  transform: translateY(0);
  box-shadow: var(--chatbot-shadow-soft);
}

/* Icon (SVG or emoji) */
.chatbot-trigger-icon {
  width: 28px;
  height: 28px;
  color: var(--chatbot-accent-primary);
}
```

**Accessibility**:
```jsx
<button
  className="chatbot-trigger"
  aria-label="Open chatbot assistant"
  aria-expanded={isOpen}
  aria-controls="chatbot-panel"
  onClick={toggleChatbot}
>
  <ChatIcon className="chatbot-trigger-icon" />
</button>
```

---

#### 2. Chat Panel (Desktop: Right-Aligned, Mobile: Full-Screen)

**Desktop Layout**:
```css
.chatbot-panel {
  /* Position */
  position: fixed;
  right: 24px;
  bottom: 96px;  /* Above trigger button */
  width: var(--chatbot-panel-width);
  max-height: var(--chatbot-panel-max-height);

  /* Glassmorphism */
  background: var(--chatbot-bg-primary);
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);

  /* Shape */
  border-radius: var(--chatbot-radius-lg);
  border: 1px solid var(--chatbot-border-soft);
  box-shadow: var(--chatbot-shadow-strong);

  /* Layout */
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* Animation */
  animation: chatbot-slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes chatbot-slide-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Fallback for browsers without backdrop-filter */
@supports not (backdrop-filter: blur(16px)) {
  .chatbot-panel {
    background: var(--chatbot-bg-secondary);
  }
}
```

**Mobile Layout**:
```css
@media (max-width: 767px) {
  .chatbot-panel {
    /* Full screen overlay */
    inset: 0;
    width: 100%;
    height: 100%;
    max-height: none;
    border-radius: 0;
    bottom: 0;
    right: 0;
  }

  /* Slide from bottom animation */
  @keyframes chatbot-slide-up {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
}
```

**Panel Structure**:
```jsx
<div
  id="chatbot-panel"
  className="chatbot-panel"
  role="region"
  aria-label="Textbook Assistant Chatbot"
  hidden={!isOpen}
>
  {/* Header */}
  <div className="chatbot-header">
    <h2 className="chatbot-title">Textbook Assistant</h2>
    <button className="chatbot-close" onClick={closeChatbot}>
      <CloseIcon />
    </button>
  </div>

  {/* Messages Area (scrollable) */}
  <div className="chatbot-messages" role="log" aria-live="polite">
    {messages.map(msg => (
      <ChatMessage key={msg.id} message={msg} />
    ))}
    {isLoading && <LoadingIndicator />}
    {error && <ErrorMessage error={error} />}
  </div>

  {/* Input Area (fixed at bottom) */}
  <div className="chatbot-input-wrapper">
    <ChatInput
      value={currentQuery}
      onChange={setCurrentQuery}
      onSubmit={handleSubmit}
      disabled={isLoading || rateLimitInfo.isLimited}
      placeholder="Ask a question..."
    />
  </div>
</div>
```

---

#### 3. Chat Header

```css
.chatbot-header {
  /* Layout */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--chatbot-space-md);

  /* Border */
  border-bottom: 1px solid var(--chatbot-border-soft);

  /* Background (slightly more opaque than panel) */
  background: var(--chatbot-bg-secondary);
}

.chatbot-title {
  font-size: var(--chatbot-font-lg);
  font-weight: 600;
  color: var(--chatbot-text-primary);
  margin: 0;
}

.chatbot-close {
  /* Button reset */
  background: none;
  border: none;
  padding: var(--chatbot-space-xs);
  cursor: pointer;

  /* Icon */
  width: 24px;
  height: 24px;
  color: var(--chatbot-text-secondary);

  /* Hover */
  transition: color 0.2s ease;
}

.chatbot-close:hover {
  color: var(--chatbot-text-primary);
}
```

---

#### 4. Messages Area (Scrollable)

```css
.chatbot-messages {
  /* Layout */
  flex: 1;  /* Fill available space */
  overflow-y: auto;
  overflow-x: hidden;
  padding: var(--chatbot-space-md);

  /* Spacing between messages */
  display: flex;
  flex-direction: column;
  gap: var(--chatbot-space-md);

  /* Scrollbar styling (calm, subtle) */
  scrollbar-width: thin;
  scrollbar-color: var(--chatbot-border-soft) transparent;
}

.chatbot-messages::-webkit-scrollbar {
  width: 6px;
}

.chatbot-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chatbot-messages::-webkit-scrollbar-thumb {
  background: var(--chatbot-border-soft);
  border-radius: var(--chatbot-radius-sm);
}

.chatbot-messages::-webkit-scrollbar-thumb:hover {
  background: hsla(210, 15%, 75%, 0.7);
}
```

---

#### 5. Chat Message Bubbles

**User Message (Right-Aligned, Light Blue)**:
```css
.chat-message-user {
  /* Alignment */
  align-self: flex-end;
  max-width: 80%;

  /* Bubble */
  background: var(--chatbot-bubble-user);
  padding: var(--chatbot-space-sm) var(--chatbot-space-md);
  border-radius: var(--chatbot-radius-xl) var(--chatbot-radius-xl)
                 var(--chatbot-radius-sm) var(--chatbot-radius-xl);

  /* Text */
  font-size: var(--chatbot-font-sm);
  color: var(--chatbot-text-primary);
  line-height: var(--chatbot-line-height-normal);

  /* Soft shadow */
  box-shadow: 0 2px 8px hsla(210, 30%, 50%, 0.1);
}
```

**Assistant Message (Left-Aligned, Lavender)**:
```css
.chat-message-assistant {
  /* Alignment */
  align-self: flex-start;
  max-width: 85%;

  /* Bubble */
  background: var(--chatbot-bubble-assistant);
  padding: var(--chatbot-space-sm) var(--chatbot-space-md);
  border-radius: var(--chatbot-radius-xl) var(--chatbot-radius-xl)
                 var(--chatbot-radius-xl) var(--chatbot-radius-sm);

  /* Text */
  font-size: var(--chatbot-font-sm);
  color: var(--chatbot-text-primary);
  line-height: var(--chatbot-line-height-normal);

  /* Soft shadow */
  box-shadow: 0 2px 8px hsla(270, 20%, 50%, 0.1);
}

/* Timestamp */
.chat-message-timestamp {
  font-size: var(--chatbot-font-xs);
  color: var(--chatbot-text-tertiary);
  margin-top: var(--chatbot-space-xs);
  display: block;
}
```

**Citations (Clickable Links)**:
```css
.chat-citation {
  /* Link styling */
  color: var(--chatbot-accent-primary);
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid currentColor;

  /* Hover */
  transition: color 0.2s ease, border-color 0.2s ease;
}

.chat-citation:hover {
  color: hsla(230, 40%, 70%, 1);  /* Darker lavender */
  border-bottom-width: 2px;
}

.chat-citation:focus {
  outline: 2px solid var(--chatbot-border-focus);
  outline-offset: 2px;
}
```

---

#### 6. Input Area (Fixed at Bottom)

```css
.chatbot-input-wrapper {
  /* Layout */
  padding: var(--chatbot-space-md);
  border-top: 1px solid var(--chatbot-border-soft);

  /* Background (slightly more opaque) */
  background: var(--chatbot-bg-secondary);

  /* Flex for input + button */
  display: flex;
  gap: var(--chatbot-space-sm);
  align-items: center;
}

.chatbot-input {
  /* Layout */
  flex: 1;
  height: var(--chatbot-input-height);
  padding: 0 var(--chatbot-space-md);

  /* Glassmorphism */
  background: hsla(210, 25%, 100%, 0.8);
  border: 1px solid var(--chatbot-border-soft);
  border-radius: var(--chatbot-radius-md);

  /* Text */
  font-size: var(--chatbot-font-sm);
  color: var(--chatbot-text-primary);
  font-family: inherit;

  /* Focus state */
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.chatbot-input:focus {
  outline: none;
  border-color: var(--chatbot-border-focus);
  box-shadow: 0 0 0 3px hsla(230, 30%, 85%, 0.3);  /* Focus ring */
}

.chatbot-input::placeholder {
  color: var(--chatbot-text-tertiary);
}

.chatbot-input:disabled {
  background: var(--chatbot-disabled);
  cursor: not-allowed;
}
```

**Send Button**:
```css
.chatbot-send-button {
  /* Size */
  width: var(--chatbot-input-height);
  height: var(--chatbot-input-height);
  padding: 0;

  /* Glassmorphism */
  background: var(--chatbot-accent-primary);
  border: none;
  border-radius: var(--chatbot-radius-md);

  /* Icon */
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  /* Interaction */
  cursor: pointer;
  transition: all 0.2s ease;
}

.chatbot-send-button:hover:not(:disabled) {
  background: hsla(230, 35%, 80%, 1);
  transform: translateY(-1px);
  box-shadow: var(--chatbot-shadow-soft);
}

.chatbot-send-button:active:not(:disabled) {
  transform: translateY(0);
}

.chatbot-send-button:disabled {
  background: var(--chatbot-disabled);
  cursor: not-allowed;
}
```

---

#### 7. Loading Indicator (Streaming Response)

```css
.chatbot-loading {
  /* Alignment */
  align-self: flex-start;

  /* Bubble (same as assistant) */
  background: var(--chatbot-bubble-assistant);
  padding: var(--chatbot-space-sm) var(--chatbot-space-md);
  border-radius: var(--chatbot-radius-xl);

  /* Dots animation */
  display: flex;
  gap: 6px;
}

.chatbot-loading-dot {
  width: 8px;
  height: 8px;
  background: var(--chatbot-accent-primary);
  border-radius: 50%;
  animation: chatbot-loading-bounce 1.4s infinite ease-in-out both;
}

.chatbot-loading-dot:nth-child(1) {
  animation-delay: -0.32s;
}

.chatbot-loading-dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes chatbot-loading-bounce {
  0%, 80%, 100% {
    transform: scale(0.7);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
```

---

#### 8. Error Message

```css
.chatbot-error {
  /* Layout */
  align-self: center;
  max-width: 90%;

  /* Bubble (slightly different color) */
  background: hsla(0, 30%, 95%, 0.9);  /* Soft red tint */
  border: 1px solid hsla(0, 30%, 85%, 0.7);
  padding: var(--chatbot-space-md);
  border-radius: var(--chatbot-radius-md);

  /* Flex for icon + text */
  display: flex;
  gap: var(--chatbot-space-sm);
  align-items: flex-start;
}

.chatbot-error-icon {
  font-size: var(--chatbot-font-lg);
  flex-shrink: 0;
}

.chatbot-error-content {
  flex: 1;
}

.chatbot-error-title {
  font-size: var(--chatbot-font-sm);
  font-weight: 600;
  color: var(--chatbot-text-primary);
  margin: 0 0 var(--chatbot-space-xs);
}

.chatbot-error-message {
  font-size: var(--chatbot-font-sm);
  color: var(--chatbot-text-secondary);
  line-height: var(--chatbot-line-height-normal);
  margin: 0;
}

.chatbot-error-retry {
  /* Button */
  margin-top: var(--chatbot-space-sm);
  padding: var(--chatbot-space-xs) var(--chatbot-space-md);
  background: var(--chatbot-accent-primary);
  color: var(--chatbot-text-primary);
  border: none;
  border-radius: var(--chatbot-radius-sm);
  font-size: var(--chatbot-font-sm);
  cursor: pointer;
  transition: background 0.2s ease;
}

.chatbot-error-retry:hover {
  background: var(--chatbot-hover);
}
```

---

#### 9. Rate Limit Message (with Countdown)

```css
.chatbot-rate-limit {
  /* Banner at top of input area */
  padding: var(--chatbot-space-sm) var(--chatbot-space-md);
  background: hsla(45, 60%, 95%, 0.95);  /* Soft yellow tint */
  border: 1px solid hsla(45, 50%, 85%, 0.8);
  border-radius: var(--chatbot-radius-sm);
  margin-bottom: var(--chatbot-space-sm);

  /* Text */
  font-size: var(--chatbot-font-sm);
  color: var(--chatbot-text-secondary);
  text-align: center;
}

.chatbot-rate-limit-countdown {
  font-weight: 600;
  color: var(--chatbot-text-primary);
}
```

---

#### 10. Text Selection Button ("Ask about this")

```css
.chatbot-selection-button {
  /* Absolute positioning near selection */
  position: absolute;
  z-index: 1000;

  /* Glassmorphism (small, compact) */
  background: var(--chatbot-bg-primary);
  backdrop-filter: blur(12px) saturate(150%);
  -webkit-backdrop-filter: blur(12px) saturate(150%);
  border: 1px solid var(--chatbot-border-soft);
  border-radius: var(--chatbot-radius-md);
  padding: var(--chatbot-space-xs) var(--chatbot-space-md);

  /* Text */
  font-size: var(--chatbot-font-sm);
  color: var(--chatbot-text-primary);
  font-weight: 500;
  white-space: nowrap;

  /* Shadow */
  box-shadow: var(--chatbot-shadow-medium);

  /* Interaction */
  cursor: pointer;
  transition: all 0.2s ease;

  /* Animation on appear */
  animation: chatbot-selection-fade-in 0.2s ease;
}

.chatbot-selection-button:hover {
  background: var(--chatbot-hover);
  transform: translateY(-2px);
  box-shadow: var(--chatbot-shadow-strong);
}

@keyframes chatbot-selection-fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

### State Management Architecture

#### Frontend State (React Hooks)

**Primary Hook: `useChatbot.js`**

```javascript
import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { queryAPI } from './api';

export function useChatbot() {
  // Session management
  const [sessionId] = useState(() => {
    const stored = localStorage.getItem('chatbot_session_id');
    return stored || uuidv4();
  });

  // UI state
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Conversation state
  const [messages, setMessages] = useState(() => {
    const stored = localStorage.getItem(`chatbot_messages_${sessionId}`);
    return stored ? JSON.parse(stored) : [];
  });

  // Input state
  const [currentQuery, setCurrentQuery] = useState('');
  const [selectedText, setSelectedText] = useState(null);

  // Rate limiting
  const [rateLimitInfo, setRateLimitInfo] = useState({
    isLimited: false,
    waitSeconds: 0,
  });

  // Refs
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Persist session ID
  useEffect(() => {
    localStorage.setItem('chatbot_session_id', sessionId);
  }, [sessionId]);

  // Persist messages
  useEffect(() => {
    localStorage.setItem(`chatbot_messages_${sessionId}`, JSON.stringify(messages));
  }, [messages, sessionId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check rate limit
  const checkRateLimit = useCallback(() => {
    const queries = JSON.parse(localStorage.getItem(`chatbot_queries_${sessionId}`) || '[]');
    const now = Date.now();
    const recentQueries = queries.filter(ts => now - ts < 60000);  // Last minute

    if (recentQueries.length >= 10) {
      const oldestQuery = Math.min(...recentQueries);
      const waitSeconds = Math.ceil((60000 - (now - oldestQuery)) / 1000);
      setRateLimitInfo({ isLimited: true, waitSeconds });

      // Countdown timer
      const timer = setTimeout(() => checkRateLimit(), 1000);
      return () => clearTimeout(timer);
    } else {
      setRateLimitInfo({ isLimited: false, waitSeconds: 0 });
    }
  }, [sessionId]);

  useEffect(() => {
    checkRateLimit();
  }, [checkRateLimit]);

  // Submit query
  const handleSubmit = useCallback(async (question = currentQuery) => {
    if (!question.trim() || isLoading || rateLimitInfo.isLimited) return;

    // Validate length
    if (question.length > 2000) {
      setError({
        title: 'Question Too Long',
        message: 'Please limit your question to 2000 characters.',
        retry: false,
      });
      return;
    }

    // Record query timestamp (rate limiting)
    const queries = JSON.parse(localStorage.getItem(`chatbot_queries_${sessionId}`) || '[]');
    queries.push(Date.now());
    localStorage.setItem(`chatbot_queries_${sessionId}`, JSON.stringify(queries));
    checkRateLimit();

    // Add user message
    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content: question,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setCurrentQuery('');
    setError(null);
    setIsLoading(true);

    // Prepare assistant message (will be streamed)
    const assistantMessageId = uuidv4();
    const assistantMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      citations: [],
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, assistantMessage]);

    try {
      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      // Stream response
      await queryAPI({
        session_id: sessionId,
        question,
        selected_text: selectedText,
        conversation_history: messages.slice(-10).map(m => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp,
        })),
      }, {
        onChunk: (content) => {
          // Append chunk to assistant message
          setMessages(prev => prev.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, content: msg.content + content }
              : msg
          ));
        },
        onCitation: (citation) => {
          // Add citation to assistant message
          setMessages(prev => prev.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, citations: [...msg.citations, citation] }
              : msg
          ));
        },
        onDone: () => {
          setIsLoading(false);
        },
        onError: (err) => {
          throw err;
        },
        signal: abortControllerRef.current.signal,
      });

      // Clear selected text after query
      setSelectedText(null);

    } catch (err) {
      setIsLoading(false);

      // Remove incomplete assistant message
      setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId));

      // Set error
      if (err.name === 'AbortError') {
        // User cancelled
        return;
      }

      if (err.code === 'RATE_LIMIT') {
        setError({
          title: 'Query Limit Reached',
          message: err.message,
          retry: false,
        });
        checkRateLimit();
      } else if (err.code === 'NETWORK_ERROR') {
        setError({
          title: 'Connection Issue',
          message: 'Unable to reach the chatbot service. Please check your internet connection.',
          retry: true,
        });
      } else {
        setError({
          title: 'Something Went Wrong',
          message: err.message || 'An unexpected error occurred. Please try again.',
          retry: true,
        });
      }
    }
  }, [currentQuery, isLoading, rateLimitInfo, selectedText, messages, sessionId, checkRateLimit]);

  // Retry last query
  const retryLastQuery = useCallback(() => {
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (lastUserMessage) {
      handleSubmit(lastUserMessage.content);
    }
  }, [messages, handleSubmit]);

  // Clear conversation
  const clearConversation = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(`chatbot_messages_${sessionId}`);
  }, [sessionId]);

  // Toggle chatbot
  const toggleChatbot = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeChatbot = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    // State
    isOpen,
    isLoading,
    error,
    messages,
    currentQuery,
    selectedText,
    rateLimitInfo,
    sessionId,
    messagesEndRef,

    // Actions
    setCurrentQuery,
    setSelectedText,
    handleSubmit,
    retryLastQuery,
    clearConversation,
    toggleChatbot,
    closeChatbot,
  };
}
```

---

### Backend Architecture

#### RAG Pipeline Flow

```
1. Receive Query
   ↓
2. Rate Limit Check (middleware)
   ↓
3. Generate Query Embedding (Cohere)
   ↓
4. Vector Search (Qdrant)
   ↓
5. Assemble Context (top-5 passages + selected_text)
   ↓
6. LLM Generation (Gemini via OpenAI SDK)
   ↓
7. Stream Response (SSE)
   ↓
8. Parse Citations (regex)
   ↓
9. Send Citation Events (SSE)
   ↓
10. Send Done Event (SSE)
```

**Key Backend Files**:

1. `app/main.py` - FastAPI app initialization, middleware, CORS
2. `app/routers/query.py` - `/query` and `/query-selection` endpoints
3. `app/rag_pipeline.py` - Core RAG logic (embed, search, generate)
4. `app/rate_limiter.py` - Rate limiting middleware
5. `app/config.py` - Environment variables (Pydantic settings)
6. `scripts/generate_embeddings.py` - Offline embedding generation

---

### Testing Strategy

#### Frontend Tests

**Unit Tests** (Jest + React Testing Library):
- `ChatbotWidget.test.jsx` - Component rendering, interactions
- `useChatbot.test.js` - State management, localStorage
- `useRateLimit.test.js` - Rate limiting logic
- `useTextSelection.test.js` - Selection detection

**Integration Tests** (Playwright):
- Open chatbot, ask question, verify response
- Test rate limiting (10 queries, verify error)
- Test text selection flow
- Test mobile responsiveness

#### Backend Tests

**Unit Tests** (pytest):
- `test_rag_pipeline.py` - Embedding, search, generation
- `test_rate_limiter.py` - Rate limiting middleware
- `test_citation_parser.py` - Citation extraction

**Integration Tests**:
- `test_api.py` - Endpoint responses, SSE streaming
- Mock Cohere, Qdrant, Gemini services

---

### Deployment Architecture

**Frontend** (GitHub Pages):
- Build: `npm run build`
- Deploy: GitHub Actions workflow on push to `main`
- Environment: `REACT_APP_CHATBOT_API_URL=https://rag-chatbot-backend.onrender.com`

**Backend** (Render Free Tier):
- Build: `pip install -r requirements.txt`
- Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Environment: Set all API keys and secrets in Render dashboard

---

## Next Steps

**Phase 2 Complete**: All planning artifacts generated.

**Ready for Implementation** (`/sp.tasks`):
1. Run `/sp.tasks` to generate testable task list
2. Implement backend (FastAPI + RAG pipeline)
3. Implement frontend (React chatbot component)
4. Generate embeddings for textbook content
5. Deploy to production (Render + GitHub Pages)
6. Validate against success criteria (SC-001 through SC-010)

**Estimated Effort**:
- Backend: 16-20 hours (RAG pipeline, API endpoints, tests)
- Frontend: 12-16 hours (UI components, state management, integration)
- Embeddings: 2-4 hours (script development, API calls)
- Testing & QA: 8-12 hours (unit, integration, accessibility)
- Deployment: 4-6 hours (CI/CD setup, environment config)
- **Total**: 42-58 hours

**Critical Path**:
1. Embedding generation (blocks backend testing)
2. Backend API (blocks frontend integration)
3. Frontend UI (blocks end-to-end testing)

---

## Appendix: Design Mockups (Text Descriptions)

**Desktop View** (1920x1080):
- Floating trigger button: bottom-right, 60px circle, glassmorphism
- Chat panel: 360px wide, 600px max height, right-aligned above trigger
- Messages area: Scrollable, alternating user (right, light blue) and assistant (left, lavender) bubbles
- Input area: Fixed at bottom, 48px height, send button on right

**Mobile View** (375x812):
- Full-screen overlay when open
- Header with "Textbook Assistant" and close button (X)
- Messages fill screen vertically
- Input fixed at bottom with keyboard
- Swipe down to close gesture

**Color Demonstration**:
- Background: Soft white with subtle blue tint, semi-transparent (75% opacity)
- Borders: Very light gray, barely visible (50% opacity)
- User bubbles: Pastel blue (#E8F0FF with 90% opacity)
- Assistant bubbles: Soft lavender (#F0EBFF with 90% opacity)
- Accent: Muted lavender (#C5B8E5)
- Text: Muted dark blue-gray (#3D4555)

**Accessibility Features**:
- All interactive elements have 44px minimum touch target
- Focus indicators visible (2px lavender outline)
- ARIA labels on all buttons
- Screen reader announcements for loading, errors, responses
- Keyboard shortcuts: Ctrl+/ to open, Escape to close, Tab to navigate

---

**Plan Complete** ✅

All artifacts generated:
- ✅ `spec.md` - Requirements and user stories
- ✅ `research.md` - Architecture decisions
- ✅ `data-model.md` - Entity schemas
- ✅ `contracts/openapi.yaml` - API specification
- ✅ `quickstart.md` - Development setup guide
- ✅ `plan.md` - This comprehensive implementation plan with UI/UX design

**Next Command**: `/sp.tasks` to generate testable implementation tasks
