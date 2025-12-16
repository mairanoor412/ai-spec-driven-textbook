/**
 * useTextSelection hook - Detects text selection on the page
 *
 * Monitors user text selection via window.getSelection() and provides
 * selected text and position information for showing selection button
 * Phase 7: Debouncing for performance optimization
 */

import { useState, useEffect, useCallback, useRef } from 'react';

const MIN_SELECTION_LENGTH = 10; // Minimum characters to trigger selection
const MAX_SELECTION_LENGTH = 5000; // Maximum characters allowed
const DEBOUNCE_DELAY = 300; // ms - debounce delay for selection detection

export function useTextSelection() {
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const debounceTimeout = useRef(null);

  /**
   * Handle text selection event (debounced)
   */
  const handleSelection = useCallback(() => {
    // Clear existing timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Debounce the selection handling
    debounceTimeout.current = setTimeout(() => {
      const selection = window.getSelection();
      const text = selection?.toString().trim() || '';

      // Check if selection meets minimum length
      if (text.length < MIN_SELECTION_LENGTH) {
        setSelectedText('');
        setSelectionPosition(null);
        setIsTruncated(false);
        return;
      }

      // Truncate if exceeds maximum length
      let finalText = text;
      let truncated = false;

      if (text.length > MAX_SELECTION_LENGTH) {
        finalText = text.substring(0, MAX_SELECTION_LENGTH);
        truncated = true;
      }

      setSelectedText(finalText);
      setIsTruncated(truncated);

      // Get selection position for button placement
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setSelectionPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          right: rect.right + window.scrollX,
          bottom: rect.bottom + window.scrollY,
          width: rect.width,
          height: rect.height,
        });
      }
    }, DEBOUNCE_DELAY);
  }, []);

  /**
   * Clear selection
   */
  const clearSelection = useCallback(() => {
    setSelectedText('');
    setSelectionPosition(null);
    setIsTruncated(false);

    // Also clear browser selection
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  }, []);

  /**
   * Register selection event handlers
   */
  useEffect(() => {
    // Handle mouseup (most common selection method)
    document.addEventListener('mouseup', handleSelection);

    // Handle keyboard selection (Shift + arrows)
    document.addEventListener('keyup', handleSelection);

    // Handle touchend for mobile devices
    document.addEventListener('touchend', handleSelection);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('keyup', handleSelection);
      document.removeEventListener('touchend', handleSelection);

      // Clear pending timeout
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [handleSelection]);

  return {
    selectedText,
    selectionPosition,
    isTruncated,
    clearSelection,
    hasSelection: selectedText.length >= MIN_SELECTION_LENGTH,
  };
}

export default useTextSelection;
