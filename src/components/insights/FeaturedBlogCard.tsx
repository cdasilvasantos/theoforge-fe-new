'use client'; // Assume client component if using hooks like useTheme, otherwise remove

import React from 'react';
import Image from 'next/image';
import { PostData } from '@/types/post';
import Link from 'next/link';

interface FeaturedBlogCardProps {
  post: PostData;
}

const FeaturedBlogCard: React.FC<FeaturedBlogCardProps> = ({ post }) => {
  const linkHref = `/blog/${post.slug}`;

  return (
    <div className="flex flex-col md:flex-row rounded-lg shadow-lg mb-8 overflow-hidden bg-card dark:bg-card-dark border border-border dark:border-border-dark">
      <Link href={linkHref} className="flex flex-col md:flex-row w-full no-underline text-inherit group relative">
        <div className="w-full md:w-1/2">
          <Image
            src={post.image || '/images/default-blog-banner.jpg'} // Use default if missing
            alt={post.title}
            fill
            style={{ objectFit: 'cover' }} // Use style prop for objectFit with fill
            sizes="(max-width: 768px) 100vw, 50vw" // Adjust sizes as needed
            className="transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>
        <div className="w-full md:w-1/2">
          <div className="p-6 flex flex-col h-full">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary dark:text-primary-dark mb-2">
              Featured Post
            </span>
            <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-3 text-foreground dark:text-foreground-dark group-hover:text-primary-hover dark:group-hover:text-primary-dark-hover transition-colors duration-200">
              {post.title}
            </h2>
            <p className="text-base text-muted-foreground dark:text-muted-foreground-dark mb-4 flex-grow">
              {post.excerpt}
            </p>
            
            {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 4).map((tag) => (
                    <span 
                      key={tag} 
                      className="inline-block bg-muted dark:bg-muted-dark rounded-full px-2 py-0.5 text-xs text-muted-foreground dark:text-muted-foreground-dark border border-border dark:border-border-dark"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 mt-auto pt-2 border-t border-border dark:border-border-dark">
              <span className="text-xs text-muted-foreground dark:text-muted-foreground-dark flex-grow">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                {post.readingTime ? ` • ${post.readingTime}` : ''}
              </span>
              {post.isPodcast && (
                <span 
                  className="inline-flex items-center bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full px-2 py-0.5 text-xs font-semibold"
                >
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V4a1 1 0 00-.196-.565A1 1 0 0018 3z"></path></svg>
                  Podcast
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default FeaturedBlogCard;
