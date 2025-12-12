/**
 * Technical accuracy verification script for the AI/Spec-Driven Textbook
 * This script performs automated checks to verify technical accuracy of content
 */

const fs = require('fs');
const path = require('path');

class TechnicalAccuracyVerifier {
  constructor(docsPath) {
    this.docsPath = docsPath;
    this.issues = [];
  }

  // Check for common technical accuracy issues
  async verifyAllChapters() {
    console.log('Starting technical accuracy verification...');

    // Check all chapter directories
    const chapterDirs = fs.readdirSync(this.docsPath).filter(dir =>
      dir.startsWith('chapter-') && fs.statSync(path.join(this.docsPath, dir)).isDirectory()
    );

    for (const chapterDir of chapterDirs) {
      const chapterPath = path.join(this.docsPath, chapterDir);
      await this.verifyChapter(chapterPath, chapterDir);
    }

    this.generateReport();
    return this.issues.length === 0;
  }

  async verifyChapter(chapterPath, chapterName) {
    console.log(`\nVerifying chapter: ${chapterName}`);

    // Check all files in the chapter
    const files = fs.readdirSync(chapterPath);

    for (const file of files) {
      const filePath = path.join(chapterPath, file);
      if (file.endsWith('.md') || file.endsWith('.mdx')) {
        await this.verifyFile(filePath, chapterName, file);
      }
    }
  }

  async verifyFile(filePath, chapterName, fileName) {
    console.log(`  Checking file: ${fileName}`);

    const content = fs.readFileSync(filePath, 'utf8');

    // Check for technical accuracy issues
    this.checkCodeSyntax(content, filePath, chapterName, fileName);
    this.checkTerminologyConsistency(content, filePath, chapterName, fileName);
    this.checkMathematicalFormulas(content, filePath, chapterName, fileName);
    this.checkLinks(content, filePath, chapterName, fileName);
    this.checkImageReferences(content, filePath, chapterName, fileName);
    this.checkCitations(content, filePath, chapterName, fileName);
  }

  checkCodeSyntax(content, filePath, chapterName, fileName) {
    // Check for common code syntax issues
    const codeBlocks = content.match(/```[\s\S]*?```/g) || [];

    for (const codeBlock of codeBlocks) {
      // Check for common syntax errors in different languages
      if (codeBlock.includes('```python')) {
        this.checkPythonSyntax(codeBlock, filePath, chapterName, fileName);
      } else if (codeBlock.includes('```javascript') || codeBlock.includes('```js')) {
        this.checkJavaScriptSyntax(codeBlock, filePath, chapterName, fileName);
      } else if (codeBlock.includes('```bash') || codeBlock.includes('```shell')) {
        this.checkBashSyntax(codeBlock, filePath, chapterName, fileName);
      }
    }
  }

  checkPythonSyntax(codeBlock, filePath, chapterName, fileName) {
    // Basic Python syntax checks
    if (codeBlock.includes('print ')) { // Python 2 style print statement
      this.issues.push({
        type: 'style',
        severity: 'medium',
        file: filePath,
        chapter: chapterName,
        message: `Python 2 style print statement found in ${fileName}. Consider using Python 3 syntax: print()`,
        codeBlock: codeBlock.substring(0, 100) + '...'
      });
    }

    if (codeBlock.includes('xrange')) {
      this.issues.push({
        type: 'deprecation',
        severity: 'high',
        file: filePath,
        chapter: chapterName,
        message: `xrange function is deprecated in Python 3. Use range() instead in ${fileName}`,
        codeBlock: codeBlock.substring(0, 100) + '...'
      });
    }
  }

  checkJavaScriptSyntax(codeBlock, filePath, chapterName, fileName) {
    // Basic JavaScript syntax checks
    if (codeBlock.includes('var ') && !codeBlock.includes('let ') && !codeBlock.includes('const ')) {
      this.issues.push({
        type: 'style',
        severity: 'medium',
        file: filePath,
        chapter: chapterName,
        message: `Using var instead of let/const in JavaScript. Modern JS prefers let/const in ${fileName}`,
        codeBlock: codeBlock.substring(0, 100) + '...'
      });
    }
  }

