'use client';

import React from 'react';

interface PodcastMetadataProps {
  episodeNumber?: number;
  duration?: string;
  releaseDate: string;
  host?: string;
  guest?: string;
}

// SVG Icons (replace MUI icons)
const PodcastIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export default function PodcastMetadata({
  episodeNumber,
  duration,
  releaseDate,
  host = "TheoForge Team",
  guest
}: PodcastMetadataProps) {
  const formattedDate = new Date(releaseDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col gap-4 p-4 mb-4 max-w-full overflow-hidden bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <PodcastIcon />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          TheoForge Insights {episodeNumber ? `- Episode ${episodeNumber}` : ''}
        </h3>
      </div>
      
      <div className="flex flex-wrap gap-x-4 gap-y-2 md:gap-x-6">
        {duration && (
          <div className="flex items-center gap-1">
            <ClockIcon />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {duration}
            </span>
          </div>
        )}
        
        <div className="flex items-center gap-1">
          <CalendarIcon />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formattedDate}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <UserIcon />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {guest ? `Host: ${host} • Guest: ${guest}` : `Host: ${host}`}
          </span>
        </div>
      </div>

      <div className="mt-2 flex items-center flex-wrap gap-2">
        <a 
          href="#"
          className="inline-block px-2.5 py-0.5 rounded text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Listen on Spotify
        </a>
        <a 
          href="#"
          className="inline-block px-2.5 py-0.5 rounded text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Apple Podcasts
        </a>
        <a 
          href="#"
          className="inline-block px-2.5 py-0.5 rounded text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Google Podcasts
        </a>
        <a 
          href="#"
          className="inline-block px-2.5 py-0.5 rounded text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          RSS Feed
        </a>
      </div>
    </div>
  );
}
