---
title: 'Chapter State Management'
description: 'Process for managing chapter states from draft to published in the textbook'
---

# Chapter State Management

## Overview

This document defines the workflow for managing chapters through different states: Draft → Review → Approved → Published. This ensures proper quality control and tracking of content development.

## State Definitions

### 1. Draft (DRAFT)
- **Status**: `draft`
- **Description**: Initial content creation phase
- **Access**: Authors and editors only
- **Characteristics**:
  - Content is incomplete or in-progress
  - May contain placeholders and TODOs
  - Not ready for review
- **Actions Required**: Content creation, initial editing

### 2. Review (REVIEW)
- **Status**: `review`
- **Description**: Content is ready for review
- **Access**: Authors, editors, and reviewers
- **Characteristics**:
  - Content is complete but not yet verified
  - Ready for peer and SME review
  - May require revisions based on feedback
- **Actions Required**: Peer review, SME review, feedback incorporation

### 3. Approved (APPROVED)
- **Status**: `approved`
- **Description**: Content has passed all reviews
- **Access**: All team members
- **Characteristics**:
  - All feedback has been addressed
  - Technical accuracy verified
  - Ready for publication
- **Actions Required**: Final quality check, preparation for publishing

### 4. Published (PUBLISHED)
- **Status**: `published`
- **Description**: Content is live in the textbook
- **Access**: Public (with version control)
- **Characteristics**:
  - Available to students
  - Version-controlled for updates
  - Monitored for issues
- **Actions Required**: Deployment, monitoring, maintenance

## State Transition Process

### DRAFT → REVIEW
- [ ] All content sections are completed
- [ ] Initial self-review completed by author
- [ ] All major placeholders filled
- [ ] Basic formatting applied
- [ ] Ready for peer review

**Trigger**: Author marks chapter ready for review

### REVIEW → APPROVED
- [ ] Peer review completed with approval
- [ ] SME review completed with approval
- [ ] All feedback incorporated
- [ ] Content verification checklist passed
- [ ] Final editing completed

**Trigger**: Review process completed successfully

### APPROVED → PUBLISHED
- [ ] Final quality assurance passed
- [ ] Automated build validation passed
- [ ] Deployment process initiated
- [ ] Post-publication checks completed

**Trigger**: Deployment process initiated

## Tracking Template

Each chapter should include state tracking information in its frontmatter:

```yaml
title: 'Chapter X: [Title]'
description: '[Description]'
tags: [physical-ai, robotics, humanoid]
state: draft | review | approved | published
state-changes:
  - status: draft
    date: YYYY-MM-DD
    by: Author Name
    notes: Initial creation
  - status: review
    date: YYYY-MM-DD
    by: Reviewer Name
    notes: Ready for peer review
  - status: approved
    date: YYYY-MM-DD
    by: SME Name
    notes: Technical accuracy verified
  - status: published
    date: YYYY-MM-DD
    by: Publisher Name
    notes: Deployed to production
```

## State Management Tools

### Git Branch Strategy
- `draft/chapter-X` for draft content
- `review/chapter-X` for review-ready content
- `approved/chapter-X` for approved content
- `main` branch for published content

### Issue Tracking
- Use GitHub Issues or similar tool to track state changes
- Assign reviewers and SMEs to specific chapters
- Track feedback and required changes

### Automation
- Automated checks for state transitions
- Notifications when state changes occur
- Validation of content before state advancement

## Quality Gates

### Draft to Review
- [ ] All template sections completed
- [ ] Minimum word count met (3,000-5,000 words)
- [ ] At least one example included
- [ ] At least one exercise included

### Review to Approved
- [ ] Peer review completed (score ≥ 4/5)
- [ ] SME review completed (score ≥ 4/5)
- [ ] All critical feedback addressed
- [ ] Content verification checklist 100% complete

### Approved to Published
- [ ] Build process successful
- [ ] All links and references validated
- [ ] Accessibility checks passed
- [ ] Mobile responsiveness verified

## Roles and Responsibilities

- **Author**: Creates content, manages draft state
- **Peer Reviewer**: Reviews content quality and clarity
- **Subject Matter Expert (SME)**: Verifies technical accuracy
- **Editor**: Manages state transitions and quality gates
- **Publisher**: Manages publication process