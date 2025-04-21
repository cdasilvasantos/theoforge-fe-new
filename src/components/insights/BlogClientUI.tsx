'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  useRouter, useSearchParams, usePathname
} from 'next/navigation'; // Import navigation hooks

import { PostData } from '@/types/post'; // Corrected import path for type
import BlogCard from './BlogCard'; // Assuming BlogCard is in the same directory now
import NewsletterSignup from '@/components/insights/NewsletterSignup'; // Corrected path

// Import types used in props
import { ContentType, ViewMode } from './InsightsListWrapper'; // Adjust path if necessary

interface BlogClientUIProps {
  allTags: string[];
  // Add props passed from the wrapper
  activeContentType: ContentType;
  activeTags: string[];
  viewMode: ViewMode;
  postsToDisplay: PostData[];
  handleContentTypeChange: (type: ContentType) => void;
  handleTagToggle: (tag: string) => void;
  handleResetFilters: () => void;
  handleViewModeChange: (mode: ViewMode) => void;
}

export default function BlogClientUI({
  allTags,
  // Destructure new props
  activeContentType,
  activeTags,
  viewMode,
  postsToDisplay,
  handleContentTypeChange,
  handleTagToggle,
  handleResetFilters,
  handleViewModeChange,
}: BlogClientUIProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State derived from URL
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('q') || '';

  // Local state only for the controlled search input
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Helper function to update URL search parameters
  const updateSearchParams = useCallback((paramsToUpdate: { [key: string]: string | null }) => {
    const current = new URLSearchParams(Array.from(searchParams.entries())); // Create mutable copy

    Object.entries(paramsToUpdate).forEach(([key, value]) => {
      if (value === null || value === '') {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });

    // Always remove page if it's 1
    if (current.get('page') === '1') {
      current.delete('page');
    }

    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`);
  }, [pathname, router, searchParams]);

  // Update local search query if URL changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Debounce search input (optional but recommended)
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearchQuery !== searchQuery) {
        updateSearchParams({ q: localSearchQuery, page: '1' }); // Reset to page 1 on new search
      }
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [localSearchQuery, searchQuery, updateSearchParams]); // Re-run when local query changes

  // Pagination Calculations
  const totalPosts = postsToDisplay.length;
  const totalPages = Math.ceil(totalPosts / 9);
  const startIndex = (currentPage - 1) * 9;
  const endIndex = startIndex + 9;
  const paginatedPostsToDisplay = postsToDisplay.slice(startIndex, endIndex); // Paginate the filtered posts

  // Event Handlers
  const handlePageChange = (value: number) => { // Remove the event parameter
    if (value >= 1 && value <= totalPages) { // Add basic validation
      updateSearchParams({ page: value.toString() });
    }
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateSearchParams({ q: localSearchQuery, page: '1' }); // Reset to page 1 on new search
  };

  return (
    <div className="py-16 bg-background-light dark:bg-background-dark"> {/* Consistent padding, theme bg */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
        {/* Header Section */}
        <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto"> 
          <div className="flex items-center justify-center mb-4"> {/* Spacing guide */}
            {/* Lightbulb Icon SVG - Use accent color */}
            <svg className="w-5 h-5 text-accent dark:text-dark-accent mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 3a1 1 0 100 2h.01a1 1 0 100-2H11zM12 7h-1v11h1V7zM5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"></path><path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd"></path></svg>
            <span className="font-poppins text-sm font-semibold uppercase tracking-widest text-accent dark:text-dark-accent"> {/* Typography + Theme Color */}
              THEOFORGE INSIGHTS
            </span>
          </div>
          <h1 className="font-poppins text-4xl md:text-5xl font-semibold mb-4 text-text-primary dark:text-dark-text-primary"> {/* Typography + Theme Color */}
            AI Strategy & Implementation
          </h1>
          <p className="font-poppins text-lg text-text-secondary dark:text-dark-text-secondary leading-relaxed"> {/* Typography + Theme Color */}
            Practical perspectives for business leaders navigating the AI transformation —
            from strategic planning to effective implementation and team enablement.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12 flex flex-col md:flex-row gap-6 items-start"> {/* Spacing guide */}
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md"> 
            {/* Input with Theme Styles */}
            <input
              type="search" 
              placeholder="Search articles & podcasts..."
              value={localSearchQuery}
              onChange={handleSearchInputChange}
              className="font-poppins w-full pl-10 pr-4 py-2 border border-border-light dark:border-border-dark rounded-md focus:ring-primary focus:border-primary bg-background-input-light dark:bg-background-input-dark text-text-primary dark:text-dark-text-primary placeholder-text-secondary dark:placeholder-dark-text-secondary transition-colors duration-150 ease-in-out"
            />
            {/* Search Icon SVG */}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-text-secondary dark:text-dark-text-secondary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
            </div>
          </form>

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row flex-grow gap-4 items-center justify-center md:justify-end"> {/* Spacing guide */}
            {/* Content Type Filter */} 
            <div className="flex justify-center gap-2"> {/* Spacing guide */}
              {[ 'all', 'article', 'podcast'].map((type) => {
                const isActive = activeContentType === type;
                const baseClasses = "font-poppins px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors duration-150 ease-in-out whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary";
                const selectedClasses = "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-dark-primary dark:text-dark-primary-foreground dark:hover:bg-dark-primary/90";
                const defaultClasses = "bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-secondary dark:text-dark-text-secondary hover:bg-muted-light dark:hover:bg-muted-dark hover:text-text-primary dark:hover:text-dark-text-primary";
                let label = type.charAt(0).toUpperCase() + type.slice(1); 
                if (type === 'all') label = 'All Content';
                
                return (
                  <button
                    key={type}
                    className={`${baseClasses} ${isActive ? selectedClasses : defaultClasses}`.trim()}
                    onClick={() => {
                      handleContentTypeChange(type as ContentType)
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="hidden sm:block border-l border-border-light dark:border-border-dark h-6 mx-2"></div> {/* Theme Border */}

            {/* View Mode Toggle */} 
            <div className="flex gap-2"> {/* Spacing guide */} 
              <button 
                className={`p-1.5 rounded-md border transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary 
                          ${viewMode === 'grid' 
                            ? 'bg-primary text-primary-foreground border-primary dark:bg-dark-primary dark:text-dark-primary-foreground dark:border-dark-primary' 
                            : 'bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark text-text-secondary dark:text-dark-text-secondary hover:bg-muted-light dark:hover:bg-muted-dark hover:text-text-primary dark:hover:text-dark-text-primary'}`}
                aria-label="Grid view"
                onClick={() => handleViewModeChange('grid')}
              >
                {/* Grid Icon SVG */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg> { /* Updated Grid Icon */}
              </button>
              <button 
                className={`p-1.5 rounded-md border transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary 
                          ${viewMode === 'list' 
                            ? 'bg-primary text-primary-foreground border-primary dark:bg-dark-primary dark:text-dark-primary-foreground dark:border-dark-primary' 
                            : 'bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark text-text-secondary dark:text-dark-text-secondary hover:bg-muted-light dark:hover:bg-muted-dark hover:text-text-primary dark:hover:text-dark-text-primary'}`}
                aria-label="List view"
                onClick={() => handleViewModeChange('list')}
              >
                {/* List Icon SVG */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Tag Filters (reuse BlogContentControls logic here if needed, or simplify) */} 
        <div className="mb-8 pb-2 overflow-x-auto"> 
          <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-2"> 
            {(() => { // IIFE for constants scope
              const isAllTagsActive = activeTags.length === 0;
              const baseClasses = "font-poppins px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors duration-150 ease-in-out whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary";
              const selectedClasses = "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-dark-primary dark:text-dark-primary-foreground dark:hover:bg-dark-primary/90";
              const defaultClasses = "bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-secondary dark:text-dark-text-secondary hover:bg-muted-light dark:hover:bg-muted-dark hover:text-text-primary dark:hover:text-dark-text-primary";
              
              return (
                <>
                  <button 
                    onClick={handleResetFilters}
                    className={`${baseClasses} ${isAllTagsActive ? selectedClasses : defaultClasses}`.trim()}
                  >
                    All Tags
                  </button>
                  {allTags.map((tag) => {
                    const isActive = activeTags.includes(tag);
                    return (
                      <button 
                        key={tag} 
                        onClick={() => handleTagToggle(tag)}
                        className={`${baseClasses} ${isActive ? selectedClasses : defaultClasses}`.trim()}
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

        {/* Blog Posts Grid/List */}
        <div className={`mb-10 ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-6'}`}> {/* Replaced Grid container */}
          {paginatedPostsToDisplay.length > 0 ? (
            paginatedPostsToDisplay.map((post, index) => (
              <BlogCard 
                post={post} 
                viewMode={viewMode} 
                key={post.slug} 
                index={index} 
                currentPage={currentPage} // Pass currentPage
              />
            ))
          ) : (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3"> {/* Ensure it spans full width */}
              <div className="text-center py-12 px-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <h6 className="font-poppins text-xl font-semibold text-gray-800 dark:text-white mb-2">No posts found.</h6>
                <p className="font-poppins text-lg text-text-secondary dark:text-dark-text-secondary">Try adjusting your search or filters.</p>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="flex justify-center mt-8" aria-label="Pagination"> {/* Replaced Box and Pagination */}
            {/* Simple button pagination - Can enhance with number links if needed */}
            <button 
              onClick={() => handlePageChange(currentPage - 1)} // Pass only the page number
              disabled={currentPage === 1}
              className="font-poppins relative inline-flex items-center px-2 py-2 rounded-l-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm font-medium text-text-secondary dark:text-dark-text-secondary hover:bg-muted-light dark:hover:bg-muted-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="font-poppins relative inline-flex items-center px-4 py-2 border-t border-b border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => handlePageChange(currentPage + 1)} // Pass only the page number
              disabled={currentPage === totalPages}
              className="font-poppins relative inline-flex items-center px-2 py-2 rounded-r-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm font-medium text-text-secondary dark:text-dark-text-secondary hover:bg-muted-light dark:hover:bg-muted-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
            {/* 
            <Pagination // Keep MUI Pagination for rich features if preferred temporarily
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
            />
             */}
          </nav>
        )}

        {/* Newsletter Signup Section */}
        <div className="mt-16 md:mt-24 py-10 md:py-16 bg-gray-100 dark:bg-gray-800 rounded-lg"> {/* Replaced Box */}
          <div className="max-w-2xl mx-auto px-4"> {/* Replaced Container */}
            <NewsletterSignup /> 
          </div>
        </div>
      </div>
    </div>
  );
}
