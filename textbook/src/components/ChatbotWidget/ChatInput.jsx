/**
 * ChatInput component - Input field with send button
 */
import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';

export function ChatInput({
  onSubmit,
  disabled = false,
  placeholder = "Ask a question about the textbook...",
  selectedText = null
}) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!input.trim() || disabled) {
      return;
    }

    // Call submit handler
    onSubmit(input.trim());

    // Clear input
    setInput('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={styles.inputContainer}>
      {selectedText && (
        <div className={styles.selectedTextDisplay}>
          <strong>Selected text:</strong> "{selectedText.substring(0, 100)}
          {selectedText.length > 100 ? '...' : ''}"
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.inputWrapper}>
        <textarea
          ref={textareaRef}
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          maxLength={2000}
          aria-label="Chat input"
        />

        <button
          type="submit"
          className={styles.sendButton}
          disabled={disabled || !input.trim()}
          aria-label="Send message"
        >
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
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
}

export default ChatInput;
