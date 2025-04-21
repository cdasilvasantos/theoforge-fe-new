'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { PostData } from '@/types/post';

// Define content directory with explicit normalization
const postsDirectory = path.resolve(process.cwd(), 'src', 'content', 'blog');
console.log('Posts directory resolved to:', postsDirectory);

// Helper function to get all post slugs (filenames without .md)
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    console.log('Reading directory:', postsDirectory);
    
    // Check if directory exists
    try {
      await fs.promises.access(postsDirectory, fs.constants.R_OK);
    } catch {
      console.error('Blog directory does not exist or is not readable:', postsDirectory);
      return [];
    }
    
    const fileNames = await fs.promises.readdir(postsDirectory);
    console.log('Files found in directory:', fileNames);
    
    const mdFiles = fileNames.filter(fileName => fileName.endsWith('.md'));
    console.log('Markdown files found:', mdFiles);
    
    return mdFiles.map(fileName => fileName.replace(/\.md$/, ''));
  } catch (error: unknown) {
    console.error('Error reading blog directory:', error);
    return [];
  }
}

// Helper function to get data for a single post by slug
export async function getPostData(slug: string): Promise<PostData | null> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  // console.log('Attempting to read file:', fullPath); // Keep this commented unless needed
  let matterResult: matter.GrayMatterFile<string>;

  try {
    const fileContents = await fs.promises.readFile(fullPath, 'utf8');
    matterResult = matter(fileContents);
  } catch (error: unknown) {
    console.error(`Error reading or parsing file ${fullPath}:`, error);
    if (error instanceof Error) {
        console.error(`Error details: ${error.message}`);
    }
    return null; 
  }

  const frontmatter = matterResult.data || {};

  // --- Debugging Log --- 
  console.log(`[getPostData - ${slug}] Raw frontmatter.isPodcast:`, frontmatter.isPodcast, `(Type: ${typeof frontmatter.isPodcast})`);
  // ---------------------

  const postData: PostData = {
    slug,
    title: frontmatter.title ?? 'Untitled Post',
    date: frontmatter.date ?? new Date().toISOString(),
    excerpt: frontmatter.excerpt ?? '',
    content: matterResult.content,
    author: frontmatter.author,
    image: frontmatter.image,
    tags: frontmatter.tags ?? [],
    readingTime: frontmatter.readingTime,
    isPodcast: frontmatter.isPodcast ?? false, // Default to false if undefined/null
    podcastEpisodeNumber: frontmatter.podcastEpisodeNumber,
    podcastDuration: frontmatter.podcastDuration,
    podcastHost: frontmatter.podcastHost,
    podcastGuest: frontmatter.podcastGuest,
    podcastSpotifyUrl: frontmatter.podcastSpotifyUrl,
    podcastAppleUrl: frontmatter.podcastAppleUrl,
    podcastGoogleUrl: frontmatter.podcastGoogleUrl, 
    podcastRssUrl: frontmatter.podcastRssUrl, 
  };

  // --- Debugging Log --- 
  console.log(`[getPostData - ${slug}] Final postData.isPodcast:`, postData.isPodcast);
  // ---------------------

  return postData;
}

// Helper function to get sorted data for all posts
export async function getSortedPostsData(): Promise<PostData[]> {
  try {
    const allSlugs = await getAllPostSlugs();
    console.log('All slugs found:', allSlugs);
    
    if (allSlugs.length === 0) {
      console.warn('No blog posts found!');
      return [];
    }
    
    // Process each slug sequentially to avoid overwhelming the system
    const allPostsData: PostData[] = [];
    for (const slug of allSlugs) {
      const postData = await getPostData(slug);
      if (postData) {
        allPostsData.push(postData);
      }
    }
    
    console.log(`Successfully processed ${allPostsData.length} out of ${allSlugs.length} posts`);
    
    // Sort posts by date
    return allPostsData.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      }
      return -1;
    });
  } catch (error: unknown) {
    console.error('Error getting sorted posts data:', error);
    return [];
  }
}

// Get all unique tags across all posts
export async function getAllTags(): Promise<string[]> {
  try {
    const allPosts = await getSortedPostsData();
    const tagSet = new Set<string>();
    
    allPosts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => tagSet.add(tag));
      }
    });
    
    const tags = Array.from(tagSet).sort();
    console.log('All tags found:', tags);
    return tags;
  } catch (error: unknown) {
    console.error('Error getting all tags:', error);
    return [];
  }
}

// Get posts filtered by tag
export async function getPostsByTag(tag: string): Promise<PostData[]> {
  try {
    const allPosts = await getSortedPostsData();
    const filteredPosts = allPosts.filter(post => 
      post.tags && Array.isArray(post.tags) && post.tags.includes(tag)
    );
    console.log(`Found ${filteredPosts.length} posts with tag: ${tag}`);
    return filteredPosts;
  } catch (error: unknown) {
    console.error(`Error getting posts by tag ${tag}:`, error);
    return [];
  }
}
