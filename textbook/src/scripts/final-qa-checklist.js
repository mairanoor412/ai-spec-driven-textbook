/**
 * Final Quality Assurance and Acceptance Testing Script
 * This script performs comprehensive testing of the AI/Spec-Driven Textbook
 */

const fs = require('fs');
const path = require('path');

class FinalQATester {
  constructor(docsPath) {
    this.docsPath = docsPath;
    this.results = {
      passed: [],
      failed: [],
      skipped: []
    };
  }

  async runAllTests() {
    console.log('🚀 Starting Final Quality Assurance and Acceptance Testing...\n');

    // Run all test categories
    await this.testContentStructure();
    await this.testNavigation();
    await this.testAccessibility();
    await this.testPerformance();
    await this.testFunctionality();
    await this.testContentAccuracy();
    await this.testCrossReferences();
    await this.testMedia();

    this.generateReport();
    return this.results.failed.length === 0;
  }

  async testContentStructure() {
    console.log('📋 Testing Content Structure...');

    const chapterDirs = fs.readdirSync(this.docsPath).filter(dir =>
      dir.startsWith('chapter-') && fs.statSync(path.join(this.docsPath, dir)).isDirectory()
    );

    for (const chapterDir of chapterDirs) {
      const chapterPath = path.join(this.docsPath, chapterDir);
      const requiredSections = ['index', 'concepts', 'examples', 'exercises'];

      for (const section of requiredSections) {
        const sectionPath = path.join(chapterPath, section);
        if (!fs.existsSync(sectionPath)) {
          this.results.failed.push({
            test: `Content Structure`,
            description: `Missing section '${section}' in chapter ${chapterDir}`,
            severity: 'critical'
          });
        } else {
          const mdFiles = fs.readdirSync(sectionPath).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
          if (mdFiles.length === 0) {
            this.results.failed.push({
              test: `Content Structure`,
              description: `No content files in section '${section}' of chapter ${chapterDir}`,
              severity: 'high'
            });
          } else {
            this.results.passed.push({
              test: `Content Structure`,
              description: `Section '${section}' exists with ${mdFiles.length} files in chapter ${chapterDir}`,
              severity: 'info'
            });
          }
        }
      }
    }

    console.log('✅ Content Structure tests completed\n');
  }

  async testNavigation() {
    console.log('🧭 Testing Navigation...');

    // Check if sidebars.js exists and has proper structure
    const sidebarPath = path.join(__dirname, '..', '..', 'sidebars.js');
    if (!fs.existsSync(sidebarPath)) {
      this.results.failed.push({
        test: `Navigation`,
        description: `sidebars.js file does not exist`,
        severity: 'critical'
      });
    } else {
      try {
        const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');
        if (!sidebarContent.includes('textbook')) {
          this.results.failed.push({
            test: `Navigation`,
            description: `Textbook navigation not found in sidebars.js`,
            severity: 'high'
          });
        } else {
          this.results.passed.push({
            test: `Navigation`,
            description: `Navigation structure exists`,
            severity: 'info'
          });
        }
      } catch (error) {
        this.results.failed.push({
          test: `Navigation`,
          description: `Error reading sidebars.js: ${error.message}`,
          severity: 'critical'
        });
      }
    }

    console.log('✅ Navigation tests completed\n');
  }

  async testAccessibility() {
    console.log('♿ Testing Accessibility...');

    // Check for accessibility features
    const configPath = path.join(__dirname, '..', '..', 'docusaurus.config.js');
    const configContent = fs.readFileSync(configPath, 'utf8');

    // Check for accessibility-related plugins
    if (configContent.includes('accessibility-enhancer')) {
      this.results.passed.push({
        test: `Accessibility`,
        description: `Accessibility enhancement plugin is enabled`,
        severity: 'info'
      });
    } else {
      this.results.failed.push({
        test: `Accessibility`,
        description: `Accessibility enhancement plugin is not enabled`,
        severity: 'high'
      });
    }

    // Check for alt text patterns in content
    const allMdFiles = this.getAllMarkdownFiles();
    let totalImages = 0;
    let imagesWithAlt = 0;

    for (const file of allMdFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const imageMatches = content.match(/!\[([^\]]*)\]\([^)]+\)/g) || [];
      totalImages += imageMatches.length;

