---
title: 'Image Optimization Guide'
description: 'Guide for optimizing images in the robotics textbook for better performance and accessibility'
---

# Image Optimization Guide

## Overview

This guide provides best practices for optimizing images in the AI/Spec-Driven Textbook for Physical AI & Humanoid Robotics. Proper image optimization ensures fast loading times, minimal bandwidth usage, and excellent visual quality across all devices while maintaining accessibility standards.

## Optimization Techniques

### 1. File Format Selection

#### SVG (Scalable Vector Graphics)
**Best for**:
- Diagrams and illustrations
- Logos and icons
- Any image with geometric shapes
- Mathematical equations and graphs

**Advantages**:
- Infinitely scalable without quality loss
- Small file sizes for simple graphics
- Editable with text editors
- Supports interactivity and animation

**Optimization tips**:
- Use tools like SVGO to reduce file size
- Remove unnecessary metadata and comments
- Minimize path complexity where possible
- Use CSS for styling instead of inline styles

#### PNG (Portable Network Graphics)
**Best for**:
- Images with transparency
- Line art and diagrams with few colors
- Images requiring lossless compression
- Screenshots with text or crisp details

**Optimization tips**:
- Use PNG-8 for images with fewer than 256 colors
- Use PNG-24 for images requiring full color range
- Reduce color palette where possible
- Use tools like TinyPNG or OptiPNG for compression

#### JPEG (Joint Photographic Experts Group)
**Best for**:
- Photographic images
- Complex images with many colors
- Images where small quality loss is acceptable

**Optimization tips**:
- Use 80-85% quality for most images
- Consider progressive JPEG for large images
- Remove EXIF data and unnecessary metadata
- Crop to eliminate unnecessary areas

#### WebP
**Best for**:
- Modern browsers with WebP support
- Better compression than JPEG/PNG
- Both lossy and lossless options available

**Advantages**:
- 25-35% smaller file sizes than JPEG
- Supports transparency like PNG
- Supports animation like GIF
- Growing browser support

### 2. Image Sizing and Resolution

#### Recommended Dimensions
- **Full-width images**: Max 1200px width for standard screens
- **Half-width images**: Max 600px width for standard screens
- **Diagrams**: 800-1000px width for detail retention
- **Icons**: 16x16 to 256x256 pixels as needed

#### Resolution Guidelines
- **Standard displays**: 72-96 DPI
- **High-density displays**: Include 2x or 3x versions
- **Print materials**: 300 DPI minimum
- **Animations**: 30 FPS for smooth motion

### 3. Compression and Quality Settings

#### JPEG Compression
```bash
# Using ImageMagick for JPEG optimization
convert input.jpg -quality 82 -strip output.jpg

# Using cjpeg for better compression
cjpeg -quality 82 -optimize -progressive input.jpg > output.jpg
```

#### PNG Compression
```bash
# Using optipng for PNG optimization
optipng -o7 input.png

# Using pngcrush for PNG optimization
pngcrush -reduce -brute input.png output.png
```

#### SVG Optimization
```bash
# Using SVGO for SVG optimization
svgo input.svg -o output.svg

# Advanced SVGO with plugins
svgo input.svg -o output.svg --config='{ "plugins": [{"cleanupIDs": false}] }'
```

## Implementation in Docusaurus

### 1. Using Docusaurus Built-in Image Features

```mdx
---
title: 'Optimized Images Example'
description: 'Example of optimized image usage in Docusaurus'
---

# Optimized Images Example

## Basic Image with Alt Text

![Description of the image content and context](/img/example/diagram.png)

## Responsive Image with Custom Styling

<div className="textbook-image">
  <img
    src={require('./assets/diagram.png').default}
    alt="Detailed description of the diagram showing key components and relationships"
    className="responsive-diagram"
  />
  <p className="image-caption">Figure 1.1: Caption describing the diagram and its significance to the content.</p>
</div>

## Image with Size Control

<div style={{textAlign: 'center', maxWidth: '800px', margin: '1rem auto'}}>
  <img
    src="/img/large-diagram.png"
    alt="Comprehensive system architecture diagram showing all major components and their interconnections"
    style={{maxWidth: '100%', height: 'auto'}}
  />
  <p style={{fontSize: '0.9em', color: '#666', marginTop: '0.5rem'}}>Figure 2.1: System architecture overview.</p>
</div>
```

### 2. Advanced Image Component with Lazy Loading

