/**
 * ErrorMessage component - Display errors with retry button
 */
import React from 'react';
import styles from './styles.module.css';

export function ErrorMessage({ error, onRetry }) {
  if (!error) return null;

  return (
    <div className={styles.errorMessage} role="alert">
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
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>{error}</span>
      {onRetry && (
        <button
          className={styles.retryButton}
          onClick={onRetry}
          aria-label="Retry"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
