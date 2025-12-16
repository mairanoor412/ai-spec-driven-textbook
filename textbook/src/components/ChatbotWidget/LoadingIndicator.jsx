/**
 * LoadingIndicator component - Animated loading dots
 */
import React from 'react';
import styles from './styles.module.css';

export function LoadingIndicator() {
  return (
    <div className={styles.loadingIndicator} aria-label="Loading">
      <div className={styles.loadingDot}></div>
      <div className={styles.loadingDot}></div>
      <div className={styles.loadingDot}></div>
    </div>
  );
}

export default LoadingIndicator;
