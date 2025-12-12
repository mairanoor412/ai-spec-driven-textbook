/**
 * Docusaurus plugin for accessibility enhancements
 * This plugin adds accessibility improvements to the textbook
 */

module.exports = function(context, options) {
  return {
    name: 'accessibility-enhancer',

    // Inject accessibility-related scripts and styles
    injectHtmlTags() {
      return {
        headTags: [
          // Add accessibility-related meta tags
          {
            tagName: 'meta',
            attributes: {
              name: 'viewport',
              content: 'width=device-width, initial-scale=1.0, maximum-scale=5.0'
            }
          },
          // Add accessibility CSS
          {
            tagName: 'style',
            innerHTML: `
              /* Accessibility improvements */

              /* Focus indicators */
              a:focus,
              button:focus,
              input:focus,
              select:focus,
              textarea:focus,
              [tabindex]:focus {
                outline: 3px solid #2E8B57;
                outline-offset: 2px;
              }

              /* High contrast mode support */
              @media (prefers-contrast: high) {
                * {
                  border-color: CanvasText !important;
                }

                a,
                button,
                input[type="button"],
                input[type="submit"],
                input[type="reset"] {
                  border: 2px solid !important;
                }
              }

              /* Reduced motion support */
              @media (prefers-reduced-motion: reduce) {
                * {
                  animation-duration: 0.01ms !important;
                  animation-iteration-count: 1 !important;
                  transition-duration: 0.01ms !important;
                }
              }

              /* Screen reader only content */
              .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
              }

              /* Skip to content link */
              .skip-link {
                position: absolute;
                top: -40px;
                left: 6px;
                background: #2E8B57;
                color: white;
                padding: 8px;
                text-decoration: none;
                border-radius: 0 0 4px 4px;
                z-index: 1000;
              }

              .skip-link:focus {
                top: 0;
              }

              /* Better focus management for keyboard users */
              .keyboard-navigation :focus {
                outline: 3px solid #2E8B57;
                outline-offset: 2px;
              }

              /* Semantic heading structure */
              h1, h2, h3, h4, h5, h6 {
                margin-top: 1.5em;
                margin-bottom: 0.5em;
              }

              /* Better color contrast */
              body {
                color: #000;
                background-color: #fff;
              }

              a {
                color: #2E8B57;
              }

              /* Ensure images have appropriate alt text handling */
              img[alt=""] {
                border: 1px dashed #ccc;
              }

              /* Better table accessibility */
              table {
                border-collapse: collapse;
                width: 100%;
              }

              th, td {
                border: 1px solid #666;
                padding: 8px;
                text-align: left;
              }

              th {
                background-color: #f5f5f5;
                font-weight: bold;
              }

              /* Better form accessibility */
              label {
                display: inline-block;
                margin-bottom: 0.5em;
              }

              input,
              select,
              textarea {
                font-size: 16px;
                padding: 8px;
              }

              /* Responsive typography */
              @media (max-width: 768px) {
                h1 { font-size: 1.8rem; }
                h2 { font-size: 1.6rem; }
                h3 { font-size: 1.4rem; }
                h4 { font-size: 1.2rem; }
                body { font-size: 1rem; }
              }
            `
          }
        ],
        preBodyTags: [
          // Add skip to content link for screen readers
          {
            tagName: 'a',
            innerHTML: 'Skip to content',
            attributes: {
              href: '#skip-to-content',
              className: 'skip-link',
              'aria-label': 'Skip to main content'
            }
          }
        ],
        postBodyTags: [
          // Add accessibility script
          {
            tagName: 'script',
            innerHTML: `
              // Accessibility enhancements
              document.addEventListener('DOMContentLoaded', function() {
                // Add keyboard navigation class to body when using keyboard
                let isUsingKeyboard = false;

                document.addEventListener('keydown', function(e) {
                  if (e.key === 'Tab') {
                    isUsingKeyboard = true;
                    document.body.classList.add('keyboard-navigation');
                  }
                });

                document.addEventListener('mousedown', function() {
                  isUsingKeyboard = false;
                  document.body.classList.remove('keyboard-navigation');
                });

                // Enhance semantic structure
                const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
                headings.forEach((heading, index) => {
                  if (!heading.id) {
                    heading.id = 'heading-' + index;
                  }
                });

                // Add aria-labels to navigation elements
                const navElements = document.querySelectorAll('nav a, .navbar a, .sidebar a');
                navElements.forEach(link => {
                  if (!link.getAttribute('aria-label') && link.textContent.trim()) {
                    link.setAttribute('aria-label', link.textContent.trim());
                  }
                });

                // Add landmark roles
                const main = document.querySelector('main');
                if (main) {
                  main.setAttribute('role', 'main');
                }

                // Add language attribute if not present
                const html = document.querySelector('html');
                if (html && !html.getAttribute('lang')) {
                  html.setAttribute('lang', 'en');
                }

                // Enhance form accessibility
                const inputs = document.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                  if (!input.hasAttribute('aria-describedby') && input.id) {
                    const associatedLabel = document.querySelector('label[for="' + input.id + '"]');
                    if (associatedLabel) {
                      input.setAttribute('aria-labelledby', input.id + '-label');
                    }
                  }
                });

                // Add table headers associations
                const tables = document.querySelectorAll('table');
                tables.forEach(table => {
                  const headers = table.querySelectorAll('th');
                  const rows = table.querySelectorAll('tr');

                  rows.forEach((row, rowIndex) => {
                    const cells = row.querySelectorAll('th, td');
                    cells.forEach((cell, cellIndex) => {
                      if (rowIndex > 0 && headers[cellIndex]) {
                        cell.setAttribute('headers', headers[cellIndex].id || 'header-' + cellIndex);
                      }
                    });
                  });
                });
              });
            `
          }
        ]
      };
    },

    // Extend webpack configuration if needed
    configureWebpack(config, isServer, utils) {
      // No special webpack configuration needed for accessibility
      return {};
    }
  };
};