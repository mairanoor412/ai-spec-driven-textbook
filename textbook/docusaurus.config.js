const {themes} = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'AI/Spec-Driven Textbook for Physical AI & Humanoid Robotics',
  tagline: 'Learn Physical AI and Humanoid Robotics through Spec-Driven Development',
  url: 'https://mairanoor412.github.io', // GitHub Pages URL
  baseUrl: '/ai-spec-driven-textbook/', // Repository name for GitHub Pages
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'mairanoor412', // GitHub username/organization
  projectName: 'ai-spec-driven-textbook', // GitHub repository name

  presets: [
    [
      'classic',
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
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        hashed: true,
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        docsRouteBasePath: '/docs',
        indexBlog: false,
      }),
    ],
  ],
  plugins: [
    // './src/plugins/offline-reading', // Disabled to fix click overlay issue
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Local search is now configured in the themes section above
      // Algolia config removed - using @easyops-cn/docusaurus-search-local instead

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
};

module.exports = config;
