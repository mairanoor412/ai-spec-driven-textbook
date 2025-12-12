---
title: 'Responsive Images Implementation Guide'
description: 'Guide for implementing responsive images that adapt to different screen sizes in the robotics textbook'
---

# Responsive Images Implementation Guide

## Overview

This guide provides instructions for implementing responsive images that adapt to different screen sizes and devices in the AI/Spec-Driven Textbook for Physical AI & Humanoid Robotics. Responsive images ensure optimal viewing experience across desktop, tablet, and mobile devices while maintaining accessibility and performance standards.

## Responsive Image Techniques

### 1. CSS-Based Responsive Images

Using CSS to make images scale appropriately within their containers:

```css
/* Base responsive image styling */
.textbook-image {
  max-width: 100%;
  height: auto;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

/* Specific size classes for different use cases */
.image-full-width {
  width: 100%;
  max-width: 100%;
}

.image-half-width {
  width: 100%;
  max-width: 50%;
  margin-left: auto;
  margin-right: auto;
}

.image-quarter-width {
  width: 100%;
  max-width: 25%;
  margin-left: auto;
  margin-right: auto;
}

/* Tablet-specific adjustments */
@media (max-width: 768px) {
  .image-half-width {
    width: 80%;
    max-width: 80%;
  }

  .image-quarter-width {
    width: 60%;
    max-width: 60%;
  }
}

/* Mobile-specific adjustments */
@media (max-width: 480px) {
  .image-half-width,
  .image-quarter-width {
    width: 100%;
    max-width: 100%;
  }
}
```

### 2. HTML Picture Element for Art Direction

For images that need different crops or compositions at different screen sizes:

```html
<picture>
  <source media="(min-width: 1024px)" srcset="/img/diagram-large.webp" type="image/webp">
  <source media="(min-width: 1024px)" srcset="/img/diagram-large.png" type="image/png">
  <source media="(min-width: 768px)" srcset="/img/diagram-medium.webp" type="image/webp">
  <source media="(min-width: 768px)" srcset="/img/diagram-medium.png" type="image/png">
  <img src="/img/diagram-small.png"
       alt="Description of the diagram showing..."
       class="textbook-image">
</picture>
```

### 3. Srcset for Resolution Switching

For delivering appropriately-sized images based on device pixel density:

```html
<img src="/img/diagram-default.png"
     srcset="/img/diagram-small.png 480w,
             /img/diagram-medium.png 768w,
             /img/diagram-large.png 1024w,
             /img/diagram-xl.png 1440w"
     sizes="(max-width: 480px) 100vw,
            (max-width: 768px) 80vw,
            (max-width: 1024px) 60vw,
            50vw"
     alt="Description of the diagram content">
```

## Docusaurus-Specific Implementation

### 1. MDX Component for Responsive Images

Create a reusable MDX component for textbook images:

