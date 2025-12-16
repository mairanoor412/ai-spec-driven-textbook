# Implementation Tasks: Integrated RAG Chatbot

**Feature**: Integrated RAG Chatbot for AI/Spec-Driven Textbook
**Branch**: `001-rag-chatbot`
**Created**: 2025-12-15
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Overview

This document contains testable implementation tasks organized by user story priority. Each phase represents an independently testable increment that delivers user value.

**User Stories**:
- **US1** (P1): Ask Questions from Full Book Content
- **US4** (P1): Access Chatbot Across All Textbook Pages
- **US2** (P2): Ask Questions from Selected Text
- **US3** (P3): View Source Citations and Navigate to Content

**Task Format**: `- [ ] [TaskID] [P?] [Story?] Description with file path`
- **[P]**: Parallelizable task (different files, no blockers)
- **[Story]**: User story label (US1, US2, etc.)

**MVP Scope**: US1 + US4 (Core chatbot with full-book queries accessible on all pages)

---

## Phase 1: Project Setup & Infrastructure

**Goal**: Initialize project structure, install dependencies, configure development environment

**Duration Estimate**: 2-3 hours

### Tasks

- [X] T001 Create backend directory structure per plan.md at `backend/`
- [X] T002 [P] Create `backend/requirements.txt` with FastAPI, Cohere, Qdrant, OpenAI SDK, Uvicorn dependencies
- [X] T003 [P] Create `backend/requirements-dev.txt` with pytest, pytest-asyncio, black, isort, mypy
- [X] T004 [P] Create `backend/.env.example` with API key placeholders (COHERE_API_KEY, QDRANT_URL, QDRANT_API_KEY, GEMINI_API_KEY)
- [X] T005 [P] Create Python package markers: `backend/app/__init__.py`, `backend/app/routers/__init__.py`, `backend/app/utils/__init__.py`
- [X] T006 [P] Create `backend/Dockerfile` for Render deployment with Python 3.10 base image
- [X] T007 [P] Create `backend/README.md` with setup instructions referencing quickstart.md
- [X] T008 Install frontend dependencies: navigate to `textbook/` and run `npm install`
- [X] T009 Swizzle Docusaurus Root component: run `npm run swizzle @docusaurus/theme-classic Root -- --wrap` in `textbook/`
- [X] T010 [P] Create `textbook/.env.local` with `REACT_APP_CHATBOT_API_URL=http://localhost:8000`
- [X] T011 [P] Create `textbook/static/img/chatbot-icon.svg` with simple chat bubble icon
- [X] T012 [P] Create `.gitignore` entries for `backend/.env`, `backend/venv/`, `textbook/.env.local`

**Acceptance Criteria**:
- Backend and frontend directory structures match plan.md
- All dependency files created and valid
- Development environment variables configured
- Git ignores sensitive files

---

## Phase 2: Foundational Components (Blocking Prerequisites)

**Goal**: Build shared infrastructure required by all user stories - embeddings generation, backend config, base UI components

**Duration Estimate**: 6-8 hours

**Blocking Rationale**: These components are used by multiple user stories and must be completed before feature implementation.

### Backend Foundation

- [X] T013 Create `backend/app/config.py` with Pydantic settings for environment variables
- [X] T014 [P] Create `backend/app/models.py` with Pydantic models: Query, Response, Citation, Message (from data-model.md)
- [X] T015 [P] Create `backend/app/utils/cohere_client.py` with EmbeddingClient class wrapping Cohere API
- [X] T016 [P] Create `backend/app/utils/qdrant_client.py` with VectorSearchClient class wrapping Qdrant API
- [X] T017 [P] Create `backend/app/utils/llm_client.py` with GeminiClient class using OpenAI SDK for Gemini
- [X] T018 [P] Create `backend/app/utils/citation_parser.py` with parse_citations function extracting `[Chapter X, Section Y]` patterns
- [X] T019 Create `backend/app/rate_limiter.py` with RateLimitMiddleware class (10 queries/minute/session)
- [X] T020 Create `backend/app/main.py` with FastAPI app initialization, CORS middleware, rate limiter registration
- [X] T021 Create `backend/scripts/generate_embeddings.py` script to process `textbook/docs/` and upload to Qdrant
- [X] T022 Run embedding generation: `python backend/scripts/generate_embeddings.py --textbook-path textbook/docs` (blocks US1 testing)

