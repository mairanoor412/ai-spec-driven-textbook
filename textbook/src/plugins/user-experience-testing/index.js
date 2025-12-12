/**
 * Docusaurus plugin for user experience testing and feedback collection
 * This plugin adds user feedback forms and testing surveys to textbook pages
 */

module.exports = function(context, options) {
  return {
    name: 'user-experience-testing',

    // Inject feedback forms and testing elements
    injectHtmlTags() {
      return {
        headTags: [
          // Add any necessary CSS or meta tags for user experience testing
          {
            tagName: 'style',
            innerHTML: `
              /* Feedback button styling */
              .feedback-trigger-button {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                padding: 12px 16px;
                background-color: #2E8B57;
                color: white;
                border: none;
                border-radius: 50px;
                cursor: pointer;
                font-size: 14px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
              }

              .feedback-trigger-button:hover {
                background-color: #246a44;
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
              }

              .feedback-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
              }

              .feedback-modal.active {
                opacity: 1;
                visibility: visible;
              }

              .feedback-modal-content {
                background-color: white;
                padding: 2rem;
                border-radius: 8px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                transform: translateY(20px);
                transition: transform 0.3s ease;
              }

              .feedback-modal.active .feedback-modal-content {
                transform: translateY(0);
              }

              .feedback-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
              }

              .feedback-modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
              }

              .feedback-modal-close:hover {
                color: #333;
              }

              /* User experience metrics tracking */
              .ux-metrics-bar {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 4px;
                background-color: #2E8B57;
                z-index: 1001;
                transform-origin: left;
                transform: scaleX(0);
                transition: transform 0.3s ease;
              }

              .ux-metrics-bar.active {
                transform: scaleX(1);
              }
            `
          }
        ],
        preBodyTags: [],
        postBodyTags: [
          // Add feedback trigger button
          {
            tagName: 'button',
            innerHTML: 'Feedback',
            attributes: {
              className: 'feedback-trigger-button',
              id: 'feedback-trigger',
              'aria-label': 'Open feedback form'
            }
          },
          // Add modal for feedback form
          {
            tagName: 'div',
            innerHTML: `
              <div class="feedback-modal-content">
                <div class="feedback-modal-header">
                  <h3>Textbook Feedback</h3>
                  <button class="feedback-modal-close" id="feedback-close">&times;</button>
                </div>
                <div id="feedback-form-container">
                  <!-- Feedback form will be dynamically loaded here -->
                  <p>Loading feedback form...</p>
                </div>
              </div>
            `,
            attributes: {
              className: 'feedback-modal',
              id: 'feedback-modal'
            }
          },
          // Add UX metrics bar
          {
            tagName: 'div',
            attributes: {
              className: 'ux-metrics-bar',
              id: 'ux-metrics-bar'
            }
          },
          // Add UX tracking script
          {
            tagName: 'script',
            innerHTML: `
              // User experience testing and feedback functionality
              document.addEventListener('DOMContentLoaded', function() {
                const feedbackTrigger = document.getElementById('feedback-trigger');
                const feedbackModal = document.getElementById('feedback-modal');
                const feedbackClose = document.getElementById('feedback-close');

                // Toggle feedback modal
                feedbackTrigger.addEventListener('click', function() {
                  feedbackModal.classList.add('active');
                  document.body.style.overflow = 'hidden';
                });

                feedbackClose.addEventListener('click', function() {
                  feedbackModal.classList.remove('active');
                  document.body.style.overflow = '';
                });

                // Close modal when clicking outside content
                feedbackModal.addEventListener('click', function(e) {
                  if (e.target === feedbackModal) {
                    feedbackModal.classList.remove('active');
                    document.body.style.overflow = '';
                  }
                });

                // Track user engagement metrics
                let startTime = Date.now();
                let scrollDepth = 0;
                let timeOnPage = 0;

                // Track scroll depth
                window.addEventListener('scroll', function() {
                  const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
                  scrollDepth = Math.max(scrollDepth, scrollPercent);
                });

                // Track time on page
                setInterval(function() {
                  timeOnPage = Math.round((Date.now() - startTime) / 1000);
                }, 1000);

                // Track clicks and interactions
                document.addEventListener('click', function(e) {
                  // Could log user interactions for UX analysis
                  if (window.gtag) {
                    window.gtag('event', 'interaction', {
                      'event_category': 'UX_Testing',
                      'event_label': window.location.pathname,
                      'value': 1
                    });
                  }
                });

                // Track page visibility for time calculation
                document.addEventListener('visibilitychange', function() {
                  if (document.hidden) {
                    // Page is hidden - stop tracking time
                    startTime = Date.now() - (timeOnPage * 1000);
                  } else {
                    // Page is visible again - resume tracking
                    startTime = Date.now() - (timeOnPage * 1000);
                  }
                });

                // Track when user leaves page
                window.addEventListener('beforeunload', function() {
                  if (window.gtag) {
                    window.gtag('event', 'page_engagement', {
                      'event_category': 'UX_Testing',
                      'event_label': window.location.pathname,
                      'custom_parameter_time_on_page': timeOnPage,
                      'custom_parameter_scroll_depth': scrollDepth
                    });
                  }
                });

                // Activate UX metrics bar
                setTimeout(() => {
                  const metricsBar = document.getElementById('ux-metrics-bar');
                  if (metricsBar) {
                    metricsBar.classList.add('active');
                  }
                }, 1000);
              });
            `
          }
        ]
      };
    },

    // Extend webpack configuration to handle React components for feedback
    configureWebpack(config, isServer, utils) {
      if (!isServer) {
        // Add support for React components if needed
        return {
          resolve: {
            alias: {
              '@feedback': config.resolve.alias['@site/src/components/UserFeedbackForm'],
              '@survey': config.resolve.alias['@site/src/components/UserTestingSurvey']
            }
          }
        };
      }
      return {};
    }
  };
};