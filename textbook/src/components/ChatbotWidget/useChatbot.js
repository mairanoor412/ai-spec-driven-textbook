/**
 * Custom hook for chatbot state management
 *
 * Manages session, messages, localStorage persistence, and query submission
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { queryAPI } from './api';

const STORAGE_KEY = 'chatbot_session';
const MAX_HISTORY_LENGTH = 50;

/**
 * Generate a unique session ID (UUID v4 format)
 */
function generateSessionId() {
  // Generate UUID v4 (compatible with crypto.randomUUID())
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Validate if a string is a valid UUID
 */
function isValidUUID(str) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Load session from localStorage
 */
function loadSession() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const session = JSON.parse(stored);
      // Validate session structure and UUID format
      if (session.sessionId && Array.isArray(session.messages) && isValidUUID(session.sessionId)) {
        return session;
      }
    }
  } catch (error) {
    console.error('Failed to load session from localStorage:', error);
  }

  // Return new session if loading failed or session_id is invalid
  return {
    sessionId: generateSessionId(),
    messages: [],
    createdAt: new Date().toISOString(),
  };
}

/**
 * Save session to localStorage
 */
function saveSession(session) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Failed to save session to localStorage:', error);
  }
}

/**
 * useChatbot hook
 *
 * @returns {Object} Chatbot state and actions
 */
export function useChatbot() {
  // Session state
  const [session, setSession] = useState(loadSession);
  const [messages, setMessages] = useState(session.messages);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [streamingContent, setStreamingContent] = useState('');
  const [selectedText, setSelectedText] = useState(null);

  // Refs
  const abortRef = useRef(null);
  const messagesEndRef = useRef(null);

  /**
   * Persist messages to localStorage whenever they change
   */
  useEffect(() => {
    const updatedSession = {
      ...session,
      messages: messages.slice(-MAX_HISTORY_LENGTH),
      lastActivity: new Date().toISOString(),
    };

    setSession(updatedSession);
    saveSession(updatedSession);
  }, [messages]);

  /**
   * Scroll to bottom when new messages arrive
   */
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingContent]);

  /**
   * Add a message to the conversation
   */
  const addMessage = useCallback((role, content, citations = []) => {
    const newMessage = {
      role,
      content,
      timestamp: new Date().toISOString(),
      citations: citations || [],
    };

    setMessages(prev => [...prev, newMessage]);
  }, []);

  /**
   * Submit a query to the chatbot
   */
  const submitQuery = useCallback(async (question) => {
    if (!question || !question.trim()) {
      return;
    }

    // Cancel any ongoing request
    if (abortRef.current) {
      abortRef.current();
    }

    // Reset state
    setError(null);
    setIsLoading(true);
    setStreamingContent('');

    // Add user message
    addMessage('user', question);

    // Prepare conversation history for API
    const conversationHistory = messages.slice(-10).map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
    }));

    // Track streaming response
    let fullResponse = '';
    let citations = [];

    try {
      // Query API with SSE streaming
      const abort = await queryAPI(
        {
          sessionId: session.sessionId,
          question,
          conversationHistory,
          selectedText,
        },
        // onChunk
        (chunk) => {
          fullResponse += chunk;
          setStreamingContent(fullResponse);
        },
        // onCitation
        (citation) => {
          citations.push(citation);
        },
        // onDone
        () => {
          // Add assistant message with citations
          addMessage(
            'assistant',
            fullResponse || 'I apologize, but I encountered an error generating a response.',
            citations
          );

          // Clear streaming state
          setStreamingContent('');
          setIsLoading(false);
          setSelectedText(null); // Clear selection after query
        },
        // onError
        (err) => {
          console.error('Query error:', err);
          setError(err.message || 'Failed to get response from chatbot');
          setStreamingContent('');
          setIsLoading(false);
        }
      );

      abortRef.current = abort;

    } catch (err) {
      console.error('Submit query error:', err);
      setError(err.message || 'Failed to submit query');
      setIsLoading(false);
      setStreamingContent('');
    }
  }, [session.sessionId, messages, selectedText, addMessage]);

  /**
   * Clear conversation history
   */
  const clearHistory = useCallback(() => {
    setMessages([]);
    setError(null);
    setStreamingContent('');
    setSelectedText(null);

    // Update session
    const clearedSession = {
      sessionId: generateSessionId(),
      messages: [],
      createdAt: new Date().toISOString(),
    };

    setSession(clearedSession);
    saveSession(clearedSession);
  }, []);

  /**
   * Retry last query
   */
  const retry = useCallback(() => {
    // Find last user message
    const lastUserMessage = [...messages]
      .reverse()
      .find(msg => msg.role === 'user');

    if (lastUserMessage) {
      // Remove failed assistant response if present
      if (messages[messages.length - 1]?.role === 'assistant' && error) {
        setMessages(prev => prev.slice(0, -1));
      }

      submitQuery(lastUserMessage.content);
    }
  }, [messages, error, submitQuery]);

  /**
   * Cancel ongoing request
   */
  const cancel = useCallback(() => {
    if (abortRef.current) {
      abortRef.current();
      abortRef.current = null;
    }

    setIsLoading(false);
    setStreamingContent('');
    setError(null);
  }, []);

  return {
    // State
    sessionId: session.sessionId,
    messages,
    isLoading,
    error,
    streamingContent,
    selectedText,

    // Actions
    submitQuery,
    clearHistory,
    retry,
    cancel,
    setSelectedText,

    // Refs
    messagesEndRef,
  };
}

export default useChatbot;
