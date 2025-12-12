# Quickstart Guide: AI/Spec-Driven Textbook Creation

**Date**: 2025-12-09 | **Feature**: 01-textbook-creation | **Spec**: [specs/01-textbook-creation/spec.md](../specs/01-textbook-creation/spec.md)

## Getting Started

This guide provides a quick overview of how to create content for the AI/Spec-Driven Textbook on Physical AI & Humanoid Robotics using the Spec-Kit Plus workflow.

### Prerequisites

- Node.js 18+ installed
- Git repository access
- Claude Code CLI installed
- Docusaurus knowledge (helpful but not required)

### Setting Up the Environment

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd humanoid-robotics
   ```

2. Install Docusaurus dependencies:
   ```bash
   npm install
   ```

3. Verify Claude Code is available:
   ```bash
   # Claude Code should be accessible in your environment
   ```

### Creating a New Chapter

1. **Create a specification** for your chapter:
   ```bash
   # Navigate to the appropriate module directory
   cd specs/01-textbook-creation/

   # Create a new chapter spec (this would typically be done via SpecKit commands)
   # For example: /sp.specify --feature "chapter-01-introduction-to-physical-ai"
   ```

2. **Clarify requirements** using the clarification workflow:
   ```bash
   # Run clarification to resolve ambiguities
   # /sp.clarify
   ```

3. **Plan the implementation**:
   ```bash
   # Generate the implementation plan
   # /sp.plan
   ```

4. **Write the content** following the standard structure:
   - Overview with learning outcomes
   - Core concepts
   - Real-world examples
   - Code examples (where applicable)
   - Exercises and activities

5. **Refine the content** using Claude Code for quality improvement.

### Chapter Structure

Each chapter should follow this structure:

```
docs/textbook/chapter-{number}-{topic}/
├── index.md          # Chapter overview and learning outcomes
├── concepts.md       # Core theoretical concepts
├── examples.md       # Real-world examples and applications
├── code.md           # Code examples and implementations (if applicable)
├── exercises.md      # Practice exercises and activities
└── _category_.json   # Chapter configuration
```

### Content Standards

1. **Target Audience**: Write for students with basic programming knowledge and basic math/physics background but no robotics background

2. **Technical Accuracy**: All technical claims must be verified by subject matter experts

3. **Chapter Length**: Aim for 3,000-5,000 words per chapter

4. **Required Elements**: Each chapter must include:
   - Learning outcomes
   - Real-world examples
   - Diagrams/visuals
   - Practical exercises

5. **Format**: Use Docusaurus MDX format for all content

### Quality Checks

Before finalizing a chapter, ensure:

- [ ] Content follows the Overview → Concepts → Examples → Code → Exercises structure
- [ ] Technical accuracy has been verified
- [ ] Content is within 3,000-5,000 word range
- [ ] All required elements are included
- [ ] Docusaurus build passes without errors
- [ ] All links and references work correctly

### Building and Previewing

1. To build the textbook locally:
   ```bash
   npm run build
   ```

2. To preview the textbook:
   ```bash
   npm start
   ```

### Deployment

The textbook is automatically deployed to GitHub Pages when changes are merged to the main branch. Ensure all quality checks pass before merging.

### Spec-Kit Plus Workflow Commands

- `/sp.specify`: Create feature specifications
- `/sp.clarify`: Clarify ambiguous requirements
- `/sp.plan`: Generate implementation plans
- `/sp.tasks`: Generate implementation tasks
- `/sp.adr`: Create architectural decision records
- `/sp.phr`: Create prompt history records