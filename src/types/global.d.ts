// src/types/global.d.ts

declare namespace JSX {
  interface IntrinsicElements {
    'zapier-interfaces-chatbot-embed': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      'chatbot-id'?: string;
      'is-popup'?: string | boolean; // Use string | boolean to accommodate 'true' or true
      // Add any other props the component accepts here
    };
  }
}
