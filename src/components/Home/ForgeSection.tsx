'use client';

import React from 'react';
import NextLink from 'next/link';
import { ForgeProjectData } from '@/lib/forgeUtils';
import Image from 'next/image';
import JdenticonIcon from '../Common/JdenticonIcon';
import SectionHeading from '../Common/SectionHeading';
import ForgeProjectCard from '../Forge/ForgeProjectCard'; // Import the new specific card
import Button from '../Common/Button';
import Paragraph from '../Common/Paragraph'; // Import Paragraph

const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 mr-1.5">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);

interface ForgeSectionProps {
  projects: ForgeProjectData[];
}

const ForgeSection: React.FC<ForgeSectionProps> = ({ projects }) => {
  const allProjects = projects;
  const nonFeatured = allProjects.filter((p: ForgeProjectData) => !p.featured);
  const displayProjects = nonFeatured.length >= 3 ? nonFeatured.slice(0, 3) : allProjects.slice(0, 3);

  return (
    <div>
      <SectionHeading className="md:text-5xl mb-2">
        From the Forge
      </SectionHeading>
      <Paragraph 
        variant="body1" 
        className="mt-4 mb-6 leading-7 text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto"
      >
        Welcome to the Forge, our experimental playground. Here, we showcase innovative proof-of-concept projects demonstrating the potential of emerging AI technologies like <span className="text-secondary font-medium">Knowledge Graphs</span>, <span className="text-secondary font-medium">Multi-Agent Systems</span>, <span className="text-secondary font-medium">RAG</span>, and advanced character agents.
      </Paragraph>
      
      <div className="flex justify-center mb-10">
        <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1.5">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
          Outlaw Innovation
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 items-stretch">
        {displayProjects.map((project: ForgeProjectData) => (
          <ForgeProjectCard key={project.id} project={project} />
        ))}
      </div>

      {allProjects.length > 3 && (
        <div className="mt-12 text-center">
          <Button href="/forge" variant="secondary" size="lg" className="shadow-sm">
            Explore All Projects
          </Button>
        </div>
      )}
    </div>
  );
};

export default ForgeSection;
