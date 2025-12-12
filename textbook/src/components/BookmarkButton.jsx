import React, { useState, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';

const BookmarkButton = ({ title }) => {
  const location = useLocation();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

  // Load bookmarks from localStorage on component mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('textbookBookmarks');
    if (savedBookmarks) {
      const parsedBookmarks = JSON.parse(savedBookmarks);
      setBookmarks(parsedBookmarks);
      setIsBookmarked(parsedBookmarks.some(b => b.url === location.pathname));
    }
  }, [location.pathname]);

  const toggleBookmark = () => {
    const bookmark = {
      url: location.pathname,
      title: title || document.title,
      timestamp: new Date().toISOString()
    };

    let updatedBookmarks;
    if (isBookmarked) {
      // Remove bookmark
      updatedBookmarks = bookmarks.filter(b => b.url !== location.pathname);
      setIsBookmarked(false);
    } else {
      // Add bookmark
      updatedBookmarks = [...bookmarks, bookmark];
      setIsBookmarked(true);
    }

    setBookmarks(updatedBookmarks);
    localStorage.setItem('textbookBookmarks', JSON.stringify(updatedBookmarks));

    // Show confirmation message
    const message = isBookmarked ? 'Bookmark removed' : 'Page bookmarked!';
    alert(message);
  };

  return (
    <button
      className={`bookmark-button ${isBookmarked ? 'bookmarked' : ''}`}
      onClick={toggleBookmark}
      title={isBookmarked ? 'Remove bookmark' : 'Bookmark this page'}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this page'}
    >
      {isBookmarked ? '🔖 Bookmarked' : 'Bookmark'}
      <style jsx>{`
        .bookmark-button {
          background: none;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          padding: 0.5rem 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .bookmark-button:hover {
          border-color: #2E8B57;
          background-color: #f8f9fa;
        }

        .bookmark-button.bookmarked {
          background-color: #e8f5e9;
          border-color: #2E8B57;
          color: #2E8B57;
        }
      `}</style>
    </button>
  );
};

export default BookmarkButton;