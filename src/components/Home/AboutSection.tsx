'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SectionHeading from '../Common/SectionHeading';
import Button from '../Common/Button';
import Heading from '../Common/Heading';
import Paragraph from '../Common/Paragraph';

const AboutSection: React.FC = () => {
  const lastName = "Williams";

  return (
    <div className="scroll-mt-20">
      <SectionHeading>
        About TheoForge
      </SectionHeading>

      <div className="max-w-3xl mx-auto text-center mb-10">
        <p className="text-gray-600 dark:text-gray-300">
          We provide enterprise leaders with <span className="text-secondary font-medium">engineering empowerment</span>, <span className="text-secondary font-medium">strategic leadership</span>, and <span className="text-secondary font-medium">capability building</span> through our unique 360-degree perspective
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-10 items-start mb-16">
        <div className="flex-1">
          <Paragraph className="mb-6 text-gray-700 dark:text-gray-200">
            TheoForge operates as a <span className="text-secondary font-semibold">living laboratory for enterprise AI innovation</span>, where we practice what we advise. Our consultancy doesn't just recommend AI implementation strategies—we live them daily, testing and refining the same approaches we recommend to global enterprise clients.
          </Paragraph>
          
          <Paragraph className="mb-8 text-gray-600 dark:text-gray-300">
            We focus on <span className="font-medium">empowering engineering teams</span> rather than replacing them, delivering practical, high-impact AI implementation strategies that position your technical talent for higher-value work while accelerating innovation. Our service portfolio spans Engineering Empowerment, Technology Strategy & Leadership, and Future Ready Workforce Training to ensure enterprise-scale transformation.
          </Paragraph>
          
          <Heading level={3} className="group text-2xl font-semibold mt-8 mb-5 text-gray-900 dark:text-gray-50 flex items-center">
            <span className="w-8 h-8 rounded-md bg-secondary/10 flex items-center justify-center mr-3 group-hover:bg-secondary/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-secondary">
                <path d="M10.75 16.82A7.462 7.462 0 0115 15.5c.71 0 1.396.098 2.046.282A.75.75 0 0018 15.06v-11a.75.75 0 00-.546-.721A9.006 9.006 0 0015 3a8.963 8.963 0 00-4.25 1.065V16.82zM9.25 4.065A8.963 8.963 0 005 3c-.85 0-1.673.118-2.454.339A.75.75 0 002 4.06v11a.75.75 0 00.954.721A7.506 7.506 0 015 15.5c1.579 0 3.042.487 4.25 1.32V4.065z" />
              </svg>
            </span>
            Our Approach: Experience, Implementation, Results
          </Heading>
          
          <Paragraph className="mb-6 text-gray-600 dark:text-gray-300 pl-4 md:pl-11">
            We bridge the gap between AI potential and enterprise implementation by combining hands-on programming experience, enterprise leadership perspective, and entrepreneurial insight. This 360-degree view enables us to deliver pragmatic solutions that transform complex AI capabilities into measurable business outcomes while elevating your engineering teams.
          </Paragraph>
        </div>
        
        <div className="flex-1 flex flex-col items-center text-center bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
          <div
            className="relative w-44 mb-6 rounded-full overflow-hidden shadow-lg border-2 border-secondary/20"
            style={{ height: '11rem' }} 
          >
            <Image
              src="/theo_keith.png"
              alt="Keith Williams"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
              sizes="176px"
            />
          </div>
          
          <Heading level={5} className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">
            Keith {lastName}
          </Heading>
          
          <Paragraph variant="body2" className="text-sm text-gray-600 dark:text-gray-400 mb-5">
            Founder & Principal AI Strategist
          </Paragraph>
          
          <Paragraph className="text-left text-gray-600 dark:text-gray-300">
            Keith brings a unique perspective combining early adoption experience with generative AI systems, leadership background in technology investment, startup experience, and educational expertise.
          </Paragraph>
          
          <Button 
            href="/about" 
            variant="secondary" 
            size="md" 
            className="mt-6 shadow-sm"
            rightIcon={<span className="ml-2">→</span>}
          >
            Meet Keith {lastName}
          </Button>
        </div>
      </div>

      <Heading level={3} className="text-2xl font-semibold mt-16 mb-8 text-center text-gray-900 dark:text-white">
        Why Enterprise Leaders Partner with TheoForge
      </Heading>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {[
          {
            title: 'A Unique 360-Degree Perspective',
            icon: "puzzle",
            content: 'We combine daily hands-on AI implementation experience, enterprise leadership as a fund CTO, and startup founding success to identify opportunities and challenges that specialists with narrower experience simply cannot see.',
          },
          {
            title: 'Living Lab for Enterprise Innovation',
            icon: "path",
            content: 'Our advice comes from direct experience as a continuously evolving laboratory where we implement, test, and refine the same AI-powered approaches we recommend to enterprise clients—proving their effectiveness before recommending them.',
          },
        ].map((benefit, index) => {
          // Define icon components based on type
          const iconComponent = benefit.icon === "puzzle" ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-secondary">
              <path d="M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 01.878.645 49.17 49.17 0 01.376 5.452.657.657 0 01-.66.664c-.354 0-.675-.186-.958-.401a1.647 1.647 0 00-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401.31 0 .557.262.534.571a48.774 48.774 0 01-.595 4.845.75.75 0 01-.61.61c-1.82.317-3.673.533-5.555.642a.58.58 0 01-.611-.581c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.035-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959a.641.641 0 01-.658.643 49.118 49.118 0 01-4.708-.36.75.75 0 01-.645-.878c.293-1.614.504-3.257.629-4.924A.53.53 0 005.337 15c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.036 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 00.659-.663 47.703 47.703 0 00-.31-4.82.75.75 0 01.83-.832c1.343.155 2.703.254 4.077.294a.64.64 0 00.657-.642z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-secondary">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" clipRule="evenodd" />
            </svg>
          );
          
          return (
            <div key={index} className="group p-7 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:border-secondary/20 dark:hover:border-secondary/20 transition-colors">
              <div className="flex items-start mb-4">
                <span className="mr-3 p-2 rounded-md bg-secondary/10 group-hover:bg-secondary/15 transition-colors">
                  {iconComponent}
                </span>
                <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
                  {benefit.title}
                </Heading>
              </div>
              <Paragraph className="text-gray-600 dark:text-gray-300 pl-4 md:pl-11">
                {benefit.content}
              </Paragraph>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AboutSection;
