'use client';

import React from 'react';

// --- Inline SVGs ---
const ZoomInSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
  </svg>
);
const ZoomOutSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 10.5h6" />
  </svg>
);
const HomeSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a.75.75 0 011.06 0l8.955 8.955M4.5 12v8.25a.75.75 0 00.75.75h12.75a.75.75 0 00.75-.75V12m-16.5 0h22.5" />
  </svg>
);
const PieChartSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
  </svg>
);
const FullscreenSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
  </svg>
);
const DownloadSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);
// --- End Inline SVGs ---

export interface GraphControlsProps {
  /**
   * Handler for zoom in action
   */
  onZoomIn: () => void;
  
  /**
   * Handler for zoom out action
   */
  onZoomOut: () => void;
  
  /**
   * Handler for reset view action
   */
  onReset: () => void;
  
  /**
   * Handler for toggling analytics panel
   */
  onToggleAnalytics: () => void;
  
  /**
   * Whether analytics panel is currently showing
   */
  showingAnalytics: boolean;
  
  /**
   * Handler for fullscreen toggle (optional)
   */
  onToggleFullscreen?: () => void;
  
  /**
   * Handler for download graph as image (optional)
   */
  onDownloadImage?: () => void;
  
  /**
   * Position of the controls panel
   */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/**
 * Controls panel for graph visualization
 */
export const GraphControls: React.FC<GraphControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
  onToggleAnalytics,
  showingAnalytics,
  onToggleFullscreen,
  onDownloadImage,
  position = 'bottom-left'
}) => {
  // Define position Tailwind classes
  const positionClassesMap = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };
  
  const positionClasses = positionClassesMap[position];

  const buttonBaseClasses = `
    p-1.5 rounded-md text-gray-600 dark:text-gray-300 
    hover:bg-gray-100 dark:hover:bg-gray-700 
    focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
    transition-colors duration-150
  `;
  
  return (
    // Replaced Paper with styled div
    <div
      className={`
        absolute flex gap-1 p-1 rounded-lg shadow-lg 
        bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm 
        z-10 border border-gray-200 dark:border-gray-700
        ${positionClasses}
      `}
    >
      {/* Replaced Tooltip and IconButton with button and title */}
      <button 
        title="Zoom In"
        onClick={onZoomIn} 
        className={buttonBaseClasses}
      >
        <ZoomInSVG />
      </button>
      
      <button 
        title="Zoom Out"
        onClick={onZoomOut} 
        className={buttonBaseClasses}
      >
        <ZoomOutSVG />
      </button>
      
      <button 
        title="Reset View"
        onClick={onReset} 
        className={buttonBaseClasses}
      >
        <HomeSVG />
      </button>
      
      <button 
        title={showingAnalytics ? "Hide Analytics" : "Show Analytics"}
        onClick={onToggleAnalytics} 
        className={`
          ${buttonBaseClasses}
          ${showingAnalytics ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : ''}
        `}
      >
        <PieChartSVG />
      </button>
      
      {onToggleFullscreen && (
        <button 
          title="Toggle Fullscreen"
          onClick={onToggleFullscreen} 
          className={buttonBaseClasses}
        >
          <FullscreenSVG />
        </button>
      )}
      
      {onDownloadImage && (
        <button 
          title="Download as Image"
          onClick={onDownloadImage} 
          className={buttonBaseClasses}
        >
          <DownloadSVG />
        </button>
      )}
    </div>
  );
};