### Frontend Foundation

- [X] T023 Create `textbook/src/components/ChatbotWidget/` directory structure
- [X] T024 Create `textbook/src/components/ChatbotWidget/styles.module.css` with glassmorphism design system per plan.md
- [X] T025 [P] Create `textbook/src/components/ChatbotWidget/api.js` with queryAPI function handling SSE streaming
- [X] T026 [P] Create `textbook/src/components/ChatbotWidget/useChatbot.js` hook managing session, messages, rate limiting, localStorage
- [X] T027 [P] Create `textbook/src/components/ChatbotWidget/useRateLimit.js` hook calculating rate limit state from localStorage
- [X] T028 Update `textbook/src/theme/Root.js` to import and render ChatbotWidget component
- [X] T029 Add chatbot CSS variables to `textbook/src/css/custom.css` with muted pastel color palette

**Acceptance Criteria**:
- Backend config loads environment variables correctly
- All utility clients initialized and ready for use
- Embeddings generated and uploaded to Qdrant (verify with health check)
- Frontend hooks manage state without errors
- Glassmorphism styles render correctly in browser

---

## Phase 3: User Story 1 - Ask Questions from Full Book Content (P1)

**Goal**: Core RAG chatbot functionality - users can ask questions and receive grounded answers with citations

**Independent Test**: Ask 10 different questions spanning multiple chapters, verify responses are grounded, include citations, and don't hallucinate

**Duration Estimate**: 10-12 hours

### Backend Implementation

- [X] T030 [US1] Create `backend/app/rag_pipeline.py` with RAGPipeline class (embed_query, vector_search, generate_response methods)
- [X] T031 [US1] Create `backend/app/routers/health.py` with GET /health endpoint returning service status
- [X] T032 [US1] Create `backend/app/routers/query.py` with POST /query endpoint implementing RAG pipeline with SSE streaming
- [X] T033 [US1] Register routers in `backend/app/main.py` with proper prefixes

### Frontend Implementation

- [X] T034 [P] [US1] Create `textbook/src/components/ChatbotWidget/ChatMessage.jsx` component rendering user and assistant message bubbles
- [X] T035 [P] [US1] Create `textbook/src/components/ChatbotWidget/ChatInput.jsx` component with input field, validation, send button
- [X] T036 [P] [US1] Create `textbook/src/components/ChatbotWidget/LoadingIndicator.jsx` component with animated dots
- [X] T037 [P] [US1] Create `textbook/src/components/ChatbotWidget/ErrorMessage.jsx` component displaying error with retry button
- [X] T038 [US1] Create `textbook/src/components/ChatbotWidget/ChatbotUI.jsx` component assembling header, messages, input (no trigger button yet)
- [X] T039 [US1] Update `textbook/src/components/ChatbotWidget/useChatbot.js` to implement handleSubmit with SSE streaming
- [X] T040 [US1] Create `textbook/src/components/ChatbotWidget/index.jsx` exporting ChatbotWidget (temporarily render open for testing)

### Integration & Testing

- [X] T041 [US1] Start backend locally: `uvicorn backend.app.main:app --reload`
- [X] T042 [US1] Start frontend locally: `cd textbook && npm start`
- [X] T043 [US1] Manual test: Ask "What is inverse kinematics?" and verify response with citations
- [X] T044 [US1] Manual test: Ask follow-up question and verify conversation context maintained
- [X] T045 [US1] Manual test: Ask question about non-existent topic and verify "couldn't find information" response
- [X] T046 [US1] Manual test: Submit 11 rapid queries and verify rate limit error with countdown

**Acceptance Criteria**:
- POST /query endpoint streams responses with chunks, citations, and done events
- Chatbot UI renders messages, handles loading states, displays errors
- Responses include source citations (Chapter X, Section Y format)
- Rate limiting enforced (10 queries/minute/session)
- No hallucination - responses only from retrieved passages
- Conversation context maintained across questions

**Parallel Execution Example**:
```bash
# Can run simultaneously after T033:
Terminal 1: Work on T034 (ChatMessage component)
Terminal 2: Work on T035 (ChatInput component)
Terminal 3: Work on T036 (LoadingIndicator component)
Terminal 4: Work on T037 (ErrorMessage component)

# Then T038 assembles all components
# Then T039-T040 complete the integration
```

