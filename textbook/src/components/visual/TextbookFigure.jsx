import React from 'react';
import FigureCaption from './FigureCaption';
import OptimizedImage from './OptimizedImage';

const TextbookFigure = ({
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
  ...props
}) => {
  return (
    <figure
      className={`textbook-figure size-${size} ${showBorder ? 'bordered' : ''} ${className}`}
      id={`fig-${id}`}
      role="figure"
      aria-label={`Figure ${id}: ${title}`}
    >
      <div className="figure-content">
        <OptimizedImage
          src={src}
          alt={alt}
          size={size}
          lazy={lazy}
          priority={priority}
          showBorder={false}
          {...props}
        />
      </div>
      <FigureCaption id={id} title={title}>
        {caption}
      </FigureCaption>
      <style jsx>{`
        .textbook-figure {
          margin: 2rem 0;
          text-align: center;
          position: relative;
        }

        .figure-content {
          display: inline-block;
          width: 100%;
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

export default TextbookFigure;