```jsx
// src/components/ResponsiveImage.jsx
import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

const ResponsiveImage = ({
  src,
  alt,
  caption,
  size = 'medium',
  className = '',
  ...props
}) => {
  const imageUrl = useBaseUrl(src);

  const sizeClasses = {
    full: 'image-full-width',
    half: 'image-half-width',
    quarter: 'image-quarter-width',
    medium: 'image-medium-width' // Default
  };

  const imageClass = `textbook-image ${sizeClasses[size]} ${className}`.trim();

  return (
    <figure className="textbook-figure">
      <img
        src={imageUrl}
        alt={alt}
        className={imageClass}
        {...props}
      />
      {caption && (
        <figcaption className="image-caption">
          {caption}
        </figcaption>
      )}

      <style jsx>{`
        .textbook-figure {
          margin: 1.5rem 0;
          text-align: center;
        }

        .textbook-image {
          max-width: 100%;
          height: auto;
          display: block;
          margin-left: auto;
          margin-right: auto;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .image-full-width {
          width: 100%;
        }

        .image-half-width {
          width: 100%;
          max-width: 800px;
        }

        .image-medium-width {
          width: 100%;
          max-width: 600px;
        }

        .image-quarter-width {
          width: 100%;
          max-width: 400px;
        }

        .image-caption {
          margin-top: 0.5rem;
          font-size: 0.9rem;
          color: #666;
          text-align: center;
        }

        @media (max-width: 768px) {
          .image-half-width, .image-medium-width {
            width: 95%;
            max-width: 95%;
          }
        }
      `}</style>
    </figure>
  );
};

export default ResponsiveImage;
```

### 2. Usage in Markdown Files

```md
import ResponsiveImage from '@site/src/components/ResponsiveImage';

<ResponsiveImage
  src="/img/chapter-01/physical-ai-concept.png"
  alt="Diagram showing the difference between Physical AI and Traditional AI systems"
  caption="Figure 1.1: Physical AI systems operate in real-world environments with uncertainty, unlike traditional AI systems that operate in controlled digital environments."
  size="half"
/>
```

## Performance Optimization

### 1. Image Compression and Formats

```javascript
// Example webpack configuration for image optimization
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 80,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.6, 0.8],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
            },
          },
        ],
      },
    ],
  },
};
```

### 2. Lazy Loading Implementation

```jsx
// Enhanced ResponsiveImage component with lazy loading
import React, { useState, useRef, useEffect } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

const ResponsiveImage = ({
  src,
  alt,
  caption,
  size = 'medium',
  className = '',
  loading = 'lazy',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (observer && imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  const imageUrl = useBaseUrl(src);

  return (
    <figure className="textbook-figure">
      <img
        ref={imgRef}
        src={isInView ? imageUrl : null}
        data-src={imageUrl}
        alt={alt}
        className={`textbook-image ${isLoaded ? 'loaded' : 'loading'} ${size}`}
        onLoad={() => setIsLoaded(true)}
        loading={loading}
        style={{ opacity: isLoaded ? 1 : 0 }}
        {...props}
      />
      {caption && (
        <figcaption className="image-caption">
          {caption}
        </figcaption>
      )}

      <style jsx>{`
        .textbook-figure {
          margin: 1.5rem 0;
          text-align: center;
        }

        .textbook-image {
          max-width: 100%;
          height: auto;
          display: block;
          margin-left: auto;
          margin-right: auto;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: opacity 0.3s ease-in-out;
        }

        .textbook-image.loading {
          background-color: #f0f0f0;
        }

        .image-caption {
          margin-top: 0.5rem;
          font-size: 0.9rem;
          color: #666;
          text-align: center;
        }

        @media (max-width: 768px) {
          .textbook-image {
            width: 95%;
          }
        }
      `}</style>
    </figure>
  );
};

export default ResponsiveImage;
```

## Accessibility Implementation

### 1. Semantic Structure

```jsx
const AccessibleImage = ({ src, alt, caption, ...props }) => {
  return (
    <figure role="group" aria-labelledby="fig-caption">
      <img
        src={src}
        alt={alt}
        {...props}
      />
      {caption && (
        <figcaption id="fig-caption" className="sr-only">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
```

### 2. Responsive Typography for Captions

```css
.image-caption {
  font-size: 0.85rem;
  line-height: 1.4;
  margin-top: 0.5rem;
  color: #555;
  text-align: center;
}

@media (max-width: 768px) {
  .image-caption {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .image-caption {
    font-size: 0.75rem;
  }
}
```

## Breakpoint-Specific Behaviors

### 1. Complex Diagrams on Small Screens

For complex diagrams that need special handling on small screens:

```jsx
const ComplexDiagram = ({ src, alt, caption }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="complex-diagram-container">
      <figure>
        <img
          src={src}
          alt={alt}
          className={`diagram-image ${expanded ? 'expanded' : ''}`}
        />
        {caption && <figcaption>{caption}</figcaption>}
      </figure>

      <button
        className="expand-diagram-btn"
        onClick={() => setExpanded(!expanded)}
        aria-label={expanded ? "Collapse diagram" : "Expand diagram for better viewing"}
      >
        {expanded ? "Collapse" : "Expand for Mobile View"}
      </button>

      <style jsx>{`
        .complex-diagram-container {
          position: relative;
          margin: 1.5rem 0;
        }

        .diagram-image {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 0 auto;
          transition: transform 0.3s ease;
        }

        .diagram-image.expanded {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          max-width: 90vw;
          max-height: 90vh;
          z-index: 1000;
          background: white;
          padding: 1rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        }

        .expand-diagram-btn {
          display: block;
          margin: 0.5rem auto;
          padding: 0.5rem 1rem;
          background: #2E8B57;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        @media (min-width: 769px) {
          .expand-diagram-btn {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};
```

## Implementation Checklist

### For Each Image
- [ ] Uses appropriate CSS classes for responsive sizing
- [ ] Includes descriptive alt text
- [ ] Has proper caption if needed
- [ ] Implements lazy loading if appropriate
- [ ] Uses optimized file format and compression
- [ ] Maintains aspect ratio when scaled
- [ ] Is accessible to screen readers
- [ ] Performs well across different devices

### For Complex Diagrams
- [ ] Provides mobile-optimized viewing option
- [ ] Includes interactive elements for zoom/expansion
- [ ] Maintains readability at smaller sizes
- [ ] Preserves important details when scaled
- [ ] Offers alternative text descriptions

### Performance Testing
- [ ] Images load quickly on various connections
- [ ] Page performance is not degraded
- [ ] Mobile experience is optimized
- [ ] Accessibility features work properly
- [ ] Cross-browser compatibility is maintained

## Best Practices

### File Organization
```
static/
├── img/
│   ├── chapter-01/
│   │   ├── physical-ai-concepts/
│   │   └── system-architectures/
│   ├── chapter-02/
│   │   ├── kinematics/
│   │   └── control-systems/
│   └── general/
│       ├── icons/
│       └── infographics/
```

### Naming Convention
- Use descriptive names: `chapter-01-physical-ai-overview.svg`
- Include resolution indicators for different sizes: `diagram@2x.png`
- Use consistent hyphenation: `forward-kinematics-flowchart.png`
- Include version numbers if needed: `system-architecture-v2.svg`

This implementation ensures that all images in the textbook are responsive, accessible, and optimized for the best learning experience across all devices.