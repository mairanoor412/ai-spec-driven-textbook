/**
 * ChatMessage component - Renders individual message bubbles
 * Phase 6: Renders citations as clickable CitationLink components
 */
import React from 'react';
import CitationLink from './CitationLink';
import styles from './styles.module.css';

export function ChatMessage({ message, isStreaming = false }) {
  const { role, content, timestamp, citations = [] } = message;

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  /**
   * Parse content and render citations as CitationLink components
   *
   * Replaces citation markers like [Chapter 3, Section 2] with clickable links
   */
  const renderContentWithCitations = () => {
    if (!content) return null;

    // Pattern to match citation markers: [Chapter X, Section Y], [Chapter X], etc.
    const citationPattern = /\[(Chapter\s+\d+(?:,\s*Section\s+\d+)?)\]/gi;

    // Split content by citation markers
    const parts = content.split(citationPattern);

    return parts.map((part, index) => {
      // Check if this part is a citation text (e.g., "Chapter 3, Section 2")
      const isCitation = /^Chapter\s+\d+/i.test(part);

      if (isCitation && citations && citations.length > 0) {
        // Find matching citation object
        const citation = citations.find(c =>
          c.text.toLowerCase() === part.toLowerCase()
        );

        if (citation) {
          return (
            <CitationLink
              key={`citation-${index}`}
              citation={citation}
            />
          );
        }
      }

      // Regular text
      return <span key={`text-${index}`}>{part}</span>;
    });
  };

  return (
    <div className={`${styles.message} ${styles[role]}`}>
      <div className={styles.messageBubble}>
        {renderContentWithCitations()}
        {isStreaming && (
          <span className={styles.streamingCursor}>▊</span>
        )}
      </div>
      {timestamp && (
        <div className={styles.messageTimestamp}>
          {formatTime(timestamp)}
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