  checkBashSyntax(codeBlock, filePath, chapterName, fileName) {
    // Basic Bash syntax checks
    if (codeBlock.includes('sudo rm -rf /')) {
      this.issues.push({
        type: 'safety',
        severity: 'critical',
        file: filePath,
        chapter: chapterName,
        message: `Dangerous command 'sudo rm -rf /' found in ${fileName}. This could be destructive.`,
        codeBlock: codeBlock.substring(0, 100) + '...'
      });
    }
  }

  checkTerminologyConsistency(content, filePath, chapterName, fileName) {
    // Check for consistent terminology
    const terminologyIssues = [];

    // Check for inconsistent AI/ML terminology
    if (content.toLowerCase().includes('machine learning') && content.toLowerCase().includes('ml')) {
      // If both forms are used, check if they're used consistently
      const mlCount = (content.match(/\bml\b/gi) || []).length;
      const fullCount = (content.match(/\bmachine learning\b/gi) || []).length;

      if (mlCount > 0 && fullCount > 0) {
        terminologyIssues.push('Mixed use of "ML" and "machine learning"');
      }
    }

    // Check for inconsistent robotics terminology
    // First, count "humanoid robot" and "humanoid robots" occurrences (case insensitive)
    const humanoidRobotRegex = /\bhumanoid\s+robot(s)?\b/gi;
    const humanoidRobotMatches = content.match(humanoidRobotRegex) || [];
    const humanoidRobotCount = humanoidRobotMatches.length;

    // Count all "humanoid" occurrences (standalone)
    const allHumanoidRegex = /\bhumanoid\b/gi;
    const allHumanoidMatches = content.match(allHumanoidRegex) || [];

    // Count how many "humanoid" instances are actually part of "humanoid robot" phrases
    // We need to be more precise - count overlapping occurrences properly
    let actualStandaloneCount = 0;

    // Find all positions of "humanoid" and check if they're followed by " robot"
    const allHumanoidPositions = [];
    const tempRegex = /\bhumanoid\b/gi;
    let tempMatch;

    while ((tempMatch = tempRegex.exec(content)) !== null) {
      allHumanoidPositions.push(tempMatch.index);
    }

    // For each "humanoid" match, check if it's part of a "humanoid robot" phrase
    for (const position of allHumanoidPositions) {
      const followingText = content.substr(position, 20); // Check next 20 chars

      // If this "humanoid" is followed by " robot", it's part of the phrase
      if (/^humanoid\s+robot/i.test(followingText)) {
        // This one is part of "humanoid robot", so don't count it as standalone
        continue;
      } else {
        // This is a standalone "humanoid"
        actualStandaloneCount++;
      }
    }

    if (actualStandaloneCount > 0 && humanoidRobotCount > 0) {
      terminologyIssues.push(`Mixed use of standalone "humanoid" (${actualStandaloneCount} times) and "humanoid robot" (${humanoidRobotCount} times)`);
    }

    terminologyIssues.forEach(issue => {
      this.issues.push({
        type: 'terminology',
        severity: 'low',
        file: filePath,
        chapter: chapterName,
        message: `${issue} in ${fileName}`,
        context: issue
      });
    });
  }

