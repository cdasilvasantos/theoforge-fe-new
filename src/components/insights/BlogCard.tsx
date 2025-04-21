'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PostData } from '@/types/post';
import { ViewMode } from './InsightsListWrapper';
import BaseCard from '../Common/BaseCard';

interface BlogCardProps {
  post: PostData;
  viewMode?: ViewMode; // Made optional
  index?: number;      // Add index prop
  currentPage?: number; // Add currentPage prop
}

const BlogCard: React.FC<BlogCardProps> = ({ post, index, currentPage /*, viewMode*/ }) => { // Accept index and currentPage
  const linkHref = `/insights/${post.slug}`; // Corrected path to insights

  // --- "New" Badge Logic ---
  const isNew = (() => {
    if (!post.date) return false; // Can't determine if no date
    try {
      const postDate = new Date(post.date);
      const today = new Date();
      const timeDiff = today.getTime() - postDate.getTime();
      const daysDiff = timeDiff / (1000 * 3600 * 24); // Difference in days
      return daysDiff <= 7; // Consider posts within the last 7 days as "New"
    } catch (error) {
      console.error("Error parsing date for blog card:", post.date, error);
      return false;
    }
  })();
  // ------------------------

  return (
    // Use BaseCard, pass specific classes via className prop
    // Remove group from BaseCard, add it to the Link for hover effects
    <BaseCard className="relative w-full"> 
      {/* Link now wraps the entire content for full clickability */}
      <Link 
        href={linkHref}
        className="no-underline text-inherit flex flex-col flex-grow group rounded-md overflow-hidden" // Added group, rounded, overflow
      >
        {isNew && (
          // Replaced Chip with span (Keep badge outside the main flex flow)
          <span 
            className="absolute bottom-2 right-2 z-10 bg-primary text-primary-foreground font-poppins text-xs font-bold px-2 py-0.5 rounded"
          >
            New
          </span>
        )}
        {/* Image container: Remove rounding here, applied to Link */} 
        <div className="relative overflow-hidden w-full"> 
          {post.image ? (
            // Replaced CardMedia with Image, added group-hover for scale effect
            <Image
              src={post.image || '/images/default-blog-banner.jpg'} // Ensure default
              alt={post.title}
              width={320} // Standard width
              height={180} // Standard height (16:9 aspect ratio)
              className="w-full h-auto object-cover bg-neutral-200 dark:bg-neutral-700 transition-transform duration-300 ease-in-out group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 50vw" // Adjust sizes as needed
              priority={index === 0 && currentPage === 1} // Update priority condition
            />
          ) : (
            // Placeholder: Ensure consistent aspect ratio
            <div className="w-full aspect-video bg-muted-light dark:bg-muted-dark flex items-center justify-center">
              {/* Replaced Typography with p */}
              <p className="font-poppins text-xs text-text-secondary dark:text-dark-text-secondary">
                Image Coming Soon
              </p>
            </div>
          )}
        </div>
        {/* Content Area: Use modular scale for consistency */}
        <div className="p-4 flex-grow flex flex-col"> 
          {/* Replaced Typography with h2 */}
          <h2 className="font-poppins font-semibold text-lg mb-4 text-text-primary dark:text-dark-text-primary"> 
            {post.title}
          </h2>
          {/* Display the first tag if available */}
          {post.tags && post.tags.length > 0 && (
            <span className="font-poppins text-xs uppercase tracking-wider text-primary font-medium mb-2"> 
              {post.tags[0]}
            </span>
          )}
          {/* Excerpt - Simple paragraph */}
          <p className="font-poppins text-sm text-text-secondary dark:text-dark-text-secondary mt-2 mb-4 flex-grow line-clamp-3"> 
            {post.excerpt}
          </p>

          {/* Tags Section */}
          {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
            // Replaced Box with div, mt-auto to push to bottom within flex container
            <div className="mt-auto pt-4 mb-0"> 
              {/* Replaced Stack with div using flex */}
              <div className="flex flex-row flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => ( 
                  // Replaced Chip with span
                  <span key={tag} className="font-poppins px-2 py-0.5 border border-border-light dark:border-border-dark rounded text-xs text-text-secondary dark:text-dark-text-secondary bg-muted-light dark:bg-muted-dark"> 
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Link> 
    </BaseCard>
  );
};

export default BlogCard;
