---
title: 'Docusaurus MDX Integration Guide'
description: 'Guide for integrating visual materials with Docusaurus MDX components in the robotics textbook'
---

# Docusaurus MDX Integration Guide

## Overview

This guide provides comprehensive instructions for integrating visual materials with Docusaurus MDX (Markdown + JSX) components in the AI/Spec-Driven Textbook for Physical AI & Humanoid Robotics. MDX allows for the seamless integration of interactive React components within markdown content, enabling rich visual experiences while maintaining the simplicity of markdown authoring.

## MDX Component Architecture

### 1. Component Categories

#### Visual Enhancement Components
- **Image Components**: Enhanced image display with captions, lightbox, and accessibility features
- **Diagram Components**: Interactive diagrams and visualizations with customization options
- **Video Components**: Embedded videos with custom controls and transcripts
- **Carousel Components**: Multi-image presentations with navigation controls

#### Interactive Learning Components
- **Simulation Components**: Interactive physics or robotics simulators
- **Quiz Components**: Embedded knowledge checks with immediate feedback
- **Exercise Components**: Interactive problem-solving environments
- **Comparison Tools**: Side-by-side comparisons with interactive elements

#### Navigation and Reference Components
- **Cross-Reference Components**: Smart linking between textbook sections
- **Figure Reference Components**: Automated figure numbering and referencing
- **Table of Contents Components**: Dynamic TOC generation
- **Breadcrumbs**: Context-aware navigation aids

### 2. Component Structure Standards

#### Basic Component Template
```jsx
// src/components/VisualComponent.jsx
import React from 'react';
import clsx from 'clsx';

const VisualComponent = ({
  children,
  className = '',
  variant = 'default',
  ...props
}) => {
  return (
    <div
      className={clsx('textbook-visual-component', `variant-${variant}`, className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default VisualComponent;
```

#### Component with Props Validation
```jsx
import React from 'react';
import PropTypes from 'prop-types';

const FigureComponent = ({
  id,
  src,
  alt,
  caption,
  size = 'medium',
  className = ''
}) => {
  return (
    <figure className={`textbook-figure size-${size} ${className}`}>
      <img src={src} alt={alt} />
      <figcaption>
        <strong>Figure {id}:</strong> {caption}
      </figcaption>
    </figure>
  );
};

FigureComponent.propTypes = {
  id: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'full']),
  className: PropTypes.string
};

export default FigureComponent;
```

## Core Visual Components

### 1. Responsive Image Component

```jsx
// src/components/ResponsiveImage.jsx
import React, { useState, useRef, useEffect } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

const ResponsiveImage = ({
  src,
  alt,
  caption,
  size = 'medium',
  lazy = true,
  priority = false,
  showBorder = true,
  className = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  const imageUrl = useBaseUrl(src);

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => setHasError(true);

  return (
    <figure
      className={`responsive-image-figure size-${size} ${showBorder ? 'bordered' : ''} ${className}`}
    >
      {!hasError ? (
        <div className="image-container">
          {!isLoaded && (
            <div className="image-placeholder">
              <div className="loading-indicator">Loading...</div>
            </div>
          )}
          <img
            ref={imgRef}
            src={imageUrl}
            alt={alt}
            className={`responsive-image ${isLoaded ? 'loaded' : 'loading'} ${hasError ? 'error' : ''}`}
            loading={lazy ? 'lazy' : 'eager'}
            fetchPriority={priority ? 'high' : 'auto'}
            onLoad={handleLoad}
            onError={handleError}
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
        .responsive-image-figure {
          margin: 1.5rem 0;
          text-align: center;
          position: relative;
        }

        .image-container {
          position: relative;
          display: inline-block;
        }

        .responsive-image {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 0 auto;
          transition: opacity 0.3s ease;
        }

        .responsive-image.loading {
          opacity: 0;
        }

        .responsive-image.loaded {
          opacity: 1;
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
          color: #666;
          font-size: 0.9rem;
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
        }

        .size-medium {
          max-width: 600px;
        }

        .size-large {
          max-width: 800px;
        }

        .size-full {
          max-width: 100%;
        }

        /* Border styling */
        .bordered .responsive-image {
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

export default ResponsiveImage;
```

