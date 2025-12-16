import React from 'react';
import styles from './styles.module.css';

/**
 * ChatTrigger - Floating button that opens/closes the chatbot
 *
 * Design: 60px circle, bottom-right positioning, glassmorphism effect
 * Accessibility: ARIA labels, keyboard navigation support
 */
export default function ChatTrigger({ isOpen, onClick }) {
  return (
    <button
      className={styles.chatbotTrigger}
      onClick={onClick}
      aria-label={isOpen ? "Close chatbot assistant" : "Open chatbot assistant"}
      aria-expanded={isOpen}
      aria-controls="chatbot-panel"
      type="button"
    >
      {isOpen ? (
        // Close icon (X)
        <svg
          className={styles.chatbotTriggerIcon}
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      ) : (
        // Chat bubble icon
        <svg
          className={styles.chatbotTriggerIcon}
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )}
      <span className="sr-only">
        {isOpen ? "Close chatbot" : "Open chatbot to ask questions"}
      </span>
    </button>
  );
}
