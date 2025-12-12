import React from 'react';
import Layout from '@theme/Layout';
import Breadcrumbs from '@site/src/components/Breadcrumbs';

// A wrapper component that adds breadcrumbs to the layout
export default function BreadcrumbLayout(props) {
  return (
    <Layout {...props}>
      <Breadcrumbs />
      <div className="container margin-vert--lg">
        {props.children}
      </div>
    </Layout>
  );
}