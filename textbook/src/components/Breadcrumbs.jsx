import React from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import { useCurrentSidebarCategory } from '@docusaurus/theme-common';

const Breadcrumbs = () => {
  const location = useLocation();
  const category = useCurrentSidebarCategory();
  const activeDoc = category?.items?.find(item => item.href === location.pathname);

  // Create breadcrumb items based on the URL path
  const pathSegments = location.pathname
    .split('/')
    .filter(segment => segment.length > 0)
    .map((segment, index, array) => {
      // Decode URI components and convert kebabs to proper case
      let title = decodeURIComponent(segment);

      // Special handling for common patterns
      if (title === 'docs') title = 'Textbook';
      if (title.startsWith('chapter-')) {
        // Convert chapter-01 to "Chapter 1"
        const chapterNumber = title.replace('chapter-', '').replace(/^0+/, '');
        title = `Chapter ${chapterNumber}`;
      }
      if (title === 'textbook') title = 'Textbook';
      if (title === 'intro') title = 'Introduction';
      if (title === 'toc') title = 'Table of Contents';

      // Create the path up to this segment
      const path = '/' + array.slice(0, index + 1).join('/');

      return {
        title: title.charAt(0).toUpperCase() + title.slice(1).replace(/-/g, ' '),
        path: path,
        isLast: index === array.length - 1
      };
    });

  // Add home breadcrumb at the beginning
  const breadcrumbs = [
    { title: 'Home', path: '/', isLast: pathSegments.length === 0 },
    ...pathSegments
  ];

  if (activeDoc && pathSegments.length > 0) {
    // Update the last breadcrumb with the actual document title
    breadcrumbs[breadcrumbs.length - 1].title = activeDoc.sidebar_label || activeDoc.title || breadcrumbs[breadcrumbs.length - 1].title;
  }

  if (breadcrumbs.length <= 1) {
    // Don't show breadcrumbs if there's only one item (just home)
    return null;
  }

  return (
    <nav className="breadcrumb-container" aria-label="Breadcrumb">
      <ol className="breadcrumb">
        {breadcrumbs.map((crumb, index) => (
          <li
            key={crumb.path}
            className={`breadcrumb-item ${crumb.isLast ? 'active' : ''}`}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            {!crumb.isLast ? (
              <Link to={crumb.path} itemProp="item">
                <span itemProp="name">{crumb.title}</span>
              </Link>
            ) : (
              <span itemProp="name">{crumb.title}</span>
            )}
            <meta itemProp="position" content={index + 1} />
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;