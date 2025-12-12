# ADR-0002: Docusaurus-Based Publication System

## Status
Accepted

## Date
2025-12-09

## Context
We need to choose a platform for publishing the textbook that supports educational content with rich formatting, navigation, search, and responsive design. The platform should support the required content structure (chapters with learning outcomes, examples, exercises, diagrams) and be suitable for our target audience of beginner to intermediate students.

## Decision
We will use Docusaurus as the static site generator for the textbook with the following characteristics:
- Content stored in MDX format for rich interactivity
- Multi-sidebar navigation structure for organized content access
- GitHub Pages deployment for hosting
- Support for embedded diagrams, code examples, and exercises
- Responsive design for accessibility across devices

## Alternatives Considered
1. Custom static site with vanilla HTML/CSS/JS
   - Pros: Complete control over features and design
   - Cons: Significant development time, maintenance burden, lacks built-in features
2. WordPress or other CMS
   - Pros: Rich content management features, familiar interface
   - Cons: Overhead for static content, less developer-friendly, potential costs
3. Docusaurus (selected)
   - Pros: Optimized for documentation, excellent Markdown/MDX support, built-in search/navigation, responsive, supports educational content well

## Consequences
- Positive: Professional-looking, accessible textbook with excellent navigation
- Positive: Built-in features like search, versioning, mobile responsiveness
- Positive: Good support for technical content with code examples
- Negative: Learning curve for Docusaurus-specific features
- Negative: Constraint to Docusaurus-specific syntax and structure

## References
- plan.md
- research.md
- data-model.md