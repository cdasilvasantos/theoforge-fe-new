'use client'; // Carousel requires client context

import React from 'react';
import NextLink from 'next/link';
import InfoCard from '../Common/InfoCard';
import SectionHeading from '../Common/SectionHeading'; 
import { PostData } from '@/types/post'; 
import Button from '../Common/Button'; 
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // Import Carousel components

interface BlogSnippetsSectionProps {
  blogSnippets: PostData[]; 
}

const BlogSnippetsSection: React.FC<BlogSnippetsSectionProps> = ({ blogSnippets }) => (
  // SectionContainer removed, applied in page.tsx
  <div>
    {/* Use SectionHeading, specify alignment */}
    <SectionHeading align="left">
      Latest Insights & Articles
    </SectionHeading>
    
    {/* Replace Grid with Carousel */}
    <Carousel
      opts={{
        align: "start",
        loop: false, // Typically don't loop snippets on homepage
      }}
      className="w-full mt-12 mb-8" // Added top margin
    >
      <CarouselContent>
        {blogSnippets.map((post, index) => (
          <CarouselItem key={post.slug} className="basis-full sm:basis-1/2 md:basis-1/3 p-2"> 
            <InfoCard 
              title={post.title} 
              image={post.image} 
              excerpt={post.excerpt} 
              link={`/insights/${post.slug}`} // Corrected link path to /insights/
              priorityImage={index < 3} // Prioritize first few images in carousel
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" /> 
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
    
    {/* Button section remains the same */}
    <div className="text-center mt-12">
      {/* Replaced styled <a> tag with Button */}
      <Button href="/insights" variant="outline" size="md" rightIcon={<span className="ml-2">→</span>}>
        View All Insights
      </Button>
    </div>
  </div>
);

export default BlogSnippetsSection;