---

## Phase 4: User Story 4 - Access Chatbot Across All Textbook Pages (P1)

**Goal**: Make chatbot accessible from all pages with persistent conversation history across navigation

**Independent Test**: Navigate through 10 different pages, verify chatbot remains visible and conversation history persists

**Duration Estimate**: 4-6 hours

**Dependencies**: Requires US1 (core chatbot) to be complete

### Implementation

- [X] T047 [P] [US4] Create `textbook/src/components/ChatbotWidget/ChatTrigger.jsx` component with floating button (60px circle, bottom-right)
- [X] T048 [US4] Update `textbook/src/components/ChatbotWidget/index.jsx` to manage open/closed state with trigger button
- [X] T049 [US4] Update `textbook/src/components/ChatbotWidget/useChatbot.js` to persist messages to localStorage on every update
- [X] T050 [US4] Update `textbook/src/components/ChatbotWidget/useChatbot.js` to restore messages from localStorage on mount
- [X] T051 [US4] Add desktop layout styles to `styles.module.css`: floating panel (360px, right-aligned)
- [X] T052 [US4] Add mobile layout styles to `styles.module.css`: full-screen overlay with responsive breakpoints
- [X] T053 [US4] Update `textbook/src/theme/Root.js` to ensure ChatbotWidget renders on all page types

### Testing

- [X] T054 [US4] Manual test: Open chatbot on Chapter 1, ask question, navigate to Chapter 3, verify chatbot persists
- [X] T055 [US4] Manual test: Have active conversation, refresh page, verify conversation history loads from localStorage
- [X] T056 [US4] Manual test: Navigate 10 pages, verify trigger button appears in consistent position
- [X] T057 [US4] Manual test: Test on mobile viewport (375px), verify full-screen overlay behavior
- [X] T058 [US4] Manual test: Clear conversation history button works and removes localStorage data

**Acceptance Criteria**:
- Trigger button visible on all textbook pages (bottom-right, glassmorphism style)
- Clicking trigger opens/closes chat panel
- Conversation history persists across page navigation (localStorage)
- Desktop: 360px floating panel; Mobile: full-screen overlay
- Chatbot state survives page refresh

**Parallel Execution Example**:
```bash
# Can run simultaneously after T046:
Terminal 1: Work on T047 (ChatTrigger component)
Terminal 2: Work on T051 (Desktop styles)
Terminal 3: Work on T052 (Mobile styles)

# Then T048-050 complete the integration
# Then T053-058 test across pages
```

---

## Phase 5: User Story 2 - Ask Questions from Selected Text (P2)

**Goal**: Allow users to select text and ask contextual questions prioritizing that selection

**Independent Test**: Select 5 different paragraphs, ask questions about each, verify responses prioritize selected text

**Duration Estimate**: 6-8 hours

**Dependencies**: Requires US1 (core chatbot) and US4 (accessible everywhere) to be complete

### Backend Implementation

- [X] T059 [US2] Create POST /query-selection endpoint in `backend/app/routers/query.py` with same RAG pipeline but prioritizing selected_text
- [X] T060 [US2] Update `backend/app/rag_pipeline.py` to accept optional selected_text parameter and boost its relevance in context assembly

### Frontend Implementation

- [X] T061 [P] [US2] Create `textbook/src/components/ChatbotWidget/useTextSelection.js` hook detecting text selection with window.getSelection()
- [X] T062 [P] [US2] Create `textbook/src/components/ChatbotWidget/SelectionButton.jsx` component appearing near selected text
- [X] T063 [US2] Update `textbook/src/components/ChatbotWidget/useChatbot.js` to store selectedText state
- [X] T064 [US2] Update `textbook/src/components/ChatbotWidget/ChatbotUI.jsx` to display selected text as quoted context
- [X] T065 [US2] Update `textbook/src/components/ChatbotWidget/api.js` to send selected_text in POST /query-selection request
- [X] T066 [US2] Update `textbook/src/components/ChatbotWidget/index.jsx` to integrate text selection with SelectionButton

### Testing

