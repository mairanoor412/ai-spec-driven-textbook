// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  textbookSidebar: [
    {
      type: 'category',
      label: 'AI/Spec-Driven Textbook for Physical AI & Humanoid Robotics',
      items: [
        {
          type: 'category',
          label: 'Textbook Overview',
          items: [
            'textbook/index',
            'textbook/toc',
            'textbook/learning-guide',
            'textbook/difficulty-badges',
            'textbook/accessibility-guide',
            'textbook/index-reference',
            'textbook/bookmarks',
            'textbook/glossary'
          ],
        },
        {
          type: 'category',
          label: 'Chapter 1: Physical AI Fundamentals',
          items: [
            'textbook/chapter-01/index/index',
            'textbook/chapter-01/concepts/concepts',
            'textbook/chapter-01/examples/examples',
            'textbook/chapter-01/exercises/exercises'
          ],
        },
        {
          type: 'category',
          label: 'Chapter 2: Humanoid Robotics Concepts',
          items: [
            'textbook/chapter-02/index/index',
            'textbook/chapter-02/concepts/concepts',
            'textbook/chapter-02/examples/examples',
            'textbook/chapter-02/exercises/exercises'
          ],
        },
        {
          type: 'category',
          label: 'Chapter 3: Practical Robotics Skills',
          items: [
            'textbook/chapter-03/index/index',
            'textbook/chapter-03/concepts/concepts',
            'textbook/chapter-03/examples/examples',
            'textbook/chapter-03/code/code',
            'textbook/chapter-03/exercises/exercises'
          ],
        },
        {
          type: 'category',
          label: 'Chapter 4: AI-Driven Workflows and Tools',
          items: [
            'textbook/chapter-04/index/index',
            'textbook/chapter-04/concepts/concepts',
            'textbook/chapter-04/examples/examples',
            'textbook/chapter-04/code/code',
            'textbook/chapter-04/exercises/exercises'
          ],
        }
      ],
    },
  ],
};

module.exports = sidebars;
