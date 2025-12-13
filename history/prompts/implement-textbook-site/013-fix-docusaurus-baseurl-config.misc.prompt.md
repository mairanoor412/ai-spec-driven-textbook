---
id: 013
title: fix docusaurus baseUrl config
stage: misc
date: 2025-12-13
surface: agent
model: claude-sonnet-4-5-20250929
feature: implement-textbook-site
branch: feature/implement-textbook-site
user: Maira Naeem
command: /sp.git.commit_pr
labels: ["docusaurus", "config", "github-pages", "baseUrl", "deployment"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - textbook/docusaurus.config.js
tests:
  - none
---

## Prompt

My Docusaurus site is deployed on GitHub Pages but shows a warning:
"Your Docusaurus site did not load properly. A common reason is a wrong baseUrl configuration."

Current baseUrl is set to:
baseUrl: "/humanoid-robotics/"

My GitHub Pages URL is:
https://mairanoor412.github.io/ai-spec-driven-textbook/

My repository name is:
ai-spec-driven-textbook

Please:
1) Identify the exact config mistake
2) Update docusaurus.config.js with the correct baseUrl
3) Tell me exactly what to commit and push
4) Ensure the site works correctly on GitHub Pages

## Response snapshot

Identified and corrected multiple configuration mismatches in docusaurus.config.js:

**Issues Found:**
1. baseUrl: '/humanoid-robotics/' → '/ai-spec-driven-textbook/' (must match repo name)
2. url: 'https://asfarahmed.github.io' → 'https://mairanoor412.github.io' (wrong user)
3. organizationName: 'asfarahmed' → 'mairanoor412' (wrong GitHub user)
4. projectName: 'humanoid-robotics' → 'ai-spec-driven-textbook' (wrong repo)

**Actions Taken:**
- Updated all 4 configuration values in textbook/docusaurus.config.js
- Created commit with conventional format: "fix(config): correct GitHub Pages baseUrl and deployment settings"
- Pushed to feature/implement-textbook-site branch
- Provided clear deployment instructions for user

**Root Cause:**
The baseUrl must exactly match the repository name in the GitHub Pages URL path. The mismatch between '/humanoid-robotics/' and actual repo 'ai-spec-driven-textbook' caused Docusaurus asset loading failures.

## Outcome

- ✅ Impact: Fixed critical deployment configuration preventing site from loading on GitHub Pages
- 🧪 Tests: Configuration validated via git diff review
- 📁 Files: textbook/docusaurus.config.js (4 values updated)
- 🔁 Next prompts: User needs to merge to main branch to trigger GitHub Pages redeployment
- 🧠 Reflection: Autonomous diagnosis and fix of multi-part configuration issue; clear explanation provided to user

## Evaluation notes (flywheel)

- Failure modes observed: None - identified all related config issues in single pass
- Graders run and results (PASS/FAIL): N/A (config fix)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
