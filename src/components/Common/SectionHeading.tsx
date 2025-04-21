import React from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import Heading from './Heading';

interface SectionHeadingProps {
  children: React.ReactNode;
  level?: 2 | 3;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

/**
 * SectionHeading Component
 * A wrapper around the base Heading component specifically for section titles.
 * Defaults to level 2 (h2) and center alignment.
 *
 * @param children - The title text.
 * @param level - The heading level (2 or 3). Defaults to 2.
 * @param align - Text alignment ('left', 'center', 'right'). Defaults to 'center'.
 * @param className - Optional additional Tailwind classes.
 */
const SectionHeading: React.FC<SectionHeadingProps> = ({ 
  children, 
  level = 2, 
  align = 'center', 
  className = '' 
}) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  // Combine alignment and additional classes
  const combinedClassName = twMerge(clsx(
    // Default styles: Inter font, 5xl size, semibold, standard margin, theme text color
    'font-heading text-5xl font-semibold mb-16 text-primary dark:text-primary-foreground',
    alignmentClasses[align],
    className
  ));

  // Render the base Heading component with appropriate props
  return (
    <Heading level={level} className={combinedClassName}>
      {children}
    </Heading>
  );
};

export default SectionHeading;
