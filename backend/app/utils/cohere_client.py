"""Cohere API client for text embeddings"""
import cohere
from typing import List, Union
from app.config import settings


class EmbeddingClient:
    """
    Client for generating embeddings using Cohere API

    Uses embed-english-v3.0 model with 1024 dimensions
    """

    def __init__(self):
        """Initialize Cohere client with API key from settings"""
        self.client = cohere.Client(api_key=settings.cohere_api_key)
        self.model = settings.cohere_model
        self.dimension = settings.embedding_dimension

    async def embed_text(self, text: str) -> List[float]:
        """
        Generate embedding for a single text string

        Args:
            text: Input text to embed

        Returns:
            List of floats representing the embedding vector (1024 dimensions)

        Raises:
            Exception: If Cohere API call fails
        """
        return await self.embed_texts([text])

    async def embed_texts(self, texts: Union[str, List[str]]) -> List[List[float]]:
        """
        Generate embeddings for one or more texts

        Args:
            texts: Single text string or list of text strings

        Returns:
            List of embedding vectors, one per input text

        Raises:
            Exception: If Cohere API call fails
        """
        # Ensure texts is a list
        if isinstance(texts, str):
            texts = [texts]

        # Validate inputs
        if not texts:
            raise ValueError("texts cannot be empty")

        for text in texts:
            if not text or not text.strip():
                raise ValueError("All texts must be non-empty")

        try:
            # Call Cohere Embed API (v4.x compatible)
            response = self.client.embed(
                texts=texts,
                model=self.model,
                input_type="search_document"  # For indexing passages
            )

            # Extract embeddings (v4.x returns embeddings directly)
            embeddings = response.embeddings

            # Validate dimensions
            for embedding in embeddings:
                if len(embedding) != self.dimension:
                    raise ValueError(
                        f"Expected {self.dimension} dimensions, got {len(embedding)}"
                    )

            return embeddings

        except Exception as e:
            raise Exception(f"Cohere embedding failed: {str(e)}")

    async def embed_query(self, query: str) -> List[float]:
        """
        Generate embedding for a search query

        Args:
            query: User's search query

        Returns:
            Embedding vector optimized for search

        Raises:
            Exception: If Cohere API call fails
        """
        if not query or not query.strip():
            raise ValueError("Query cannot be empty")

        try:
            response = self.client.embed(
                texts=[query],
                model=self.model,
                input_type="search_query"  # For querying
            )

            # Extract first embedding (v4.x returns embeddings directly)
            embedding = response.embeddings[0]

            if len(embedding) != self.dimension:
                raise ValueError(
                    f"Expected {self.dimension} dimensions, got {len(embedding)}"
                )

            return embedding

        except Exception as e:
            raise Exception(f"Cohere query embedding failed: {str(e)}")


# Global instance
embedding_client = EmbeddingClient()
