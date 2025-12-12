/**
 * Docusaurus plugin for PDF generation
 * This plugin adds functionality to generate a printable/PDF version of the textbook
 */

module.exports = function(context, options) {
  return {
    name: 'pdf-generator',

    // Inject CSS for print styling and the print header component
    injectHtmlTags() {
      return {
        headTags: [
          // Print-specific CSS
          {
            tagName: 'style',
            innerHTML: `
              @media print {
                /* Hide navigation elements */
                .navbar,
                .menu,
                .theme-edit-this-page,
                .theme-last-updated,
                .pagination-nav,
                .theme-admonition,
                .footer,
                .button,
                .social-links,
                .sidebar,
                .table-of-contents,
                .theme-doc-sidebar-container,
                .theme-doc-footer,
                .theme-back-to-top-button,
                .theme-tags-container,
                .theme-code-block-buttons {
                  display: none !important;
                }

                /* Adjust content for printing */
                .container,
                .row,
                .col {
                  width: 100% !important;
                  max-width: none !important;
                  margin: 0 !important;
                  padding: 0 !important;
                }

                /* Adjust main content area */
                .main-wrapper,
                .theme-doc-markdown,
                .markdown {
                  width: 100% !important;
                  max-width: 100% !important;
                  margin: 0 !important;
                  padding: 0.5in !important;
                  box-sizing: border-box;
                }

                /* Typography adjustments for print */
                body {
                  font-family: 'Times New Roman', Times, serif !important;
                  font-size: 12pt !important;
                  line-height: 1.6 !important;
                  color: #000 !important;
                  background: #fff !important;
                }

                h1, h2, h3, h4, h5, h6 {
                  page-break-after: avoid;
                  page-break-inside: avoid;
                  color: #000 !important;
                  margin: 1.5em 0 0.5em 0 !important;
                }

                h1 {
                  font-size: 24pt !important;
                  margin-top: 0 !important;
                }

                h2 {
                  font-size: 20pt !important;
                }

                h3 {
                  font-size: 16pt !important;
                }

                p, div, li {
                  color: #000 !important;
                  font-size: 12pt !important;
                  line-height: 1.6 !important;
                }

                /* Code blocks for print */
                .prism-code,
                code {
                  background-color: #f5f5f5 !important;
                  border: 1px solid #ccc !important;
                  font-family: 'Courier New', Courier, monospace !important;
                  font-size: 10pt !important;
                  line-height: 1.4 !important;
                }

                /* Tables for print */
                table {
                  width: 100% !important;
                  border-collapse: collapse !important;
                  font-size: 10pt !important;
                }

                th, td {
                  border: 1px solid #000 !important;
                  padding: 6px !important;
                  vertical-align: top !important;
                }

                /* Images for print */
                img {
                  max-width: 100% !important;
                  height: auto !important;
                  page-break-inside: avoid !important;
                }

                /* Links for print */
                a {
                  color: #000 !important;
                  text-decoration: underline !important;
                }

                a[href]:after {
                  content: " (" attr(href) ") ";
                  font-size: 9pt;
                  word-break: break-all;
                }

                /* Page breaks */
                .page-break-before {
                  page-break-before: always;
                }

                .page-break-after {
                  page-break-after: always;
                }

                .no-page-break {
                  page-break-inside: avoid;
                }

                /* Page margins and size */
                @page {
                  margin: 0.5in;
                  size: A4;
                }

                /* Adjust for better print layout */
                .container {
                  width: 100% !important;
                  max-width: none !important;
                  padding: 0 !important;
                }

                /* Print header styling */
                #print-friendly-header {
                  display: block !important;
                  margin-bottom: 20mm !important;
                  border-bottom: 2px solid #2E8B57 !important;
                  padding-bottom: 10mm !important;
                }

                #print-friendly-header .mainTitle {
                  font-family: 'Times New Roman', Times, serif !important;
                  font-size: 24pt !important;
                  color: #000 !important;
                  margin: 0 !important;
                  text-align: center !important;
                  line-height: 1.3 !important;
                }

                #print-friendly-header .divider {
                  border: none !important;
                  border-top: 1px solid #ccc !important;
                  margin: 15pt 0 !important;
                }

                #print-friendly-header .printInfo {
                  display: flex !important;
                  justify-content: space-between !important;
                  font-size: 10pt !important;
                  margin-top: 5mm !important;
                  color: #666 !important;
                }

                #print-friendly-header .copyright {
                  margin-top: 10mm !important;
                  text-align: center !important;
                  font-size: 9pt !important;
                  color: #666 !important;
                }
              }

              /* Print preview button styling */
              .print-preview-button {
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 1000;
                padding: 10px 15px;
                background-color: #2E8B57;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                display: none;
              }

              @media screen {
                .print-preview-button {
                  display: block;
                }
              }
            `
          },
          // Script to add print functionality and page numbering
          {
            tagName: 'script',
            innerHTML: `
              // Add print functionality to the page
              window.addEventListener('load', function() {
                // Create print button
                const printButton = document.createElement('button');
                printButton.className = 'print-preview-button';
                printButton.textContent = 'Print Version';
                printButton.onclick = function() {
                  window.print();
                };

                // Add to page
                document.body.appendChild(printButton);

                // Add keyboard shortcut for print (Ctrl/Cmd + P)
                document.addEventListener('keydown', function(e) {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                    e.preventDefault();
                    window.print();
                  }
                });

                // Calculate page numbers for print
                function updatePageNumbers() {
                  // For print preview, we'll set page numbers dynamically
                  const pageNumberSpans = document.querySelectorAll('.pageNumber');
                  const totalPagesSpans = document.querySelectorAll('.totalPages');

                  // In a real implementation, we'd calculate actual page numbers
                  // For now, we'll use a placeholder approach
                  pageNumberSpans.forEach(span => {
                    span.textContent = '1'; // Will be updated when printing
                  });

                  totalPagesSpans.forEach(span => {
                    span.textContent = 'X'; // Will be updated when printing
                  });
                }

                // Update page numbers when printing
                window.matchMedia('print').addListener(function(mql) {
                  if (mql.matches) {
                    updatePageNumbers();
                  }
                });

                // Initial update
                updatePageNumbers();
              });
            `
          }
        ],
        preBodyTags: [
          // Inject the print header as HTML
          {
            tagName: 'div',
            innerHTML: `
              <div id="print-friendly-header" style="display: none;">
                <h1 class="mainTitle">AI/Spec-Driven Textbook for Physical AI & Humanoid Robotics</h1>
                <hr class="divider" />
                <div class="printInfo">
                  <p>Date Printed: <span id="printDate"></span></p>
                  <p>Page: <span class="pageNumber"></span> of <span class="totalPages"></span></p>
                </div>
                <div class="copyright">
                  <p>© <span id="currentYear"></span> AI/Spec-Driven Textbook for Physical AI & Humanoid Robotics. All rights reserved.</p>
                </div>
              </div>
              <script>
                // Set dynamic content for the print header
                document.getElementById('printDate').textContent = new Date().toLocaleDateString();
                document.getElementById('currentYear').textContent = new Date().getFullYear();
              </script>
            `,
            attributes: {}
          }
        ],
        postBodyTags: []
      };
    },

    // Extend webpack configuration if needed
    configureWebpack(config, isServer, utils) {
      // No special webpack configuration needed for print/PDF
      return {};
    }
  };
};