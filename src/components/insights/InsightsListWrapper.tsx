'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // Import Next.js Image component
import { PostData } from '@/types/post';
import Heading from '@/components/Common/Heading';
import Paragraph from '@/components/Common/Paragraph';
import Button from '@/components/Common/Button';
import { Tag } from '@/components/Common/Tag';
import { ViewGridIcon, ListBulletIcon } from '@radix-ui/react-icons';

// Export types so they can be imported by BlogClientUI
export type ContentType = 'all' | 'article' | 'podcast';
export type ViewMode = 'grid' | 'list';

interface InsightsListWrapperProps {
  allPostsData: PostData[];
  pageTitle?: string;
  pageSubtitle?: string;
}

const InsightCard: React.FC<{ post: PostData; viewMode: ViewMode }> = ({ post, viewMode }) => (
  <div className={`border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all ${
    viewMode === 'list' 
      ? 'mb-4 md:flex md:flex-row items-start' 
      : 'flex flex-col h-full'
    }`}>
    {post.image && (
      <div className={`relative ${viewMode === 'list' ? 'md:w-1/3 aspect-video' : 'w-full aspect-video'}`}> 
        <Image 
          src={post.image}
          alt={post.title}
          layout="fill" 
          objectFit="cover"
          className="transition-transform duration-300 hover:scale-105"
        />
      </div>
    )}
    <div className="p-5 flex flex-col flex-grow">
      <Heading level={3} className="text-lg font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
        <a href={`/insights/${post.slug}`} className="hover:underline">
          {post.title}
        </a>
      </Heading>
      <Paragraph className="text-sm text-muted-foreground mb-3">
        {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        {post.isPodcast && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary/20 text-secondary">Podcast</span>}
      </Paragraph>
      {post.excerpt && (
        <Paragraph className="text-sm mb-3 line-clamp-2">{post.excerpt}</Paragraph>
      )}
      <div className="flex flex-wrap gap-1 mt-auto pt-3 border-t border-border/50"> 
        {post.tags?.slice(0, 3).map(tag => <Tag key={tag} text={tag} />)}
        {post.tags && post.tags.length > 3 && <span className="text-xs text-muted-foreground">+{post.tags.length - 3} more</span>}
      </div>
    </div>
  </div>
);

const FeaturedInsightCard: React.FC<{ post: PostData }> = ({ post }) => (
  <div className="border border-border rounded-lg overflow-hidden shadow-sm mb-6">
    <div className="grid grid-cols-1 md:grid-cols-5 gap-0 items-center">
      {/* Image Column (Conditional) */} 
      {post.image && (
        <div className="relative md:col-span-3 h-[240px]">
          <Image 
            src={post.image}
            alt={post.title}
            layout="fill" 
            objectFit="cover"
          />
        </div>
      )}
      {/* Text Content Column - Spans full width if no image */} 
      <div className={`p-4 flex flex-col justify-center ${post.image ? 'md:col-span-2' : 'md:col-span-5'}`}> 
        <div className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
          Featured Insight
        </div>
        <Heading level={2} className="text-xl font-bold mb-2">
          <a href={`/insights/${post.slug}`} className="hover:text-primary transition-colors hover:underline">
            {post.title}
          </a>
        </Heading>
        {post.excerpt && (
          <Paragraph className="text-sm mb-3 line-clamp-2">{post.excerpt}</Paragraph>
        )}
        <Paragraph className="text-xs text-muted-foreground mb-3">
          {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          {post.isPodcast && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary/20 text-secondary">Podcast</span>}
        </Paragraph>
        <div className="flex flex-wrap gap-1 mb-3">
          {post.tags?.slice(0, 3).map(tag => <Tag key={tag} text={tag} />)}
          {post.tags && post.tags.length > 3 && <span className="text-xs text-muted-foreground">+{post.tags.length - 3} more</span>}
        </div>
        <Button href={`/insights/${post.slug}`} variant="primary" size="sm" className="w-full">
          Read More
        </Button>
      </div>
    </div>
  </div>
);

const InsightsListWrapper: React.FC<InsightsListWrapperProps> = ({
  allPostsData,
  pageTitle,
  pageSubtitle
}) => {
  const [activeContentType, setActiveContentType] = useState<ContentType>('all');
  const [activeTag, setActiveTag] = useState<string>(''); 
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filteredInsights, setFilteredInsights] = useState<PostData[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    if (!allPostsData) {
      setFilteredInsights([]); 
      setAllTags([]);
      return; 
    }

    const tagsSet = new Set<string>();
    allPostsData.forEach(post => post.tags?.forEach(tag => tagsSet.add(tag)));
    setAllTags(Array.from(tagsSet).sort());

    let result = allPostsData;

    if (activeContentType !== 'all') {
      result = result.filter(post => {
        if (activeContentType === 'podcast') return post.isPodcast;
        if (activeContentType === 'article') return !post.isPodcast;
        return true;
      });
    }

    if (activeTag) {
      result = result.filter(post =>
        post.tags && post.tags.includes(activeTag)
      );
    }

    setFilteredInsights(result);
  }, [activeContentType, activeTag, allPostsData]); 

  const handleTagChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveTag(event.target.value);
  };

  return (
    <div>
      <div className="container mx-auto px-4">
        {/* Compact header */}
        {pageTitle && <Heading level={1} className="text-3xl font-bold text-center mb-2">{pageTitle}</Heading>}
        {pageSubtitle && <Paragraph className="text-base text-muted-foreground text-center mb-4 max-w-3xl mx-auto">{pageSubtitle}</Paragraph>}
       
        {/* Featured article (if applicable) */}
        {filteredInsights.length > 0 && activeContentType === 'all' && activeTag === '' && (
          <FeaturedInsightCard post={filteredInsights[0]} />
        )}

        {/* Filter controls */}
        <div className="border-b border-border pb-4 mb-6">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div className="flex gap-2 flex-wrap">
              {(['all', 'article', 'podcast'] as ContentType[]).map(type => (
                <Button
                  key={type}
                  variant={activeContentType === type ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setActiveContentType(type)}
                  className="capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              {allTags.length > 0 && (
                <div className="relative w-40">
                  <select
                    value={activeTag}
                    onChange={handleTagChange}
                    className="w-full appearance-none bg-background border border-border rounded-md py-1 pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">All Tags</option>
                    {allTags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              )}
              <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')} aria-label="Grid View" className="h-8 w-8">
                <ViewGridIcon className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')} aria-label="List View" className="h-8 w-8">
                <ListBulletIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main insights grid/list */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
          {filteredInsights.length > 0 ? (
            filteredInsights
              .slice(activeContentType === 'all' && activeTag === '' ? 1 : 0)
              .map((post) => (
                <InsightCard key={post.slug} post={post} viewMode={viewMode} />
              ))
          ) : (
            <div className="py-8 text-center col-span-full border border-dashed border-border rounded-lg">
              <Paragraph className="text-base text-muted-foreground">No insights match your current filters.</Paragraph>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => {setActiveContentType('all'); setActiveTag('');}}>Reset Filters</Button>
            </div>
          )}
        </div>
        
        {/* Email Signup */}
        <div className="mt-10 mb-6 py-6 px-4 md:px-6 border-t border-border">
          <div className="max-w-2xl mx-auto text-center">
            <Heading level={3} className="text-lg font-semibold mb-2">Stay updated with our latest insights</Heading>
            <Paragraph className="mb-4 text-sm">Get notified about new articles on AI strategy and implementation.</Paragraph>
            <form className="flex gap-2 max-w-md mx-auto">
              <input type="email" placeholder="Your email" className="flex-grow px-3 py-1.5 text-sm rounded-md border border-border bg-background" />
              <Button variant="primary" size="sm">Subscribe</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsListWrapper;
