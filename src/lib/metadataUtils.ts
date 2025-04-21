import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { siteConfig } from '@/config/site';

// Default site image to use when no specific image is available
const DEFAULT_OG_IMAGE = siteConfig.ogImage;
const SITE_URL = siteConfig.url;

// Define the standard image dimensions for Open Graph
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

interface ContentMetadata {
  id?: string;
  title?: string;
  description?: string;
  image?: string;
  tags?: string[];
  status?: string;
  featured?: boolean;
  publishDate?: string;
  [key: string]: any; // For any additional frontmatter properties
}

/**
 * Create Open Graph and standard metadata for a page based on content metadata
 * 
 * @param contentMetadata - Metadata extracted from content frontmatter
 * @param basePath - Base path for the content type (e.g., '/forge', '/blog')
 * @returns Next.js Metadata object
 */
export function createMetadata(contentMetadata: ContentMetadata, basePath: string): Metadata {
  const title = contentMetadata.title ? 
    `${contentMetadata.title} | ${siteConfig.name}` : 
    siteConfig.name;
  const description = contentMetadata.description || siteConfig.description;
  
  // Process and optimize the image path
  const imageInfo = processContentImage(contentMetadata.image);
  
  // Construct canonical URL
  const canonicalUrl = contentMetadata.id 
    ? `${SITE_URL}${basePath}/${contentMetadata.id}` 
    : SITE_URL;
  
  // Build keywords from tags if available
  const keywords = contentMetadata.tags || siteConfig.keywords;

  return {
    title: title,
    description: description,
    keywords: keywords,
    authors: [{ name: siteConfig.author }],
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: canonicalUrl,
      title: title,
      description: description,
      siteName: siteConfig.name,
      images: [imageInfo]
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [imageInfo.url],
      creator: siteConfig.twitterHandle
    },
    alternates: {
      canonical: canonicalUrl,
    }
  };
}

/**
 * Process content image paths and ensure they're properly formatted for OG tags
 * 
 * @param imagePath Optional image path from content frontmatter
 * @returns Formatted image object for OpenGraph tags
 */
export function processContentImage(imagePath?: string): {
  url: string;
  width: number;
  height: number;
  alt: string;
} {
  // Default fallback image
  if (!imagePath) {
    return {
      url: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      alt: siteConfig.name
    };
  }

  // Handle absolute URLs
  if (imagePath.startsWith('http')) {
    return {
      url: imagePath,
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      alt: siteConfig.name
    };
  }

  // Handle relative paths - ensure they start with /
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return {
    url: `${SITE_URL}${normalizedPath}`,
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    alt: siteConfig.name
  };
}

/**
 * Loads content metadata from a markdown file
 * 
 * @param contentPath - Path to markdown file or directory containing index.md
 * @returns ContentMetadata object
 */
export async function loadContentMetadata(contentPath: string): Promise<ContentMetadata> {
  try {
    // Determine the actual file path (handle both direct file paths and directories)
    let filePath = contentPath;
    
    if (!contentPath.endsWith('.md')) {
      // If path is a directory, look for index.md
      const indexPath = path.join(contentPath, 'index.md');
      if (fs.existsSync(indexPath)) {
        filePath = indexPath;
      } else {
        // Try to find any .md file in the directory
        const files = fs.readdirSync(contentPath).filter(file => file.endsWith('.md'));
        if (files.length > 0) {
          filePath = path.join(contentPath, files[0]);
        } else {
          throw new Error(`No markdown file found in ${contentPath}`);
        }
      }
    }
    
    // Read the file content
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Extract frontmatter (assuming format like "---\nkey: value\n---\ncontent")
    const frontmatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---/);
    
    if (!frontmatterMatch) {
      return {}; // No frontmatter found
    }
    
    const frontmatterContent = frontmatterMatch[1];
    const metadata: ContentMetadata = {};
    
    // Parse frontmatter content into key-value pairs
    frontmatterContent.split('\n').forEach(line => {
      const match = line.match(/^([^:]+):\s*(.*)$/);
      if (match) {
        const [, key, value] = match;
        
        // Handle arrays (values starting with [ and ending with ])
        if (value.trim().startsWith('[') && value.trim().endsWith(']')) {
          try {
            metadata[key.trim()] = JSON.parse(value.replace(/'/g, '"'));
          } catch (e) {
            // Fall back to string if parsing fails
            metadata[key.trim()] = value.trim();
          }
        } else {
          // Handle normal values (remove quotes if present)
          metadata[key.trim()] = value.trim().replace(/^['"](.*)['"]$/, '$1');
        }
      }
    });
    
    return metadata;
  } catch (error) {
    console.error('Error loading content metadata:', error);
    return {}; // Return empty metadata on error
  }
}

/**
 * Utility to create a unified function for generating metadata across different page types
 * 
 * @param contentType The content type/section (e.g., 'blog', 'forge', 'services')
 * @param contentId Optional content ID for specific pages
 * @returns Metadata generator function compatible with Next.js
 */
export function createMetadataGenerator(contentType: string, contentId?: string) {
  return async function generateMetadata(): Promise<Metadata> {
    const basePath = `/${contentType}`;
    let contentPath: string;
    
    if (contentId) {
      // For specific content pages (e.g., blog/[slug])
      contentPath = path.join(process.cwd(), `src/content/${contentType}/${contentId}.md`);
      
      // Handle case where the content might be in a subdirectory with same name
      if (!fs.existsSync(contentPath)) {
        contentPath = path.join(process.cwd(), `src/content/${contentType}/${contentId}/index.md`);
      }
    } else {
      // For section landing pages
      contentPath = path.join(process.cwd(), `src/content/${contentType}/index.md`);
      
      // If no index.md exists, try to find any .md file for fallback metadata
      if (!fs.existsSync(contentPath)) {
        const contentDir = path.join(process.cwd(), `src/content/${contentType}`);
        if (fs.existsSync(contentDir)) {
          const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'));
          if (files.length > 0) {
            contentPath = path.join(contentDir, files[0]);
          }
        }
      }
    }
    
    // Load metadata from content file
    let contentMetadata: ContentMetadata = {};
    
    if (fs.existsSync(contentPath)) {
      contentMetadata = await loadContentMetadata(contentPath);
    }
    
    // Generate and return metadata
    return createMetadata(contentMetadata, basePath);
  };
}
