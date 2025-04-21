'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

// Reusable component for rendering Markdown content with consistent styling
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => (
  <article
    className={[
      "text-gray-900 dark:text-white", // color: text.primary
      "text-base", // fontSize: 1rem
      "leading-relaxed", // lineHeight: 1.7
      "[&>:first-child]:mt-0", // Remove top margin from first element
      "[&>*+*]:mt-6", // Consistent vertical spacing (1.5em ~ mt-6)

      // Headings
      "[&_h1,&_h2,&_h3,&_h4,&_h5,&_h6]:mt-10 [&_h1,&_h2,&_h3,&_h4,&_h5,&_h6]:mb-4", // mt: 1.8em (~mt-10), mb: 0.8em (~mb-4)
      "[&_h1,&_h2,&_h3,&_h4,&_h5,&_h6]:font-bold [&_h1,&_h2,&_h3,&_h4,&_h5,&_h6]:leading-tight", // fontWeight: bold, lineHeight: 1.3
      "[&_h1]:text-4xl", // fontSize: 2.2rem (~text-4xl)
      "[&_h2]:text-3xl", // fontSize: 1.8rem (~text-3xl)
      "[&_h3]:text-2xl", // fontSize: 1.5rem (~text-2xl)
      "[&_h4]:text-xl", // fontSize: 1.2rem (~text-xl)

      // Paragraphs - inherits general styles
      "[&_p]:mb-4", // Add some bottom margin to paragraphs for separation

      // Links
      "[&_a]:text-blue-600 dark:[&_a]:text-blue-400 [&_a]:underline",
      "hover:[&_a]:decoration-blue-400 dark:hover:[&_a]:decoration-blue-300",

      // Lists
      "[&_ul,&_ol]:pl-8", // pl: 2em (~pl-8)
      "[&_ul]:list-disc [&_ol]:list-decimal",
      "[&_li]:mb-2", // mb: 0.6em (~mb-2)

      // Blockquotes
      "[&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 dark:[&_blockquote]:border-gray-600",
      "[&_blockquote]:pl-4 [&_blockquote]:ml-0 [&_blockquote]:italic",
      "[&_blockquote]:text-gray-500 dark:[&_blockquote]:text-gray-400",
      "[&_blockquote_p]:my-2", // Adjust internal paragraph margin

      // Inline Code
      // Using `not-prose` on the parent might require targeting code differently if using typography plugin elsewhere
      "[&_code:not(pre>code)]]:font-mono [&_code:not(pre>code)]]:text-sm",
      "[&_code:not(pre>code)]]:bg-gray-100 dark:[&_code:not(pre>code)]]:bg-gray-700",
      "[&_code:not(pre>code)]]:rounded [&_code:not(pre>code)]]:px-1 [&_code:not(pre>code)]]:py-0.5",
      "[&_code:not(pre>code)]]:break-words",

      // Code Blocks
      "[&_pre]:bg-gray-200 dark:[&_pre]:bg-gray-800", // Changed background for contrast
      "[&_pre]:rounded [&_pre]:p-4 [&_pre]:overflow-x-auto",
      "[&_pre>code]:font-mono [&_pre>code]:text-sm [&_pre>code]:leading-normal", // Reset/apply styles for code within pre
      "[&_pre>code]:bg-transparent [&_pre>code]:p-0", // Reset specific inline styles

      // Horizontal Rules
      "[&_hr]:border-0 [&_hr]:h-px [&_hr]:bg-gray-300 dark:[&_hr]:bg-gray-600 [&_hr]:my-8", // my: 2em (~my-8)

      // Images
      "[&_img]:max-w-full [&_img]:h-auto [&_img]:block [&_img]:my-6", // my: 1.5em (~my-6)

      // Tables
      "[&_table]:w-full [&_table]:border-collapse [&_table]:my-6", // my: 1.5em (~my-6)
      "[&_th,&_td]:border [&_th,&_td]:border-gray-300 dark:[&_th,&_td]:border-gray-600",
      "[&_th,&_td]:px-4 [&_th,&_td]:py-2 [&_th,&_td]:text-left", // padding: 0.5em 1em (~px-4 py-2)
      "[&_th]:bg-gray-100 dark:[&_th]:bg-gray-700 [&_th]:font-bold",
    ].join(' ')}
  >
    <ReactMarkdown>{content}</ReactMarkdown>
  </article>
);

export default MarkdownRenderer;
