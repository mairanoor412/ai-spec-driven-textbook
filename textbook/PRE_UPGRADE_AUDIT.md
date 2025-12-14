# Pre-Upgrade Audit - Docusaurus 2.0.0-beta.6 → 3.x

**Date**: 2025-12-13
**Project**: AI/Spec-Driven Textbook for Physical AI & Humanoid Robotics
**Purpose**: Document current state before upgrading to Docusaurus 3.x, React 18, and Node.js 18+

## Current Package Versions

### Core Dependencies

| Package | Current Version | Target Version |
|---------|----------------|----------------|
| @docusaurus/core | 2.0.0-beta.6 | 3.x (latest stable) |
| @docusaurus/preset-classic | 2.0.0-beta.6 | 3.x (latest stable) |
| @docusaurus/theme-search-algolia | 2.0.0-beta.6 | 3.x (latest stable) or local search |
| react | ^17.0.1 | ^18.0.0 |
| react-dom | ^17.0.1 | ^18.0.0 |
| @mdx-js/react | ^1.6.21 | ^3.0.0 (for Docusaurus 3.x) |

### Supporting Dependencies

| Package | Current Version | Notes |
|---------|----------------|-------|
| prism-react-renderer | ^1.2.1 | May need update for Docusaurus 3.x |
| clsx | ^1.1.1 | Utility library, likely compatible |
| remark-code-import | 0.2.0 | May need update for MDX v3 |
| @svgr/webpack | ^5.5.0 | Webpack loader, check compatibility |
| file-loader | ^6.2.0 | Webpack loader, check compatibility |
| url-loader | ^4.1.1 | Webpack loader, check compatibility |

## Current Plugins Identified

### Presets

1. **@docusaurus/preset-classic** (2.0.0-beta.6)
   - Includes: docs, blog, theme-classic
   - Configuration: Custom sidebar, remark plugins, custom CSS
   - Status: Active

### Themes

- **Search theme**: Currently disabled (line 49-52 in docusaurus.config.js)
  - Comment: "Search plugin temporarily disabled due to dependency conflicts"
  - TODO note: "Re-enable after upgrading Docusaurus to version 3.x"
  - **ACTION REQUIRED**: Re-enable search with Docusaurus 3.x compatible plugin (T127-T132)

### Plugins

- **Custom plugins**: Currently disabled (line 53-55)
  - `'./src/plugins/offline-reading'` - Disabled due to click overlay issue
  - Status: Commented out

### Notable Configuration

- **Prism**: Code syntax highlighting with GitHub light theme and Dracula dark theme
- **Navbar**: Custom navigation with textbook links
- **Footer**: Custom footer with resources and links
- **Docs**:
  - Route base path: `/docs`
  - Sidebar collapsible: true
  - Edit URL configured
  - Remark plugins: Empty array (ready for additions)

## Build Scripts

```json
{
  "start": "docusaurus start",
  "dev": "docusaurus start --port 3000",
  "build": "docusaurus build",
  "build:textbook": "docusaurus build --out-dir build/textbook",
  "serve": "docusaurus serve",
  "validate": "node scripts/validate-build.js",
  "prebuild": "npm run validate"
}
```

## Node.js Version

- Current: Unknown (to be verified)
- Required: 18.0+ for Docusaurus 3.x

## Content Files

- Location: `docs/` directory
- Format: Markdown (.md) and MDX (.mdx)
- Chapters: 4 chapters with modular structure
- Assets: Images in `docs/assets/`

## Configuration Files

1. **docusaurus.config.js** - Main configuration
2. **sidebars.js** or **sidebar.js** - Sidebar configuration
3. **package.json** - Dependencies and scripts

## Backup Strategy

- Git checkpoint: Tag before upgrade
- Local backup: Directory snapshot
- Content validation: Checksum comparison

## Upgrade Constraints

✅ **MUST PRESERVE**:
- All MD/MDX content files (byte-for-byte)
- All images and assets
- All code examples
- All exercises

❌ **DO NOT MODIFY**:
- Chapter content
- Visual materials
- Code examples within chapters
- Exercise definitions

✔️ **ALLOWED TO CHANGE**:
- package.json dependencies
- docusaurus.config.js configuration
- Plugin configurations
- Build scripts
- Deployment settings

## Pre-Upgrade Checklist

- [x] T107: Document current package versions (this file)
- [x] T108: Identify all Docusaurus plugins in use (documented above)
- [x] T109: Create Git checkpoint/tag (tag: pre-docusaurus-upgrade)
- [x] T110: Verify all content files committed (0 uncommitted files in textbook/docs/)
- [x] T111: Create backup/snapshot (created: .backups/textbook-pre-upgrade-20251213-111642.tar.gz - 6.0M)
- [x] T112: Run baseline validation tests (build succeeded - log: baseline-build-output.log)

## Baseline Build Results

**Status**: ✅ **SUCCESS**

**Output**: Generated static files in "build"

**Warnings**: Some broken links warnings (onBrokenLinks: 'warn' in config)

**Build completed successfully** - ready to proceed with upgrade
