'use client';

import React from 'react';

export interface LoadingFallbackProps {
  /**
   * Custom message to display during loading
   */
  message?: string;
  
  /**
   * Whether to show a progress indicator
   */
  showProgress?: boolean;
}

/**
 * A reusable loading fallback component
 */
export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  message = 'Loading visualization...',
  showProgress = true
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center h-full w-full 
                 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-4 text-center"
    >
      {showProgress && (
        <div className="mb-6"> 
          {/* Tailwind Animated Spinner */}
          <svg 
            className="animate-spin h-16 w-16 text-blue-600 dark:text-blue-400" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
      
      <h6 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
        {message}
      </h6>
      
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Please wait while we prepare the data visualization
      </p>
    </div>
  );
};
