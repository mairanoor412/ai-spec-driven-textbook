# Docusaurus Upgrade Log

**Date**: 2025-12-13
**Upgrade**: Docusaurus 2.0.0-beta.6 → 3.6.3
**Related**: React 17 → 18, Node.js requirement 18.0+

## Dependency Changes

### Core Framework

| Package | Old Version | New Version | Change Type |
|---------|-------------|-------------|-------------|
| @docusaurus/core | 2.0.0-beta.6 | ^3.6.3 | Major upgrade |
| @docusaurus/preset-classic | 2.0.0-beta.6 | ^3.6.3 | Major upgrade |
| react | ^17.0.1 | ^18.3.1 | Major upgrade |
| react-dom | ^17.0.1 | ^18.3.1 | Major upgrade |

### MDX and Rendering

| Package | Old Version | New Version | Change Type |
|---------|-------------|-------------|-------------|
| @mdx-js/react | ^1.6.21 | ^3.0.0 | Major upgrade (MDX v1 → v3) |
| prism-react-renderer | ^1.2.1 | ^2.4.0 | Major upgrade |

### Utilities

| Package | Old Version | New Version | Change Type |
|---------|-------------|-------------|-------------|
| clsx | ^1.1.1 | ^2.1.1 | Major upgrade |

### Removed Packages

| Package | Old Version | Reason |
|---------|-------------|--------|
| @docusaurus/theme-search-algolia | 2.0.0-beta.6 | Will be replaced with local search plugin |
| @svgr/webpack | ^5.5.0 | Handled by Docusaurus 3.x internally |
| file-loader | ^6.2.0 | Handled by Docusaurus 3.x internally |
| url-loader | ^4.1.1 | Handled by Docusaurus 3.x internally |
| remark-code-import | 0.2.0 | Not needed / incompatible with MDX v3 |

### Added Packages

| Package | Version | Purpose |
|---------|---------|---------|
| @docusaurus/module-type-aliases | ^3.6.3 | TypeScript support |
| @docusaurus/tsconfig | ^3.6.3 | TypeScript configuration |
| @docusaurus/types | ^3.6.3 | TypeScript type definitions |

## Breaking Changes

### 1. MDX v1 → v3
- Updated from @mdx-js/react v1.6.21 to v3.0.0
- May require syntax updates in .mdx files (to be validated)

### 2. React 17 → 18
- Automatic batching enabled
- Concurrent features available
- No code changes required for Docusaurus usage

### 3. Webpack Loaders
- file-loader, url-loader, @svgr/webpack removed
- Asset handling now managed by Docusaurus 3.x internally
- No configuration changes needed

### 4. Search Plugin
- Old: @docusaurus/theme-search-algolia (disabled due to conflicts)
- New: Will install local search plugin separately (T127-T132)

## Migration Steps Completed

- [x] T113: Verified Node.js 23.1.0 (>= 18.0 required)
- [x] T114: Updated Docusaurus core packages to 3.6.3
- [x] T115: Updated React to 18.3.1
- [x] T116: Run npm install (SUCCESS - 1,277 packages, 0 vulnerabilities)
- [x] T117: Address peer dependency conflicts (cleaned node_modules, fresh install)
- [x] T118: Updated/removed plugins for 3.x compatibility
- [x] T119: Documented changes (this file)

## Installation Results

**npm install output**:
- Packages added: 1,277
- Vulnerabilities: 0
- Time: 6 minutes
- Exit code: 0 (success)
- Log: npm-install-clean.log

## Configuration Migration Completed

- [x] T120: Reviewed Docusaurus v3 migration guide
- [x] T121: Updated docusaurus.config.js syntax for v3
  - Updated JSDoc type annotations: `Config` instead of `DocusaurusConfig`
  - Updated prism-react-renderer imports to use `themes` export
  - Changed preset reference from `'@docusaurus/preset-classic'` to `'classic'`
  - Added proper module.exports pattern
- [x] T122: Migrated plugin configurations to v3 API (preset-classic)
- [x] T123: Updated theme configuration (prism themes)
- [x] T124: Updated sidebars.js for v3 compatibility
  - Added TypeScript type annotations
  - Updated to modern export pattern
- [x] T125: Build scripts verified (already v3 compatible)
- [x] T126: Deployment configuration verified (GitHub Pages settings correct)

## Search Plugin Re-enablement Completed

- [x] T127: Researched Docusaurus 3.x-compatible search plugins
  - Selected: @easyops-cn/docusaurus-search-local
  - Rationale: Privacy-friendly, zero setup, sufficient for 4 chapters
- [x] T128: Installed local search plugin (21 packages, 0 vulnerabilities)
- [x] T129: Configured search plugin in docusaurus.config.js
  - Enabled result highlighting
  - English language support
  - Docs-only indexing
  - Explicit search result paths
- [ ] T130-T132: Test search functionality (will test during build validation)

## Next Steps

1. Run build validation and test all features (T133-T141)
2. Validate content preservation (T142-T147)
3. Deploy and test (T148-T155)
4. Document completion (T156-T162)

## Rollback Plan

If upgrade fails:
1. `git checkout textbook/package.json`
2. `npm install`
3. Or restore from backup: `.backups/textbook-pre-upgrade-20251213-111642.tar.gz`
4. Or revert to tag: `git checkout pre-docusaurus-upgrade`
