import React from 'react';
import { cn } from '@/lib/utils';
import Heading from '../Common/Heading';
import Paragraph from '../Common/Paragraph';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string; // Optional title
  subtitle?: string; // Optional subtitle
  maxWidth?: string; // Allow overriding default max-width if needed
  className?: string; // Allow additional custom classes for the outer div
  headerClassName?: string; // Allow custom classes for the header section
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  title,
  subtitle,
  maxWidth = 'max-w-7xl', // Default to a common wide container
  className = '',
  headerClassName = ''
}) => {
  const containerClasses = `
    ${maxWidth}
    mx-auto
    px-4 sm:px-6 lg:px-8
    // Default py-16 applied via SectionContainer pattern below, or override via className
    ${className}
  `;

  const headerClasses = `
    mb-8 md:mb-12 // Standard bottom margin for header
    text-center // Center align header by default
    ${headerClassName}
  `;

  return (
    <div className={containerClasses.trim().replace(/\s+/g, ' ')}>
      {(title || subtitle) && (
        <div className={headerClasses.trim().replace(/\s+/g, ' ')}>
          {title && (
            <Heading level={1} className="mb-4 text-4xl font-semibold md:text-5xl">
              {title}
            </Heading>
          )}
          {subtitle && (
            <Paragraph variant="body1" className="text-lg max-w-3xl mx-auto text-muted-foreground">
              {subtitle}
            </Paragraph>
          )}
        </div>
      )}
      {children} {/* Render the actual page content */}
    </div>
  );
};

export default PageContainer;
