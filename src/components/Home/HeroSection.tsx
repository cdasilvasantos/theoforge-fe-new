'use client';

import React from 'react';
import Link from 'next/link';
import Button from '../Common/Button'; // Import the Button component
import Heading from '../Common/Heading'; // Import the Heading component
import Paragraph from '../Common/Paragraph'; // Import the Paragraph component

const HeroSection = () => (
  // Replace fixed height with min-height, remove flex center, add explicit padding
  <section
    className="min-h-[90vh] flex flex-col justify-center text-white bg-[url('/hero_star_bg.png')] bg-cover bg-center bg-no-repeat relative overflow-hidden pt-20 sm:pt-24 md:pt-32"
  >
    {/* Overlay */}
    <div
      className="absolute inset-0 bg-black/40 z-10" // Reduced opacity to show more background
    />
    {/* Content Container: Update to create proper text alignment */}
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 flex flex-col items-center">
      {/* Inner Content Box: Change to center text alignment for more authority */}
      <div className="flex flex-col items-center text-center p-6 sm:p-8">
        {/* Adjust smallest heading size */}
        <Heading
          level={1} // H1 equivalent
          className="font-bold text-white text-3xl sm:text-5xl md:text-6xl mb-8 leading-tight" // Larger, bolder text
        >
          Empower Enterprise Engineering Through Strategic AI Transformation
        </Heading>
        {/* Use Paragraph component, variant defaults to body1 */}
        <Paragraph className="text-white text-xl mb-10 max-w-2xl"> 
          Enterprise leaders partner with TheoForge for our 
          <span className="text-secondary font-semibold"> unique 360° perspective</span> that combines hands-on AI implementation, enterprise leadership, and founder experience to 
          <span className="text-secondary font-semibold"> elevate engineering teams</span> to higher-impact work
        </Paragraph>

        {/* Use Button component with Secondary OUTLINE variant */}
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <Button 
            variant="primary"
            href="/about/living-lab" 
            size="lg" 
            className="shadow-md"
          >
            Our Living Lab
          </Button>
          <Button 
            variant="outline"
            href="/community" 
            size="lg" 
            className="border-secondary text-white hover:bg-secondary/10" 
          >
            Join Our Community
          </Button>
        </div>
      </div>
    </div> 
  </section>
);

export default HeroSection;
