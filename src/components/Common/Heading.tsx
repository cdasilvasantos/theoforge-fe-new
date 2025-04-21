import React from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

// Define the props for the Heading component
interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3 | 4 | 5 | 6; // Constrain level to valid heading levels
  children: React.ReactNode;
  className?: string;
}

// Mapping of heading levels to Tailwind classes based on typography_guide.md v1.3
const levelClasses: Record<HeadingProps['level'], string> = {
  1: 'font-heading font-bold text-6xl',     // H1: Inter Bold 6xl (4.5rem)
  2: 'font-heading font-semibold text-5xl',   // H2: Inter SemiBold 5xl (3.5rem)
  3: 'font-heading font-semibold text-4xl',   // H3: Inter SemiBold 4xl (2.75rem)
  4: 'font-heading font-semibold text-3xl',   // H4: Inter SemiBold 3xl (2.25rem)
  5: 'font-heading font-semibold text-2xl',   // H5: Inter SemiBold 2xl (1.75rem)
  6: 'font-heading font-semibold text-xl',    // H6: Inter SemiBold xl (1.375rem)
};

/**
 * Heading Component
 * Renders semantic HTML heading elements (h1-h6) with predefined
 * typography styles based on the specified level.
 *
 * @param level - The semantic heading level (1-6).
 * @param children - The content of the heading.
 * @param className - Optional additional Tailwind classes.
 * @param ...props - Other standard HTML attributes for heading elements.
 */
const Heading: React.FC<HeadingProps> = ({
  level,
  children,
  className,
  ...props // Collect remaining props
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  // Combine classes
  const combinedClasses = twMerge(clsx(
    'text-neutral-900 dark:text-neutral-100', // Default text color
    levelClasses[level], // Apply level-specific styles
    className // Apply any additional classes passed via props
  ));

  // Pass only the essential props explicitly
  return (
    <Tag className={combinedClasses}>
      {children}
    </Tag>
  );
};

export default Heading;
