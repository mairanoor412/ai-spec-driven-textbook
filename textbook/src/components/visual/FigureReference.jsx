import React from 'react';
import Link from '@docusaurus/Link';

const FigureReference = ({
  id,
  title = '',
  label = 'Figure',
  className = '',
  page = null,
  variant = 'inline' // 'inline', 'block', 'tooltip'
}) => {
  const href = `#fig-${id}`;

  constgetReferenceContent = () => (
    <>
      <span className="reference-label">{label} </span>
      <span className="reference-id">{id}</span>
      {title && <span className="reference-title">: {title}</span>}
      {page && <span className="reference-page"> (page {page})</span>}
    </>
  );

  return (
    <Link
      to={href}
      className={`figure-reference variant-${variant} ${className}`}
      aria-label={`Jump to ${label} ${id}${title ? ': ' + title : ''}`}
    >
      {getReferenceContent()}
      <style jsx>{`
        .figure-reference {
          color: #2d3748;
          text-decoration: none;
          border-bottom: 1px dotted #cbd5e0;
          transition: all 0.2s ease;
          display: inline;
          cursor: pointer;
        }

        .figure-reference:hover {
          color: #1a202c;
          border-bottom: 1px solid #a0aec0;
          background-color: #f7fafc;
          border-radius: 2px;
          padding: 0 1px;
        }

        .figure-reference:focus {
          outline: 2px solid #667eea;
          outline-offset: 1px;
          border-radius: 2px;
        }

        .reference-label {
          font-weight: 500;
          color: #4a5568;
        }

        .reference-id {
          font-weight: 600;
          color: #2d3748;
        }

        .reference-title {
          color: #4a5568;
        }

        .reference-page {
          color: #718096;
          font-size: 0.875em;
          font-style: italic;
        }

        .variant-block {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          background-color: #f7fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          margin: 0 0.25rem;
        }

        @media (max-width: 768px) {
          .figure-reference {
            font-size: 0.95em;
          }
        }
      `}</style>
    </Link>
  );
};

export default FigureReference;