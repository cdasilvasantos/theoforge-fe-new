'use client'; // Ensure this wrapper is also treated as a client component boundary

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import the Footer component with SSR disabled
const DynamicFoot = dynamic(() => import('../Layout/Footer'), {
  ssr: false,
  // Optional: Add a loading component if needed
  // loading: () => <p>Loading Footer...</p>,
});

// No props are expected by the Footer component
const DynamicFooter: React.FC = () => {
  return <DynamicFoot />;
};

export default DynamicFooter;
