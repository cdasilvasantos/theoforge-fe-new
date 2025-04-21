import React from 'react';
import { getAllTestimonials, TestimonialData } from '@/lib/testimonialUtils'; 
import SectionHeading from '../Common/SectionHeading';
import TestimonialCard from '../Testimonials/TestimonialCard';
import Button from '../Common/Button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface TestimonialsSectionProps {
  maxItems?: number;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ maxItems }) => {
  const allTestimonials = getAllTestimonials(); 

  const testimonialsToDisplay = maxItems 
    ? allTestimonials.slice(0, maxItems) 
    : allTestimonials;

  if (testimonialsToDisplay.length === 0) {
    return null;
  }

  return (
    <div>
      <SectionHeading align="center" className="md:text-5xl mb-12">
        What Our Clients Say
      </SectionHeading>
      
      <div className="max-w-3xl mx-auto text-center mb-10">
        <p className="text-gray-600 dark:text-gray-300">
          Enterprise leaders trust TheoForge to guide their <span className="text-secondary font-medium">AI transformation journey</span>
        </p>
      </div>

      <Carousel 
        opts={{
          align: "center",
          loop: testimonialsToDisplay.length > 3, // Only loop if more items than visible
        }}
        className="w-full max-w-[1200px] mx-auto"
      >
        <CarouselContent className="-ml-4 flex justify-center"> 
          {testimonialsToDisplay.map((testimonial) => (
            // Set responsive basis: 1 on mobile, 2 on md, 3 on lg
            <CarouselItem key={testimonial.id} className="basis-full md:basis-1/2 lg:basis-1/3 pl-4 pb-6 max-w-[350px]"> 
              <div className="h-full"> {/* Ensure card stretches */} 
                <TestimonialCard testimonial={testimonial} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Conditionally show controls if looping is possible */} 
        {testimonialsToDisplay.length > 3 && (
          <>
            <CarouselPrevious className="hidden sm:flex" /> 
            <CarouselNext className="hidden sm:flex" />
          </>
        )}
      </Carousel>
      
      {maxItems && allTestimonials.length > maxItems && (
          <div className="mt-10 text-center">
              <Button href="/testimonials" variant="secondary" size="md" className="shadow-sm">
                  View All Testimonials
              </Button>
          </div>
      )}
    </div>
  );
};

export default TestimonialsSection;
