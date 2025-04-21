import React from 'react';
import { cn } from '@/lib/utils';

interface SectionContainerProps {
  children: React.ReactNode;
  id?: string;
  className?: string; // Allow passing additional classes (e.g., background)
  py?: string; // Allow overriding default padding (e.g., py-12, py-20, py-24)
}

const SectionContainer: React.FC<SectionContainerProps> = ({ 
  children, 
  id, 
  className = '', 
  py = 'py-12 md:py-16' // Responsive padding - smaller on mobile, larger on desktop
}) => {
  return (
    <section id={id} className={cn(py, className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
};

export default SectionContainer;
