"""Qdrant vector database client for semantic search"""
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue
from typing import List, Dict, Any, Optional
import uuid
from app.config import settings


class VectorSearchClient:
    """
    Client for vector similarity search using Qdrant

    Manages embeddings storage and retrieval for the RAG pipeline
    """

    def __init__(self):
        """Initialize Qdrant client with credentials from settings"""
        self.client = QdrantClient(
            url=settings.qdrant_url,
            api_key=settings.qdrant_api_key
        )
        self.collection_name = settings.qdrant_collection_name
        self.dimension = settings.embedding_dimension

    def ensure_collection_exists(self):
        """
        Create collection if it doesn't exist

        Collection uses cosine similarity with 1024 dimensions
        """
        try:
            # Try to get the collection
            self.client.get_collection(self.collection_name)
            # Collection exists, no action needed
            return
        except Exception as e:
            # Collection might not exist, try to create it
            try:
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(
                        size=self.dimension,
                        distance=Distance.COSINE
                    )
                )
            except Exception as create_error:
                # Check if error is because collection already exists
                error_msg = str(create_error).lower()
                if "already exists" in error_msg or "conflict" in error_msg:
                    # Collection exists, this is fine
                    return
                else:
                    # Real error, re-raise
                    raise create_error

    async def upsert_embedding(
        self,
        embedding: List[float],
        metadata: Dict[str, Any]
    ) -> str:
        """
        Insert or update an embedding with metadata

        Args:
            embedding: Vector representation (1024 dimensions)
            metadata: Textbook passage metadata (chapter, section, text, url, etc.)

        Returns:
            UUID of the inserted point

        Raises:
            Exception: If upsert fails
        """
        if len(embedding) != self.dimension:
            raise ValueError(f"Embedding must have {self.dimension} dimensions")

        point_id = str(uuid.uuid4())

        try:
            self.client.upsert(
                collection_name=self.collection_name,
                points=[
                    PointStruct(
                        id=point_id,
                        vector=embedding,
                        payload=metadata
                    )
                ]
            )
            return point_id

        except Exception as e:
            raise Exception(f"Failed to upsert embedding: {str(e)}")

    async def search(
        self,
        query_vector: List[float],
        top_k: int = None,
        min_score: float = None,
        filters: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Search for similar embeddings

        Args:
            query_vector: Query embedding (1024 dimensions)
            top_k: Number of results to return (default from settings)
            min_score: Minimum similarity score (default from settings)
            filters: Optional metadata filters (e.g., {"chapter_number": 3})

        Returns:
            List of matches with payload and score

        Raises:
            Exception: If search fails
        """
        if len(query_vector) != self.dimension:
            raise ValueError(f"Query vector must have {self.dimension} dimensions")

        top_k = top_k or settings.top_k_results
        min_score = min_score or settings.min_similarity_score

        try:
            # Build filter if provided
            query_filter = None
            if filters:
                conditions = []
                for key, value in filters.items():
                    conditions.append(
                        FieldCondition(
                            key=key,
                            match=MatchValue(value=value)
                        )
                    )
                query_filter = Filter(must=conditions)

            # Perform search
            results = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                limit=top_k,
                score_threshold=min_score,
                query_filter=query_filter
            )

            # Format results
            matches = []
            for result in results:
                matches.append({
                    "id": str(result.id),
                    "score": result.score,
                    "payload": result.payload
                })

            return matches

        except Exception as e:
            raise Exception(f"Vector search failed: {str(e)}")

    async def delete_all(self):
        """Delete all points in the collection (for testing/reset)"""
        try:
            self.client.delete_collection(self.collection_name)
            self.ensure_collection_exists()
        except Exception as e:
            raise Exception(f"Failed to delete collection: {str(e)}")

    def get_collection_info(self) -> Dict[str, Any]:
        """
        Get collection statistics

        Returns:
            Dictionary with collection info (count, status, etc.)
        """
        try:
            info = self.client.get_collection(self.collection_name)
            return {
                "collection_name": self.collection_name,
                "vectors_count": info.vectors_count,
                "points_count": info.points_count,
                "status": info.status
            }
        except Exception as e:
            return {
                "collection_name": self.collection_name,
                "error": str(e)
            }


# Global instance
vector_search_client = VectorSearchClient()
