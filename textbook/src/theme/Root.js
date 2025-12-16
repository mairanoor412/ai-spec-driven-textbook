import React, { Suspense, lazy } from 'react';
import Root from '@theme-original/Root';

// Lazy load ChatbotWidget for better initial page load performance
const ChatbotWidget = lazy(() => import('../components/ChatbotWidget'));

export default function RootWrapper(props) {
  return (
    <>
      <Root {...props} />
      <Suspense fallback={null}>
        <ChatbotWidget />
      </Suspense>
    </>
  );
}
