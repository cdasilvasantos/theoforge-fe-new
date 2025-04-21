import React from 'react';
import { cn } from '@/lib/utils'; // Assuming you have a utility for classnames

interface TagProps {
  text: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({
  text,
  isActive = false,
  onClick,
  className,
}) => {
  return (
    <button
      type="button" // Important for accessibility if clickable
      onClick={onClick}
      disabled={!onClick} // Disable if no onClick handler is provided
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        isActive
          ? 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80' // Active state using secondary theme color
          : 'border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground', // Default state
        onClick ? 'cursor-pointer' : 'cursor-default', // Cursor changes based on clickability
        className // Allow custom classes
      )}
    >
      {text}
    </button>
  );
};