/**
 * Custom hook for rate limiting on the frontend
 *
 * Tracks query timestamps in localStorage and enforces limits
 */

import { useState, useEffect, useCallback } from 'react';

const RATE_LIMIT_KEY = 'chatbot_rate_limit';
const MAX_QUERIES = 10;
const WINDOW_SECONDS = 60;

/**
 * Load query timestamps from localStorage
 */
function loadQueryTimestamps() {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    if (stored) {
      const timestamps = JSON.parse(stored);
      // Filter to recent queries (within window)
      const cutoff = Date.now() - (WINDOW_SECONDS * 1000);
      return timestamps.filter(ts => ts > cutoff);
    }
  } catch (error) {
    console.error('Failed to load rate limit data:', error);
  }

  return [];
}

/**
 * Save query timestamps to localStorage
 */
function saveQueryTimestamps(timestamps) {
  try {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(timestamps));
  } catch (error) {
    console.error('Failed to save rate limit data:', error);
  }
}

/**
 * useRateLimit hook
 *
 * @returns {Object} Rate limit state and actions
 */
export function useRateLimit() {
  const [queryTimestamps, setQueryTimestamps] = useState(loadQueryTimestamps);
  const [isLimited, setIsLimited] = useState(false);
  const [waitSeconds, setWaitSeconds] = useState(0);

  /**
   * Clean up old timestamps periodically
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setQueryTimestamps(prev => {
        const cutoff = Date.now() - (WINDOW_SECONDS * 1000);
        const filtered = prev.filter(ts => ts > cutoff);

        if (filtered.length !== prev.length) {
          saveQueryTimestamps(filtered);
        }

        return filtered;
      });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  /**
   * Check if currently rate-limited
   */
  useEffect(() => {
    const cutoff = Date.now() - (WINDOW_SECONDS * 1000);
    const recentQueries = queryTimestamps.filter(ts => ts > cutoff);

    if (recentQueries.length >= MAX_QUERIES) {
      const oldestQuery = Math.min(...recentQueries);
      const resetTime = oldestQuery + (WINDOW_SECONDS * 1000);
      const wait = Math.ceil((resetTime - Date.now()) / 1000);

      setIsLimited(true);
      setWaitSeconds(Math.max(wait, 1));

      // Set timeout to clear limit when window expires
      const timeout = setTimeout(() => {
        setIsLimited(false);
        setWaitSeconds(0);
      }, wait * 1000);

      return () => clearTimeout(timeout);
    } else {
      setIsLimited(false);
      setWaitSeconds(0);
    }
  }, [queryTimestamps]);

  /**
   * Record a new query
   */
  const recordQuery = useCallback(() => {
    const now = Date.now();

    setQueryTimestamps(prev => {
      const updated = [...prev, now];
      const cutoff = now - (WINDOW_SECONDS * 1000);
      const filtered = updated.filter(ts => ts > cutoff);

      saveQueryTimestamps(filtered);
      return filtered;
    });
  }, []);

  /**
   * Reset rate limit (clear all timestamps)
   */
  const reset = useCallback(() => {
    setQueryTimestamps([]);
    saveQueryTimestamps([]);
    setIsLimited(false);
    setWaitSeconds(0);
  }, []);

  /**
   * Get remaining queries in current window
   */
  const getRemainingQueries = useCallback(() => {
    const cutoff = Date.now() - (WINDOW_SECONDS * 1000);
    const recentQueries = queryTimestamps.filter(ts => ts > cutoff);
    return Math.max(0, MAX_QUERIES - recentQueries.length);
  }, [queryTimestamps]);

  return {
    // State
    isLimited,
    waitSeconds,
    queriesInWindow: queryTimestamps.length,
    maxQueries: MAX_QUERIES,
    windowSeconds: WINDOW_SECONDS,

    // Actions
    recordQuery,
    reset,
    getRemainingQueries,
  };
}

export default useRateLimit;
