"""Gemini LLM client using OpenAI SDK"""
from openai import OpenAI
from typing import List, AsyncIterator, Dict, Any
from app.config import settings
from app.models import Message


class GeminiClient:
    """
    Client for Gemini LLM using OpenAI SDK compatibility

    Generates grounded responses from retrieved context
    """

    def __init__(self):
        """Initialize OpenAI client configured for Gemini API"""
        self.client = OpenAI(
            api_key=settings.gemini_api_key,
            base_url=settings.openai_api_base
        )
        self.model = settings.gemini_model
        self.max_tokens = settings.max_tokens
        self.temperature = settings.temperature

    def build_prompt(
        self,
        question: str,
        context_passages: List[Dict[str, Any]],
        conversation_history: List[Message] = None,
        selected_text: str = None
    ) -> List[Dict[str, str]]:
        """
        Build messages for chat completion

        Args:
            question: User's question
            context_passages: Retrieved passages from vector search
            conversation_history: Previous messages in conversation
            selected_text: Optional text selection from the textbook

        Returns:
            List of message dictionaries for OpenAI chat format
        """
        messages = []

        # System message with grounding instructions
        system_prompt = """You are an AI assistant for the "AI/Spec-Driven Physical AI & Humanoid Robotics" textbook.
Your role is to answer questions using ONLY the provided context from the textbook.

IMPORTANT RULES:
1. Only use information from the provided context passages
2. If the context doesn't contain the answer, say "I couldn't find information about this in the textbook"
3. Include citations in the format [Chapter X, Section Y] for all claims
4. Be concise but accurate
5. If the user selected text, prioritize that context
6. Do not make up or infer information not in the context"""

        messages.append({"role": "system", "content": system_prompt})

        # Add conversation history if provided
        if conversation_history:
            for msg in conversation_history[-10:]:  # Last 10 messages for context
                messages.append({
                    "role": msg.role.value,
                    "content": msg.content
                })

        # Build context from retrieved passages
        context_text = "\n\n---\n\n".join([
            f"**{p['payload'].get('chapter', 'Unknown')} - {p['payload'].get('section', 'Unknown')}**\n{p['payload'].get('text', '')}"
            for p in context_passages
        ])

        # Add selected text if provided
        if selected_text:
            user_message = f"""SELECTED TEXT FROM TEXTBOOK:
"{selected_text}"

RETRIEVED CONTEXT:
{context_text}

QUESTION: {question}

Please answer the question focusing on the selected text above, using the retrieved context for additional information."""
        else:
            user_message = f"""RETRIEVED CONTEXT:
{context_text}

QUESTION: {question}

Please answer the question using only the context provided above."""

        messages.append({"role": "user", "content": user_message})

        return messages

    async def generate_response(
        self,
        question: str,
        context_passages: List[Dict[str, Any]],
        conversation_history: List[Message] = None,
        selected_text: str = None
    ) -> str:
        """
        Generate a complete response (non-streaming)

        Args:
            question: User's question
            context_passages: Retrieved passages from vector search
            conversation_history: Previous messages
            selected_text: Optional text selection

        Returns:
            Generated response text

        Raises:
            Exception: If LLM call fails
        """
        messages = self.build_prompt(
            question=question,
            context_passages=context_passages,
            conversation_history=conversation_history,
            selected_text=selected_text
        )

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=self.max_tokens,
                temperature=self.temperature
            )

            return response.choices[0].message.content

        except Exception as e:
            raise Exception(f"Gemini generation failed: {str(e)}")

    async def generate_stream(
        self,
        question: str,
        context_passages: List[Dict[str, Any]],
        conversation_history: List[Message] = None,
        selected_text: str = None
    ) -> AsyncIterator[str]:
        """
        Generate a streaming response (for SSE)

        Args:
            question: User's question
            context_passages: Retrieved passages from vector search
            conversation_history: Previous messages
            selected_text: Optional text selection

        Yields:
            Text chunks as they are generated

        Raises:
            Exception: If LLM call fails
        """
        messages = self.build_prompt(
            question=question,
            context_passages=context_passages,
            conversation_history=conversation_history,
            selected_text=selected_text
        )

        try:
            stream = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=self.max_tokens,
                temperature=self.temperature,
                stream=True
            )

            for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content

        except Exception as e:
            raise Exception(f"Gemini streaming failed: {str(e)}")


# Global instance
gemini_client = GeminiClient()
