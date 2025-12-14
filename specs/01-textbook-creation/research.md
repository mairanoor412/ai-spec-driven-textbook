# Research: AI/Spec-Driven Textbook Creation for Physical AI & Humanoid Robotics

**Date**: 2025-12-09 | **Feature**: 01-textbook-creation | **Spec**: [specs/01-textbook-creation/spec.md](../specs/01-textbook-creation/spec.md)

## Architecture Research

### Decision: AI/Spec-Driven Pipeline Architecture
**Rationale**: The architecture follows the SpecKit → Claude Code → GitHub → Docusaurus pipeline to ensure content is generated systematically with quality controls and proper versioning.

**Components**:
- SpecKit for specification and planning workflows
- Claude Code for AI-assisted content generation and refinement
- GitHub for version control and collaboration
- Docusaurus for static site generation and deployment

### Decision: LLM Selection for Drafting
**Rationale**: Claude Code will be the primary LLM for drafting content as it's specifically designed for software engineering tasks and can work with the Spec-Kit workflow.

**Alternatives considered**:
- Gemini: Less specialized for technical content generation
- GPT-4: Less integration with Spec-Kit tools
- Claude Code: Best integration with existing workflow and strong for technical content

### Decision: SpecKit Workflow Strategy
**Rationale**: Iterative module-by-module approach allows for continuous refinement and validation of content quality before proceeding to the next module.

**Alternatives considered**:
- Linear approach: Less opportunity for learning and improvement between modules
- Module-by-module: Allows for iterative improvement and quality checks between modules

### Decision: Docusaurus Structure
**Rationale**: Multi-sidebar structure provides better organization for a textbook with 10-15 chapters, allowing for logical grouping of related content.

**Alternatives considered**:
- Single sidebar: Could become unwieldy with 10-15 chapters
- Multi-sidebar: Better for user navigation and logical grouping of content

### Decision: Deployment Strategy
**Rationale**: GitHub Pages is the primary deployment strategy as it's free, reliable, and integrates well with the existing GitHub workflow.

**Alternatives considered**:
- GitHub Pages: Free, integrated with GitHub workflow
- Vercel: More features but adds complexity
- Netlify: Alternative option if GitHub Pages proves insufficient

### Decision: File Naming Conventions
**Rationale**: Consistent naming conventions ensure maintainability and clear organization of content.

**Convention**:
- Module directories: `module-{number}-{topic}/`
- Chapter files: `chapter-{number}-{topic}.md`
- Section files: `{section-name}.md`
- Assets: `assets/images/{module}/{chapter}/`

## Book Structure Research

### Decision: Book Structure Outline
**Rationale**: The structure follows modules → chapters → sections to provide logical organization and maintainability.

**Structure**:
- Modules: Major topic areas (e.g., Physical AI Fundamentals, Humanoid Robotics)
- Chapters: Individual topics within modules (e.g., Perception Systems, Kinematics)
- Sections: Subtopics within chapters (e.g., Sensor Types, Forward Kinematics)

### Decision: Chapter Content Structure
**Rationale**: Following the Overview → Concepts → Examples → Code → Exercises structure ensures comprehensive coverage and learning progression.

**Structure**:
- Overview: Learning outcomes and chapter summary
- Concepts: Theoretical foundations and principles
- Examples: Real-world applications and scenarios
- Code: Practical implementations (where applicable)
- Exercises: Practice problems and activities

## Automation Workflow Research

### Decision: Automation Pipeline
**Rationale**: The spec → clarify → plan → write → refine → build → deploy workflow ensures quality and consistency.

**Process**:
1. spec: Create detailed specifications for each chapter
2. clarify: Resolve ambiguities and define requirements
3. plan: Design implementation approach
4. write: Generate initial content
5. refine: Improve and validate content
6. build: Compile and test Docusaurus site
7. deploy: Publish to GitHub Pages

## Quality Gates Research

### Decision: Quality Validation Process
**Rationale**: Multiple quality gates ensure content meets educational and technical standards.

**Gates**:
- Content accuracy: Verification by subject matter experts
- Versioning: Proper Git version control and release management
- Formatting: Docusaurus MDX compliance and styling
- Build checks: Successful Docusaurus build without errors

## Technical Implementation Research

### Decision: Concurrent Writing Approach
**Rationale**: Chapter-concurrent writing allows for iterative refinement while maintaining overall project momentum.

**Approach**:
- Write each chapter using SpecKit while refining the overall plan
- Validate each chapter before moving to the next
- Update plan based on learnings from completed chapters

## Environment Upgrade Research

### Decision: Docusaurus Version Upgrade Path (2.0.0-beta.6 → 3.x)

**Rationale**: The current Docusaurus 2.0.0-beta.6 is a legacy beta version that lacks stability, security updates, and modern features. Upgrading to Docusaurus 3.x provides:
- Production-ready stability with long-term support
- Improved performance and build times
- Better TypeScript support and type safety
- Enhanced MDX v3 capabilities
- Active maintenance and security updates
- React 18 compatibility with modern features (automatic batching, concurrent rendering)

