// src/components/Blog/AudioPlayerOverlay.tsx
"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface AudioPlayerOverlayProps {
  audioUrl: string;
  imageUrl: string;
}

export default function AudioPlayerOverlay({ audioUrl, imageUrl }: AudioPlayerOverlayProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // To show loading state
  const [isEnded, setIsEnded] = useState(false); // Track if audio finished
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isEnded) { // If ended, restart playback
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setIsPlaying(true);
        setIsEnded(false);
    } else if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true); // Show loading indicator
      audioRef.current.play().then(() => {
          setIsPlaying(true);
          setIsLoading(false);
      }).catch((error) => {
          console.error("Error playing audio:", error);
          setIsLoading(false); // Hide loading on error
      });
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setIsEnded(true);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  }

  const handleCanPlay = () => {
     // Only stop loading if we aren't already playing (prevents flicker on seek/restart)
    if (!isPlaying) {
       setIsLoading(false);
    }
  }

  return (
    <div 
      className="absolute top-0 left-0 right-0 bottom-0 z-10 overflow-hidden"
    >
      {/* Background Image */}
      <Image 
        src={imageUrl} 
        alt="Audio content" 
        fill 
        priority
        style={{ 
          objectFit: 'cover',
          objectPosition: 'center top'
        }}
        sizes="(max-width: 960px) 100vw, 960px"
      />

      {/* Dark overlay for better button visibility */}
      <div 
        className="absolute top-0 left-0 right-0 bottom-0 bg-black/40 z-10"
      />

      <audio
        ref={audioRef}
        src={audioUrl}
        onPlay={() => {setIsPlaying(true); setIsLoading(false); setIsEnded(false);}}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
        onWaiting={() => setIsLoading(true)} // Show loading when buffering
        onCanPlay={handleCanPlay}
        onLoadStart={handleLoadStart}
        preload="metadata" // Preload only metadata initially
        style={{ display: 'none' }} // Hide the default audio controls
      />
      
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center"
      >
        <button
          onClick={togglePlayPause}
          className="bg-white/90 hover:bg-white shadow-lg rounded-full p-4 sm:p-6 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          aria-label={isPlaying ? 'Pause' : isEnded ? 'Replay' : 'Play'}
          disabled={isLoading}
        >
          {isLoading ? (
            // Tailwind Loading Spinner SVG
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : isPlaying ? (
            // Pause SVG Icon
            <svg className="h-8 w-8 text-gray-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 00-1 1v2a1 1 0 102 0V9a1 1 0 00-1-1zm5 0a1 1 0 00-1 1v2a1 1 0 102 0V9a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : isEnded ? (
            // Replay SVG Icon
            <svg className="h-8 w-8 text-gray-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm1 14a1 1 0 011-1h5.001a5.002 5.002 0 004.088-2.301 1 1 0 111.885.666A7.002 7.002 0 015 17.899V20a1 1 0 11-2 0v-5a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          ) : (
            // Play SVG Icon
            <svg className="h-8 w-8 text-gray-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
