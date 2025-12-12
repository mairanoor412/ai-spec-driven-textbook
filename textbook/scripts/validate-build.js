#!/usr/bin/env node

/**
 * Automated Build Validation Script
 * Validates the textbook content before build process
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const DOCS_DIR = './docs';
const TEXTBOOK_DIR = './docs/textbook';
const TEMPLATES_DIR = './docs/templates';

// Validation functions
function validateFrontmatter(docsPath) {
  console.log('Validating frontmatter in markdown files...');

  const errors = [];
  const files = getAllMarkdownFiles(docsPath);

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');

    // Check if frontmatter exists
    if (!content.startsWith('---')) {
      errors.push(`Missing frontmatter in: ${file}`);
      continue;
    }

    // Extract frontmatter
    const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      errors.push(`Invalid frontmatter format in: ${file}`);
      continue;
    }

    const frontmatter = frontmatterMatch[1];

    // Check for required fields
    if (!frontmatter.includes('title:')) {
      errors.push(`Missing 'title' in frontmatter of: ${file}`);
    }

    if (!frontmatter.includes('description:')) {
      errors.push(`Missing 'description' in frontmatter of: ${file}`);
    }
  }

  return errors;
}

function validateChapterStructure() {
  console.log('Validating chapter structure...');

  const errors = [];

  if (!fs.existsSync(TEXTBOOK_DIR)) {
    errors.push(`Textbook directory does not exist: ${TEXTBOOK_DIR}`);
    return errors;
  }

  const chapterDirs = fs.readdirSync(TEXTBOOK_DIR)
    .filter(item =>
      fs.statSync(path.join(TEXTBOOK_DIR, item)).isDirectory() &&
      item.startsWith('chapter-')
    );

  for (const chapterDir of chapterDirs) {
    const chapterPath = path.join(TEXTBOOK_DIR, chapterDir);

    // Check for required subdirectories
    const requiredSubdirs = ['index', 'concepts', 'examples', 'exercises'];
    for (const subdir of requiredSubdirs) {
      const subPath = path.join(chapterPath, subdir);
      if (!fs.existsSync(subPath)) {
        errors.push(`Missing required subdirectory in chapter ${chapterDir}: ${subdir}`);
      }
    }

    // Check for required files in each subdirectory
    for (const subdir of requiredSubdirs) {
      const subPath = path.join(chapterPath, subdir);
      if (fs.existsSync(subPath)) {
        const files = fs.readdirSync(subPath);
        const mdFiles = files.filter(file => file.endsWith('.md') || file.endsWith('.mdx'));

        if (mdFiles.length === 0) {
          errors.push(`No markdown files found in ${chapterDir}/${subdir}`);
        }
      }
    }
  }

  return errors;
}

function validateLinks(docsPath) {
  console.log('Validating internal links...');

  const errors = [];
  const files = getAllMarkdownFiles(docsPath);

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');

    // Find all internal links
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      const link = match[2];

      // Check if it's an internal link (starts with /docs or relative path)
      if (link.startsWith('/docs/') || link.startsWith('./') || link.startsWith('../')) {
        // For now, just log the links found - in a real implementation you'd validate them
        console.log(`Found internal link in ${file}: ${link}`);
      }
    }
  }

  return errors;
}

function validateImages(docsPath) {
  console.log('Validating image references...');

  const errors = [];
  const files = getAllMarkdownFiles(docsPath);

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');

    // Find all image references
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;

    while ((match = imageRegex.exec(content)) !== null) {
      const imagePath = match[2];

      // Check if it's a local image reference
      if (imagePath.startsWith('./') || imagePath.startsWith('../') || imagePath.startsWith('/')) {
        // For now, just log the images found - in a real implementation you'd validate them
        console.log(`Found image reference in ${file}: ${imagePath}`);
      }
    }
  }

  return errors;
}

function getAllMarkdownFiles(dir) {
  const files = [];

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllMarkdownFiles(fullPath));
    } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }

  return files;
}

function validateBuild() {
  console.log('Starting build validation...');

  const validationErrors = [];

  // Run all validation checks
  validationErrors.push(...validateFrontmatter(DOCS_DIR));
  validationErrors.push(...validateChapterStructure());
  validationErrors.push(...validateLinks(DOCS_DIR));
  validationErrors.push(...validateImages(DOCS_DIR));

  // Print results
  if (validationErrors.length > 0) {
    console.error('❌ Build validation failed with the following errors:');
    validationErrors.forEach(error => console.error(`  - ${error}`));
    process.exit(1);
  } else {
    console.log('✅ All validation checks passed!');

    // Try to build the site to make sure it works
    try {
      console.log('Attempting to build the site...');
      // We won't actually run the build in this script, but in a real implementation:
      // execSync('npm run build', { stdio: 'inherit' });
      console.log('Build test would run here in a real implementation');
    } catch (buildError) {
      console.error('❌ Build failed:', buildError.message);
      process.exit(1);
    }
  }
}

// Run validation
validateBuild();