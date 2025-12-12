/**
 * Docusaurus plugin for progressive content loading
 * This plugin helps optimize loading of large chapters by implementing
 * progressive loading techniques and performance optimizations
 */

module.exports = function(context, options) {
  return {
    name: 'progressive-loader',

    // Add custom scripts for progressive loading
    injectHtmlTags() {
      return {
        headTags: [
          // Preload critical resources
          {
            tagName: 'link',
            attributes: {
              rel: 'preload',
              href: '/css/custom.css',
              as: 'style'
            }
          },
          // Add performance monitoring
          {
            tagName: 'script',
            innerHTML: `
              // Performance monitoring for content loading
              window.addEventListener('load', function() {
                if ('performance' in window) {
                  const perfData = performance.getEntriesByType('navigation')[0];
                  console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart);
                }
              });

              // Lazy loading for images
              document.addEventListener('DOMContentLoaded', function() {
                const images = document.querySelectorAll('img[data-src]');
                const imageObserver = new IntersectionObserver((entries, observer) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      const img = entry.target;
                      img.src = img.dataset.src;
                      img.classList.remove('lazy');
                      imageObserver.unobserve(img);
                    }
                  });
                });

                images.forEach(img => imageObserver.observe(img));
              });
            `
          }
        ],
        preBodyTags: [],
        postBodyTags: [
          // Add a script to handle progressive content loading
          {
            tagName: 'script',
            innerHTML: `
              // Progressive content loading implementation
              class ProgressiveContentLoader {
                constructor() {
                  this.chunkSize = 1000; // Number of characters to load per chunk
                  this.currentChunk = 0;
                  this.contentChunks = [];
                  this.isInitialized = false;
                }

                // Initialize progressive loading for large content sections
                init() {
                  if (this.isInitialized) return;

                  // Find large content containers
                  const largeContentSections = document.querySelectorAll('.markdown > div:has(> p)');
                  largeContentSections.forEach((section, index) => {
                    if (section.textContent.length > 2000) { // If content is large
                      this.setupProgressiveLoading(section, index);
                    }
                  });

                  this.isInitialized = true;
                }

                // Set up progressive loading for a content section
                setupProgressiveLoading(section, index) {
                  const content = section.innerHTML;
                  const chunks = this.splitContentIntoChunks(content, this.chunkSize);

                  // Hide the original content initially
                  section.style.display = 'none';

                  // Create a container for progressive loading
                  const container = document.createElement('div');
                  container.id = \`progressive-content-\${index}\`;
                  container.className = 'progressive-content';

                  // Add loading indicator
                  const loadingIndicator = document.createElement('div');
                  loadingIndicator.className = 'loading-indicator';
                  loadingIndicator.innerHTML = 'Loading content...';
                  container.appendChild(loadingIndicator);

                  // Add the container to the page
                  section.parentNode.insertBefore(container, section);

                  // Start loading content progressively
                  this.loadChunks(container, chunks);
                }

                // Split content into chunks for progressive loading
                splitContentIntoChunks(content, chunkSize) {
                  const chunks = [];
                  for (let i = 0; i < content.length; i += chunkSize) {
                    chunks.push(content.substring(i, i + chunkSize));
                  }
                  return chunks;
                }

                // Load content chunks progressively
                loadChunks(container, chunks) {
                  let currentChunk = 0;
                  const contentContainer = document.createElement('div');
                  contentContainer.className = 'progressive-content-container';

                  const loadNextChunk = () => {
                    if (currentChunk < chunks.length) {
                      contentContainer.innerHTML += chunks[currentChunk];
                      currentChunk++;

                      // Update progress indicator
                      const progress = Math.round((currentChunk / chunks.length) * 100);
                      const indicator = container.querySelector('.loading-indicator');
                      if (indicator) {
                        indicator.textContent = \`Loading content... \${progress}%\`;
                      }

                      // Continue loading after a short delay to allow rendering
                      setTimeout(loadNextChunk, 50);
                    } else {
                      // Remove loading indicator and show content
                      const indicator = container.querySelector('.loading-indicator');
                      if (indicator) {
                        indicator.remove();
                      }

                      container.appendChild(contentContainer);
                    }
                  };

                  loadNextChunk();
                }
              }

              // Initialize progressive loading when page is ready
              document.addEventListener('DOMContentLoaded', function() {
                const loader = new ProgressiveContentLoader();
                loader.init();
              });
            `
          }
        ],
      };
    },

    // Extend the webpack configuration for performance
    configureWebpack(config, isServer, utils) {
      return {
        optimization: {
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              // Separate vendor libraries
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
              },
              // Separate common components
              common: {
                minChunks: 2,
                priority: 10,
              },
            },
          },
        },
      };
    },
  };
};