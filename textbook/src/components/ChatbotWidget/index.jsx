/**
 * ChatbotWidget - Main export component
 *
 * Integrates all chatbot functionality with state management
 * Phase 4: Manages open/closed state with trigger button
 * Phase 5: Integrates text selection functionality
 * Phase 7: Keyboard shortcuts and accessibility
 */
import React, { useState, useEffect } from 'react';
import { useChatbot } from './useChatbot';
import { useRateLimit } from './useRateLimit';
import { useTextSelection } from './useTextSelection';
import ChatbotUI from './ChatbotUI';
import ChatTrigger from './ChatTrigger';
import SelectionButton from './SelectionButton';

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    messages,
    isLoading,
    error,
    streamingContent,
    selectedText,
    submitQuery,
    clearHistory,
    retry,
    messagesEndRef,
    setSelectedText
  } = useChatbot();

  const {
    isLimited,
    waitSeconds,
    recordQuery
  } = useRateLimit();

  const {
    selectedText: pageSelectedText,
    selectionPosition,
    isTruncated,
    clearSelection,
    hasSelection
  } = useTextSelection();

  const handleSubmit = (question) => {
    // Check rate limit
    if (isLimited) {
      // Show rate limit error (already handled by error state in useChatbot)
      return;
    }

    // Record query for rate limiting
    recordQuery();

    // Submit query
    submitQuery(question);
  };

  const toggleChatbot = () => {
    setIsOpen(prev => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSelectionButtonClick = () => {
    // Set selected text in chatbot state
    setSelectedText(pageSelectedText);

    // Open chatbot
    setIsOpen(true);

    // Clear page selection
    clearSelection();
  };

  /**
   * Keyboard shortcuts
   * Ctrl+/ or Cmd+/ - Toggle chatbot
   * Escape - Close chatbot
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+/ or Cmd+/ to toggle chatbot
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        toggleChatbot();
      }

      // Escape to close chatbot
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      {/* Trigger button - always visible */}
      <ChatTrigger isOpen={isOpen} onClick={toggleChatbot} />

      {/* Selection button - appears when text is selected */}
      {!isOpen && hasSelection && (
        <SelectionButton
          position={selectionPosition}
          onClick={handleSelectionButtonClick}
          isTruncated={isTruncated}
        />
      )}

      {/* Chatbot UI - conditionally rendered */}
      {isOpen && (
        <ChatbotUI
          messages={messages}
          isLoading={isLoading}
          error={isLimited ? `Rate limit exceeded. Please wait ${waitSeconds} seconds.` : error}
          streamingContent={streamingContent}
          selectedText={selectedText}
          onSubmit={handleSubmit}
          onRetry={retry}
          onClearHistory={clearHistory}
          onClose={handleClose}
          messagesEndRef={messagesEndRef}
        />
      )}
    </>
  );
}

export default ChatbotWidget;
