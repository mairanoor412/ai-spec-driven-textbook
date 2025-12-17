import React, { useState } from 'react';
import styles from './styles.module.css';

/**
 * ChatTrigger - Floating button that opens/closes the chatbot
 *
 * Design: 60px circle (desktop), 64px (mobile), teal brand colors
 * Features: Robot icon, tooltip on hover/focus, smooth animations
 * Accessibility: ARIA labels, keyboard navigation, screen reader support
 */
export default function ChatTrigger({ isOpen, onClick }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipDelayTimer, setTooltipDelayTimer] = useState(null);

  const handleMouseEnter = () => {
    // Show tooltip after 600ms delay
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 600);
    setTooltipDelayTimer(timer);
  };

  const handleMouseLeave = () => {
    // Clear timer and hide tooltip immediately
    if (tooltipDelayTimer) {
      clearTimeout(tooltipDelayTimer);
      setTooltipDelayTimer(null);
    }
    setShowTooltip(false);
  };

  const handleFocus = () => {
    // Show tooltip immediately for keyboard users (no delay)
    setShowTooltip(true);
  };

  const handleBlur = () => {
    // Hide tooltip when focus is lost
    setShowTooltip(false);
  };

  return (
    <div className={styles.chatTriggerContainer}>
      <button
        className={styles.chatTrigger}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
        aria-expanded={isOpen}
        aria-controls="chatbot-panel"
        aria-describedby="chatbot-tooltip"
        type="button"
      >
        {isOpen ? (
          // Close icon (X)
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        ) : (
          // Robot icon (minimal design)
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            {/* Robot head outline */}
            <rect x="6" y="8" width="12" height="10" rx="2" />
            {/* Left eye */}
            <circle cx="9.5" cy="12" r="1.25" fill="currentColor" />
            {/* Right eye */}
            <circle cx="14.5" cy="12" r="1.25" fill="currentColor" />
            {/* Smile/mouth */}
            <path d="M9 15 Q12 16.5 15 15" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            {/* Antenna line */}
            <line x1="12" y1="5" x2="12" y2="8" strokeLinecap="round" />
            {/* Antenna tip */}
            <circle cx="12" cy="4" r="1.5" fill="currentColor" />
          </svg>
        )}
      </button>

      {/* Tooltip - only shown when not open and showTooltip is true */}
      {!isOpen && (
        <span
          id="chatbot-tooltip"
          role="tooltip"
          className={`${styles.tooltip} ${showTooltip ? styles.tooltipVisible : ''}`}
          aria-hidden={!showTooltip}
        >
          Ask AI Assistant
          <div className={styles.tooltipArrow}></div>
        </span>
      )}
    </div>
  );
}
