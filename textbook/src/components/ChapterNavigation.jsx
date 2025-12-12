import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';

const ChapterNavigation = ({ currentChapter, nextChapter, prevChapter }) => {

  return (
    <div className="chapter-navigation">
      <div className="chapter-nav-container">
        {prevChapter && (
          <div className="chapter-nav prev">
            <Link to={prevChapter.path}>
              <span className="nav-arrow">←</span>
              <span className="nav-label">Previous</span>
              <div className="nav-title">{prevChapter.title}</div>
            </Link>
          </div>
        )}

        {nextChapter && (
          <div className="chapter-nav next">
            <Link to={nextChapter.path}>
              <span className="nav-label">Next</span>
              <span className="nav-arrow">→</span>
              <div className="nav-title">{nextChapter.title}</div>
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .chapter-navigation {
          margin: 2rem 0;
          border-top: 1px solid #e0e0e0;
          border-bottom: 1px solid #e0e0e0;
          padding: 1.5rem 0;
        }

        .chapter-nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .chapter-nav {
          flex: 1;
        }

        .chapter-nav.prev {
          text-align: left;
        }

        .chapter-nav.next {
          text-align: right;
        }

        .chapter-nav a {
          display: block;
          padding: 1rem;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          text-decoration: none;
          color: inherit;
          transition: border-color 0.2s, background-color 0.2s;
        }

        .chapter-nav a:hover {
          border-color: #2E8B57;
          background-color: #f8f9fa;
        }

        .nav-arrow {
          display: block;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .nav-label {
          display: block;
          font-size: 0.8rem;
          text-transform: uppercase;
          color: #6c757d;
          margin-bottom: 0.25rem;
        }

        .nav-title {
          font-weight: 600;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .chapter-nav-container {
            flex-direction: column;
            gap: 1rem;
          }

          .chapter-nav.prev, .chapter-nav.next {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ChapterNavigation;