'use client'; // Ensure this wrapper is also treated as a client component boundary

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import the Header component with SSR disabled
const DynamicHeaderComponent = dynamic(() => import('../Layout/Header'), {
  ssr: false,
  // Optional: Add a loading component if needed
  // loading: () => <p>Loading Header...</p>,
});

const DynamicHeader: React.FC = () => {
  return <DynamicHeaderComponent />;
};

export default DynamicHeader;
