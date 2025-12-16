/**
 * API client for chatbot backend with SSE streaming support
 */

const API_BASE_URL = process.env.REACT_APP_CHATBOT_API_URL || 'http://localhost:8000';

/**
 * Query the chatbot with SSE streaming
 *
 * @param {Object} params Query parameters
 * @param {string} params.sessionId Session identifier
 * @param {string} params.question User's question
 * @param {Array} params.conversationHistory Previous messages
 * @param {string} params.selectedText Optional selected text
 * @param {Function} onChunk Callback for text chunks
 * @param {Function} onCitation Callback for citations
 * @param {Function} onDone Callback when complete
 * @param {Function} onError Callback for errors
 * @returns {Function} Abort function to cancel the request
 */
export async function queryAPI({
  sessionId,
  question,
  conversationHistory = [],
  selectedText = null
}, onChunk, onCitation, onDone, onError) {
  const controller = new AbortController();

  try {
    // Determine endpoint
    const endpoint = selectedText ? '/query-selection' : '/query';

    // Build request body
    const body = {
      session_id: sessionId,
      question: question,
      conversation_history: conversationHistory,
    };

    if (selectedText) {
      body.selected_text = selectedText;
    }

    // Make SSE request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    // Check response status
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    // Create event source from response stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let streamComplete = false;

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        // Decode and append to buffer
        buffer += decoder.decode(value, { stream: true });

        // Process complete lines
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (!line.trim() || line.startsWith(':')) {
            continue; // Skip empty lines and comments
          }

          // Parse SSE event
          if (line.startsWith('data: ')) {
            const data = line.substring(6);

            try {
              const event = JSON.parse(data);

              // Handle different event types
              switch (event.event) {
                case 'chunk':
                  if (onChunk) {
                    onChunk(event.data.content);
                  }
                  break;

                case 'citation':
                  if (onCitation) {
                    onCitation(event.data);
                  }
                  break;

                case 'done':
                  streamComplete = true;
                  if (onDone) {
                    onDone(event.data);
                  }
                  break;

                case 'error':
                  streamComplete = true;
                  if (onError) {
                    onError(new Error(event.data.message || 'Unknown error'));
                  }
                  break;

                default:
                  console.warn('Unknown event type:', event.event);
              }
            } catch (parseError) {
              console.error('Failed to parse SSE data:', data, parseError);
            }
          }
        }

        // Exit loop if stream is complete
        if (streamComplete) {
          break;
        }
      }
    } finally {
      // Always close the reader to properly terminate the connection
      try {
        reader.cancel();
      } catch (e) {
        // Ignore errors during cleanup
      }
    }

    // If we exit the loop without 'done' event, call onDone
    if (!streamComplete && onDone) {
      onDone({});
    }

  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request aborted');
    } else if (onError) {
      onError(error);
    }
  }

  // Return abort function
  return () => controller.abort();
}

/**
 * Check API health
 *
 * @returns {Promise<Object>} Health status
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
}

/**
 * Retry wrapper for API calls with exponential backoff
 *
 * @param {Function} apiCall Function that returns a promise
 * @param {number} maxRetries Maximum number of retries
 * @param {number} initialDelay Initial delay in ms
 * @returns {Promise} Result of the API call
 */
export async function withRetry(apiCall, maxRetries = 3, initialDelay = 1000) {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;

      // Don't retry on client errors (4xx)
      if (error.message && error.message.includes('HTTP 4')) {
        throw error;
      }

      // Exponential backoff
      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
