---
title: 'Image and Diagram Guidelines'
description: 'Standards and guidelines for creating visual content in the AI/Spec-Driven Textbook for Physical AI & Humanoid Robotics'
---

# Image and Diagram Guidelines

## Overview

This document provides guidelines for creating and using images and diagrams in the AI/Spec-Driven Textbook for Physical AI & Humanoid Robotics. Visual content should enhance understanding and complement the text.

## Image Standards

### Format and Quality
- **Format**: Use PNG for diagrams, JPG for photographs, SVG for scalable vector graphics
- **Resolution**: Minimum 300 DPI for print quality, optimized for web delivery
- **File Size**: Optimize for web (under 500KB per image when possible)
- **Dimensions**: Standard widths of 800px or 1200px for consistency

### Content Guidelines
- **Relevance**: All images must directly relate to the content
- **Clarity**: Images should be clear and unambiguous
- **Accessibility**: Include descriptive alt text for all images
- **Attribution**: Credit all sources and obtain proper permissions

## Diagram Standards

### Types of Diagrams
- **System Architecture Diagrams**: Show component relationships
- **Process Flow Diagrams**: Illustrate sequences and workflows
- **Conceptual Diagrams**: Visualize abstract concepts
- **Technical Schematics**: Detailed technical representations

### Creation Guidelines
- **Consistency**: Use consistent colors, fonts, and styles throughout
- **Color Palette**: Use the textbook's standard color scheme:
  - Primary: #2E8B57 (Sea Green)
  - Secondary: #4682B4 (Steel Blue)
  - Accent: #DC143C (Crimson)
  - Neutral: #708090 (Slate Gray)
- **Typography**: Use sans-serif fonts (e.g., Arial, Helvetica) at readable sizes
- **Labels**: Include clear, concise labels for all elements

## Placeholder Generation Process

### AI-Generated Placeholders
For initial content creation, AI-generated placeholders can be used:

1. **Description Creation**: Write detailed descriptions of needed visuals
2. **AI Tool Selection**: Use appropriate AI tools for image generation
3. **Prompt Engineering**: Create detailed prompts for consistent results
4. **Quality Review**: Verify placeholders meet educational goals
5. **Replacement Planning**: Plan for professional visuals in final versions

### Placeholder Standards
- **Watermark**: Include "PLACEHOLDER" watermark on AI-generated images
- **Description**: Include detailed description in image metadata
- **Quality Note**: Note any quality limitations in alt text
- **Replacement Priority**: Prioritize replacement based on educational importance

## Integration with Docusaurus

### Image Placement
```markdown
![Descriptive Alt Text](/img/path/to/image.png)
```

### Responsive Images
```markdown
<div className="textbook-image">
  <img src={require('./path/to/image.png').default} alt="Descriptive text" />
  <p className="image-caption">Caption explaining the image</p>
</div>
```

### Image Metadata
Include in frontmatter when needed:
```yaml
images:
  - src: /img/path/to/image.png
    alt: Descriptive alt text
    caption: Image caption
    source: Source attribution if applicable
```

## Accessibility Requirements

### Alt Text Guidelines
- **Descriptive**: Convey the essential information from the image
- **Contextual**: Tailor alt text to the surrounding content
- **Concise**: Keep under 125 characters when possible
- **Functional**: Explain what the image does, not just what it shows

### Caption Requirements
- **Explanatory**: Provide context that enhances understanding
- **Stand-alone**: Captions should make sense without the image
- **Attribution**: Include source attribution when required

## Review Process

### Technical Review
- Verify images enhance rather than duplicate text content
- Check that all images are properly licensed
- Ensure images are optimized for web delivery

### Educational Review
- Confirm images support learning objectives
- Verify diagrams accurately represent concepts
- Check that alt text and captions are educationally appropriate

## Tools and Resources

### Recommended Tools
- **Vector Graphics**: Figma, Adobe Illustrator, or Inkscape
- **Image Editing**: Adobe Photoshop, GIMP, or Photopea
- **Diagram Creation**: Draw.io, Lucidchart, or Mermaid.js
- **AI Generation**: DALL-E, Midjourney, or Stable Diffusion (with proper licensing)

### Style Resources
- Color palette generator for consistency
- Typography guidelines document
- Template files for common diagram types