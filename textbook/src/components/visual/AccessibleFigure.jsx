import React, { useState } from 'react';
import AccessibleImage from './AccessibleImage';
import FigureCaption from './FigureCaption';

const AccessibleFigure = ({
  id,
  src,
  alt,
  title,
  caption,
  size = 'medium',
  showBorder = true,
  className = '',
  lazy = true,
  priority = false,
  enableZoom = true,
  elements = [],
  enableSkipLink = true,
  ...props
}) => {
  const [showAltText, setShowAltText] = useState(false);

  return (
    <figure
      className={`accessible-figure-component size-${size} ${showBorder ? 'bordered' : ''} ${className}`}
      id={`fig-${id}`}
      role="figure"
      aria-label={`Figure ${id}: ${title}`}
      aria-describedby={`fig-${id}-desc`}
    >
      {enableSkipLink && (
        <a href="#content" className="skip-link" aria-label={`Skip to content after Figure ${id}`}>
          Skip Figure
        </a>
      )}

      <div className="figure-content">
        <AccessibleImage
          src={src}
          alt={alt}
          size={size}
          lazy={lazy}
          priority={priority}
          showBorder={false}
          enableZoom={enableZoom}
          elements={elements}
          ariaLabel={`Figure ${id}: ${title}`}
          {...props}
        />
      </div>

      <div id={`fig-${id}-desc`} className="sr-only">
        {title}: {caption} {alt && `Image description: ${alt}`}
        {elements.length > 0 && ` Contains ${elements.length} labeled elements: ${elements.map(el => el.name).join(', ')}.`}
      </div>

      <div className="alt-text-toggle">
        <button
          onClick={() => setShowAltText(!showAltText)}
          aria-expanded={showAltText}
          aria-controls={`alt-text-${id}`}
        >
          {showAltText ? 'Hide' : 'Show'} Alt Text
        </button>
        {showAltText && (
          <div id={`alt-text-${id}`} className="alt-text-content">
            <p>{alt}</p>
          </div>
        )}
      </div>

      <FigureCaption id={id} title={title}>
        {caption}
      </FigureCaption>

      <style jsx>{`
        .accessible-figure-component {
          margin: 2rem 0;
          text-align: center;
          position: relative;
        }

        .skip-link {
          position: absolute;
          top: -40px;
          left: 0;
          background: #000;
          color: #fff;
          padding: 8px;
          text-decoration: none;
          border: none;
          border-radius: 4px;
          font-size: 0.875rem;
        }

        .skip-link:focus,
        .skip-link:active {
          top: 0;
          outline: 2px solid #fff;
          outline-offset: 2px;
        }

        .figure-content {
          display: inline-block;
          width: 100%;
        }

        .alt-text-toggle {
          margin-top: 0.5rem;
        }

        .alt-text-toggle button {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          padding: 0.25rem 0.5rem;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .alt-text-toggle button:focus {
          outline: 2px solid #667eea;
          outline-offset: 2px;
        }

        .alt-text-content {
          margin-top: 0.5rem;
          padding: 0.5rem;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          color: #4b5563;
          text-align: left;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .size-small {
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .size-medium {
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .size-large {
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .size-full {
          max-width: 100%;
        }

        /* Border styling */
        .bordered {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .size-medium, .size-large, .size-full {
            max-width: 100%;
          }
        }
      `}</style>
    </figure>
  );
};

export default AccessibleFigure;