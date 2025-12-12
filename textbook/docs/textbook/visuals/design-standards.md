---
title: 'Visual Design Standards'
description: 'Design standards and guidelines for visual materials in the AI/Spec-Driven Textbook for Physical AI & Humanoid Robotics'
---

# Visual Design Standards

## Overview

This document establishes visual design standards for the AI/Spec-Driven Textbook for Physical AI & Humanoid Robotics. These standards ensure consistency, accessibility, and educational effectiveness across all visual materials in the textbook.

## Color Palette

### Primary Colors
- **Sea Green**: `#2E8B57` - Used for primary elements, headings, and important information
- **Dark Sea Green**: `#277A4C` - Darker variant for emphasis
- **Light Sea Green**: `#3D9B6B` - Lighter variant for subtle elements

### Secondary Colors
- **Steel Blue**: `#4682B4` - Used for secondary elements and links
- **Dark Steel Blue**: `#3D73A0` - Darker variant for contrast
- **Light Steel Blue**: `#5A91C0` - Lighter variant for backgrounds

### Accent Colors
- **Crimson**: `#DC143C` - Used for warnings, errors, and critical information
- **Goldenrod**: `#DAA520` - Used for highlights and important notes
- **Forest Green**: `#228B22` - Used for success states and positive elements

### Neutral Colors
- **Charcoal**: `#36454F` - Primary text color
- **Slate Gray**: `#708090` - Secondary text and subtle elements
- **Light Gray**: `#D3D3D3` - Borders and dividers
- **Off White**: `#F8F9FA` - Backgrounds and subtle highlights

## Typography

### Font Stack
```css
primary-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
code-font: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
```

### Heading Hierarchy
- **H1 (Title)**: 2.5rem, Bold, Primary Color
- **H2 (Major Section)**: 2rem, Semi-bold, Primary Color
- **H3 (Subsection)**: 1.5rem, Semi-bold, Primary Color
- **H4 (Minor Section)**: 1.25rem, Medium, Secondary Color
- **H5 (Sub-subsection)**: 1.1rem, Medium, Secondary Color
- **H6 (Detail)**: 1rem, Regular, Charcoal

### Body Text
- **Primary Text**: 1rem, Line Height 1.7, Charcoal Color
- **Secondary Text**: 0.9rem, Line Height 1.6, Slate Gray Color
- **Caption Text**: 0.85rem, Line Height 1.5, Slate Gray Color

## Diagram Standards

### Style Guidelines
- **Lines**: 2px stroke width for primary elements, 1px for secondary
- **Colors**: Use primary and secondary colors consistently
- **Arrows**: 15px length, 8px width, filled with primary color
- **Shapes**: Rounded corners (4px radius) for rectangles, circles for nodes

### Common Diagram Elements

#### Process Flow Diagrams
- **Start/End**: Rounded rectangles with 8px corner radius
- **Process**: Rectangles with 4px corner radius
- **Decision**: Diamonds with 4px corner radius
- **Connector**: Circles with connecting arrows
- **Direction**: Arrows pointing in flow direction

#### System Architecture Diagrams
- **Components**: Rectangles with 8px corner radius
- **Interfaces**: Dashed lines connecting components
- **Data Flow**: Arrows showing information flow
- **Boundaries**: Dotted lines around system boundaries

#### Kinematic Diagrams
- **Joints**: Circles or arcs representing joint types
- **Links**: Lines connecting joints, labeled with lengths
- **Coordinate Frames**: Three-axis representations (X-red, Y-green, Z-blue)
- **Movement**: Arrows showing possible motions

#### Block Diagrams
- **Blocks**: Rectangles with 4px corner radius
- **Signals**: Arrows showing information flow
- **Summing Points**: Circles with plus/minus signs
- **Gain Blocks**: Triangles with gain values

## Image Standards

### Dimensions and Sizes
- **Full-width Images**: Maximum 1200px width
- **Half-width Images**: Maximum 600px width
- **Quarter-width Images**: Maximum 300px width
- **Icons**: 16x16px to 48x48px range
- **Diagrams**: Scalable vector format (SVG) preferred

