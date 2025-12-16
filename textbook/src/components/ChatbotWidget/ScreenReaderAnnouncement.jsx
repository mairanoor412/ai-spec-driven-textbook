import React from 'react';

/**
 * ScreenReaderAnnouncement - Invisible component for screen reader announcements
 *
 * Uses aria-live="polite" to announce status changes to screen reader users
 * without interrupting their current reading
 */
export default function ScreenReaderAnnouncement({ message }) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
    >
      {message}
    </div>
  );
}
