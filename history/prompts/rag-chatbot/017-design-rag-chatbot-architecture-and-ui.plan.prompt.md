---
id: 017
title: design rag chatbot architecture and ui
stage: plan
date: 2025-12-15
surface: agent
model: claude-sonnet-4-5-20250929
feature: rag-chatbot
branch: 001-rag-chatbot
user: Maira Naeem
command: /sp.plan
labels: ["planning", "architecture", "ui-ux", "glassmorphism", "rag", "fastapi", "react", "docusaurus"]
links:
  spec: specs/001-rag-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-rag-chatbot/plan.md
  - specs/001-rag-chatbot/research.md
  - specs/001-rag-chatbot/data-model.md
  - specs/001-rag-chatbot/quickstart.md
  - specs/001-rag-chatbot/contracts/openapi.yaml
tests:
  - none (planning phase)
---

## Prompt

```text
GOAL:
Design a professional, calm, premium chatbot UI and produce a complete planning output that includes:
- Architecture sketch
- Section structure
- Research approach
- Quality validation
- Testing strategy
- Documented decisions with tradeoffs

UI / UX DESIGN REQUIREMENTS:
Design a chatbot interface with a soft, calming, professional look.

Layout:
- Chatbot must appear on the RIGHT side of the screen
- Fixed or floating (support-style chatbot)
- Should not obstruct main content

Visual Style:
- Light background with subtle glassmorphism effect
- Low-opacity, semi-transparent surfaces
- Rounded corners throughout
- Minimal, soft shadows only
- Soft borders instead of heavy outlines

Colors:
- Muted pastel tones only
  - Light blue
  - Soft gray
  - Lavender
- Avoid neon, bright, or harsh colors
- Maintain sufficient contrast for readability

Chat Elements:
- Chat bubbles should be soft, semi-transparent
- Calm spacing and clean typography
- Premium, professional feel (not playful)

PLANNING OUTPUT REQUIREMENTS:

1. Architecture Sketch
   - High-level UI + backend interaction flow
   - RAG pipeline placement
   - Session handling and rate limiting considerations

2. Section Structure
   - Logical breakdown of UI, state, data flow, and system responsibilities

3. Research Approach
   - Use a research-concurrent approach
   - Research while planning/writing (not all upfront)
   - Cite sources using APA style (from Constitution where applicable)

4. Phased Organization
   Organize the plan into clear phases:
   - Research
   - Foundation
   - Analysis
   - Synthesis

5. Decisions Needing Documentation
   - List important design and architectural decisions
   - For each decision, include:
     - Available options
     - Chosen option
     - Tradeoffs and rationale

6. Testing & Quality Validation
   - Define validation checks mapped to acceptance criteria
   - UI usability checks
   - Accessibility and readability validation
   - Rate limiting and session behavior validation
```

## Response snapshot

Created comprehensive architecture and design plan for the RAG Chatbot feature with complete UI/UX specifications.

**Planning Artifacts Generated**:

1. **research.md** (29KB, 9 decisions):
   - Frontend framework: React with Docusaurus swizzling
   - UI design: Glassmorphism with CSS backdrop-filter, muted pastels
   - Backend: Async FastAPI with SSE streaming
   - Rate limiting: Hybrid (frontend + backend)
   - Embeddings: Section-level with Cohere + Qdrant
   - Docusaurus integration: Swizzle Root component
   - Deployment: Monorepo with separate CI/CD
   - Accessibility: WCAG 2.1 AA compliance
   - Error handling: Specific messages + exponential backoff retry

2. **data-model.md** (26KB):
   - 7 core entities with validation rules, relationships, state transitions
   - Query, Embedding, Response, Session, Citation, Message, RateLimitInfo
   - Full schemas for TypeScript (frontend), Python/Pydantic (backend), Qdrant (vector DB)
   - Data flow diagrams for query submission and text selection

3. **contracts/openapi.yaml** (12KB):
   - OpenAPI 3.0 specification with 3 endpoints
   - POST /query (SSE streaming with chunk/citation/done events)
   - POST /query-selection (selection-based queries)
   - GET /health (service health checks)
   - Complete request/response schemas with examples

4. **quickstart.md** (24KB):
   - Step-by-step development environment setup
   - Backend setup (Python venv, requirements, .env configuration)
   - Embedding generation script instructions
   - Frontend setup (Docusaurus, environment variables)
   - Testing workflows (unit, integration, end-to-end)
   - Deployment guides (Render + GitHub Pages)
   - Troubleshooting common issues

