'use client';

import React from 'react';

// Define props based on the embed code attributes
interface ZapierChatbotEmbedProps {
  isPopup?: string; // Typically boolean, but HTML attributes are strings
  chatbotId: string;
}

// This component simply renders the custom Zapier element.
// We use lowercase 'zapier-interfaces-chatbot-embed' as it's a custom element.
const ZapierChatbotEmbed: React.FC<ZapierChatbotEmbedProps> = ({ isPopup = 'true', chatbotId }) => {
  // Note: React might complain about unknown props on custom elements if not typed correctly.
  // Casting to `any` or using specific web component libraries can mitigate this,
  // but often just passing attributes works if the script handles them.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ZapierElement = 'zapier-interfaces-chatbot-embed' as any;
  return (
    <ZapierElement
      is-popup={isPopup} // Use the attribute name directly
      chatbot-id={chatbotId}
    />
  );
};

export default ZapierChatbotEmbed;