- [X] T067 [US2] Manual test: Select paragraph on Chapter 2, click "Ask about this", verify selection shown in chat
- [X] T068 [US2] Manual test: Ask "Explain this in simpler terms" with selection, verify response focuses on selected text
- [X] T069 [US2] Manual test: Clear selection, ask new question, verify switches to full-book mode
- [X] T070 [US2] Manual test: Select very long text (5000+ chars), verify truncation with notification
- [X] T071 [US2] Manual test: Test selection button positioning on different screen sizes

**Acceptance Criteria**:
- Text selection detected on mouseup/keyup events
- "Ask about this" button appears near selection
- Selected text visually indicated in chat (quoted)
- Responses prioritize selected text while maintaining grounding
- Selection cleared after query or when user starts new general query
- Handles edge cases: long selections, no selection, multiple selections

**Parallel Execution Example**:
```bash
# Can run simultaneously after T060:
Terminal 1: Work on T061 (useTextSelection hook)
Terminal 2: Work on T062 (SelectionButton component)

# Then T063-066 complete the integration
# Then T067-071 test selection behavior
```

---

## Phase 6: User Story 3 - View Source Citations and Navigate to Content (P3)

**Goal**: Make citations clickable links that navigate to textbook sections with highlighting

**Independent Test**: Ask 10 questions, click citations, verify navigation to correct sections

**Duration Estimate**: 4-6 hours

**Dependencies**: Requires US1 (core chatbot) to be complete

### Implementation

- [X] T072 [P] [US3] Create `textbook/src/components/ChatbotWidget/CitationLink.jsx` component rendering clickable citation
- [X] T073 [US3] Update `backend/app/utils/citation_parser.py` to generate Docusaurus-compatible URLs (`/docs/chapter-3/inverse-kinematics#section-2`)
- [X] T074 [US3] Update `textbook/src/components/ChatbotWidget/ChatMessage.jsx` to render citations as CitationLink components
- [X] T075 [US3] Add citation link styles to `styles.module.css` (lavender color, underline on hover)
- [X] T076 [US3] Implement navigation handling in CitationLink (open in same/new tab based on user preference)
- [X] T077 [US3] Add scroll-to-section logic using URL hash anchor and highlight effect

### Testing

- [X] T078 [US3] Manual test: Ask question, verify citations rendered as clickable links
- [X] T079 [US3] Manual test: Click citation, verify navigation to correct chapter/section
- [X] T080 [US3] Manual test: Verify section scrolled into view or highlighted on navigation
- [X] T081 [US3] Manual test: Hover over citation, verify visual feedback (darker lavender, thicker underline)
- [X] T082 [US3] Manual test: Keyboard navigation - Tab to citation, Enter to navigate

**Acceptance Criteria**:
- Citations formatted as links (`[Chapter 3, Section 2]` → clickable)
- Clicking navigates to correct textbook URL
- Target section scrolled into view or highlighted
- Citation links accessible via keyboard (Tab, Enter)
- Hover states provide visual feedback

**Parallel Execution Example**:
```bash
# Can run simultaneously after T046:
Terminal 1: Work on T072 (CitationLink component)
Terminal 2: Work on T073 (URL generation in parser)
Terminal 3: Work on T075 (Citation styles)

# Then T074, T076-077 complete the integration
# Then T078-082 test navigation
```

---

## Phase 7: Polish & Cross-Cutting Concerns

**Goal**: Accessibility, mobile responsiveness, error handling, documentation

**Duration Estimate**: 6-8 hours

**Dependencies**: All user stories complete

### Accessibility (WCAG 2.1 AA)

- [X] T083 [P] Add ARIA labels to all interactive elements in ChatbotWidget components
- [X] T084 [P] Implement keyboard shortcuts: Ctrl+/ (open), Escape (close), Tab (navigate)
- [X] T085 [P] Add screen reader announcements for loading, errors, new messages using `aria-live="polite"`
- [X] T086 [P] Add focus indicators to all focusable elements (2px lavender outline per plan.md)
- [ ] T087 Test with screen reader (NVDA/JAWS/VoiceOver): Verify all content announced correctly
- [ ] T088 Run Lighthouse accessibility audit: Achieve 90+ score

### Mobile Responsiveness

- [ ] T089 [P] Test chatbot on mobile devices (iOS Safari, Android Chrome): Verify full-screen overlay
- [ ] T090 [P] Verify touch targets are 44px minimum (trigger button, send button, close button)
- [ ] T091 [P] Test swipe gestures: Swipe down to close chatbot on mobile
- [ ] T092 [P] Verify keyboard behavior on mobile (input focus, virtual keyboard)