### 2. Interactive Diagram Component

```jsx
// src/components/InteractiveDiagram.jsx
import React, { useState, useEffect, useRef } from 'react';

const InteractiveDiagram = ({
  id,
  title,
  description,
  controls = [],
  children,
  className = ''
}) => {
  const [state, setState] = useState({});
  const [isInteractive, setIsInteractive] = useState(false);
  const diagramRef = useRef(null);

  // Initialize state from controls
  useEffect(() => {
    const initialState = {};
    controls.forEach(control => {
      initialState[control.id] = control.defaultValue || control.min || 0;
    });
    setState(initialState);
  }, [controls]);

  const updateControlValue = (controlId, value) => {
    setState(prev => ({
      ...prev,
      [controlId]: value
    }));
  };

  const renderControl = (control) => {
    switch (control.type) {
      case 'slider':
        return (
          <div key={control.id} className="control-slider">
            <label htmlFor={control.id}>
              {control.label} ({state[control.id]})
            </label>
            <input
              type="range"
              id={control.id}
              min={control.min}
              max={control.max}
              step={control.step}
              value={state[control.id]}
              onChange={(e) => updateControlValue(control.id, parseFloat(e.target.value))}
            />
          </div>
        );
      case 'checkbox':
        return (
          <div key={control.id} className="control-checkbox">
            <label>
              <input
                type="checkbox"
                checked={state[control.id]}
                onChange={(e) => updateControlValue(control.id, e.target.checked)}
              />
              {control.label}
            </label>
          </div>
        );
      case 'select':
        return (
          <div key={control.id} className="control-select">
            <label htmlFor={control.id}>{control.label}</label>
            <select
              id={control.id}
              value={state[control.id]}
              onChange={(e) => updateControlValue(control.id, e.target.value)}
            >
              {control.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`interactive-diagram ${className}`} ref={diagramRef}>
      <div className="diagram-header">
        <h3>{title}</h3>
        <p className="diagram-description">{description}</p>
      </div>

      <div className="diagram-controls">
        {controls.map(renderControl)}
      </div>

      <div className="diagram-content" data-state={JSON.stringify(state)}>
        {typeof children === 'function' ? children(state) : children}
      </div>

      <style jsx>{`
        .interactive-diagram {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
          margin: 1.5rem 0;
          background-color: #fafafa;
        }

        .diagram-header {
          margin-bottom: 1.5rem;
        }

        .diagram-header h3 {
          color: #2E8B57;
          margin-bottom: 0.5rem;
        }

        .diagram-description {
          color: #666;
          margin-bottom: 0;
        }

        .diagram-controls {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background-color: #fff;
          border-radius: 6px;
        }

        .control-slider, .control-checkbox, .control-select {
          flex: 1;
          min-width: 200px;
        }

        .control-slider label, .control-checkbox label, .control-select label {
          display: block;
          margin-bottom: 0.25rem;
          font-weight: 500;
        }

        .control-slider input[type="range"] {
          width: 100%;
        }

        .diagram-content {
          border-top: 1px solid #e0e0e0;
          padding-top: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default InteractiveDiagram;
```

### 3. Figure Reference Component

```jsx
// src/components/FigureReference.jsx
import React from 'react';
import Link from '@docusaurus/Link';

const FigureReference = ({ id, title, page }) => {
  return (
    <Link
      to={`/docs/textbook/chapter-${id.split('.')[0]}/#${id.toLowerCase().replace(/\./g, '-')}`}
      className="figure-reference"
      aria-label={`Jump to Figure ${id}: ${title}`}
    >
      <span className="reference-prefix">Figure </span>
      <span className="reference-id">{id}</span>
      {title && <span className="reference-title">: {title}</span>}
      {page && <span className="reference-page"> (page {page})</span>}
    </Link>
  );
};

export default FigureReference;
```

## MDX Usage Examples

### 1. Basic Image Integration
```mdx
---
title: 'Chapter 1: Physical AI Fundamentals - Visual Examples'
description: 'Visual examples and diagrams for Physical AI fundamentals'
---

import ResponsiveImage from '@site/src/components/ResponsiveImage';

# Chapter 1: Physical AI Fundamentals - Visual Examples

## System Architecture

Physical AI systems integrate perception, reasoning, and action in a continuous loop with the environment:

<ResponsiveImage
  src="/img/chapter-01/physical-ai-system.png"
  alt="Physical AI system architecture diagram showing perception module receiving sensor inputs, reasoning module processing information, and action module controlling actuators in a feedback loop with the environment"
  caption="Figure 1.1: Physical AI system architecture showing perception, reasoning, and action modules with environmental interaction."
  size="large"
  priority={true}
/>
```

### 2. Interactive Diagram Integration
```mdx
import InteractiveDiagram from '@site/src/components/InteractiveDiagram';

# Forward Kinematics Explorer

Use the interactive diagram below to explore how joint angles affect the position of a robot's end-effector:

<InteractiveDiagram
  id="fk-explorer"
  title="Forward Kinematics Explorer"
  description="Adjust joint angles to see how they affect the end-effector position of a 2-DOF manipulator"
  controls={[
    {
      id: 'joint1',
      type: 'slider',
      label: 'Joint 1 Angle',
      min: -90,
      max: 90,
      step: 1,
      defaultValue: 0
    },
    {
      id: 'joint2',
      type: 'slider',
      label: 'Joint 2 Angle',
      min: -90,
      max: 90,
      step: 1,
      defaultValue: 0
    },
    {
      id: 'link1',
      type: 'slider',
      label: 'Link 1 Length',
      min: 50,
      max: 150,
      step: 5,
      defaultValue: 100
    }
  ]}
>
  {(state) => (
    <div className="kinematics-visualization">
      <svg width="400" height="300">
        {/* Render robot arm based on state values */}
        <line
          x1="200" y1="250"
          x2={200 + state.link1 * Math.cos(state.joint1 * Math.PI / 180)}
          y2={250 - state.link1 * Math.sin(state.joint1 * Math.PI / 180)}
          stroke="#2E8B57" strokeWidth="5" />
        {/* Additional SVG elements for visualization */}
      </svg>
      <p>End-effector position: X={Math.round(200 + state.link1 * Math.cos(state.joint1 * Math.PI / 180))}, Y={Math.round(250 - state.link1 * Math.sin(state.joint1 * Math.PI / 180))}</p>
    </div>
  )}
</InteractiveDiagram>
```

### 3. Cross-Reference Integration
```mdx
import FigureReference from '@site/src/components/FigureReference';

# Control Systems

As shown in <FigureReference id="2.3" title="ZMP Control Diagram" />, the Zero Moment Point approach is crucial for humanoid robot balance control. This concept builds on the perception systems discussed in <FigureReference id="1.1" title="Perception System" />.
```

## Advanced Integration Patterns

### 1. Dynamic Content Loading
```jsx
// src/components/DynamicDiagram.jsx
import React, { useState, useEffect } from 'react';

const DynamicDiagram = ({ diagramType, dataEndpoint }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(dataEndpoint);
        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataEndpoint]);

  if (loading) return <div className="loading">Loading diagram...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="dynamic-diagram">
      {/* Render diagram based on data and type */}
      {renderDiagram(diagramType, data)}
    </div>
  );
};
```

### 2. Context-Aware Components
```jsx
// src/components/ContextAwareDiagram.jsx
import React, { useContext } from 'react';
import { ThemeContext } from '@docusaurus/theme-common';