  checkMathematicalFormulas(content, filePath, chapterName, fileName) {
    // Check for common mathematical notation issues
    const mathPatterns = [
      /\\frac\{[^}]+\}\{[^}]+\}/g, // LaTeX fractions
      /\$\$[\s\S]*?\$\$/, // Double dollar math blocks
      /\$[^$]+\$/g // Inline math
    ];

    for (const pattern of mathPatterns) {
      const matches = content.match(pattern) || [];
      for (const match of matches) {
        // Check for common math errors
        if (match.includes('0/0') || match.includes('\\frac{0}{0}')) {
          this.issues.push({
            type: 'math',
            severity: 'high',
            file: filePath,
            chapter: chapterName,
            message: `Indeterminate form 0/0 found in mathematical expression in ${fileName}`,
            formula: match
          });
        }
      }
    }
  }

  checkLinks(content, filePath, chapterName, fileName) {
    // Check for broken internal links
    const linkMatches = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];

    for (const link of linkMatches) {
      const url = link.match(/\(([^)]+)\)/)[1];

      if (url.startsWith('./') || url.startsWith('../')) {
        // Internal link - check if target exists
        const relativePath = path.join(path.dirname(filePath), url);
        if (!fs.existsSync(relativePath) && !url.includes('#')) {
          this.issues.push({
            type: 'broken-link',
            severity: 'high',
            file: filePath,
            chapter: chapterName,
            message: `Broken internal link in ${fileName}: ${url}`,
            link: link
          });
        }
      }
    }
  }

  checkImageReferences(content, filePath, chapterName, fileName) {
    // Check for missing image files
    const imageMatches = content.match(/!\[([^\]]*)\]\(([^)]+)\)/g) || [];

    for (const image of imageMatches) {
      const imagePath = image.match(/\(([^)]+)\)/)[1];

      if (imagePath.startsWith('./') || imagePath.startsWith('../')) {
        const relativePath = path.join(path.dirname(filePath), imagePath);
        if (!fs.existsSync(relativePath)) {
          this.issues.push({
            type: 'missing-image',
            severity: 'high',
            file: filePath,
            chapter: chapterName,
            message: `Missing image file in ${fileName}: ${imagePath}`,
            image: image
          });
        }
      }
    }
  }

  checkCitations(content, filePath, chapterName, fileName) {
    // Check for proper citation format
    const citationPatterns = [
      /\[@[^\]]+\]/g, // [@cite]
      /\[.*?]\s*\(.*?\.pdf\)/gi // [Description](reference.pdf)
    ];

    for (const pattern of citationPatterns) {
      const matches = content.match(pattern) || [];
      for (const match of matches) {
        // Check if citations follow proper format
        if (match.includes('[see also]') || match.includes('[citation needed]')) {
          this.issues.push({
            type: 'citation',
            severity: 'medium',
            file: filePath,
            chapter: chapterName,
            message: `Incomplete citation found in ${fileName}: ${match}`,
            citation: match
          });
        }
      }
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('TECHNICAL ACCURACY VERIFICATION REPORT');
    console.log('='.repeat(60));

    if (this.issues.length === 0) {
      console.log('✅ No technical accuracy issues found!');
    } else {
      console.log(`⚠️  Found ${this.issues.length} potential issues:`);

      const groupedIssues = this.groupIssuesBySeverity();

      for (const [severity, issues] of Object.entries(groupedIssues)) {
        if (issues.length > 0) {
          console.log(`\n${severity.toUpperCase()} ISSUES (${issues.length}):`);
          console.log('-'.repeat(40));

          for (const issue of issues) {
            console.log(`File: ${path.relative(this.docsPath, issue.file)}`);
            console.log(`Chapter: ${issue.chapter}`);
            console.log(`Issue: ${issue.message}`);
            if (issue.codeBlock) {
              console.log(`Code: ${issue.codeBlock}`);
            }
            console.log('');
          }
        }
      }
    }

    console.log('='.repeat(60));
  }

  groupIssuesBySeverity() {
    const grouped = {
      critical: [],
      high: [],
      medium: [],
      low: []
    };

    for (const issue of this.issues) {
      grouped[issue.severity].push(issue);
    }

    return grouped;
  }
}

// Run verification if this script is executed directly
if (require.main === module) {
  const docsPath = path.join(__dirname, '..', '..', 'docs', 'textbook');

  if (fs.existsSync(docsPath)) {
    const verifier = new TechnicalAccuracyVerifier(docsPath);
    verifier.verifyAllChapters()
      .then(success => {
        process.exit(success ? 0 : 1);
      })
      .catch(err => {
        console.error('Error during verification:', err);
        process.exit(1);
      });
  } else {
    console.error(`Docs path does not exist: ${docsPath}`);
    process.exit(1);
  }
}

module.exports = TechnicalAccuracyVerifier;