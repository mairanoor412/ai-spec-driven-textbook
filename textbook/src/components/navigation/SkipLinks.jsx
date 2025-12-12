import React from 'react';

const SkipLinks = () => {
  return (
    <nav className="skip-links" aria-label="Skip navigation links">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <a href="#page-content" className="skip-link">
        Skip to page content
      </a>
      <a href="#figure" className="skip-link">
        Skip to figures
      </a>
      <a href="#table" className="skip-link">
        Skip to tables
      </a>
      <a href="#diagram" className="skip-link">
        Skip to diagrams
      </a>
      <a href="#navigation" className="skip-link">
        Skip to navigation
      </a>
      <a href="#exercises" className="skip-link">
        Skip to exercises
      </a>
      <style jsx>{`
        .skip-links {
          position: absolute;
          top: -40px;
          left: 6px;
          z-index: 1000;
        }

        .skip-link {
          position: absolute;
          top: -40px;
          left: 6px;
          padding: 8px;
          background: #000;
          color: #fff;
          text-decoration: none;
          border: none;
          border-radius: 4px;
          font-size: 0.875rem;
        }

        .skip-link:focus,
        .skip-link:active {
          top: 6px;
          left: 6px;
          outline: 2px solid #fff;
          outline-offset: 2px;
        }

        .skip-link:not(:focus):not(:active) {
          clip: rect(0 0 0 0);
          clip-path: inset(50%);
          height: 1px;
          overflow: hidden;
          position: absolute;
          white-space: nowrap;
          width: 1px;
        }
      `}</style>
    </nav>
  );
};

export default SkipLinks;