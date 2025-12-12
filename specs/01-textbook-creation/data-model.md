# Data Model: AI/Spec-Driven Textbook Creation for Physical AI & Humanoid Robotics

**Date**: 2025-12-09 | **Feature**: 01-textbook-creation | **Spec**: [specs/01-textbook-creation/spec.md](../specs/01-textbook-creation/spec.md)

## Entity: Textbook Chapter

**Description**: A self-contained educational unit covering specific topics in Physical AI and robotics

**Fields**:
- `id`: Unique identifier (e.g., "chapter-01-introduction")
- `title`: Chapter title
- `module`: Parent module identifier
- `learningOutcomes`: Array of learning outcomes
- `content`: Main content body (Markdown/MDX)
- `examples`: Array of real-world examples
- `exercises`: Array of practical exercises
- `diagrams`: Array of visual materials
- `prerequisites`: Prerequisite knowledge required
- `difficulty`: Difficulty level (beginner/intermediate/advanced)
- `wordCount`: Approximate word count
- `estimatedReadingTime`: Estimated time to complete
- `relatedChapters`: Array of related chapter IDs

**Validation rules**:
- Must have 3,000-5,000 words of explanatory prose (excluding code blocks and exercise text)
- Must include 3-5 learning outcomes
- Must include 2-4 real-world examples
- Must include 3-5 diagrams with alt text and captions
- Must include 2-3 working code examples
- Must include 3-5 practical exercises
- Content must be technically accurate and verified by subject matter experts
- Difficulty must match target audience (beginner-intermediate with basic programming/math background)

## Entity: Textbook Module

**Description**: A collection of related chapters covering a major topic area. Note: In the current implementation, the textbook is organized as a single module containing 4 self-contained chapters. This entity definition supports future expansion if chapters need to be grouped into multiple modules.

**Fields**:
- `id`: Unique identifier (e.g., "module-01-physical-ai")
- `title`: Module title
- `description`: Brief description of the module
- `chapters`: Array of chapter IDs in this module
- `learningPath`: Suggested learning path through the module
- `prerequisites`: Prerequisite knowledge for the module
- `duration`: Estimated time to complete the module

**Validation rules**:
- Must contain 1-4 chapters
- Chapters must follow logical progression
- Must build on previous modules appropriately

**Implementation Note**: Current textbook uses flat chapter structure (one module with 4 chapters) for simplicity.

## Entity: Learning Content

**Description**: Educational material including text, diagrams, examples, and exercises that convey knowledge about Physical AI and humanoid robotics

**Fields**:
- `id`: Unique identifier
- `type`: Content type (text, diagram, example, exercise, code)
- `content`: The actual content
- `format`: Format (Markdown, MDX, image, code)
- `difficulty`: Difficulty level
- `targetAudience`: Intended audience level
- `relatedEntities`: Related content entities
- `verificationStatus`: Status of technical accuracy verification

**Validation rules**:
- Content must be technically accurate
- Must match target audience level
- All technical claims must be correct

## Entity: Visual Materials

**Description**: Diagrams, images, and other visual aids that support text-based learning content

**Fields**:
- `id`: Unique identifier
- `title`: Title of the visual
- `description`: Description of the visual
- `type`: Type of visual (diagram, image, chart, video)
- `path`: File path in the repository
- `altText`: Alternative text for accessibility
- `caption`: Caption for the visual
- `relatedChapter`: Chapter this visual belongs to
- `source`: Source of the visual (original/AI-generated)

**Validation rules**:
- Must have appropriate alt text for accessibility
- Must be relevant to the associated content
- Must be properly formatted for Docusaurus

## Entity: Student

**Description**: The target audience consisting of beginner to intermediate learners studying Physical AI, robotics, and humanoid systems. This entity represents the persona used for content design and validation - not an actual tracked user.

**Fields**:
- `level`: Technical level (beginner/intermediate)
- `background`: Technical background (basic programming knowledge and basic math/physics, no robotics background)
- `goals`: Learning goals (understand Physical AI, humanoid robotics, practical skills, AI-driven workflows)
- `preferredLearningStyle`: Learning style preference (visual, hands-on, reading, code-based)
- `progress`: Learning progress through the textbook (conceptual only)

**Validation rules**:
- This is a design persona, not a database entity
- Used to validate content difficulty, prerequisites, and learning paths
- Informs decisions about explanations, examples, and exercise complexity

**Implementation Note**: No actual student tracking system is implemented. This entity guides content creation to meet target audience needs.

## Relationships

- `Module` 1-to-many `Chapter`: A module contains multiple chapters
- `Chapter` 1-to-many `LearningContent`: A chapter contains multiple content elements
- `Chapter` 1-to-many `VisualMaterials`: A chapter contains multiple visual materials
- `LearningContent` many-to-many `LearningContent`: Content elements can be related to each other

## State Transitions

### Chapter States
- `draft`: Initial state when chapter is being written
- `review`: Chapter is under review for technical accuracy
- `approved`: Chapter has passed review and is ready for inclusion
- `published`: Chapter is included in the published textbook
- `deprecated`: Chapter is outdated and needs updating

### Content Verification States
- `unverified`: Content has not yet been verified for technical accuracy
- `in-review`: Content is being reviewed by subject matter experts
- `verified`: Content has been verified and is technically accurate
- `flagged`: Content has been flagged for potential inaccuracies