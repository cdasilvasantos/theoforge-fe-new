// src/components/Forge/ForgeProjectCard.tsx
import React from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import BaseCard from '../Common/BaseCard';
import Button from '../Common/Button';
import JdenticonIcon from '../Common/JdenticonIcon';
import Heading from '../Common/Heading';
import Paragraph from '../Common/Paragraph';
import { ForgeProjectData } from '@/lib/forgeUtils';
import { FaGithub, FaArrowUpRightFromSquare } from 'react-icons/fa6'; // Icons for links
import { trackEvent, AnalyticsEvents } from '@/lib/analytics';

interface ForgeProjectCardProps {
  project: ForgeProjectData;
}

const ForgeProjectCard: React.FC<ForgeProjectCardProps> = ({ project }) => {
  const { 
    id, 
    title, 
    content, 
    image, 
    tags, 
    githubUrl, 
    tryUrl, 
    status 
  } = project;

  const isComingSoon = status === 'Coming Soon';

  // Determine if the link is internal or external
  const isInternalLink = tryUrl && tryUrl.startsWith('/');
  
  // Handle tracking for GitHub button clicks
  const handleGitHubClick = () => {
    trackEvent(AnalyticsEvents.EXTERNAL_LINK_CLICK, {
      destination: 'github',
      project_id: id,
      project_title: title
    });
  };
  
  // Handle tracking for Try It button clicks
  const handleTryClick = () => {
    trackEvent(AnalyticsEvents.FORGE_PROJECT_CLICKED, {
      project_id: id,
      project_title: title,
      project_status: status || 'unknown',
      destination: isInternalLink ? 'internal' : 'external'
    });
  };

  return (
    <BaseCard key={id} className="flex flex-col h-full shadow-sm"> 
      {/* Inner wrapper for consistent padding */} 
      <div className="p-4 flex-grow flex flex-col"> 
        {/* Image */} 
        {image ? (
          <div className="w-full mb-3 rounded-lg overflow-hidden bg-teal-900 aspect-[4/3] flex items-center justify-center"> 
            <Image
              src={image}
              alt={`${title} preview`}
              width={320}
              height={180}
              className="w-full h-auto object-cover"
            />
          </div>
        ) : (
          <div className="w-full aspect-[4/3] mb-3 bg-teal-900 dark:bg-teal-800 rounded-lg flex items-center justify-center"> 
            <JdenticonIcon value={title} size={40} />
          </div>
        )}

        {/* Title */} 
        <Heading level={4} className="mb-2 text-base font-semibold text-gray-900 dark:text-gray-50"> 
          {title}
        </Heading>

        {/* Description */} 
        <Paragraph variant="body2" className="text-gray-600 dark:text-gray-300 mb-3 flex-grow text-sm"> 
          {content}
        </Paragraph>

        {/* Tags */} 
        {tags && tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5"> 
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-md dark:bg-teal-900/30 dark:text-teal-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Status Badge */} 
        {status && !isComingSoon && (
            <div className="mb-2"> 
              <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${ 
                isComingSoon 
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' 
                  : 'bg-muted text-muted-foreground dark:bg-muted-dark dark:text-muted-foreground-dark'
              }`}>
                {status}
              </span>
            </div>
        )}
        
        {/* Buttons */} 
        <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-2"> 
          {githubUrl && (
            <Button 
              href={githubUrl} 
              variant="outline" 
              size="sm" 
              leftIcon={<FaGithub />} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mt-2 text-sm py-1"
              onClick={handleGitHubClick}
            >
              GitHub
            </Button>
          )}
          {tryUrl && (
            <Button 
              href={tryUrl} 
              variant="primary"
              size="sm"
              leftIcon={<FaArrowUpRightFromSquare />} 
              target={isInternalLink ? "_self" : "_blank"}
              rel={isInternalLink ? "" : "noopener noreferrer"}
              disabled={isComingSoon} 
              className="mt-2 text-sm py-1"
              onClick={!isComingSoon ? handleTryClick : undefined}
            >
              {isComingSoon ? 'Coming Soon' : 'Try It'}
            </Button>
          )}
        </div>
      </div> 
    </BaseCard>
  );
};

export default ForgeProjectCard;