### Error Handling & Edge Cases

- [X] T093 [P] Implement retry logic with exponential backoff in `api.js` for network errors
- [X] T094 [P] Add specific error messages for each error type per research.md (network, timeout, rate limit, no results)
- [ ] T095 [P] Test API unavailable scenario: Stop backend, verify user-friendly error with retry button
- [ ] T096 [P] Test extremely long question (2000+ chars): Verify truncation warning
- [ ] T097 [P] Test question in non-English language: Verify appropriate response

### Performance Optimization

- [X] T098 [P] Lazy load ChatbotWidget component to improve initial page load time
- [X] T099 [P] Implement debouncing for text selection detection (reduce event handler calls)
- [ ] T100 [P] Add bundle size analysis: Verify chatbot adds <50KB to build
- [ ] T101 Run Lighthouse performance audit: Verify chatbot doesn't degrade page performance (<5% impact)

### Documentation & Deployment

- [ ] T102 [P] Create `backend/tests/test_rag_pipeline.py` with unit tests for RAG components
- [ ] T103 [P] Create `backend/tests/test_rate_limiter.py` with tests for rate limiting middleware
- [ ] T104 [P] Create `textbook/src/components/ChatbotWidget/__tests__/useChatbot.test.js` with hook tests
- [X] T105 [P] Create `.github/workflows/deploy-backend.yml` with Render deployment trigger
- [X] T106 [P] Create `.github/workflows/deploy-frontend.yml` with GitHub Pages deployment
- [X] T107 Update `README.md` with chatbot feature description and screenshots
- [X] T108 Create deployment documentation in `specs/001-rag-chatbot/DEPLOYMENT.md`

### Final Validation

- [ ] T109 Run full end-to-end test suite covering all user stories
- [ ] T110 Verify all 10 success criteria from spec.md (SC-001 through SC-010)
- [ ] T111 Performance test: Simulate 50 concurrent users, verify no degradation
- [ ] T112 Security audit: Verify no API keys in repository, HTTPS enforced
- [ ] T113 Cross-browser test: Chrome, Firefox, Safari desktop + mobile
- [ ] T114 Create release notes summarizing implemented user stories and known limitations

**Acceptance Criteria**:
- WCAG 2.1 AA compliance achieved (Lighthouse audit 90+)
- Mobile-responsive on all device sizes
- All edge cases handled gracefully
- Test coverage >80% for backend critical paths
- CI/CD pipelines deployed and tested
- Documentation complete and accurate

**Parallel Execution Example**:
```bash
# After all user stories complete, can run simultaneously:
Terminal 1: Work on T083-086 (Accessibility)
Terminal 2: Work on T089-092 (Mobile responsiveness)
Terminal 3: Work on T093-097 (Error handling)
Terminal 4: Work on T098-101 (Performance)
Terminal 5: Work on T102-104 (Tests)
Terminal 6: Work on T105-108 (Deployment & docs)

# Then T109-114 validate everything together
```

---

## Dependencies & Execution Order

### Critical Path

```
Phase 1 (Setup)
  ↓
Phase 2 (Foundation) ← BLOCKS all user stories
  ↓
Phase 3 (US1) + Phase 4 (US4) ← Can run in parallel after Phase 2
  ↓
Phase 5 (US2) ← Requires US1 + US4 complete
  ↓
Phase 6 (US3) ← Requires US1 complete (can run parallel with US2)
  ↓
Phase 7 (Polish) ← Requires all user stories complete
```

### User Story Dependencies

- **US1** (P1): No dependencies (core feature)
- **US4** (P1): Depends on US1 (needs core chatbot to make accessible)
- **US2** (P2): Depends on US1 + US4 (extends core chatbot with selection)
- **US3** (P3): Depends on US1 only (enhances citations, independent of US2/US4)

### Suggested Execution Phases

**Week 1** (MVP - ~24 hours):
- Days 1-2: Phase 1 (Setup) + Phase 2 (Foundation)
- Days 3-4: Phase 3 (US1 - Core chatbot)
- Day 5: Phase 4 (US4 - Accessible everywhere)
- **Deliverable**: Working chatbot answering questions on all pages

