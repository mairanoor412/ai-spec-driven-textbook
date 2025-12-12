import React, { useState, useEffect, useRef } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

const AccessibleImage = ({
  src,
  alt,
  caption,
  size = 'medium',
  lazy = true,
  priority = false,
  showBorder = true,
  className = '',
  showHighContrast = false,
  enableZoom = true,
  ariaLabel,
  enableSkipLink = false,
  longDescriptionId,
  elements = [],
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isHighContrast, setIsHighContrast] = useState(showHighContrast);
  const [activeElement, setActiveElement] = useState(null);
  const imgRef = useRef(null);

  const imageUrl = useBaseUrl(src);

  // Check for user preference for high contrast
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    const handleChange = (e) => setIsHighContrast(e.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => {
    // Handle error appropriately
  };

  const handleZoomIn = () => {
    if (zoomLevel < 3) setZoomLevel(zoomLevel + 0.25);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 1) setZoomLevel(zoomLevel - 0.25);
  };

  const resetZoom = () => {
    setZoomLevel(1);
  };

  const handleElementFocus = (elementId, event) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        setActiveElement(elementId);
        break;
      case 'Escape':
        setActiveElement(null);
        break;
      default:
        break;
    }
  };

  return (
    <figure
      className={`accessible-figure size-${size} ${showBorder ? 'bordered' : ''} ${isHighContrast ? 'high-contrast' : ''} ${className}`}
      role="group"
      aria-label={ariaLabel || alt}
    >
      {enableSkipLink && (
        <a href="#content" className="skip-link" aria-label="Skip image content">
          Skip Image
        </a>
      )}

      <div className="image-container">
        {!isLoaded && (
          <div className="loading-placeholder" aria-hidden="true">
            <div className="loading-indicator">Loading image...</div>
          </div>
        )}
        <img
          ref={imgRef}
          src={imageUrl}
          alt={alt}
          className={`accessible-image ${isLoaded ? 'loaded' : 'loading'}`}
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center top' }}
          loading={lazy ? 'lazy' : 'eager'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      </div>

      {enableZoom && (
        <div className="zoom-controls" role="toolbar" aria-label="Image zoom controls">
          <button
            onClick={handleZoomOut}
            aria-label="Zoom out"
            disabled={zoomLevel <= 1}
            className="zoom-button"
          >
            −
          </button>
          <span className="zoom-level" aria-live="polite">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            aria-label="Zoom in"
            disabled={zoomLevel >= 3}
            className="zoom-button"
          >
            +
          </button>
          <button
            onClick={resetZoom}
            aria-label="Reset zoom"
            className="zoom-button reset-button"
          >
            Reset
          </button>
        </div>
      )}

      {elements.length > 0 && (
        <div className="image-elements" aria-label="Interactive elements in image">
          {elements.map((element, idx) => (
            <div
              key={idx}
              className={`image-element ${activeElement === element.id ? 'focused' : ''}`}
              tabIndex="0"
              role="button"
              aria-label={element.label}
              onKeyDown={(e) => handleElementFocus(element.id, e)}
              onClick={() => setActiveElement(activeElement === element.id ? null : element.id)}
            >
              {element.name}
            </div>
          ))}
        </div>
      )}

      {activeElement && (
        <div className="element-description" role="dialog" aria-modal="true" aria-label="Element description">
          {elements.find(el => el.id === activeElement)?.description}
          <button onClick={() => setActiveElement(null)} aria-label="Close description">
            Close
          </button>
        </div>
      )}

      {caption && (
        <figcaption className="image-caption">
          {caption}
        </figcaption>
      )}

      {longDescriptionId && (
        <div id={longDescriptionId} className="long-description" hidden>
          <h3>Long Description</h3>
          <p>{longDescriptionId}</p>
        </div>
      )}

      <style jsx>{`
        .accessible-figure {
          margin: 1.5rem 0;
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
        }

        .skip-link:focus {
          top: 0;
        }

        .image-container {
          position: relative;
          display: inline-block;
          max-width: 100%;
          overflow: hidden;
        }

        .accessible-image {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 0 auto;
          transition: transform 0.2s ease;
        }

        .loading-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          background-color: #f5f5f5;
        }

        .zoom-controls {
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .zoom-button {
          padding: 0.25rem 0.5rem;
          border: 1px solid #ccc;
          background: white;
          cursor: pointer;
          border-radius: 4px;
        }

        .zoom-button:hover {
          background: #f0f0f0;
        }

        .zoom-button:focus {
          outline: 2px solid #4682B4;
          outline-offset: 2px;
        }

        .zoom-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .zoom-level {
          min-width: 40px;
          text-align: center;
          font-family: monospace;
          font-weight: bold;
        }

        .reset-button {
          font-size: 0.875rem;
        }

        .image-caption {
          margin-top: 0.5rem;
          font-size: 0.9rem;
          color: #666;
        }

        .image-elements {
          margin-top: 0.5rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
        }

        .image-element {
          padding: 0.25rem 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          cursor: pointer;
          background: #f9f9f9;
          transition: all 0.2s ease;
        }

        .image-element:focus,
        .image-element.focused {
          border-color: #4682B4;
          background-color: #f0f8ff;
          outline: 2px solid #4682B4;
          outline-offset: 2px;
        }

        .element-description {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background: white;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 100;
          margin-top: 0.5rem;
        }

        /* High contrast mode */
        .high-contrast {
          border: 2px solid #000 !important;
        }

        .high-contrast .image-caption {
          color: #000 !important;
          background: #fff !important;
        }

        .high-contrast .zoom-button {
          border: 2px solid #000 !important;
          color: #000 !important;
          background: #fff !important;
        }

        .high-contrast .zoom-button:hover {
          background: #000 !important;
          color: #fff !important;
        }

        /* Size variants */
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
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .size-medium, .size-large, .size-full {
            max-width: 100%;
          }

          .zoom-controls {
            flex-wrap: wrap;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .accessible-image {
            transition: none;
          }
        }
      `}</style>
    </figure>
  );
};

export default AccessibleImage;