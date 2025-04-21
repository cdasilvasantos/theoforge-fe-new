'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PostData } from '@/types/post';
import BlogContentControls from './BlogContentControls';

interface BlogClientProps {
  allPosts: PostData[];
}

type ViewMode = 'grid' | 'list';

const BlogClient: React.FC<BlogClientProps> = ({ allPosts }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filteredPosts, setFilteredPosts] = useState<PostData[]>(allPosts.slice(1)); // All except featured
  const [featuredPost, setFeaturedPost] = useState<PostData>(allPosts[0]);

  // Get unique tags from all posts
  const uniqueTags: string[] = Array.from(
    new Set(
      allPosts.flatMap(post => post.tags || [])
    )
  ).sort();

  // Handle posts filtering
  const handleFilter = (filtered: PostData[]) => {
    // If we have filtered posts, set them and update featured post
    if (filtered.length > 0) {
      setFilteredPosts(filtered.slice(1));
      setFeaturedPost(filtered[0]);
    } else {
      // If no posts match filter, show empty state
      setFilteredPosts([]);
      // Keep the original featured post
      setFeaturedPost(allPosts[0]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white">
          Insights & Expertise
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Enterprise technology strategies and thought leadership for forward-thinking executives
        </p>
      </div>
      
      {/* Interactive Filter Controls */}
      <BlogContentControls 
        posts={allPosts}
        uniqueTags={uniqueTags}
        onFilter={handleFilter}
        onViewModeChange={setViewMode}
      />
      
      {/* Featured Post */}
      {featuredPost && (
        <div className="mb-12">
          <span className="block text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
            FEATURED INSIGHT
          </span>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
            <div className="relative h-60 md:h-auto md:min-h-[320px]">
              <Image 
                src={featuredPost.image || '/images/placeholder.png'} 
                alt={featuredPost.title} 
                fill 
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {featuredPost.isPodcast && (
                <div 
                  className="absolute top-4 left-4 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold"
                >
                  PODCAST
                </div>
              )}
            </div>
            
            <div className="p-4 md:p-6 flex flex-col">
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  {featuredPost.tags?.slice(0, 3).map((tag: string) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                    >
                      <svg className="-ml-0.5 mr-1.5 h-3 w-3 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5a.997.997 0 01.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      {tag}
                    </span>
                  ))}
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                  {featuredPost.title}
                </h2>
                
                <p className="text-base text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {featuredPost.excerpt || featuredPost.title}
                </p>
              </div>
              
              <div className="mt-auto">
                <div className="flex items-center mb-4">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(featuredPost.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    {featuredPost.readingTime && ` · ${featuredPost.readingTime} min read`}
                  </span>
                </div>
                
                <Link 
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Read {featuredPost.isPodcast ? 'Episode' : 'Article'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* No Results State */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
            No matching content found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Try adjusting your filters or selecting different tags
          </p>
        </div>
      )}
      
      {/* Content Grid or List View */}
      {filteredPosts.length > 0 && (
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1'} gap-4 md:gap-6 mb-12`}>
          {filteredPosts.map((post: PostData) => (
            <Link 
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={`flex ${viewMode === 'grid' ? 'flex-col' : 'flex-col sm:flex-row'} h-full rounded-lg overflow-hidden transition-all duration-200 ease-in-out hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-gray-800 shadow-md no-underline text-inherit`}
            >
              {/* Image container - adjustments for list view */}
              <div className={`relative ${viewMode === 'grid' ? 'h-48' : 'h-48 sm:h-auto sm:w-1/3 md:w-1/4'} flex-shrink-0`}>
                <Image 
                  src={post.image || '/images/placeholder.png'} 
                  alt={post.title} 
                  fill 
                  style={{ objectFit: 'cover' }}
                  sizes={viewMode === 'grid' ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" : "(max-width: 640px) 100vw, 33vw"}
                />
                {post.isPodcast && (
                  <div 
                    className="absolute top-2 left-2 bg-blue-600 text-white px-1.5 py-0.5 rounded text-[0.65rem] font-bold z-10"
                  >
                    PODCAST
                  </div>
                )}
              </div>
              
              {/* Content container */}
              <div className={`p-3 ${viewMode === 'grid' ? 'sm:p-4' : 'sm:p-5'} flex flex-col flex-grow`}>
                <h3 
                  className={`font-bold ${viewMode === 'grid' ? 'text-lg mb-1' : 'text-xl mb-2'} flex-grow leading-snug text-gray-900 dark:text-white line-clamp-3`}
                >
                  {post.title}
                </h3>
                
                {/* Show excerpt only in list view for better space usage */} 
                {viewMode === 'list' && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {post.excerpt || post.title}
                  </p>
                )}
                
                <div className="flex justify-between items-center mt-auto pt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  
                  <div className="flex flex-wrap justify-end gap-1">
                    {post.tags?.slice(0, viewMode === 'grid' ? 2 : 3).map((tag: string) => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center px-1.5 py-0.5 rounded text-[0.65rem] font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogClient;
