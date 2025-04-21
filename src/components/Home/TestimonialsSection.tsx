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
    <div className="py-12 md:py-16">
      <div className="px-4 md:px-6 lg:px-8">
        <SectionHeading align="center" className="text-3xl md:text-4xl lg:text-5xl mb-6 md:mb-12">
          What Our Clients Say
        </SectionHeading>
        
        <div className="max-w-3xl mx-auto text-center mb-6 md:mb-10">
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
            Enterprise leaders trust TheoForge to guide their <span className="text-secondary font-medium">AI transformation journey</span>
          </p>
        </div>

        {/* Mobile Carousel (only visible on small screens) */}
        <div className="block sm:hidden w-full">
          <Carousel 
            opts={{
              align: "center",
              loop: testimonialsToDisplay.length > 1,
              containScroll: "keepSnaps",
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonialsToDisplay.map((testimonial) => (
                <CarouselItem key={`mobile-${testimonial.id}`} className="w-full">
                  <div className="px-4">
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1" />
            <CarouselNext className="right-1" />
          </Carousel>
        </div>

        {/* Desktop Carousel (hidden on small screens) */}
        <div className="hidden sm:block w-full">
          <Carousel 
            opts={{
              align: "center",
              loop: testimonialsToDisplay.length > 1,
            }}
            className="w-full max-w-[1200px] mx-auto"
          >
            <CarouselContent className="-ml-4 flex justify-center"> 
              {testimonialsToDisplay.map((testimonial) => (
                <CarouselItem key={`desktop-${testimonial.id}`} className="pl-4 pb-6 min-w-0 sm:basis-3/4 md:basis-1/2 lg:basis-1/2 max-w-[500px]"> 
                  <div className="h-full">
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
        
        {maxItems && allTestimonials.length > maxItems && (
          <div className="mt-10 text-center">
              <Button href="/testimonials" variant="secondary" size="md" className="shadow-sm">
                  View All Testimonials
              </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsSection;
