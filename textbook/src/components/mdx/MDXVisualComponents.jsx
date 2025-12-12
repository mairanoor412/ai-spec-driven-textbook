import React from 'react';
import TextbookFigure from '../visual/TextbookFigure';
import FigureReference from '../visual/FigureReference';
import OptimizedImage from '../visual/OptimizedImage';
import AccessibleFigure from '../visual/AccessibleFigure';
import KinematicsExplorer from '../interactive/KinematicsExplorer';

// MDX-compatible wrapper component that can be used in Docusaurus MDX files
const MDXVisualComponents = {
  // Figure components
  TextbookFigure,
  AccessibleFigure,
  FigureReference,

  // Image components
  OptimizedImage,

  // Interactive components
  KinematicsExplorer,

  // Simple wrapper for regular images with default optimization
  Image: ({ src, alt, caption, size = 'medium', ...props }) => (
    <OptimizedImage
      src={src}
      alt={alt}
      caption={caption}
      size={size}
      {...props}
    />
  ),

  // Figure wrapper for simple figure usage
  Figure: ({ id, src, alt, title, caption, ...props }) => (
    <TextbookFigure
      id={id}
      src={src}
      alt={alt}
      title={title}
      caption={caption}
      {...props}
    />
  ),

  // Accessible figure wrapper
  AccessibleImg: ({ src, alt, caption, title, id, ...props }) => (
    <AccessibleFigure
      id={id || 'auto'}
      src={src}
      alt={alt}
      title={title || alt}
      caption={caption}
      {...props}
    />
  )
};

// Export individual components as well as the collection
export {
  TextbookFigure,
  FigureReference,
  OptimizedImage,
  AccessibleFigure,
  KinematicsExplorer,
  MDXVisualComponents as default
};