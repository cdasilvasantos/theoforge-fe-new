'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import the ZapierChatbotEmbed component with SSR disabled
const ZapierChatbotEmbed = dynamic(() => import('./ZapierChatbotEmbed'), {
  ssr: false,
});

// Define props for the wrapper, matching the original component
interface DynamicZapierChatbotProps {
  isPopup?: string;
  chatbotId: string;
}

// The wrapper component simply renders the dynamically imported component
const DynamicZapierChatbot: React.FC<DynamicZapierChatbotProps> = (props) => {
  return <ZapierChatbotEmbed {...props} />;
};

export default DynamicZapierChatbot;
