/**
 * Docusaurus plugin for performance optimization
 * This plugin implements various performance optimizations to improve site speed and loading times
 */

module.exports = function(context, options) {
  const { siteConfig } = context;

  return {
    name: 'performance-optimizer',

    // Configure webpack for performance optimizations
    configureWebpack(config, isServer, utils) {
      const { getJSMinimizer, getCSSMinimizer } = utils;

      const isProd = process.env.NODE_ENV === 'production';

      const performanceConfig = {};

      if (isProd) {
        // Performance optimizations for production builds
        performanceConfig.optimization = {
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              // Separate vendor code from application code
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
                priority: 10,
                maxSize: 244000, // ~244KB
              },
              // Separate common components
              common: {
                name: 'common',
                minChunks: 2,
                chunks: 'all',
                priority: 5,
                maxSize: 244000, // ~244KB
              },
            },
          },
          // Enable module concatenation for better runtime performance
          concatenateModules: true,
          // Enable scope hoisting
          providedExports: true,
          usedExports: true,
          sideEffects: true,
        };

        // Add performance hints
        performanceConfig.performance = {
          maxAssetSize: 250000, // 250KB
          maxEntrypointSize: 250000, // 250KB
          hints: 'warning',
        };
      }

      return performanceConfig;
    },

    // Inject performance-related scripts and optimizations
    injectHtmlTags() {
      return {
        headTags: [
          // Preconnect to external resources
          {
            tagName: 'link',
            attributes: {
              rel: 'preconnect',
              href: 'https://fonts.googleapis.com',
            },
          },
          {
            tagName: 'link',
            attributes: {
              rel: 'preconnect',
              href: 'https://fonts.gstatic.com',
              crossOrigin: 'anonymous',
            },
          },
          // Preload critical resources
          {
            tagName: 'link',
            attributes: {
              rel: 'preload',
              href: '/assets/css/main.css',
              as: 'style',
            },
          },
          // Resource hints for performance
          {
            tagName: 'link',
            attributes: {
              rel: 'dns-prefetch',
              href: '//www.google-analytics.com',
            },
          },
          // Performance monitoring script
          {
            tagName: 'script',
            innerHTML: `
              // Performance monitoring
              window.addEventListener('load', function() {
                if ('performance' in window) {
                  // Measure core web vitals
                  const measureCoreWebVitals = () => {
                    // First Contentful Paint (FCP)
                    new PerformanceObserver((entryList) => {
                      for (const entry of entryList.getEntries()) {
                        if (window.gtag) {
                          window.gtag('event', 'web_vital', {
                            event_category: 'Performance',
                            event_label: 'FCP',
                            value: Math.round(entry.startTime),
                          });
                        }
                      }
                    }).observe({entryTypes: ['paint']});

                    // Largest Contentful Paint (LCP)
                    new PerformanceObserver((entryList) => {
                      for (const entry of entryList.getEntries()) {
                        if (window.gtag) {
                          window.gtag('event', 'web_vital', {
                            event_category: 'Performance',
                            event_label: 'LCP',
                            value: Math.round(entry.startTime),
                          });
                        }
                      }
                    }).observe({entryTypes: ['largest-contentful-paint']});

                    // First Input Delay (FID) / Interaction to Next Paint (INP)
                    new PerformanceObserver((entryList) => {
                      for (const entry of entryList.getEntries()) {
                        if (window.gtag) {
                          window.gtag('event', 'web_vital', {
                            event_category: 'Performance',
                            event_label: 'FID',
                            value: Math.round(entry.processingStart - entry.startTime),
                          });
                        }
                      }
                    }).observe({entryTypes: ['first-input']});
                  };

                  measureCoreWebVitals();
                }

                // Performance timing
                const perfData = {
                  pageLoadTime: Math.round(performance.timing.loadEventEnd - performance.timing.navigationStart),
                  domContentLoaded: Math.round(performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart),
                  firstPaint: performance.timing.responseStart - performance.timing.requestStart,
                };

                // Log performance data (in a real app, you might send this to an analytics service)
                console.log('Performance Metrics:', perfData);
              });
            `,
          },
          // Lazy loading for images
          {
            tagName: 'script',
            innerHTML: `
              // Lazy load images
              document.addEventListener('DOMContentLoaded', function() {
                const images = document.querySelectorAll('img[data-src]');
                const imageObserver = new IntersectionObserver((entries, observer) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      const img = entry.target;
                      img.src = img.dataset.src;
                      img.removeAttribute('data-src');
                      imageObserver.unobserve(img);
                    }
                  });
                });

                images.forEach(img => imageObserver.observe(img));
              });
            `,
          },
        ],
        preBodyTags: [],
        postBodyTags: [],
      };
    },

    // Optimize during build process
    async postBuild(props) {
      const fs = require('fs');
      const path = require('path');

      // Log performance metrics after build
      console.log('Performance optimization completed.');
      console.log('Build output directory:', props.outDir);

      // Analyze bundle size
      const analyzeBundle = (dir) => {
        let totalSize = 0;
        const files = fs.readdirSync(dir);

        files.forEach(file => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);

          if (stat.isDirectory()) {
            totalSize += analyzeBundle(filePath);
          } else {
            totalSize += stat.size;
          }
        });

        return totalSize;
      };

      const bundleSize = analyzeBundle(props.outDir);
      const sizeInMB = (bundleSize / (1024 * 1024)).toFixed(2);

      console.log(\`Total bundle size: \${sizeInMB} MB\`);

      // Generate performance report
      const reportPath = path.join(props.outDir, 'performance-report.json');
      const report = {
        timestamp: new Date().toISOString(),
        bundleSize: bundleSize,
        bundleSizeMB: parseFloat(sizeInMB),
        optimizationsApplied: [
          'Code splitting',
          'Asset optimization',
          'Preloading strategies',
          'Lazy loading implementation'
        ]
      };

      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log('Performance report generated at:', reportPath);
    }
  };
};