5. **plan.md** (60KB) - Comprehensive implementation plan:
   - **Technical Context**: Languages, dependencies, platforms, performance goals, constraints
   - **Constitution Check**: All 4 principles validated and passing
   - **Project Structure**: Complete file tree for frontend + backend
   - **Phase 0 (Research)**: Summary of 9 architecture decisions
   - **Phase 1 (Design)**: Data models, API contracts, quickstart guide
   - **Phase 2 (UI/UX Design)**:
     - Complete visual design system (color palette, typography, spacing)
     - 10 detailed component specifications with CSS
     - Glassmorphism implementation (backdrop-filter with fallback)
     - Mobile-responsive design (desktop floating panel, mobile full-screen)
     - Accessibility features (keyboard navigation, ARIA, screen readers)
     - State management architecture (React hooks, localStorage)
     - Backend RAG pipeline flow (10 steps)
     - Testing strategy (unit, integration, end-to-end)
     - Deployment architecture (GitHub Pages + Render)

**UI/UX Design Highlights**:

**Color Palette** (Muted Pastels):
- Background: Soft white with blue tint (hsla(210, 25%, 98%, 0.75))
- User bubbles: Pastel blue (hsla(210, 30%, 90%, 0.9))
- Assistant bubbles: Soft lavender (hsla(270, 20%, 92%, 0.9))
- Accent: Muted lavender (hsla(230, 30%, 85%, 1))
- Text: Muted dark blue-gray (hsla(220, 15%, 25%, 1))

**Key Components**:
1. Floating trigger button (60px circle, bottom-right)
2. Chat panel (360px desktop, full-screen mobile)
3. Glassmorphism effect with backdrop-filter
4. User messages (right-aligned, light blue)
5. Assistant messages (left-aligned, lavender)
6. Loading indicator (animated dots)
7. Error messages (soft red tint, calm design)
8. Rate limit countdown (soft yellow banner)
9. Text selection button ("Ask about this")
10. Input area with send button

**Technical Architecture**:
- **Frontend**: React components in Docusaurus via swizzling
- **Backend**: FastAPI with Cohere, Qdrant, Gemini (via OpenAI SDK)
- **RAG Pipeline**: Embed → Search → Generate → Stream → Cite
- **Rate Limiting**: 10 queries/minute/session (hybrid enforcement)
- **Deployment**: GitHub Pages (frontend) + Render Free Tier (backend)

**Constitution Compliance**: All 4 principles validated and passing
- Educational Excellence and Accessibility ✅
- Modular and Maintainable Structure ✅
- Technical Accuracy and Clarity ✅
- Docusaurus-Optimized Presentation ✅

**Performance Goals**:
- p95 latency < 3 seconds (query to response)
- Vector search < 500ms
- Support 50 concurrent users
- Chatbot UI loads in < 100ms

**Next Phase**: Run `/sp.tasks` to generate testable implementation tasks

## Outcome

- ✅ Impact: Complete architectural plan with detailed UI/UX specifications for RAG chatbot. All design decisions documented with rationale, alternatives, and trade-offs. Ready for implementation phase.
- 🧪 Tests: Planning phase - test strategy defined (Jest, React Testing Library, pytest, Playwright)
- 📁 Files: 5 artifacts created: plan.md (60KB), research.md (29KB), data-model.md (26KB), quickstart.md (24KB), contracts/openapi.yaml (12KB)
- 🔁 Next prompts: Run `/sp.tasks` to generate testable task list for implementation
- 🧠 Reflection: Successfully created professional, calm, premium UI design with glassmorphism effect and muted pastels. All architectural decisions documented with research citations. Constitution check passed for all principles. Ready for implementation.

## Evaluation notes (flywheel)

- Failure modes observed: Initial script execution failed with positional parameter error for feature description, but branch was successfully created. Agent context update script correctly processed placeholders.
- Graders run and results (PASS/FAIL): Constitution check: PASS (all 4 principles validated), UI/UX design: PASS (meets all calm/professional requirements), Architecture: PASS (all 9 decisions documented)
- Prompt variant (if applicable): Standard /sp.plan workflow with custom UI/UX design requirements
- Next experiment (smallest change to try): For future plans with custom UI requirements, consider creating a dedicated UI/UX design template separate from the main plan to improve modularity
