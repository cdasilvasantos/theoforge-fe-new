'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BaseCard from './BaseCard';
import Button from './Button';
import Heading from './Heading';
import Paragraph from './Paragraph';

interface InfoCardProps {
  title: string;
  excerpt: string;
  image?: string;
  link: string;
  priorityImage?: boolean;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ 
  title, 
  excerpt, 
  image, 
  link, 
  priorityImage, 
  className 
}) => {
  return (
    <BaseCard className={className}> 
      {image && (
        <div className="relative w-full mb-6 overflow-hidden rounded-lg aspect-video"> 
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover bg-muted" 
            priority={priorityImage}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}
      {/* Improve padding and structure */}
      <div className="p-6 pt-7 pb-8 flex-grow flex flex-col"> 
        <Heading level={5} className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-50"> 
          {title}
        </Heading>
        <Paragraph variant="body2" className="mb-6 text-gray-600 dark:text-gray-300"> 
          {excerpt}
        </Paragraph>
        <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-700"> 
          <Button href={link} variant="primary" size="sm" rightIcon={<span className="ml-1">→</span>} className="mt-4">
            Learn More
          </Button>
        </div>
      </div>
    </BaseCard>
  );
};

export default InfoCard;