### File Formats
- **Photographs**: JPEG (80% quality) or PNG
- **Diagrams**: SVG (scalable vector graphics) preferred
- **Screenshots**: PNG with transparency if needed
- **Icons**: SVG or high-resolution PNG (2x/3x)

### Resolution Requirements
- **Standard Displays**: 72-96 DPI
- **High-Density Displays**: 144-192 DPI equivalents
- **Print**: 300 DPI minimum

## Accessibility Standards

### Color Accessibility
- **Contrast Ratio**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Color Independence**: Information conveyed through means other than color alone
- **Color-Blind Friendly**: Use patterns or textures in addition to color

### Alternative Text
- **Descriptive**: Alt text should describe the image content and function
- **Contextual**: Alt text should be appropriate for the surrounding context
- **Concise**: Keep alt text under 125 characters when possible
- **Functional**: Describe the action or purpose if the image is interactive

### Visual Hierarchy
- **Clear Structure**: Use consistent spacing and sizing
- **Logical Flow**: Arrange elements in a predictable order
- **Grouping**: Visually group related elements
- **Emphasis**: Use color, size, and weight to show importance

## Responsive Design

### Breakpoints
- **Mobile**: Up to 768px
- **Tablet**: 769px to 1024px
- **Desktop**: 1025px and above

### Responsive Behaviors
- **Images**: Scale down but never exceed container width
- **Diagrams**: Maintain aspect ratio while scaling
- **Complex Diagrams**: Switch to scrollable containers on small screens
- **Captions**: Stay with associated images regardless of screen size

## Animation and Interaction

### Animation Guidelines
- **Subtle**: Animations should enhance, not distract
- **Performance**: Keep animations under 300ms
- **Accessibility**: Respect `prefers-reduced-motion` setting
- **Purpose**: Animations should have clear functional purpose

### Interactive Elements
- **Hover States**: Subtle color or shadow changes
- **Focus States**: Clear visual indication for keyboard navigation
- **Active States**: Visual feedback for pressed/selected states
- **Loading States**: Clear indicators for content loading

## Naming Conventions

### File Names
- **Format**: `category-subject-variant.extension`
- **Example**: `kinematics-forward-chain-diagram.svg`
- **Case**: Use lowercase with hyphens
- **Numbers**: Use leading zeros for sequences (01, 02, 03...)

### Alt Text Patterns
- **Diagrams**: "[Subject] diagram showing [key elements and relationships]"
- **Charts**: "[Chart type] showing [data and trend]"
- **Photos**: "[Subject] photo showing [key visual elements]"
- **Icons**: "[Icon function] icon"

## Quality Assurance

### Review Checklist
- [ ] Color contrast meets accessibility standards
- [ ] Alternative text is descriptive and appropriate
- [ ] Images are properly sized and optimized
- [ ] Diagrams accurately represent concepts
- [ ] Visual hierarchy is clear and logical
- [ ] Responsive behavior works across devices
- [ ] Animations are smooth and appropriate
- [ ] All visual elements support learning objectives

### Testing Requirements
- **Cross-browser Compatibility**: Test in major browsers
- **Device Testing**: Test on various screen sizes
- **Accessibility Testing**: Use screen readers and accessibility tools
- **Performance Testing**: Verify loading times and smooth interactions

## Tools and Resources

### Recommended Tools
- **Vector Graphics**: Figma, Adobe Illustrator, or Inkscape
- **Raster Graphics**: Adobe Photoshop, GIMP, or Photopea
- **Diagramming**: Draw.io, Lucidchart, or Mermaid.js
- **Animation**: CSS animations, Framer Motion, or Lottie

### Templates
- **Diagram Template**: Standard layout with color palette applied
- **Infographic Template**: Grid system and typography standards
- **Icon Template**: Consistent stroke width and style guide
- **Chart Template**: Color schemes and labeling standards

## Maintenance

### Update Process
- **Regular Reviews**: Quarterly review of visual standards
- **Feedback Integration**: Incorporate user feedback
- **Technology Updates**: Adapt to new display technologies
- **Accessibility Improvements**: Stay current with WCAG guidelines

### Version Control
- **Documentation**: Keep this document updated with changes
- **Assets**: Maintain original source files for all graphics
- **History**: Track changes and reasons for updates
- **Rollback Plan**: Maintain ability to revert to previous standards if needed