const ContextAwareDiagram = ({ children, ...props }) => {
  const { isDarkTheme } = useContext(ThemeContext);

  return (
    <div className={`context-aware-diagram theme-${isDarkTheme ? 'dark' : 'light'}`}>
      {React.cloneElement(children, {
        ...props,
        theme: isDarkTheme ? 'dark' : 'light'
      })}
    </div>
  );
};
```

## Performance Optimization

### 1. Lazy Loading for Heavy Components
```jsx
import React, { lazy, Suspense } from 'react';

const HeavyDiagram = lazy(() => import('./HeavyInteractiveDiagram'));

const DiagramWrapper = (props) => (
  <Suspense fallback={<div className="loading">Loading interactive diagram...</div>}>
    <HeavyDiagram {...props} />
  </Suspense>
);
```

### 2. Memoization for Expensive Renders
```jsx
import React, { useMemo, memo } from 'react';

const OptimizedDiagram = memo(({ data, config }) => {
  const processedData = useMemo(() => {
    // Expensive data processing
    return processData(data);
  }, [data]);

  return (
    <div>
      {/* Render diagram with processed data */}
    </div>
  );
});
```

## Testing and Validation

### 1. Component Testing
```jsx
// __tests__/ResponsiveImage.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import ResponsiveImage from '../src/components/ResponsiveImage';

