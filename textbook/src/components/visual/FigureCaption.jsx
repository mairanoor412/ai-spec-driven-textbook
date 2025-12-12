import React from 'react';

const FigureCaption = ({
  id,
  title,
  children,
  className = '',
  number = null,
  label = 'Figure',
  page = null
}) => {
  return (
    <figcaption
      className={`figure-caption ${className}`}
      id={`fig-${id}`}
      aria-label={`${label} ${number || id}: ${title}`}
    >
      <div className="caption-content">
        <span className="caption-label">
          <strong>{label} {number || id}:</strong>
        </span>
        <span className="caption-title"> {title}</span>
        {children && <span className="caption-body"> {children}</span>}
        {page && <span className="caption-page"> (page {page})</span>}
      </div>
      <style jsx>{`
        .figure-caption {
          margin-top: 0.75rem;
          padding: 0.75rem 0;
          font-size: 0.9rem;
          color: #666;
          text-align: center;
          border-top: 1px solid #e0e0e0;
          line-height: 1.5;
        }

        .caption-content {
          display: inline-block;
          text-align: left;
        }

        .caption-label {
          color: #4a5568;
          font-weight: 500;
        }

        .caption-title {
          font-weight: 500;
        }

        .caption-page {
          color: #888;
          font-style: italic;
          margin-left: 0.5rem;
        }

        @media (max-width: 768px) {
          .figure-caption {
            font-size: 0.85rem;
            padding: 0.5rem 0;
          }
        }
      `}</style>
    </figcaption>
  );
};

export default FigureCaption;