import React, { useState, useRef, useEffect } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

const OptimizedImage = ({
  src,
  alt,
  caption,
  size = 'medium',
  lazy = true,
  priority = false,
  showBorder = true,
  className = '',
  placeholderColor = '#e0e0e0',
  fadeIn = true,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef(null);
  const placeholderRef = useRef(null);

  const imageUrl = useBaseUrl(src);

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => setHasError(true);

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    const imgElement = imgRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgElement) {
      observer.observe(imgElement);
    }

    return () => {
      if (observer && imgElement) {
        observer.unobserve(imgElement);
      }
    };
  }, [lazy]);

  // Calculate aspect ratio for better layout stability
  const [aspectRatio, setAspectRatio] = useState(null);

  useEffect(() => {
    if (src) {
      // Try to extract dimensions from filename pattern (e.g., image-800x600.jpg)
      const dimensionMatch = src.match(/-([0-9]+)x([0-9]+)(\.[^.]+)$/);
      if (dimensionMatch) {
        const [, width, height] = dimensionMatch;
        setAspectRatio((height / width) * 100);
      }
    }
  }, [src]);

  if (hasError) {
    return (
      <figure className={`optimized-image-figure size-${size} ${className}`}>
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
          .optimized-image-figure {
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
    <figure className={`optimized-image-figure size-${size} ${showBorder ? 'bordered' : ''} ${className}`}>
      <div className="image-container">
        {aspectRatio && (
          <div
            className="aspect-ratio-placeholder"
            style={{ paddingBottom: `${aspectRatio}%` }}
            ref={placeholderRef}
          />
        )}
        {!isLoaded && isInView && (
          <div className="image-placeholder" style={{ backgroundColor: placeholderColor }}>
            <div className="loading-indicator">
              <div className="spinner"></div>
              <span>Loading...</span>
            </div>
          </div>
        )}
        <img
          ref={imgRef}
          src={isInView ? imageUrl : ''}
          alt={alt}
          className={`optimized-image ${isLoaded ? 'loaded' : 'loading'} ${fadeIn ? 'fade-in' : ''}`}
          loading={lazy && !isInView ? 'lazy' : 'eager'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            display: isInView ? 'block' : 'none'
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
        .optimized-image-figure {
          margin: 1.5rem 0;
          text-align: center;
          position: relative;
        }

        .image-container {
          position: relative;
          display: inline-block;
          width: 100%;
        }

        .aspect-ratio-placeholder {
          width: 100%;
          height: 0;
          position: relative;
        }

        .optimized-image {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 0 auto;
        }

        .optimized-image.loading {
          opacity: 0;
        }

        .optimized-image.loaded {
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
          background-color: #f5f5f5;
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

export default OptimizedImage;