      for (const match of imageMatches) {
        const altText = match.match(/!\[([^\]]*)\]/)[1];
        if (altText && altText.trim() !== '') {
          imagesWithAlt++;
        }
      }
    }

    if (totalImages > 0) {
      const altPercentage = (imagesWithAlt / totalImages) * 100;
      if (altPercentage >= 90) {
        this.results.passed.push({
          test: `Accessibility`,
          description: `Images have alt text (${imagesWithAlt}/${totalImages}, ${altPercentage.toFixed(1)}%)`,
          severity: 'info'
        });
      } else {
        this.results.failed.push({
          test: `Accessibility`,
          description: `Too many images without alt text (${imagesWithAlt}/${totalImages}, ${altPercentage.toFixed(1)}%)`,
          severity: 'medium'
        });
      }
    }

    console.log('✅ Accessibility tests completed\n');
  }

  async testPerformance() {
    console.log('⚡ Testing Performance...');

    // Check for performance optimization plugins
    const configPath = path.join(__dirname, '..', '..', 'docusaurus.config.js');
    const configContent = fs.readFileSync(configPath, 'utf8');

    if (configContent.includes('performance-optimizer')) {
      this.results.passed.push({
        test: `Performance`,
        description: `Performance optimization plugin is enabled`,
        severity: 'info'
      });
    } else {
      this.results.failed.push({
        test: `Performance`,
        description: `Performance optimization plugin is not enabled`,
        severity: 'medium'
      });
    }

    console.log('✅ Performance tests completed\n');
  }

  async testFunctionality() {
    console.log('⚙️  Testing Functionality...');

    // Check for all custom plugins
    const configPath = path.join(__dirname, '..', '..', 'docusaurus.config.js');
    const configContent = fs.readFileSync(configPath, 'utf8');

    const requiredPlugins = [
      'progressive-loader',
      'offline-reading',
      'pdf-generator',
      'accessibility-enhancer',
      'performance-optimizer',
      'user-experience-testing'
    ];

    for (const plugin of requiredPlugins) {
      if (configContent.includes(plugin)) {
        this.results.passed.push({
          test: `Functionality`,
          description: `Plugin '${plugin}' is enabled`,
          severity: 'info'
        });
      } else {
        this.results.failed.push({
          test: `Functionality`,
          description: `Plugin '${plugin}' is not enabled`,
          severity: 'high'
        });
      }
    }

    console.log('✅ Functionality tests completed\n');
  }

  async testContentAccuracy() {
    console.log('🔍 Testing Content Accuracy...');

    // Run the technical accuracy verification script
    try {
      const { execSync } = require('child_process');
      // Run from the textbook directory, path is relative to that
      const result = execSync('node src/scripts/verify-technical-accuracy.js', {
        cwd: path.join(__dirname, '..', '..'), // Go from src/scripts/ to textbook/
        encoding: 'utf8'
      });

      if (!result.includes('✅ No technical accuracy issues found!')) {
        this.results.failed.push({
          test: `Content Accuracy`,
          description: `Technical accuracy verification found issues`,
          severity: 'high'
        });
      } else {
        this.results.passed.push({
          test: `Content Accuracy`,
          description: `Technical accuracy verification passed`,
          severity: 'info'
        });
      }
    } catch (error) {
      this.results.failed.push({
        test: `Content Accuracy`,
        description: `Technical accuracy verification failed: ${error.message}`,
        severity: 'critical'
      });
    }

    console.log('✅ Content Accuracy tests completed\n');
  }

  async testCrossReferences() {
    console.log('🔗 Testing Cross-References...');

    // Check for cross-references between chapters
    const allMdFiles = this.getAllMarkdownFiles();
    let totalCrossRefs = 0;
    let validCrossRefs = 0;

    for (const file of allMdFiles) {
      const content = fs.readFileSync(file, 'utf8');
      // Look for potential cross-reference patterns (markdown links with chapter)
      const crossRefMatches = content.match(/\[.*?\]\(.*?chapter.*?\)/g) || [];
      totalCrossRefs += crossRefMatches.length;

      // Also look for Docusaurus component references that link to other chapters
      const componentRefMatches = content.match(/prevChapter=\{\{path:\s*'[^']*chapter[^']*'/g) || [];
      totalCrossRefs += componentRefMatches.length;

      const nextChapterRefMatches = content.match(/nextChapter=\{\{path:\s*'[^']*chapter[^']*'/g) || [];
      totalCrossRefs += nextChapterRefMatches.length;

      // Look for text references to other chapters
      const textRefMatches = content.match(/\*\*Chapter \d+.*?\*\*/g) || [];
      totalCrossRefs += textRefMatches.length;

      // For now, just count them - in a real test we'd validate the references
      validCrossRefs += crossRefMatches.length + componentRefMatches.length + nextChapterRefMatches.length + textRefMatches.length;
    }

    if (totalCrossRefs > 0) {
      this.results.passed.push({
        test: `Cross-References`,
        description: `Found ${totalCrossRefs} cross-references`,
        severity: 'info'
      });
    } else {
      this.results.failed.push({
        test: `Cross-References`,
        description: `No cross-references found`,
        severity: 'medium'
      });
    }

    console.log('✅ Cross-Reference tests completed\n');
  }

  async testMedia() {
    console.log('🖼️  Testing Media Files...');

    // Check for image references and verify they exist
    const allMdFiles = this.getAllMarkdownFiles();
    let totalImages = 0;
    let existingImages = 0;

    for (const file of allMdFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const imageMatches = content.match(/!\[([^\]]*)\]\(([^)]+)\)/g) || [];

      for (const match of imageMatches) {
        totalImages++;
        const imagePath = match.match(/\(([^)]+)\)/)[1];

        if (imagePath.startsWith('./') || imagePath.startsWith('../')) {
          const fullPath = path.join(path.dirname(file), imagePath);
          if (fs.existsSync(fullPath)) {
            existingImages++;
          }
        } else if (imagePath.startsWith('/')) {
          const fullPath = path.join(__dirname, '..', '..', 'static', imagePath);
          if (fs.existsSync(fullPath)) {
            existingImages++;
          }
        }
      }
    }

    if (totalImages > 0) {
      const existingPercentage = (existingImages / totalImages) * 100;
      if (existingPercentage >= 95) {
        this.results.passed.push({
          test: `Media`,
          description: `Images exist (${existingImages}/${totalImages}, ${existingPercentage.toFixed(1)}%)`,
          severity: 'info'
        });
      } else {
        this.results.failed.push({
          test: `Media`,
          description: `Missing images (${existingImages}/${totalImages}, ${existingPercentage.toFixed(1)}%)`,
          severity: 'high'
        });
      }
    }

    console.log('✅ Media tests completed\n');
  }

  getAllMarkdownFiles() {
    const files = [];
    const walkDir = (dir) => {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // Only include textbook content, not other docs
          const dirName = path.basename(fullPath);
          if (dirName.startsWith('chapter-') || dirName === 'textbook' ||
              dirName === 'index' || dirName === 'concepts' ||
              dirName === 'examples' || dirName === 'exercises') {
            walkDir(fullPath);
          }
        } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
          // Only include files from the textbook directory
          if (fullPath.includes(path.join('docs', 'textbook'))) {
            files.push(fullPath);
          }
        }
      }
    };

    walkDir(this.docsPath);
    return files;
  }

  generateReport() {
    console.log('='.repeat(60));
    console.log('FINAL QUALITY ASSURANCE AND ACCEPTANCE TESTING REPORT');
    console.log('='.repeat(60));

    console.log(`\n📊 Test Results Summary:`);
    console.log(`✅ Passed: ${this.results.passed.length}`);
    console.log(`❌ Failed: ${this.results.failed.length}`);
    console.log(`⏭️  Skipped: ${this.results.skipped.length}`);
    console.log(`Total: ${this.results.passed.length + this.results.failed.length + this.results.skipped.length}`);

    if (this.results.failed.length > 0) {
      console.log(`\n🚨 FAILED TESTS:`);
      console.log('-'.repeat(40));

      const groupedBySeverity = {};
      for (const test of this.results.failed) {
        if (!groupedBySeverity[test.severity]) {
          groupedBySeverity[test.severity] = [];
        }
        groupedBySeverity[test.severity].push(test);
      }

      for (const [severity, tests] of Object.entries(groupedBySeverity)) {
        console.log(`\n${severity.toUpperCase()} ISSUES:`);
        for (const test of tests) {
          console.log(`  • ${test.description}`);
        }
      }
    }

    if (this.results.passed.length > 0) {
      console.log(`\n✅ PASSED TESTS:`);
      console.log('-'.repeat(40));

      // Group passed tests by category
      const passedByCategory = {};
      for (const test of this.results.passed) {
        if (!passedByCategory[test.test]) {
          passedByCategory[test.test] = [];
        }
        passedByCategory[test.test].push(test);
      }

      for (const [category, tests] of Object.entries(passedByCategory)) {
        console.log(`\n${category}:`);
        console.log(`  ${tests.length} tests passed`);
      }
    }

    console.log('\n' + '='.repeat(60));

    if (this.results.failed.length === 0) {
      console.log('🎉 ALL TESTS PASSED! The textbook is ready for acceptance.');
    } else {
      console.log('⚠️  Some tests failed. Please address the issues before final acceptance.');
    }
    console.log('='.repeat(60));
  }
}

// Run QA tests if this script is executed directly
if (require.main === module) {
  const docsPath = path.join(__dirname, '..', '..', 'docs', 'textbook');

  if (fs.existsSync(docsPath)) {
    const tester = new FinalQATester(docsPath);
    tester.runAllTests()
      .then(success => {
        process.exit(success ? 0 : 1);
      })
      .catch(err => {
        console.error('Error during QA testing:', err);
        process.exit(1);
      });
  } else {
    console.error(`Docs path does not exist: ${docsPath}`);
    process.exit(1);
  }
}

module.exports = FinalQATester;