```jsx
// src/components/OptimizedImage.jsx
import React, { useState, useRef, useEffect } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

const OptimizedImage = ({
  src,
  alt,
  caption,
  className = '',
  lazy = true,
  priority = false,
  width,
  height,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  const imageUrl = useBaseUrl(src);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  return (
    <figure className={`optimized-image-container ${className}`}>
      {!hasError ? (
        <div className="image-wrapper">
          {!isLoaded && (
            <div className="image-placeholder">
              <div className="loading-indicator">Loading...</div>
            </div>
          )}
          <img
            ref={imgRef}
            src={imageUrl}
            alt={alt}
            className={`optimized-image ${isLoaded ? 'loaded' : 'loading'}`}
            loading={lazy ? 'lazy' : 'eager'}
            fetchPriority={priority ? 'high' : 'auto'}
            width={width}
            height={height}
            onLoad={handleLoad}
            onError={handleError}
            style={{
              display: isLoaded ? 'block' : 'none',
              maxWidth: '100%',
              height: 'auto'
            }}
            {...props}
          />
        </div>
      ) : (
        <div className="image-error">
          <p>⚠️ Image could not be loaded: {alt}</p>
          <p>URL: {imageUrl}</p>
        </div>
      )}

      {caption && (
        <figcaption className="image-caption">
          {caption}
        </figcaption>
      )}

      <style jsx>{`
        .optimized-image-container {
          margin: 1.5rem 0;
          text-align: center;
        }

        .image-wrapper {
          position: relative;
          display: inline-block;
        }

        .image-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 200px;
          min-height: 150px;
          background-color: #f5f5f5;
          border-radius: 8px;
        }

        .loading-indicator {
          color: #666;
          font-size: 0.9rem;
        }

        .optimized-image {
          transition: opacity 0.3s ease;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .optimized-image.loading {
          opacity: 0;
        }

        .optimized-image.loaded {
          opacity: 1;
        }

        .image-error {
          padding: 1rem;
          background-color: #ffecec;
          border: 1px solid #ffcccc;
          border-radius: 8px;
          color: #d00;
          text-align: left;
        }

        .image-caption {
          margin-top: 0.5rem;
          font-size: 0.9rem;
          color: #666;
          text-align: center;
        }
      `}</style>
    </figure>
  );
};

export default OptimizedImage;
```

### 3. Usage of Optimized Image Component

```mdx
---
title: 'Using Optimized Images'
description: 'How to use the optimized image component in textbook content'
---

import OptimizedImage from '@site/src/components/OptimizedImage';

# Using Optimized Images

## Basic Usage

<OptimizedImage
  src="/img/chapter-01/physical-ai-concept.png"
  alt="Diagram showing the Physical AI system with perception, reasoning, and action components interacting with the environment"
  caption="Figure 1.1: Physical AI system architecture with perception, reasoning, and action modules."
/>

## With Specific Dimensions

<OptimizedImage
  src="/img/chapter-01/robot-architecture.png"
  alt="System architecture diagram showing sensor inputs, processing units, and actuator outputs in a humanoid robot"
  caption="Figure 1.2: Humanoid robot system architecture showing the flow of information from sensors through processing to actuators."
  width={600}
  height={400}
/>

## For Complex Diagrams (High Priority Loading)

<OptimizedImage
  src="/img/chapter-01/kinematic-chain.png"
  alt="Kinematic chain diagram showing joint connections and degrees of freedom in a robotic arm"
  caption="Figure 1.3: Kinematic chain representation of a multi-joint robotic manipulator."
  priority={true}
/>
```

## Performance Optimization

### 1. Image Dimensions and File Sizes

| Image Type | Recommended Size | Max File Size | Format |
|------------|------------------|---------------|---------|
| Diagrams | 800x600 px | 100KB | SVG or PNG |
| Photos | 1200x800 px | 200KB | JPEG or WebP |
| Icons | 256x256 px | 10KB | SVG or PNG |
| Screenshots | 1024x768 px | 150KB | PNG or JPEG |

### 2. Loading Strategies

#### Lazy Loading
```jsx
// Enable lazy loading for images below the fold
const LazyImage = ({ src, alt, ...props }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    {...props}
  />
);
```

#### Priority Loading
```jsx
// Use high priority for above-the-fold or critical images
const PriorityImage = ({ src, alt, ...props }) => (
  <img
    src={src}
    alt={alt}
    fetchPriority="high"
    {...props}
  />
);
```

### 3. Responsive Images with srcset

```jsx
const ResponsiveImage = ({ src, alt, sizes, ...props }) => (
  <img
    src={src}
    srcSet={`${src}?w=400 400w,
            ${src}?w=800 800w,
            ${src}?w=1200 1200w`}
    sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
    alt={alt}
    {...props}
  />
);
```

## Accessibility Considerations

### 1. Alt Text Guidelines

#### Good Alt Text Examples
- **Informative**: `"Graph showing the relationship between motor torque and rotational speed for three different motor types"`
- **Contextual**: `"Forward kinematics equation showing how joint angles determine end-effector position in a robotic arm"`
- **Functional**: `"Button to expand the robot architecture diagram for detailed viewing"`

#### Bad Alt Text Examples
- **Too Vague**: `"A chart"`
- **Irrelevant**: `"A pretty diagram"`
- **Redundant**: `"Image of a robot diagram showing a robot"`

### 2. Image Captions

```mdx
<figure>
  <img src="/img/chapter-01/control-system.png" alt="Block diagram showing the feedback control system with controller, plant, sensor, and summing junction" />
  <figcaption>
    <strong>Figure 1.4:</strong> Feedback control system architecture showing the relationship between controller, plant, sensor, and feedback loop.
    This diagram illustrates how the system compares the desired output with the actual output to minimize error.
  </figcaption>
</figure>
```

### 3. Semantic Structure

```mdx
<article>
  <header>
    <h1>Control Systems in Physical AI</h1>
  </header>

  <section>
    <h2>Feedback Control Architecture</h2>

    <p>Physical AI systems rely on feedback control to maintain stability and achieve desired behaviors.</p>

    <figure role="group" aria-labelledby="fig1-caption">
      <img
        src="/img/chapter-01/feedback-control.png"
        alt="Block diagram showing sensor input feeding to controller, controller output to actuator, and actuator effect on plant with feedback to sensor"
      />
      <figcaption id="fig1-caption">
        Feedback control architecture with sensor, controller, actuator, and plant components forming a closed loop.
      </figcaption>
    </figure>

    <p>The feedback loop ensures that the system responds to environmental changes and maintains desired performance.</p>
  </section>
</article>
```

## Automation Tools

### 1. Build-Time Optimization

#### Webpack Configuration
```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000, // Inline small images
              name: '[name].[hash:7].[ext]',
              outputPath: 'static/media',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: { progressive: true, quality: 80 },
              optipng: { enabled: false },
              pngquant: { quality: [0.65, 0.90], speed: 4 },
              webp: { quality: 80 },
            },
          },
        ],
      },
    ],
  },
};
```

#### Package.json Scripts
```json
{
  "scripts": {
    "optimize-images": "find ./static -name '*.{png,jpg,jpeg}' -exec imagemin {} \\;",
    "svg-optimize": "find ./static -name '*.svg' -exec svgo {} \\;",
    "image-check": "node scripts/check-image-sizes.js"
  }
}
```

### 2. Image Analysis Script

```js
// scripts/check-image-sizes.js
const fs = require('fs');
const path = require('path');

function checkImageSizes(directory) {
  const files = fs.readdirSync(directory);

  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      checkImageSizes(filePath);
    } else if (file.match(/\.(png|jpe?g|gif|svg)$/i)) {
      if (stat.size > 200 * 1024) { // 200KB threshold
        console.log(`Large image detected: ${filePath} (${(stat.size / 1024).toFixed(2)}KB)`);
      }
    }
  });
}

checkImageSizes('./static/img');
```

## Quality Assurance Checklist

### Before Publishing
- [ ] All images have descriptive alt text
- [ ] File sizes are optimized (under recommended limits)
- [ ] Images are in appropriate formats for their content type
- [ ] Responsive behavior works on different screen sizes
- [ ] Captions are provided for complex diagrams
- [ ] Images load properly with and without JavaScript
- [ ] Lazy loading works correctly
- [ ] Accessibility features are implemented
- [ ] Images have appropriate titles and descriptions
- [ ] No broken image links exist

### Performance Testing
- [ ] Page load times are acceptable (< 3 seconds)
- [ ] Images load progressively
- [ ] No render-blocking images exist
- [ ] Largest Contentful Paint (LCP) is optimized
- [ ] Cumulative Layout Shift (CLS) is minimized
- [ ] Core Web Vitals scores are good

### Cross-Browser Testing
- [ ] Images display correctly in Chrome, Firefox, Safari, Edge
- [ ] Responsive behavior works across browsers
- [ ] SVG images render properly in all browsers
- [ ] WebP fallbacks work in non-supporting browsers
- [ ] Image optimization features work consistently

This guide ensures that all visual materials in the textbook are optimized for performance while maintaining accessibility and quality standards.