'use client'; // Ensure calculations run client-side

import * as React from 'react';
import InfoCard from '../Common/InfoCard'; // Correct path
import SectionHeading from '../Common/SectionHeading'; // Import new heading
import { ServiceData } from '@/types/service'; // Import type from centralized location

// Define the props for the ServicesSection component
interface ServicesSectionProps {
  services: ServiceData[];
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ services }) => {
  return (
    // SectionContainer removed, applied in page.tsx
    <div>
      {/* Use SectionHeading, pass responsive font size class */}
      <SectionHeading className="md:text-5xl mb-4">
        Core Services for Your AI Transformation
      </SectionHeading>

      <div className="max-w-3xl mx-auto mb-10 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          Strategic guidance and practical implementation to master your <span className="text-secondary font-medium">enterprise AI transformation</span>
        </p>
      </div>

      {/* Replace Carousel with a Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:gap-8 lg:gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          // Render InfoCard directly in the grid cell
          <InfoCard
            key={service.slug} // Add key here
            title={service.title}
            excerpt={service.excerpt}
            image={service.image}
            link={`/services/${service.slug}`}
            priorityImage={index < 3} // Prioritize first few images
          />
        ))}
      </div>
    </div>
  );
};

export default ServicesSection;
