---
id: 021
title: Fix chatbot session UUID validation
stage: green
date: 2025-12-16
surface: agent
model: claude-sonnet-4-5-20250929
feature: rag-chatbot
branch: 001-rag-chatbot
user: asfar
command: direct
labels: ["bugfix", "validation", "uuid", "session-management"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - textbook/src/components/ChatbotWidget/useChatbot.js
tests:
 - Manual testing: Restart frontend and verify chatbot accepts messages
---

## Prompt

Current problem:
The chatbot UI loads, but every message shows **"Failed to fetch"**.

What is already confirmed:
- Backend is running successfully
- Health endpoint works:
  curl http://localhost:8000/health
  → status: healthy
- Qdrant is healthy
- Embeddings are generated
- Frontend is served at:
  http://localhost:3000/ai-spec-driven-textbook/

Frontend environment:
File: textbook/.env.local
REACT_APP_CHATBOT_API_URL=http://localhost:8000

Browser error:
Console shows:
Failed to load resource: the server responded with a status of 422 (Unprocessable Entity)
:8000/query:1   Failed to load resource: net::ERR_CONTENT_LENGTH_MISMATCH
useChatbot.js:173  Query error: TypeError: Failed to fetch
eval @ useChatbot.js:173
:8000/query:1   Failed to load resource: the server responded with a status of 422 (Unprocessable Entity)
:8000/query:1   Failed to load resource: net::ERR_CONTENT_LENGTH_MISMATCH
useChatbot.js:173  Query error: TypeError: Failed to fetch
eval @ useChatbot.js:173
:8000/query:1   Failed to load resource: the server responded with a status of 422 (Unprocessable Entity)
:8000/query:1   Failed to load resource: net::ERR_CONTENT_LENGTH_MISMATCH
useChatbot.js:173  Query error: TypeError: Failed to fetch
eval @ useChatbot.js:173
:8000/query:1   Failed to load resource: the server responded with a status of 422 (Unprocessable Entity)
:8000/query:1   Failed to load resource: net::ERR_CONTENT_LENGTH_MISMATCH
useChatbot.js:173  Query error: TypeError: Failed to fetch
eval @ us

## Response snapshot

Root cause identified: The backend expects a valid UUID for `session_id` (validated at backend/app/models.py:66-74), but the frontend was generating it as `${Date.now()}-${Math.random().toString(36).substr(2, 9)}` which is NOT a valid UUID format. This caused the 422 (Unprocessable Entity) error.

Changes made to textbook/src/components/ChatbotWidget/useChatbot.js:

1. Fixed UUID generation (line 16-28):
   - Now uses `crypto.randomUUID()` for modern browsers
   - Falls back to RFC4122-compliant UUID v4 generation for older browsers

2. Added UUID validation function (line 33-36):
   - Validates existing session IDs from localStorage
   - Ensures only valid UUIDs are used

3. Updated session loading (line 47):
   - Now checks if stored session_id is a valid UUID
   - Automatically migrates old sessions to new format

Next steps for user:
- Restart frontend development server to apply changes
- The chatbot will automatically generate a new valid UUID session
- Try sending a message - it should now work correctly
- Browser console errors should be gone

## Outcome

- ✅ Impact: Fixed critical bug preventing chatbot from accepting any messages due to invalid session_id format
- 🧪 Tests: Manual testing required - restart frontend and verify messages can be sent successfully
- 📁 Files: Modified 1 file (useChatbot.js)
- 🔁 Next prompts: Test the chatbot end-to-end; verify streaming responses work correctly
- 🧠 Reflection: The issue was a mismatch between frontend session ID generation and backend validation. The backend required RFC4122 UUID format, while frontend was using a timestamp-based custom format. Fixed by implementing proper UUID generation with browser API fallback.

## Evaluation notes (flywheel)

- Failure modes observed: Session ID format mismatch between frontend and backend validation schemas
- Graders run and results (PASS/FAIL): Manual testing pending
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Verify streaming responses work end-to-end; test localStorage session persistence
