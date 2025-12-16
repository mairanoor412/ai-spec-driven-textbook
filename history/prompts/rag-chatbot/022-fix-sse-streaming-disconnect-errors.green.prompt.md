---
id: 022
title: Fix SSE streaming disconnect errors
stage: green
date: 2025-12-16
surface: agent
model: claude-sonnet-4-5-20250929
feature: rag-chatbot
branch: 001-rag-chatbot
user: asfar
command: direct
labels: ["bugfix", "streaming", "sse", "error-handling", "connection-management"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - backend/app/routers/query.py
 - textbook/src/components/ChatbotWidget/api.js
tests:
 - Manual testing: Restart both servers and verify streaming works without errors
---

## Prompt

Backend error after fixing UUID validation:
```
RuntimeError: Unexpected message received: http.request
```

Error details:
- POST /query returns 200 OK successfully
- Error occurs in StreamingResponse during streaming
- Error in starlette/responses.py listen_for_disconnect method
- Exception in ASGI application with ExceptionGroup
- Error repeats for each query attempt

## Response snapshot

Root cause identified: Frontend was closing the connection improperly, causing the backend to receive unexpected messages while trying to stream. Two issues:

1. **Frontend issue**: When receiving 'done' or 'error' events, the frontend immediately returned without closing the ReadableStream reader, leaving the connection in an inconsistent state.

2. **Backend issue**: The streaming generator didn't gracefully handle client disconnects (asyncio.CancelledError), causing error logging and connection issues.

### Backend fixes (backend/app/routers/query.py):
1. Added initial SSE ping comment (": ping\n\n") to properly establish connection
2. Added asyncio.CancelledError exception handler for graceful client disconnect handling
3. Added nested error handling to catch disconnects during error reporting
4. Added asyncio import

### Frontend fixes (textbook/src/components/ChatbotWidget/api.js):
1. Added streamComplete flag to track when stream ends
2. Wrapped stream reading in try-finally block to ensure cleanup
3. Changed early returns to break statements for proper cleanup
4. Added reader.cancel() in finally block to properly close stream
5. Improved completion handling to avoid duplicate onDone calls

## Outcome

- ✅ Impact: Fixed critical streaming error causing backend crashes and inconsistent client connections
- 🧪 Tests: Manual testing required - restart both servers and verify chatbot streaming works without errors
- 📁 Files: Modified 2 files (query.py, api.js)
- 🔁 Next prompts: End-to-end test with multiple messages; verify error handling works correctly
- 🧠 Reflection: The error was caused by improper connection lifecycle management. Frontend needs to properly close ReadableStream readers, and backend needs to gracefully handle client disconnects in streaming responses. The fix ensures both sides of the connection are properly managed.

## Evaluation notes (flywheel)

- Failure modes observed: Improper stream reader cleanup in frontend; lack of client disconnect handling in backend
- Graders run and results (PASS/FAIL): Manual testing pending
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Test with slow connections; verify abort functionality works correctly; test error scenarios
