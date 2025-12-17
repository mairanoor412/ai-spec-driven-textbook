---
id: 002
title: UI/UX Implementation Tasks Generation
stage: tasks
date: 2025-12-17
surface: agent
model: claude-sonnet-4-5
feature: 001-rag-chatbot
branch: 001-rag-chatbot
user: asfar
command: /sp.tasks
labels: ["tasks", "ui-ux", "implementation-plan", "checklist", "accessibility", "chatbot"]
links:
  spec: specs/001-rag-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-rag-chatbot/tasks-uiux.md
tests:
 - N/A (task generation phase, no tests executed)
---

## Prompt

$ARGUMENTS

(User requested continuation of /sp.tasks workflow for chatbot UI/UX improvements)

## Response snapshot

✅ **Task generation completed successfully**. Generated comprehensive implementation tasks document with:

**Document Created**: `tasks-uiux.md` (separate from original RAG chatbot tasks.md)

**Task Organization**: 3 phases, 17 implementation + 5 verification = 22 total tasks
- **Phase 1 - Color System Foundation** (4 tasks, ~1 hour): Update 8 CSS variables in custom.css for teal/green brand alignment
- **Phase 2 - Floating Icon & Tooltip** (6 tasks, ~2-3 hours): Replace text trigger with circular robot icon, add tooltip with 600ms delay
- **Phase 3 - Component Polish & Accessibility** (7 tasks, ~1-2 hours): Update all component colors, add prefers-reduced-motion support

**Parallel Execution**: 15 tasks marked [P] can run in parallel
- Phase 1: All 4 color variable updates
- Phase 2: 5 of 6 tasks (tooltip state, markup, CSS, animations, focus)
- Phase 3: 6 of 7 tasks (all component color updates)

**Task Format Compliance**: All tasks follow strict checklist format:
- ✅ Checkbox prefix: `- [ ]`
- ✅ Task ID: Sequential T001-T017
- ✅ [P] marker: 15 tasks marked parallelizable
- ✅ File paths: Explicit paths in every task description
- ✅ Acceptance criteria: Clear success conditions per task

**Files to Modify**: 8 total
1. `textbook/src/css/custom.css` - 8 color variables (lines 28-58)
2. `textbook/src/components/ChatbotWidget/ChatTrigger.jsx` - Icon SVG, tooltip, ARIA labels (~100 lines)
3. `textbook/src/components/ChatbotWidget/styles.module.css` - Tooltip, animations, reduced-motion (~150 lines)
4. `textbook/src/components/ChatbotWidget/ChatMessage.jsx` - Bubble colors (~5 lines)
5. `textbook/src/components/ChatbotWidget/ChatInput.jsx` - Send button color (~3 lines)
6. `textbook/src/components/ChatbotWidget/CitationLink.jsx` - Link accent color (~2 lines)
7. `textbook/src/components/ChatbotWidget/SelectionButton.jsx` - Button colors (~3 lines)
8. `textbook/src/components/ChatbotWidget/ChatbotUI.jsx` - Header background (~2 lines)

**Verification Tasks**: 5 comprehensive checks
- V001: Color contrast ratios (WebAIM Checker)
- V002: Floating icon behavior (desktop/mobile/keyboard/screen reader)
- V003: Cross-browser testing (6 browsers)
- V004: Accessibility automation (axe, WAVE, Lighthouse)
- V005: Manual accessibility (keyboard, screen reader, focus, touch targets)

**Manual Testing Checklists Included**:
- Visual regression (desktop 1920x1080, mobile 375x667, tablet 768x1024)
- Color verification (message bubbles, interactive elements)
- Accessibility verification (keyboard nav, screen readers, motion sensitivity)
- Performance testing (60fps animations, load time <100ms)
- Browser compatibility (Chrome, Firefox, Safari, Edge, iOS Safari, Android Chrome)

**Dependency Graph**:
```
Phase 1 (Color System) - MUST complete first
   ↓
Phase 2 (Icon) + Phase 3 (Components) - Can run in parallel
   ↓
Verification (V001-V005) - After all implementation
```

**MVP vs Full Scope**:
- MVP: Phase 1 + T005 + T009 (7 tasks, ~2 hours) = Floating icon with colors
- Full: All 3 phases (17 tasks, ~4-6 hours) = Production-ready with WCAG 2.1 AA

**Risk Mitigation Strategies**:
- Breaking functionality: UI-only changes, test after each phase
- Color contrast failures: Pre-verified 10.2:1+ ratios, WebAIM validation
- Animation performance: GPU-accelerated only (transform/opacity), Chrome Performance tab testing
- Accessibility regressions: axe DevTools + manual screen reader testing
- Browser compatibility: Existing backdrop-filter support 95%+

## Outcome

- ✅ Impact: Complete implementation task breakdown for production-grade chatbot UI/UX polish with 22 actionable, testable tasks
- 🧪 Tests: 5 verification tasks (V001-V005) covering color contrast, device testing, cross-browser, accessibility automation, and manual accessibility
- 📁 Files: 1 tasks document created (tasks-uiux.md), 8 implementation files identified with line counts
- 🔁 Next prompts: Begin implementation with Phase 1 (T001-T004: color system updates), then proceed to Phase 2 & 3 in parallel
- 🧠 Reflection: Task generation successfully organized by incremental phases rather than user stories (this is UI polish, not new features). All tasks include explicit file paths, acceptance criteria, and clear dependencies. 15 of 17 tasks parallelizable for efficient execution. Estimated 4-6 hours total effort for experienced frontend developer.

## Evaluation notes (flywheel)

- Failure modes observed: None - task generation workflow executed successfully, all tasks follow checklist format requirements
- Graders run and results (PASS/FAIL): Task Format Validation: PASS (all 22 tasks have checkbox, ID, file paths, acceptance criteria), Dependency Graph: PASS (Phase 1 blocks 2&3, verification depends on implementation), Parallel Opportunities: PASS (15 tasks marked [P] correctly)
- Prompt variant (if applicable): UI/UX improvement tasks (no user stories, incremental phases instead)
- Next experiment (smallest change to try): Implement Phase 1 MVP (T001-T004 color system) and validate before proceeding to Phase 2 icon changes
