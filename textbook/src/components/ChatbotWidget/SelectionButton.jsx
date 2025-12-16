import React from 'react';
import styles from './styles.module.css';

/**
 * SelectionButton - Floating button that appears near selected text
 *
 * Design: Glassmorphism effect, positioned near text selection
 * Clicking opens chatbot with selected text as context
 */
export default function SelectionButton({ position, onClick, isTruncated }) {
  if (!position) return null;

  // Calculate button position (below and centered on selection)
  const buttonStyle = {
    position: 'absolute',
    top: `${position.bottom + 8}px`,
    left: `${position.left + (position.width / 2)}px`,
    transform: 'translateX(-50%)',
    zIndex: 9997, // Below chatbot but above content
  };

  return (
    <button
      className={styles.selectionButton}
      style={buttonStyle}
      onClick={onClick}
      aria-label="Ask chatbot about selected text"
      type="button"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <span>Ask about this</span>
      {isTruncated && (
        <span className={styles.selectionTruncated} title="Text truncated to 5000 characters">
          (truncated)
        </span>
      )}
    </button>
  );
}