describe('ResponsiveImage', () => {
  it('renders image with correct alt text', () => {
    render(
      <ResponsiveImage
        src="/test.png"
        alt="Test image"
        caption="Test caption"
      />
    );

    expect(screen.getByRole('img', { name: /Test image/i })).toBeInTheDocument();
    expect(screen.getByText(/Test caption/i)).toBeInTheDocument();
  });
});
```

### 2. Accessibility Testing
```jsx
// Using axe-core for accessibility testing
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('has no accessibility violations', async () => {
  const { container } = render(<ResponsiveImage src="/test.png" alt="Test" />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Quality Assurance Checklist

### Component Standards
- [ ] Components follow React best practices
- [ ] Prop types are defined for all props
- [ ] Components are properly documented
- [ ] Error boundaries are implemented where needed
- [ ] Loading states are handled appropriately
- [ ] Accessibility attributes are included
- [ ] Responsive design is implemented
- [ ] Performance considerations are addressed

### Integration Standards
- [ ] Components are properly imported in MDX files
- [ ] Components are accessible via @site alias
- [ ] Components follow naming conventions
- [ ] Components are registered with Docusaurus if needed
- [ ] Components work in both dev and production builds
- [ ] Components maintain consistent styling
- [ ] Components handle different content types appropriately

### Testing Standards
- [ ] Unit tests cover component functionality
- [ ] Accessibility tests pass
- [ ] Performance tests are implemented
- [ ] Cross-browser compatibility is verified
- [ ] Responsive behavior is tested
- [ ] Error handling is tested
- [ ] Loading states are tested

## Deployment Considerations

### 1. Build Optimization
```js
// docusaurus.config.js
module.exports = {
  // ...
  themes: [
    // Add any custom themes
  ],
  plugins: [
    // Add plugins for MDX processing
    [
      '@docusaurus/plugin-content-docs',
      {
        path: 'docs',
        routeBasePath: '/docs',
        mdxPageComponent: '@theme/MDXPage',
      },
    ],
  ],
};
```

### 2. Asset Optimization
```js
// webpack config for image optimization
module.exports = {
  // ...
  webpack: {
    configure: (config) => {
      // Add image optimization rules
      config.module.rules.push({
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000, // Inline small images
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
      });
      return config;
    },
  },
};
```

This integration guide provides a comprehensive framework for incorporating visual materials into the Docusaurus-based textbook using MDX components. The approach ensures maintainability, accessibility, and performance while providing rich interactive experiences for students learning robotics concepts.