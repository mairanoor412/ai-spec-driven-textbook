/**
 * Error message configurations
 * Provides user-friendly error messages for different error types
 * Based on research.md error classification
 */

export const ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  RATE_LIMIT: 'RATE_LIMIT',
  TIMEOUT: 'TIMEOUT',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  NO_RESULTS: 'NO_RESULTS',
  INVALID_INPUT: 'INVALID_INPUT',
  UNKNOWN: 'UNKNOWN',
};

export const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK_ERROR]: {
    title: 'Connection Issue',
    message: 'Unable to reach the chatbot service. Please check your internet connection and try again.',
    retry: true,
    icon: '🔌',
  },
  [ERROR_TYPES.RATE_LIMIT]: {
    title: 'Query Limit Reached',
    message: 'You\'ve asked too many questions recently. Please wait {seconds} seconds before trying again.',
    retry: false,
    icon: '⏱️',
  },
  [ERROR_TYPES.TIMEOUT]: {
    title: 'Request Timed Out',
    message: 'The chatbot is taking longer than usual. Please try again or simplify your question.',
    retry: true,
    icon: '⏳',
  },
  [ERROR_TYPES.SERVICE_UNAVAILABLE]: {
    title: 'Chatbot Temporarily Unavailable',
    message: 'The chatbot service is currently down. Please try again in a few moments.',
    retry: true,
    icon: '🔧',
  },
  [ERROR_TYPES.NO_RESULTS]: {
    title: 'No Information Found',
    message: 'I couldn\'t find information about this in the textbook. Try rephrasing your question or asking about a different topic.',
    retry: false,
    icon: '🔍',
  },
  [ERROR_TYPES.INVALID_INPUT]: {
    title: 'Invalid Question',
    message: 'Your question is too long (max 2000 characters) or empty. Please try a shorter question.',
    retry: false,
    icon: '⚠️',
  },
  [ERROR_TYPES.UNKNOWN]: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again later or contact support if the issue persists.',
    retry: true,
    icon: '❌',
  },
};

/**
 * Classify error type from error object
 *
 * @param {Error} error - Error object
 * @returns {string} Error type constant
 */
export function classifyError(error) {
  if (!error) return ERROR_TYPES.UNKNOWN;

  const message = error.message?.toLowerCase() || '';

  // Network errors
  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('connection') ||
    error.name === 'NetworkError'
  ) {
    return ERROR_TYPES.NETWORK_ERROR;
  }

  // Rate limit
  if (message.includes('rate limit') || message.includes('429')) {
    return ERROR_TYPES.RATE_LIMIT;
  }

  // Timeout
  if (message.includes('timeout') || message.includes('timed out')) {
    return ERROR_TYPES.TIMEOUT;
  }

  // Service unavailable
  if (
    message.includes('503') ||
    message.includes('502') ||
    message.includes('500') ||
    message.includes('unavailable')
  ) {
    return ERROR_TYPES.SERVICE_UNAVAILABLE;
  }

  // No results
  if (message.includes('no information') || message.includes('no results')) {
    return ERROR_TYPES.NO_RESULTS;
  }

  // Invalid input
  if (
    message.includes('invalid') ||
    message.includes('too long') ||
    message.includes('empty')
  ) {
    return ERROR_TYPES.INVALID_INPUT;
  }

  return ERROR_TYPES.UNKNOWN;
}

/**
 * Get user-friendly error message
 *
 * @param {Error} error - Error object
 * @param {number} waitSeconds - Seconds to wait (for rate limit)
 * @returns {Object} Error message object
 */
export function getErrorMessage(error, waitSeconds = 0) {
  const errorType = classifyError(error);
  const config = ERROR_MESSAGES[errorType];

  // Replace {seconds} placeholder for rate limit
  const message = config.message.replace('{seconds}', waitSeconds.toString());

  return {
    ...config,
    message,
    type: errorType,
  };
}
