import React from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

interface BaseCardProps {
  children: React.ReactNode;
  className?: string;
  layout?: 'vertical' | 'horizontal';
  // Add other potential variant props later if needed (e.g., hoverEffect?)
}

const BaseCard: React.FC<BaseCardProps> = ({ 
  children, 
  className, 
  layout = 'vertical' 
}) => {
  // Combine base styles with any additional classes passed via props using clsx and twMerge
  const cardClasses = twMerge(
    clsx(
      'flex', 
      { 
        'flex-col': layout === 'vertical', 
        'flex-row items-start': layout === 'horizontal' 
      },
      'h-full min-h-[360px] sm:min-h-[400px] lg:min-h-[420px]', // Responsive minimum height scaling with breakpoints
      'rounded-lg',
      'bg-white dark:bg-neutral-800', // Standard background (paper is white by default)
      'border border-neutral-200 dark:border-neutral-700', // Standard border
      'shadow-md hover:shadow-lg', // Standard shadow + hover effect
      'overflow-hidden', // Prevent content overflow issues
      'transition-shadow duration-200 ease-in-out', // Optional: subtle hover effect
      className // Append additional classes
    )
  );

  return (
    // No need for trim/replace now
    <div className={cardClasses}>
      {children}
    </div>
  );
};

export default BaseCard;
