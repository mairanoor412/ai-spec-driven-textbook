/**
 * ChatbotUI component - Main chatbot interface
 *
 * Assembles header, messages area, and input
 * Phase 7: Screen reader announcements
 */
import React, { useEffect, useState } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import LoadingIndicator from './LoadingIndicator';
import ErrorMessage from './ErrorMessage';
import ScreenReaderAnnouncement from './ScreenReaderAnnouncement';
import styles from './styles.module.css';

export function ChatbotUI({
  messages,
  isLoading,
  error,
  streamingContent,
  selectedText,
  onSubmit,
  onRetry,
  onClearHistory,
  onClose,
  messagesEndRef
}) {
  const [announcement, setAnnouncement] = useState('');

  // Announce loading state
  useEffect(() => {
    if (isLoading && !streamingContent) {
      setAnnouncement('Processing your question...');
    }
  }, [isLoading, streamingContent]);

  // Announce errors
  useEffect(() => {
    if (error) {
      setAnnouncement(`Error: ${error}`);
    }
  }, [error]);

  // Announce new messages
  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        const preview = lastMessage.content.substring(0, 100);
        setAnnouncement(`Answer received: ${preview}${lastMessage.content.length > 100 ? '...' : ''}`);
      }
    }
  }, [messages, isLoading]);
  return (
    <div className={styles.chatbotContainer}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.headerTitle}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          Ask AI Assistant
        </h3>

        <div className={styles.headerActions}>
          {messages.length > 0 && (
            <button
              className={styles.iconButton}
              onClick={onClearHistory}
              aria-label="Clear conversation"
              title="Clear conversation"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          )}

          <button
            className={styles.iconButton}
            onClick={onClose}
            aria-label="Close chatbot"
            title="Close chatbot"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className={styles.messagesContainer}>
        {messages.length === 0 && !isLoading && !streamingContent && (
          <div className={styles.emptyState}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <circle cx="9" cy="10" r="1"></circle>
              <circle cx="15" cy="10" r="1"></circle>
              <path d="M9 14c.5.5 1.5 1 3 1s2.5-.5 3-1"></path>
            </svg>
            <h3>Welcome to AI Assistant!</h3>
            <p>Ask me anything about the textbook content.</p>
          </div>
        )}

        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}

        {streamingContent && (
          <ChatMessage
            message={{
              role: 'assistant',
              content: streamingContent,
              timestamp: new Date().toISOString()
            }}
            isStreaming={true}
          />
        )}

        {isLoading && !streamingContent && <LoadingIndicator />}

        <ErrorMessage error={error} onRetry={onRetry} />

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput
        onSubmit={onSubmit}
        disabled={isLoading}
        selectedText={selectedText}
      />

      {/* Screen reader announcements */}
      <ScreenReaderAnnouncement message={announcement} />
    </div>
  );
}

export default ChatbotUI;