**Week 2** (Full Features - ~18 hours):
- Days 1-2: Phase 5 (US2 - Text selection)
- Day 3: Phase 6 (US3 - Citation navigation)
- Days 4-5: Phase 7 (Polish, testing, deployment)
- **Deliverable**: Complete feature with all user stories, deployed

---

## Parallel Execution Opportunities

Tasks marked with **[P]** can be executed in parallel within their phase. This allows multiple developers or AI agents to work simultaneously without conflicts.

### Phase 1 Parallel Tasks

```bash
# After T001, run simultaneously:
T002, T003, T004, T005, T006, T007, T010, T011, T012
# ~10 tasks in parallel
```

### Phase 2 Parallel Tasks

```bash
# After T013, run simultaneously:
T014, T015, T016, T017, T018 (all utils and models)
T024, T025, T026, T027 (all frontend hooks and styles)
# ~9 tasks in parallel
```

### Phase 3 Parallel Tasks (US1)

```bash
# After T033, run simultaneously:
T034, T035, T036, T037 (all UI components)
# 4 tasks in parallel, then T038-040 assemble
```

### Phase 7 Parallel Tasks (Polish)

```bash
# After all user stories, run simultaneously:
T083-086 (Accessibility)
T089-092 (Mobile)
T093-097 (Error handling)
T098-101 (Performance)
T102-104 (Tests)
T105-108 (Deployment)
# ~24 tasks in parallel across 6 categories
```

---

## Implementation Strategy

### MVP First (Recommended)

**Scope**: Phase 1 + Phase 2 + Phase 3 (US1) + Phase 4 (US4)

**Why**: Delivers core value (ask questions, get answers, accessible everywhere) with minimal scope

**Estimated Effort**: 24-30 hours

**Validation**: Can demonstrate working chatbot to stakeholders, gather feedback before building enhancements

### Incremental Delivery

After MVP:
1. **Release 1**: US2 (text selection) - adds contextual queries
2. **Release 2**: US3 (citation navigation) - improves trust and verification
3. **Release 3**: Polish (accessibility, tests, performance)

Each release is independently testable and deployable.

---

## Task Summary

**Total Tasks**: 114
**Parallelizable Tasks**: 47 (41%)

**Tasks per Phase**:
- Phase 1 (Setup): 12 tasks
- Phase 2 (Foundation): 17 tasks
- Phase 3 (US1): 17 tasks
- Phase 4 (US4): 12 tasks
- Phase 5 (US2): 13 tasks
- Phase 6 (US3): 11 tasks
- Phase 7 (Polish): 32 tasks

**Tasks per User Story**:
- US1 (P1): 17 tasks
- US4 (P1): 12 tasks
- US2 (P2): 13 tasks
- US3 (P3): 11 tasks
- Setup/Polish: 61 tasks

**MVP Task Count**: 58 tasks (Phases 1-4)

---

## Success Validation Checklist

After completing all tasks, validate against spec.md success criteria:

- [ ] **SC-001**: p95 latency < 3 seconds (measure with 50 sample queries)
- [ ] **SC-002**: 90% of responses include valid source citations
- [ ] **SC-003**: System supports 50 concurrent users (load test)
- [ ] **SC-004**: Vector search 90%+ accuracy (test with 50 questions)
- [ ] **SC-005**: Zero hallucinations (test with 100 diverse queries)
- [ ] **SC-006**: Chatbot loads on 100% of textbook pages
- [ ] **SC-007**: Selection queries prioritize selected text 95% of time
- [ ] **SC-008**: Full interaction completed in <1 minute
- [ ] **SC-009**: Backend 99% uptime over 30 days (monitor)
- [ ] **SC-010**: Fully functional on desktop + mobile browsers

---

## Notes

- **No Testing Phase**: Tests not explicitly requested in spec, so test tasks are marked as optional in Phase 7
- **File Paths**: All tasks include specific file paths for LLM execution
- **Glassmorphism**: UI design uses CSS backdrop-filter with fallback per plan.md
- **Rate Limiting**: Hybrid enforcement (frontend localStorage + backend in-memory)
- **Embeddings**: Must be generated once (T022) before US1 testing
- **Constitution**: All implementation must comply with Educational Excellence, Modular Structure, Technical Accuracy, Docusaurus-Optimized principles

**Ready to Execute**: Tasks are specific enough for immediate implementation. Start with Phase 1, then Phase 2, then user stories in priority order.
