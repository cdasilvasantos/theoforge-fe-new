import React from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

// Define variants for paragraph styles based on typography_guide.md
type ParagraphVariant = 'body1' | 'body2' | 'caption' | 'overline';

// Define the props for the Paragraph component
interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: ParagraphVariant;
  children: React.ReactNode;
  className?: string;
}

// Mapping of variants to Tailwind classes
const variantClasses: Record<ParagraphVariant, string> = {
  body1: 'font-sans font-normal text-base text-neutral-900 dark:text-neutral-100',   // Body Text 1
  body2: 'font-sans font-normal text-sm text-neutral-700 dark:text-neutral-300',    // Body Text 2
  caption: 'font-sans font-normal text-xs text-neutral-600 dark:text-neutral-400',  // Caption Text
  overline: 'font-sans font-normal text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400', // Overline Text (Added uppercase & tracking)
};

/**
 * Paragraph Component
 * Renders semantic HTML paragraph elements (<p>) with predefined
 * typography styles based on the specified variant.
 *
 * @param variant - The style variant (e.g., 'body1', 'body2', 'caption'). Defaults to 'body1'.
 * @param children - The content of the paragraph.
 * @param className - Optional additional Tailwind classes.
 * @param ...props - Other standard HTML attributes for paragraph elements.
 */
const Paragraph: React.FC<ParagraphProps> = ({
  variant = 'body1', // Default to body1 if no variant is specified
  children,
  className,
  ...props
}) => {
  const combinedClasses = twMerge(clsx(
    variantClasses[variant], // Apply variant-specific styles
    className // Apply any additional classes passed via props
  ));

  return (
    <p className={combinedClasses} {...props}>
      {children}
    </p>
  );
};

export default Paragraph;
