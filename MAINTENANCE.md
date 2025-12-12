# Maintenance Guide: AI/Spec-Driven Textbook for Physical AI & Humanoid Robotics

**Version**: 1.0
**Last Updated**: 2025-12-12
**Project**: AI/Spec-Driven Textbook for Physical AI & Humanoid Robotics

---

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Chapter Modularity](#chapter-modularity)
- [Content Updates](#content-updates)
- [Technical Accuracy Verification](#technical-accuracy-verification)
- [Accessibility Audit](#accessibility-audit)
- [Performance Optimization](#performance-optimization)
- [Spec-Kit Plus Compatibility](#spec-kit-plus-compatibility)
- [PDF Generation](#pdf-generation)
- [UX Testing](#ux-testing)
- [Deployment](#deployment)
- [Quality Assurance](#quality-assurance)

---

## Overview

This guide provides comprehensive instructions for maintaining, updating, and deploying the Physical AI & Humanoid Robotics textbook.

### Key Principles

1. **Modular Design**: Each chapter is independent and can be updated without affecting others
2. **Spec-Driven**: All changes should align with specifications in `specs/01-textbook-creation/`
3. **Quality First**: Technical accuracy and accessibility are non-negotiable
4. **User-Centered**: All updates should enhance learner experience

---

## Project Structure

### Repository Organization

```
humanoid-robotics/
├── .gitignore                      # Git ignore patterns
├── MAINTENANCE.md                  # This file
├── README.md                       # Project overview
├── specs/                          # Feature specifications
│   └── 01-textbook-creation/
│       ├── spec.md                 # Requirements
│       ├── plan.md                 # Implementation plan
│       ├── tasks.md                # Task breakdown
│       ├── data-model.md           # Entity definitions
│       └── checklists/             # Quality checklists
└── textbook/                       # Docusaurus project
    ├── docs/                       # Content directory
    │   ├── intro.md                # Site introduction
    │   └── textbook/               # Main textbook content
    │       ├── index.md            # Textbook home
    │       ├── glossary.md         # Terms glossary
    │       ├── bookmarks.md        # Bookmarking guide
    │       ├── learning-guide.md   # Learning navigation
    │       ├── accessibility-guide.md  # Accessibility features
    │       ├── difficulty-badges.md    # Difficulty guide
    │       ├── index-reference.md  # Comprehensive index
    │       ├── chapter-01/         # Physical AI Fundamentals
    │       │   ├── index/
    │       │   ├── concepts/
    │       │   ├── examples/
    │       │   ├── code/           # Code examples (added)
    │       │   └── exercises/
    │       ├── chapter-02/         # Humanoid Robotics
    │       ├── chapter-03/         # Practical Robotics Skills
    │       └── chapter-04/         # AI-Driven Workflows
    ├── docusaurus.config.js        # Docusaurus configuration
    ├── sidebars.js                 # Sidebar configuration
    ├── package.json                # Dependencies
    └── static/                     # Static assets
```

---

## Chapter Modularity

### Design Philosophy

Each chapter is designed to be **self-contained** and **independently updatable**.

### Chapter Structure (Constitutional Mandate)

Every chapter must follow this 5-file structure:

```
chapter-XX-name/
├── index/          # Overview - chapter introduction and learning outcomes
├── concepts/       # Concepts - core theoretical content
├── examples/       # Examples - real-world applications
├── code/          # Code - working code examples (2-3 minimum)
└── exercises/      # Exercises - practical exercises (3-5 minimum)
```

### Validation Test (T097)

**Purpose**: Verify that updating one chapter doesn't break others.

**Test Procedure**:

1. **Select a test chapter** (e.g., Chapter 2)

2. **Make a minor update**:
   ```bash
   cd textbook/docs/textbook/chapter-02/concepts
   # Edit concepts.md - add a new paragraph
   ```

3. **Build the site**:
   ```bash
   cd textbook
   npm run build
   ```

4. **Verify**:
   - ✅ Build succeeds without errors
   - ✅ Other chapters render correctly
   - ✅ Navigation links work
   - ✅ Search indexing updates
   - ✅ No broken cross-references

5. **Test navigation**:
   ```bash
   npm run serve
   ```
   - Visit all 4 chapters
   - Check cross-references
   - Verify sidebar navigation

**Expected Result**: Chapter 2 updates, all other chapters unchanged and functional.

---

## Content Updates

### Update Workflow

1. **Identify need**: Content error, outdated info, enhancement
2. **Check specification**: Verify change aligns with `specs/01-textbook-creation/spec.md`
3. **Update content**: Edit relevant chapter file(s)
4. **Verify quality**: Run quality checks (see [Quality Assurance](#quality-assurance))
5. **Test build**: Ensure Docusaurus builds successfully
6. **Review**: Subject matter expert review if technical content changed
7. **Deploy**: Follow deployment process

### Content Types

**Conceptual Content** (`concepts/*.md`):
- Keep beginner-friendly
- Maintain technical accuracy
- Use clear examples
- Update based on latest research

**Code Examples** (`code/*.md`):
- **Must be working code** - test before publishing
- Update for latest library versions
- Include comprehensive comments
- Provide "how to run" instructions

**Exercises** (`exercises/*.md`):
- Align with learning outcomes
- Provide difficulty indicators (🟢🟡🔴)
- Include solution hints (in separate document if needed)
- Test feasibility

---

## Technical Accuracy Verification (T101)

### Verification Process

All technical content must be verified for accuracy before publication.

### Verification Checklist

#### For Conceptual Content

- [ ] Definitions are technically correct
- [ ] Examples accurately reflect real-world systems
- [ ] No misleading simplifications
- [ ] Citations for advanced claims (when applicable)
- [ ] Consistent terminology with glossary

#### For Code Examples

- [ ] Code runs without errors
- [ ] Dependencies are correctly specified
- [ ] Version compatibility documented
- [ ] Comments accurately describe functionality
- [ ] Follows ROS2/Python best practices
- [ ] Security: No hardcoded credentials or unsafe patterns

#### For Mathematical Content

- [ ] Formulas are correct
- [ ] Units are specified
- [ ] Example calculations verify
- [ ] Notation consistent with industry standards

### Subject Matter Expert (SME) Review

**When Required**:
- New technical content
- Significant conceptual updates
- Code example additions
- Mathematical derivations

**SME Qualifications**:
- Professional experience in robotics/AI (3+ years)
- Academic background in relevant field
- Familiarity with ROS2, Python, ML frameworks

**Review Process**:
1. Create review request (see `chapter-XX/review-request.md` templates)
2. SME reviews content for technical accuracy
3. SME provides feedback via comments/annotations
4. Content author makes revisions
5. SME approves final version
6. Document approval in `chapter-XX/revision-log.md`

---

## Accessibility Audit (T100)

### WCAG 2.1 AA Compliance

All content must meet WCAG 2.1 Level AA standards.

### Audit Checklist

#### Visual Content

- [ ] All images have descriptive alt text
- [ ] Complex diagrams have text descriptions below image
- [ ] Color is not the only visual differentiator
- [ ] Text contrast meets 4.5:1 ratio (normal text)
- [ ] Text contrast meets 3:1 ratio (large text, UI elements)

#### Content Structure

- [ ] Heading hierarchy is correct (H1 → H2 → H3)
- [ ] Lists use proper markup (ul, ol, dl)
- [ ] Tables have headers and captions
- [ ] Links are descriptive (not "click here")

#### Interactive Elements

- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators are visible
- [ ] Forms have labels
- [ ] Error messages are clear

#### Code Examples

- [ ] Code blocks have language specified
- [ ] Syntax highlighting doesn't rely on color alone
- [ ] Code has text descriptions/comments

### Testing Tools

**Automated Testing**:
```bash
# Install accessibility testing tools
npm install -g @axe-core/cli

# Run accessibility audit
cd textbook
npm run build
axe build/ --tags wcag2aa
```

**Manual Testing**:
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation
- Browser zoom to 200%
- High contrast mode

### Documentation

See [`textbook/docs/textbook/accessibility-guide.md`](/textbook/docs/textbook/accessibility-guide.md) for complete accessibility guidelines.

---

## Performance Optimization (T103)

### Performance Goals

- **Time to Interactive (TTI)**: < 3 seconds
- **First Contentful Paint (FCP)**: < 1.5 seconds
- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **Cumulative Layout Shift (CLS)**: < 0.1

### Optimization Strategies

#### 1. Image Optimization

```bash
# Compress images before adding to repo
# Use tools like imagemin, squoosh, or tinypng

# Recommended formats:
# - Diagrams: SVG (vector) or optimized PNG
# - Photos: WebP with PNG fallback
# - Max dimensions: 1920x1080
```

#### 2. Code Splitting

Docusaurus automatically splits code by route. No additional configuration needed.

#### 3. Lazy Loading

Images lazy load by default in Docusaurus.

#### 4. Asset Minification

```bash
# Build process automatically minifies
npm run build

# Output in textbook/build/ is production-ready
```

#### 5. Caching Strategy

GitHub Pages automatically caches static assets. No configuration needed.

### Performance Testing

```bash
# Build production version
cd textbook
npm run build

# Serve locally
npm run serve

# Test with Lighthouse
# Open Chrome DevTools → Lighthouse → Run audit

# Target scores:
# - Performance: > 90
# - Accessibility: 100
# - Best Practices: > 90
# - SEO: > 90
```

### Progressive Content Loading (T094)

For large chapters (> 5,000 words):

**Strategy**: Break into smaller sections using Docusaurus pagination or tabs.

**Implementation**:
```markdown
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="basics" label="Basics" default>
    Basic content here...
  </TabItem>
  <TabItem value="advanced" label="Advanced">
    Advanced content here...
  </TabItem>
</Tabs>
```

---

## Spec-Kit Plus Compatibility (T099)

### Validation Process

Ensure all content generation follows Spec-Kit Plus workflows.

### Checklist

- [ ] Feature specifications in `specs/01-textbook-creation/spec.md`
- [ ] Implementation plan in `specs/01-textbook-creation/plan.md`
- [ ] Task breakdown in `specs/01-textbook-creation/tasks.md`
- [ ] Data model defined in `specs/01-textbook-creation/data-model.md`
- [ ] Constitution principles followed (see `.specify/memory/constitution.md`)

### Constitutional Compliance

**Required Chapter Structure**:
- ✅ Overview (index.md)
- ✅ Concepts (concepts.md)
- ✅ Examples (examples.md)
- ✅ Code (code.md) **← Must be present**
- ✅ Exercises (exercises.md)

**Content Requirements**:
- ✅ 3-5 learning outcomes per chapter
- ✅ 2-4 real-world examples per chapter
- ✅ 3-5 diagrams with alt text per chapter
- ✅ 2-3 working code examples per chapter
- ✅ 3-5 practical exercises per chapter
- ✅ 3,000-5,000 words of explanatory prose per chapter

### Workflow Validation

```bash
# Verify all chapters have required files
for chapter in textbook/docs/textbook/chapter-*/; do
  echo "Checking $chapter"
  [ -d "$chapter/index" ] && echo "✓ index" || echo "✗ index"
  [ -d "$chapter/concepts" ] && echo "✓ concepts" || echo "✗ concepts"
  [ -d "$chapter/examples" ] && echo "✓ examples" || echo "✗ examples"
  [ -d "$chapter/code" ] && echo "✓ code" || echo "✗ code"
  [ -d "$chapter/exercises" ] && echo "✓ exercises" || echo "✗ exercises"
done
```

---

## PDF Generation (T098)

### Approach

Using Docusaurus export features for PDF generation.

### Method 1: Browser Print to PDF

**Steps**:
1. Build site: `npm run build`
2. Serve site: `npm run serve`
3. Navigate to chapter
4. Use browser print (Ctrl+P / Cmd+P)
5. Select "Save as PDF"
6. Adjust print settings:
   - Remove headers/footers
   - Set margins to minimal
   - Enable background graphics

**Pros**: Simple, no additional tools
**Cons**: Manual process, limited styling control

### Method 2: docusaurus-prince-pdf (Recommended for Production)

**Installation**:
```bash
cd textbook
npm install docusaurus-prince-pdf --save-dev
```

**Configuration** (in `docusaurus.config.js`):
```javascript
plugins: [
  [
    'docusaurus-prince-pdf',
    {
      printMode: 'pdf',
      outputPath: './textbook-complete.pdf',
    },
  ],
],
```

**Usage**:
```bash
npm run build
# PDF generated in build/textbook-complete.pdf
```

**Note**: Requires Prince XML (commercial license for production use)

### Method 3: Puppeteer Script

For free PDF generation:

```javascript
// scripts/generate-pdf.js
const puppeteer = require('puppeteer');

async function generatePDF() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const chapters = [
    'http://localhost:3000/docs/textbook/chapter-01',
    'http://localhost:3000/docs/textbook/chapter-02',
    'http://localhost:3000/docs/textbook/chapter-03',
    'http://localhost:3000/docs/textbook/chapter-04',
  ];

  for (let i = 0; i < chapters.length; i++) {
    await page.goto(chapters[i], { waitUntil: 'networkidle0' });
    await page.pdf({
      path: `textbook-chapter-${i + 1}.pdf`,
      format: 'A4',
      printBackground: true,
    });
  }

  await browser.close();
}

generatePDF();
```

---

## UX Testing (T102)

### Testing Process

Conduct user experience testing with target audience (beginner to intermediate robotics learners).

### Test Scenarios

#### Scenario 1: First-Time User Navigation

**Objective**: User can find and understand content structure

**Tasks**:
1. Visit textbook homepage
2. Find table of contents
3. Identify chapter progression
4. Locate learning guide

**Success Criteria**:
- User completes tasks in < 3 minutes
- No confusion about chapter order
- User finds learning path guidance

#### Scenario 2: Content Accessibility

**Objective**: User with varying technical backgrounds can find appropriate content

**Tasks**:
1. Assess current skill level using difficulty guide
2. Find beginner/intermediate/advanced content
3. Locate prerequisites for a chapter
4. Navigate using learning style guide

**Success Criteria**:
- User accurately assesses skill level
- Finds appropriate content for their level
- Understands prerequisites

#### Scenario 3: Code Example Usage

**Objective**: User can find, understand, and use code examples

**Tasks**:
1. Find ROS2 code example
2. Understand what the code does
3. Identify how to run the code
4. Locate related concepts

**Success Criteria**:
- User finds code in < 2 minutes
- Comprehends purpose of code
- Knows how to run example

### Feedback Collection

**Methods**:
- User testing sessions (5-10 users)
- Feedback forms
- Analytics (if available)
- Accessibility testing with diverse users

**Metrics to Track**:
- Time to complete tasks
- Navigation paths taken
- Error rates
- Satisfaction ratings
- Accessibility barriers encountered

---

## Deployment

### GitHub Pages Deployment (T104)

#### Prerequisites

- GitHub repository configured
- GitHub Pages enabled in repository settings
- Branch set to deploy from: `main` or `gh-pages`

#### Deployment Configuration

**In `docusaurus.config.js`**:

```javascript
module.exports = {
  title: 'AI/Spec-Driven Textbook for Physical AI & Humanoid Robotics',
  tagline: 'Learn Physical AI and Humanoid Robotics through Spec-Driven Development',
  url: 'https://asfarahmed.github.io',
  baseUrl: '/humanoid-robotics/',
  organizationName: 'asfarahmed',
  projectName: 'humanoid-robotics',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  // ... rest of config
};
```

#### Manual Deployment

```bash
cd textbook

# Set Git credentials (if needed)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Deploy to GitHub Pages
npm run deploy
```

#### Automated Deployment (GitHub Actions)

**Create `.github/workflows/deploy.yml`**:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
    paths:
      - 'textbook/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'

      - name: Install dependencies
        run: |
          cd textbook
          npm ci

      - name: Build website
        run: |
          cd textbook
          npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./textbook/build
```

#### Verification

After deployment:
1. Visit `https://asfarahmed.github.io/humanoid-robotics/`
2. Verify all chapters load
3. Test navigation
4. Test search functionality
5. Check mobile responsiveness

---

## Quality Assurance (T106)

### Final QA Checklist

#### Content Quality

- [ ] All 4 chapters complete with 5-file structure
- [ ] 3-5 learning outcomes per chapter
- [ ] 2-4 examples per chapter
- [ ] 3-5 diagrams per chapter
- [ ] 2-3 code examples per chapter
- [ ] 3-5 exercises per chapter
- [ ] 3,000-5,000 words per chapter

#### Technical Accuracy

- [ ] All code examples tested and working
- [ ] Concepts reviewed by SME
- [ ] No factual errors
- [ ] Citations for advanced claims
- [ ] Consistent terminology

#### Accessibility

- [ ] All images have alt text
- [ ] Heading hierarchy correct
- [ ] Links are descriptive
- [ ] Color not only indicator
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

#### User Experience

- [ ] Clear navigation
- [ ] Logical chapter progression
- [ ] Difficulty levels indicated
- [ ] Prerequisites documented
- [ ] Learning paths defined
- [ ] Search functionality works

#### Performance

- [ ] Site loads in < 3 seconds
- [ ] Images optimized
- [ ] Lighthouse score > 90
- [ ] Mobile responsive

#### Deployment

- [ ] Builds without errors
- [ ] GitHub Pages deploys successfully
- [ ] All links work (no 404s)
- [ ] Search indexes properly

### Acceptance Testing

**Final Checklist**:
1. ✅ Build succeeds: `npm run build`
2. ✅ Local serve works: `npm run serve`
3. ✅ All chapters accessible
4. ✅ Search returns results
5. ✅ Mobile view works
6. ✅ Code examples tested
7. ✅ Accessibility audit passes
8. ✅ Performance benchmarks met
9. ✅ GitHub Pages deployment successful
10. ✅ User testing feedback incorporated

---

## Maintenance Schedule

### Regular Updates

**Weekly**:
- Monitor for broken links
- Check search functionality
- Review user feedback (if available)

**Monthly**:
- Update dependencies: `npm update`
- Review code examples for library updates
- Check for outdated technical content

**Quarterly**:
- Full accessibility audit
- Performance testing
- SME review of technical content
- User testing session

**Annually**:
- Major content review
- Framework version updates (Docusaurus)
- Comprehensive quality audit

---

## Contact & Support

**Project Maintainer**: (Add contact info)
**Repository**: https://github.com/asfarahmed/humanoid-robotics
**Issues**: https://github.com/asfarahmed/humanoid-robotics/issues

---

**Document Version**: 1.0
**Last Reviewed**: 2025-12-12
**Next Review**: 2026-01-12
