import React from 'react';
import Button from '../Common/Button'; 

const CallToActionSection = () => (
  // Full-width gradient background with contained content
  <div className="bg-gradient-to-br from-teal-700 to-teal-900 text-white py-16 md:py-20 text-center relative overflow-hidden">
    {/* Decorative background elements */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-0 left-1/4 w-24 h-24 rounded-full bg-secondary"></div>
      <div className="absolute bottom-0 right-1/4 w-32 h-32 rounded-full bg-secondary"></div>
      <div className="absolute top-1/3 right-1/3 w-16 h-16 rounded-full bg-white"></div>
    </div>

    {/* Center content within the container */}
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"> {/* Added consistent horizontal padding */}
      {/* Heading - Use standard text/font utilities */}
      <h2 className="text-3xl md:text-4xl font-bold mb-6">
        Ready to Navigate Your AI Journey with <span className="text-secondary">Expert Guidance</span>?
      </h2>
      {/* Paragraph */}
      <p className="text-lg mb-8">
        Schedule a consultation to explore how our strategic advisory, implementation guidance, and workforce training can accelerate your AI initiatives and deliver measurable business value.
      </p>
      {/* Button - Use Button component */}
      {/* Inferring a contrasting style - secondary or custom? Let's try secondary with overrides */}
      <Button 
        href="/contact" 
        variant="secondary" 
        size="lg"
        className="shadow-md hover:shadow-lg transition-shadow"
      >
        Schedule Your Strategy Session
      </Button>
    </div>
  </div>
);

export default CallToActionSection;
