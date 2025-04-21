'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { PostData } from '@/types/post';
import BlogCard from './BlogCard'; 

// Define type for content filtering
type ContentType = 'all' | 'article' | 'podcast';
type SortOrder = 'newest' | 'oldest';

interface BlogPageEnhancerProps {
  posts: PostData[];
}

const BlogPageEnhancer: React.FC<BlogPageEnhancerProps> = ({ posts }) => {
  // State for content filtering
  const [selectedContentType] = useState<ContentType>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  // --- Data Processing & Filtering --- //

  // Get the top N most frequent tags from all posts
  const topTags = useMemo(() => {
    const tagFrequency: { [key: string]: number } = {};
    posts.forEach(post => {
      post.tags?.forEach(tag => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
      });
    });

    // Sort tags by frequency (descending) and then alphabetically
    const sortedTags = Object.keys(tagFrequency).sort((a, b) => {
      const freqDiff = tagFrequency[b] - tagFrequency[a];
      if (freqDiff !== 0) return freqDiff;
      return a.localeCompare(b); // Alphabetical secondary sort
    });

    // Return top N tags (e.g., top 10)
    const MAX_TAGS_TO_SHOW = 10;
    return sortedTags.slice(0, MAX_TAGS_TO_SHOW);
  }, [posts]);

  // --- Filtering Logic --- //
  const filteredPosts = useMemo(() => {
    const processedPosts = posts.filter(post => {
      // Content Type Filter
      // Handle cases where post.content_type might be missing
      const postContentType = post.isPodcast ? 'podcast' : 'article'; // Determine content type based on isPodcast flag
      const contentTypeMatch = selectedContentType === 'all' || postContentType === selectedContentType;

      // Tag Filter
      // Ensure post.tags is always an array for filtering
      const postTags = Array.isArray(post.tags) ? post.tags : []; 
      const tagsMatch = selectedTags.length === 0 || selectedTags.every(tag => postTags.includes(tag));

      return contentTypeMatch && tagsMatch;
    });

    // Sorting Logic
    processedPosts.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return processedPosts;
  }, [posts, selectedContentType, selectedTags, sortOrder]);

  // --- Event Handlers --- //
  const handleSortChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(event.target.value as SortOrder);
  }, []);

  const handleTagToggle = useCallback((tag: string) => {
    // If the clicked tag is already selected, remove it
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag) // Remove tag
        : [...prev, tag] // Add tag (allow multiple tags)
    );
  }, []);

  const handleClearTags = useCallback(() => {
    setSelectedTags([]);
  }, []);

  // --- Render Logic --- //
  return (
    // Replaced Box with div
    <div className="w-full py-4">
      {/* Filter and Sort Controls - Replaced Box with div using flex */}
      <div 
        className="flex flex-wrap gap-4 mb-6 items-center" // Increased gap and mb
      >
        {/* Tag Filters Section - Replaced Box with div using flex */}
        <div className="flex-grow-[2] min-w-[300px] flex flex-wrap gap-2 items-center"> 
          {/* Replaced Typography with span */}
          <span className="mr-1 font-medium text-sm text-gray-700 shrink-0">Filter by Tag:</span>
          {/* Replaced Stack with div using flex */}
          <div className="flex flex-row gap-2 flex-wrap">
            {topTags.map((tag) => (
              // Replaced Chip with button for clickability and styling
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-2.5 py-0.5 rounded text-xs border transition-colors duration-150 ease-in-out 
                  ${selectedTags.includes(tag) 
                    ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              >
                {tag}
              </button>
            ))}
          </div>
          {selectedTags.length > 0 && (
            // Replaced Button with button
            <button
              type="button"
              onClick={handleClearTags}
              className="ml-1 px-2 py-1 text-xs text-indigo-600 hover:text-indigo-800 shrink-0 focus:outline-none"
            >
              Clear Tags
            </button>
          )}
        </div>

        {/* Sorting Options - Replaced Box and FormControl with div/label/select */}
        <div className="flex-grow min-w-[200px]"> 
          <label htmlFor="sort-by-select" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select
            id="sort-by-select"
            value={sortOrder}
            onChange={handleSortChange}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Blog Post Grid - Replaced Box with div using grid */}
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-4" // Adjusted gap
      >
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))
        ) : (
          // Replaced Typography with p, added grid-column span
          <p className="col-span-1 sm:col-span-2 md:col-span-3 text-gray-500">
            No posts match the current filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default BlogPageEnhancer;