**Migration Strategy**:
- Follow official Docusaurus v2 to v3 migration guide
- Incremental upgrade approach: dependencies → configuration → plugins → validation
- Preserve all existing content without modification (infrastructure-only upgrade)

**Alternatives Considered**:
- Stay on 2.0.0-beta.6: Rejected due to lack of stability, security updates, and modern features
- Skip to Docusaurus 4.x (if available): Rejected as 3.x is current stable version with proven migration path
- Switch to alternative SSG (VitePress, Nextra): Rejected to maintain existing Docusaurus investment and content structure

### Decision: React Version Upgrade (17 → 18)

**Rationale**: React 18 is required for Docusaurus 3.x compatibility and provides:
- Automatic batching for better performance
- Concurrent features for improved user experience
- Improved server-side rendering capabilities
- Streaming SSR support
- Required for Docusaurus 3.x peer dependencies

**Migration Approach**:
- Upgrade as part of Docusaurus upgrade (bundled dependency)
- No code changes required for Docusaurus usage (handled by framework)
- Test existing components for compatibility

**Alternatives Considered**:
- Stay on React 17: Not viable due to Docusaurus 3.x requirement
- Upgrade to React 19: Rejected as Docusaurus 3.x currently targets React 18

### Decision: Node.js Version Requirement (18.0+)

**Rationale**: Node.js 18.0+ is required for Docusaurus 3.x and provides:
- Native Fetch API support
- Improved performance and security
- Long-term support (LTS) version
- Better ES modules support
- Required for Docusaurus 3.x build process

**Implementation**:
- Update development environment to Node.js 18.x or 20.x LTS
- Update CI/CD pipeline Node.js version
- Update GitHub Actions workflows if applicable
- Document Node.js version requirement in project README

**Alternatives Considered**:
- Node.js 16: End of life, incompatible with Docusaurus 3.x
- Node.js 21+: Cutting edge but not LTS, potentially unstable

### Decision: Search Plugin Selection for Docusaurus 3.x

**Rationale**: Search functionality is critical for textbook navigation (per spec FR-009). Must support full-text search with result highlighting and ranking.

**Options Evaluated**:

1. **Algolia DocSearch** (`@docusaurus/theme-search-algolia`)
   - Pros: Official Docusaurus integration, powerful search, free for open source
   - Cons: Requires external service, approval process for free tier
   - Best for: Public documentation with high traffic

2. **Local Search Plugin** (`@easyops-cn/docusaurus-search-local`)
   - Pros: No external dependencies, works offline, instant setup, free
   - Cons: Less powerful than Algolia, larger bundle size
   - Best for: Small to medium documentation, privacy-sensitive content

3. **Lunr.js Plugin** (`docusaurus-lunr-search`)
   - Pros: Client-side search, no external service
   - Cons: Performance issues with large sites, less maintained
   - Best for: Small sites only

**Recommended Decision**: Start with **Local Search Plugin** for immediate functionality, with option to migrate to Algolia if search quality/performance becomes an issue.

**Rationale for Local Search**:
- Zero setup time (no approval process)
- Privacy-friendly (no external service)
- Sufficient for 4-chapter textbook
- Can migrate to Algolia later if needed without content changes

### Decision: Content Preservation Strategy

**Rationale**: All existing MD/MDX content must remain unchanged during upgrade to prevent introduction of errors or loss of carefully crafted educational material.

**Implementation**:
- Git commit checkpoint before upgrade begins
- Automated validation: compare content file checksums pre/post upgrade
- No manual editing of content files during upgrade
- All changes limited to configuration and dependency files
- Comprehensive regression testing after upgrade

**Validation Checklist**:
- All 4 chapters render without errors
- Navigation (breadcrumbs, sidebar, next/previous) works correctly
- Search functionality operates with highlighting
- Visual materials (images, diagrams) load properly
- Code examples render with correct syntax highlighting
- Deployment to GitHub Pages succeeds
- Build completes with zero errors or warnings

### Decision: Rollback and Risk Mitigation

**Rationale**: Minimize risk of upgrade failure by having clear rollback plan and incremental validation.

**Rollback Strategy**:
- All upgrade changes in single Git commit for easy revert
- Document pre-upgrade package versions
- Keep separate upgrade branch until fully validated
- Merge to main only after complete validation passes

**Risk Mitigation Measures**:
- Test upgrade in local development environment first
- Run full build validation before deployment
- Deploy to test/staging environment before production
- Keep backup of working state
- Document all configuration changes for troubleshooting

**Known Risks**:
1. Breaking changes in Docusaurus 3.x API → Mitigation: Follow migration guide, test incrementally
2. Search plugin incompatibility → Mitigation: Research compatible plugins before upgrade, have fallback options
3. MDX syntax changes → Mitigation: Validate builds immediately, fix compatibility issues
4. GitHub Pages deployment config changes → Mitigation: Review v3 deployment docs, test in staging