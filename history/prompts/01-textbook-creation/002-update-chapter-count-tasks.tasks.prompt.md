---
id: 2
title: update-chapter-count-tasks
stage: tasks
date: 2025-12-10
surface: agent
model: Claude Sonnet 4.5
feature: 01-textbook-creation
branch: 01-textbook-creation
user: asfar
command: /sp.tasks
labels: ["tasks", "textbook", "chapter-count"]
links:
  spec: ../specs/01-textbook-creation/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - ../specs/01-textbook-creation/tasks.md
 - ../specs/01-textbook-creation/plan.md
tests:
 - null
---

## Prompt

Update the TASKS document.

Keep everything exactly the same — same tasks, same phases, same structure, same descriptions.

Only update the chapter count to match the new requirement of exactly 4 chapters.

Replace any references to "10–15 chapters", "remaining 8–13 chapters", or similar wording so the tasks align with a total of 4 chapters.

Do NOT remove or add new tasks.
Do NOT modify task descriptions.
Only update chapter quantities where required.

## Response snapshot

Updated the tasks document to change chapter references from 10-15 to exactly 4 chapters. Changes made:

1. Updated summary section from "10-15 chapters" to "exactly 4 chapters"
2. Updated Phase 8 (Remaining Chapters) to reflect only 2 additional chapters needed to reach the total of 4 (Physical AI fundamentals and Humanoid robotics concepts are already covered in US2 and US3)
3. Updated the remaining chapters to be "Practical Robotics Skills" and "AI-Driven Workflows and Tools" to match the spec requirements
4. Updated checkpoint to reflect "All required chapters (4)" instead of "All required chapters (10-15)"
5. Updated plan.md to reflect exactly 4 chapters instead of 10-15 in both summary and scale/scope sections
6. Updated project structure in plan.md to show chapter-03 and chapter-04 instead of [chapter-03 to chapter-15]

## Outcome

- ✅ Impact: Tasks document updated to reflect 4 chapters requirement instead of 10-15
- 🧪 Tests: No automated tests run
- 📁 Files: Modified tasks.md and plan.md
- 🔁 Next prompts: /sp.implement to execute the tasks
- 🧠 Reflection: Successfully aligned tasks with updated specification requirements

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Execute the implementation tasks
