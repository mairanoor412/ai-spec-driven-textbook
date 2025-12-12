import React, { useState, useEffect } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

const PlaceholderImage = ({
  src,
  alt,
  caption,
  size = 'medium',
  lazy = true,
  priority = false,
  showBorder = true,
  className = '',
  placeholderType = 'blur', // 'blur', 'color', 'svg'
  placeholderColor = '#e0e0e0',
  blurHash = null,
  fadeIn = true,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [placeholderSvg, setPlaceholderSvg] = useState('');

  const imageUrl = useBaseUrl(src);

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => setHasError(true);

  // Generate a simple SVG placeholder based on image dimensions or content
  useEffect(() => {
    if (placeholderType === 'svg' && !isLoaded) {
      // Create a simple SVG placeholder
      const svg = `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${placeholderColor}"/>
        <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#999" font-family="Arial" font-size="14">
          Loading image...
        </text>
      </svg>`;
      setPlaceholderSvg(`data:image/svg+xml;base64,${btoa(svg)}`);
    }
  }, [placeholderType, placeholderColor, isLoaded]);

  if (hasError) {
    return (
      <figure className={`placeholder-image-figure size-${size} ${className}`}>
        <div className="image-error">
          <div className="error-icon">⚠️</div>
          <p>Image could not be loaded: {alt}</p>
          <p>URL: {imageUrl}</p>
        </div>
        {caption && (
          <figcaption className="image-caption">
            {caption}
          </figcaption>
        )}
        <style jsx>{`
          .placeholder-image-figure {
            margin: 1.5rem 0;
            text-align: center;
          }
          .image-error {
            padding: 2rem;
            background-color: #fff5f5;
            border: 2px solid #fecaca;
            border-radius: 8px;
            color: #dc2626;
            text-align: center;
          }
          .error-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
          }
        `}</style>
      </figure>
    );
  }

  return (
    <figure className={`placeholder-image-figure size-${size} ${showBorder ? 'bordered' : ''} ${className}`}>
      <div className="image-container">
        {!isLoaded && (
          <div className="image-placeholder" style={{ backgroundColor: placeholderType === 'color' ? placeholderColor : 'transparent' }}>
            {placeholderType === 'blur' && (
              <div className="blur-placeholder" style={{ backgroundColor: placeholderColor }}></div>
            )}
            {placeholderType === 'svg' && (
              <img
                src={placeholderSvg}
                alt="Loading placeholder"
                className="svg-placeholder"
              />
            )}
            {placeholderType !== 'svg' && (
              <div className="loading-indicator">
                <div className="spinner"></div>
              </div>
            )}
          </div>
        )}
        <img
          src={isInView ? imageUrl : ''}
          alt={alt}
          className={`placeholder-image ${isLoaded ? 'loaded' : 'loading'} ${fadeIn ? 'fade-in' : ''}`}
          loading={lazy && !isInView ? 'lazy' : 'eager'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            display: isInView ? 'block' : 'none',
            opacity: isLoaded ? 1 : 0
          }}
          {...props}
        />
      </div>

      {caption && (
        <figcaption className="image-caption">
          {caption}
        </figcaption>
      )}

      <style jsx>{`
        .placeholder-image-figure {
          margin: 1.5rem 0;
          text-align: center;
          position: relative;
        }

        .image-container {
          position: relative;
          display: inline-block;
          width: 100%;
        }

        .placeholder-image {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 0 auto;
        }

        .placeholder-image.loading {
          opacity: 0;
        }

        .placeholder-image.loaded {
          opacity: 1;
        }

        .fade-in.loaded {
          transition: opacity 0.3s ease;
        }

        .image-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .blur-placeholder {
          width: 100%;
          height: 100%;
          filter: blur(5px);
          opacity: 0.7;
        }

        .svg-placeholder {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .loading-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: #666;
          font-size: 0.9rem;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 2px solid #e5e7eb;
          border-top: 2px solid #4f46e5;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .image-error {
          padding: 1rem;
          background-color: #ffecec;
          border: 1px solid #ffcccc;
          border-radius: 8px;
          color: #d00;
        }

        .image-caption {
          margin-top: 0.5rem;
          font-size: 0.9rem;
          color: #666;
          text-align: center;
          line-height: 1.4;
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
        .bordered img {
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

export default PlaceholderImage;