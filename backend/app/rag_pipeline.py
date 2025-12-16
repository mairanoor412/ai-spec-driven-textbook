"""RAG (Retrieval-Augmented Generation) Pipeline for Chatbot"""
from typing import List, Dict, Any, AsyncIterator
import time
from app.models import Query, Response, RetrievedPassage, Citation
from app.utils.cohere_client import embedding_client
from app.utils.qdrant_client import vector_search_client
from app.utils.llm_client import gemini_client
from app.utils.citation_parser import parse_citations


class RAGPipeline:
    """
    Retrieval-Augmented Generation pipeline

    Flow:
    1. Embed query → vector
    2. Search Qdrant → relevant passages
    3. Generate response with Gemini → grounded answer
    4. Parse citations → clickable links
    """

    def __init__(self):
        """Initialize RAG pipeline with all clients"""
        self.embedding_client = embedding_client
        self.vector_client = vector_search_client
        self.llm_client = gemini_client

    async def embed_query(self, question: str) -> List[float]:
        """
        Convert question to embedding vector

        Args:
            question: User's question text

        Returns:
            Embedding vector (1024 dimensions)
        """
        return await self.embedding_client.embed_query(question)

    async def vector_search(
        self,
        query_vector: List[float],
        top_k: int = 5,
        min_score: float = 0.7,
        selected_text: str = None
    ) -> List[Dict[str, Any]]:
        """
        Search for relevant passages in Qdrant

        Args:
            query_vector: Query embedding
            top_k: Number of results to return
            min_score: Minimum similarity score
            selected_text: Optional selected text to boost relevance

        Returns:
            List of matched passages with metadata
        """
        # If selected text provided, get its embedding and merge results
        if selected_text and selected_text.strip():
            try:
                # Embed selected text
                selection_vector = await self.embedding_client.embed_query(selected_text[:500])

                # Search with both vectors
                query_results = await self.vector_client.search(
                    query_vector=query_vector,
                    top_k=top_k // 2,
                    min_score=min_score
                )

                selection_results = await self.vector_client.search(
                    query_vector=selection_vector,
                    top_k=top_k // 2,
                    min_score=min_score
                )

                # Merge and deduplicate results
                seen_ids = set()
                merged_results = []

                # Prioritize selection results
                for result in selection_results:
                    if result['id'] not in seen_ids:
                        merged_results.append(result)
                        seen_ids.add(result['id'])

                # Add query results
                for result in query_results:
                    if result['id'] not in seen_ids and len(merged_results) < top_k:
                        merged_results.append(result)
                        seen_ids.add(result['id'])

                return merged_results

            except Exception as e:
                # Fall back to query-only search
                print(f"Warning: Selection search failed, using query-only: {e}")

        # Standard query search
        return await self.vector_client.search(
            query_vector=query_vector,
            top_k=top_k,
            min_score=min_score
        )

    async def generate_response(
        self,
        question: str,
        context_passages: List[Dict[str, Any]],
        conversation_history: List = None,
        selected_text: str = None
    ) -> str:
        """
        Generate grounded response using Gemini

        Args:
            question: User's question
            context_passages: Retrieved passages from vector search
            conversation_history: Previous conversation messages
            selected_text: Optional selected text

        Returns:
            Generated response text
        """
        return await self.llm_client.generate_response(
            question=question,
            context_passages=context_passages,
            conversation_history=conversation_history,
            selected_text=selected_text
        )

    async def generate_stream(
        self,
        question: str,
        context_passages: List[Dict[str, Any]],
        conversation_history: List = None,
        selected_text: str = None
    ) -> AsyncIterator[str]:
        """
        Generate streaming response using Gemini

        Args:
            question: User's question
            context_passages: Retrieved passages from vector search
            conversation_history: Previous conversation messages
            selected_text: Optional selected text

        Yields:
            Text chunks as they are generated
        """
        async for chunk in self.llm_client.generate_stream(
            question=question,
            context_passages=context_passages,
            conversation_history=conversation_history,
            selected_text=selected_text
        ):
            yield chunk

    async def process_query(
        self,
        query: Query,
        stream: bool = False
    ) -> Response:
        """
        Complete RAG pipeline: embed → search → generate → parse citations

        Args:
            query: Query object with question and context
            stream: Whether to use streaming generation

        Returns:
            Response object with generated answer and citations
        """
        start_time = time.time()

        try:
            # Step 1: Embed query
            query_vector = await self.embed_query(query.question)

            # Step 2: Vector search
            search_results = await self.vector_search(
                query_vector=query_vector,
                top_k=5,
                min_score=0.7,
                selected_text=query.selected_text
            )

            # Check if we found relevant passages
            if not search_results:
                # No relevant information found
                response = Response(
                    query_id=query.query_id,
                    content="I couldn't find information about this in the textbook. Please try rephrasing your question or ask about a different topic.",
                    citations=[],
                    retrieved_passages=[],
                    confidence_score=0.0,
                    generation_time_ms=int((time.time() - start_time) * 1000),
                    status="completed"
                )
                return response

            # Step 3: Generate response
            if stream:
                # Streaming response handled separately in endpoint
                response_text = ""
            else:
                response_text = await self.generate_response(
                    question=query.question,
                    context_passages=search_results,
                    conversation_history=query.conversation_history,
                    selected_text=query.selected_text
                )

            # Step 4: Parse citations
            citations = parse_citations(
                response_text=response_text if not stream else "",
                context_passages=search_results
            )

            # Step 5: Build retrieved passages list
            retrieved_passages = [
                RetrievedPassage(
                    embedding_id=result['id'],
                    text=result['payload'].get('text', '')[:500],  # Truncate for response
                    relevance_score=result['score'],
                    chapter=result['payload'].get('chapter'),
                    section=result['payload'].get('section')
                )
                for result in search_results
            ]

            # Calculate confidence (average relevance score)
            avg_score = sum(r['score'] for r in search_results) / len(search_results)

            # Step 6: Build response
            response = Response(
                query_id=query.query_id,
                content=response_text,
                citations=citations,
                retrieved_passages=retrieved_passages,
                confidence_score=round(avg_score, 2),
                generation_time_ms=int((time.time() - start_time) * 1000),
                status="completed"
            )

            return response

        except Exception as e:
            # Error response
            error_time = int((time.time() - start_time) * 1000)
            response = Response(
                query_id=query.query_id,
                content=f"I encountered an error processing your question: {str(e)}",
                citations=[],
                retrieved_passages=[],
                confidence_score=0.0,
                generation_time_ms=error_time,
                status="failed"
            )
            return response


# Global pipeline instance
rag_pipeline = RAGPipeline()
