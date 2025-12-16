"""Query endpoints for RAG chatbot"""
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from app.models import Query, Response
from app.rag_pipeline import rag_pipeline
from app.utils.citation_parser import parse_citations
from app.rate_limiter import check_rate_limit
import json
import time
import asyncio

router = APIRouter()


async def generate_sse_events(query: Query):
    """
    Generate Server-Sent Events for streaming response

    Yields SSE-formatted events:
    - chunk: Text chunks as they are generated
    - citation: Citation found in response
    - done: Response complete
    - error: Error occurred

    Args:
        query: Query object with question and context
    """
    try:
        # Keep connection alive with initial comment
        yield ": ping\n\n"
        # Step 1: Embed query
        query_vector = await rag_pipeline.embed_query(query.question)

        # Step 2: Vector search
        search_results = await rag_pipeline.vector_search(
            query_vector=query_vector,
            top_k=5,
            min_score=0.7,
            selected_text=query.selected_text
        )

        # Check if we found relevant passages
        if not search_results:
            # Send error event
            yield f"data: {json.dumps({'event': 'chunk', 'data': {'content': 'I could not find information about this in the textbook. Please try rephrasing your question or ask about a different topic.'}})}\n\n"
            yield f"data: {json.dumps({'event': 'done', 'data': {}})}\n\n"
            return

        # Step 3: Stream response generation
        full_response = ""

        async for chunk in rag_pipeline.generate_stream(
            question=query.question,
            context_passages=search_results,
            conversation_history=query.conversation_history,
            selected_text=query.selected_text
        ):
            full_response += chunk

            # Send chunk event
            event_data = {
                "event": "chunk",
                "data": {
                    "content": chunk
                }
            }
            yield f"data: {json.dumps(event_data)}\n\n"

        # Step 4: Parse and send citations
        citations = parse_citations(
            response_text=full_response,
            context_passages=search_results
        )

        for citation in citations:
            event_data = {
                "event": "citation",
                "data": {
                    "text": citation.text,
                    "url": citation.url,
                    "chapter": citation.chapter,
                    "chapter_number": citation.chapter_number,
                    "section": citation.section,
                    "section_number": citation.section_number
                }
            }
            yield f"data: {json.dumps(event_data)}\n\n"

        # Step 5: Send done event
        done_data = {
            "event": "done",
            "data": {
                "query_id": query.query_id,
                "confidence_score": round(sum(r['score'] for r in search_results) / len(search_results), 2) if search_results else 0.0
            }
        }
        yield f"data: {json.dumps(done_data)}\n\n"

    except asyncio.CancelledError:
        # Client disconnected - this is expected, don't log as error
        print("Client disconnected during streaming")
        return
    except Exception as e:
        # Send error event only if connection is still alive
        try:
            error_data = {
                "event": "error",
                "data": {
                    "message": f"An error occurred: {str(e)}"
                }
            }
            yield f"data: {json.dumps(error_data)}\n\n"
        except (asyncio.CancelledError, GeneratorExit):
            # Client disconnected while handling error
            print(f"Client disconnected during error handling: {str(e)}")
            return


@router.post("/query", tags=["Query"])
async def query_chatbot(query: Query = Depends(check_rate_limit)):
    """
    Submit a question to the RAG chatbot (streaming response)

    Args:
        query: Query object containing question and conversation history

    Returns:
        Server-Sent Events stream with response chunks and citations

    Example:
        POST /query
        Body: {
            "session_id": "uuid",
            "question": "What is inverse kinematics?",
            "conversation_history": []
        }

        Response (SSE stream):
        data: {"event": "chunk", "data": {"content": "Inverse kinematics is..."}}
        data: {"event": "citation", "data": {"text": "Chapter 3, Section 2", "url": "/docs/..."}}
        data: {"event": "done", "data": {}}
    """
    # Return streaming response
    return StreamingResponse(
        generate_sse_events(query),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"  # Disable nginx buffering
        }
    )


@router.post("/query-selection", tags=["Query"])
async def query_with_selection(query: Query = Depends(check_rate_limit)):
    """
    Submit a question about selected text (streaming response)

    Args:
        query: Query object with question, selected_text, and conversation history

    Returns:
        Server-Sent Events stream with response chunks and citations

    Example:
        POST /query-selection
        Body: {
            "session_id": "uuid",
            "question": "Explain this in simpler terms",
            "selected_text": "Inverse kinematics (IK) is the process...",
            "conversation_history": []
        }
    """
    if not query.selected_text or not query.selected_text.strip():
        raise HTTPException(
            status_code=400,
            detail="selected_text is required for this endpoint"
        )

    # Return streaming response (same as /query)
    return StreamingResponse(
        generate_sse_events(query),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
