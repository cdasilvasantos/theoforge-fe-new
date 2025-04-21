// src/components/Testimonials/TestimonialCard.tsx
import React from 'react';
import Image from 'next/image';
import BaseCard from '../Common/BaseCard';
import JdenticonIcon from '../Common/JdenticonIcon';
import { TestimonialData } from '@/lib/testimonialUtils'; 
import { FaQuoteLeft } from 'react-icons/fa6'; // Quotation mark icon
import Heading from '../Common/Heading'; // Import Heading
import Paragraph from '../Common/Paragraph'; // Import Paragraph

interface TestimonialCardProps {
  testimonial: TestimonialData;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const { id, quote, name, title, company, image } = testimonial;

  return (
    <BaseCard key={id} className="h-full"> 
      {/* Image/Avatar Container (Top, full width, aspect-video) */}
      <div className="w-full relative aspect-video overflow-hidden rounded-t-lg bg-neutral-100 dark:bg-neutral-700">
        {image ? (
          <Image
            src={image}
            alt={`${name} - ${title}`}
            fill // Use fill
            className="object-cover" // Basic object cover
          />
        ) : (
          // Centered Jdenticon as fallback
          <div className="absolute inset-0 flex items-center justify-center">
            <JdenticonIcon value={name} size={64} /> {/* Adjust size as needed */} 
          </div>
        )}
      </div>

      {/* Content Container (Below image, standard padding) */} 
      <div className="p-6 pb-8 flex flex-col flex-grow"> 
        {/* Quote (First, with icon) */} 
        <div className="relative mb-6 flex-grow">
          <FaQuoteLeft className="text-secondary text-2xl mb-2" />
          <Paragraph 
            className="italic text-lg text-gray-700 dark:text-gray-200 leading-relaxed"
          >
            {quote}
          </Paragraph>
        </div>

        {/* Author Info (Aligned left now) */} 
        <div className="mt-auto pt-4 border-t border-secondary/20 dark:border-secondary/30"> 
          <Heading level={5} className="mb-1 font-semibold text-lg">
            {name}
          </Heading>
          <Paragraph variant="body2" className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">{title}</span>{title && company ? ', ' : ''}{company}
          </Paragraph>
        </div>
      </div>
    </BaseCard>
  );
};

export default TestimonialCard;
