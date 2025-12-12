const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
  title: 'AI/Spec-Driven Textbook for Physical AI & Humanoid Robotics',
  tagline: 'Learn Physical AI and Humanoid Robotics through Spec-Driven Development',
  url: 'https://asfarahmed.github.io', // GitHub Pages URL
  baseUrl: '/humanoid-robotics/', // Repository name for GitHub Pages
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'asfarahmed', // GitHub username/organization
  projectName: 'humanoid-robotics', // GitHub repository name

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Route base path for docs section
          routeBasePath: '/docs',
          // Use the textbook sidebar
          sidebarCollapsible: true,
          // Enable next and previous navigation
          showLastUpdateAuthor: false,
          showLastUpdateTime: false,
          // Optimize loading for large documents with remark plugins
          remarkPlugins: [
          ],
          // Please change this to your repo.
          editUrl: 'https://github.com/your-organization/humanoid-robotics/edit/main/textbook/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/main/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  themes: [
  ],
  plugins: [
    // './src/plugins/offline-reading', // Disabled to fix click overlay issue
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        // The application ID provided by Algolia
        appId: 'YOUR_APP_ID',

        // Public API key: it is safe to commit it
        apiKey: 'YOUR_SEARCH_API_KEY',

        indexName: 'humanoid-robotics-textbook',

        // Optional: see doc link below
        contextualSearch: true,

        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        externalUrlRegex: 'external\\.example\\.com|thirdparty\\.example\\.com',

        // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
        replaceSearchResultPathname: {
          from: '/docs/textbook/', // or as RegExp: /\/docs\//
          to: '/docs/textbook/',
        },

        // Optional: Algolia search parameters
        searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',
      },

      navbar: {
        title: 'Physical AI & Humanoid Robotics',
        logo: {
          alt: 'Humanoid Robotics Textbook Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'textbook/index',
            position: 'left',
            label: 'Textbook',
          },
          {
            type: 'doc',
            docId: 'textbook/toc',
            position: 'left',
            label: 'Chapters',
          },
          {
            href: 'https://github.com/your-organization/humanoid-robotics',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Textbook',
            items: [
              {
                label: 'Get Started',
                to: '/docs/textbook',
              },
              {
                label: 'Chapter 1: Physical AI Fundamentals',
                to: '/docs/textbook/chapter-01/index/',
              },
              {
                label: 'All Chapters',
                to: '/docs/textbook/toc',
              },
            ],
          },
          {
            title: 'Resources',
            items: [
              {
                label: 'Spec-Kit Plus',
                href: 'https://github.com/spec-driven/spec-kit-plus',
              },
              {
                label: 'Docusaurus',
                href: 'https://docusaurus.io',
              },
              {
                label: 'Robotics Learning',
                href: 'https://www.ros.org',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/your-organization/humanoid-robotics',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} AI/Spec-Driven Textbook for Physical AI & Humanoid Robotics. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
});
