'use client';

import React, { useState } from 'react';
import { PostData } from '@/types/post';

type ContentType = 'all' | 'article' | 'podcast';
type ViewMode = 'grid' | 'list';

interface BlogContentControlsProps {
  posts: PostData[];
  uniqueTags: string[];
  onFilter: (filteredPosts: PostData[]) => void;
  onViewModeChange: (mode: ViewMode) => void;
}

const BlogContentControls: React.FC<BlogContentControlsProps> = ({ 
  posts, 
  uniqueTags, 
  onFilter,
  onViewModeChange
}) => {
  const [activeContentType, setActiveContentType] = useState<ContentType>('all');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Filter posts by content type and tags
  const filterPosts = () => {
    let filtered = [...posts];
    
    // Filter by content type
    if (activeContentType !== 'all') {
      filtered = filtered.filter(post => {
        if (activeContentType === 'podcast') return post.isPodcast;
        if (activeContentType === 'article') return !post.isPodcast;
        return true;
      });
    }
    
    // Filter by tags (if any tags are selected)
    if (activeTags.length > 0) {
      filtered = filtered.filter(post => 
        post.tags && post.tags.some(tag => activeTags.includes(tag))
      );
    }
    
    onFilter(filtered);
  };

  // Handle content type selection
  const handleContentTypeChange = (type: ContentType) => {
    setActiveContentType(type);
    setTimeout(() => filterPosts(), 0);
  };

  // Handle tag selection
  const handleTagToggle = (tag: string) => {
    const newActiveTags = activeTags.includes(tag)
      ? activeTags.filter(t => t !== tag)
      : [...activeTags, tag];
    
    setActiveTags(newActiveTags);
    setTimeout(() => filterPosts(), 0);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setActiveContentType('all');
    setActiveTags([]);
    onFilter(posts);
  };

  // Toggle view mode
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    onViewModeChange(mode);
  };

  return (
    <div className="mb-6"> 
      {/* Content Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          {/* Filter Icon SVG */}
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
          <span className="text-base font-medium text-gray-800 dark:text-gray-200"> 
            Filter Content
          </span>
        </div>
        
        {/* Content Type Filters */}
        <div className="flex flex-wrap justify-center gap-2"> 
          {[ 'all', 'article', 'podcast'].map((type) => {
            const isActive = activeContentType === type;
            const baseClasses = "px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors duration-150 ease-in-out";
            const selectedClasses = "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600";
            const defaultClasses = "bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";
            let label = type.charAt(0).toUpperCase() + type.slice(1); // Capitalize
            if (type === 'all') label = 'All Content';
            
            return (
              <button
                key={type}
                className={`${baseClasses} ${isActive ? selectedClasses : defaultClasses}`}
                onClick={() => handleContentTypeChange(type as ContentType)}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2"> 
          <button 
            className={`p-2 rounded-md border transition-colors duration-150 ease-in-out 
                      ${viewMode === 'grid' 
                        ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500' 
                        : 'bg-transparent border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            aria-label="Grid view"
            onClick={() => handleViewModeChange('grid')}
          >
            {/* Grid Icon SVG */}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
          </button>
          <button 
            className={`p-2 rounded-md border transition-colors duration-150 ease-in-out 
                      ${viewMode === 'list' 
                        ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500' 
                        : 'bg-transparent border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            aria-label="List view"
            onClick={() => handleViewModeChange('list')}
          >
            {/* List Icon SVG */}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
          </button>
        </div>
      </div>

      {/* Tag Navigation */}
      <div className="mb-8 pb-2 overflow-x-auto"> 
        <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-2"> 
          {(() => { 
            const isAllTagsActive = activeTags.length === 0;
            const baseClasses = "px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors duration-150 ease-in-out whitespace-nowrap";
            const selectedClasses = "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600";
            const defaultClasses = "bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";
            
            return (
              <>
                <button 
                  className={`${baseClasses} ${isAllTagsActive ? selectedClasses : defaultClasses}`}
                  onClick={handleResetFilters}
                >
                  All Tags
                </button>
                {uniqueTags.map((tag: string) => {
                  const isActive = activeTags.includes(tag);
                  return (
                    <button 
                      key={tag} 
                      className={`${baseClasses} ${isActive ? selectedClasses : defaultClasses}`}
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </button>
                  );
                })}
              </>
            );
          })()} 
        </div>
      </div>
    </div>
  );
};

export default BlogContentControls;
