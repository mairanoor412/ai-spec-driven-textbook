import React from 'react';
import { useHistory } from '@docusaurus/router';
import styles from './styles.module.css';

/**
 * CitationLink - Clickable citation that navigates to textbook section
 *
 * Features:
 * - Navigates to cited section in textbook
 * - Scrolls to section using URL hash anchor
 * - Keyboard accessible (Tab, Enter)
 * - Visual feedback on hover/focus
 */
export default function CitationLink({ citation, onClick }) {
  const history = useHistory();

  const handleClick = (e) => {
    e.preventDefault();

    // Call optional onClick handler
    if (onClick) {
      onClick(citation);
    }

    // Navigate to the citation URL
    if (citation.url) {
      // Use Docusaurus router for internal navigation
      history.push(citation.url);

      // Scroll to section after navigation
      setTimeout(() => {
        scrollToSection(citation.url);
      }, 100);
    }
  };

  const handleKeyDown = (e) => {
    // Handle Enter key for keyboard navigation
    if (e.key === 'Enter') {
      handleClick(e);
    }
  };

  return (
    <a
      href={citation.url}
      className={styles.citation}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
      aria-label={`Navigate to ${citation.text} in textbook`}
      title={`Go to ${citation.chapter}${citation.section ? ', ' + citation.section : ''}`}
    >
      [{citation.text}]
    </a>
  );
}

/**
 * Scroll to section using URL hash anchor
 *
 * @param {string} url - URL with hash anchor (e.g., /docs/chapter-3#section-2)
 */
function scrollToSection(url) {
  // Extract hash from URL
  const hashIndex = url.indexOf('#');
  if (hashIndex === -1) return;

  const hash = url.substring(hashIndex + 1);
  if (!hash) return;

  // Find element with matching ID
  const element = document.getElementById(hash);

  if (element) {
    // Scroll to element with smooth behavior
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    // Add highlight effect (optional)
    highlightElement(element);
  } else {
    // Fallback: try to find by data-attribute or class
    const altElement = document.querySelector(`[data-section="${hash}"]`);
    if (altElement) {
      altElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      highlightElement(altElement);
    }
  }
}

/**
 * Highlight element temporarily after navigation
 *
 * @param {HTMLElement} element - Element to highlight
 */
function highlightElement(element) {
  // Add highlight class
  element.classList.add('citation-highlight');

  // Remove highlight after 2 seconds
  setTimeout(() => {
    element.classList.remove('citation-highlight');
  }, 2000);
}
