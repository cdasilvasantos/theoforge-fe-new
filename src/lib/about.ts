import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// Define the structure for a link item
export interface LinkItem {
  name: string;
  url: string;
  icon?: string; // Optional icon identifier (e.g., 'code', 'link')
}

// Define the structure for the about item data
export interface AboutItem {
  id: string;
  title: string;
  description?: string;
  contentHtml?: string; // For potential item-specific HTML content
  image?: string;       // Optional image URL
  name?: string;        // Optional name override (if different from title)
  links?: LinkItem[];   // Optional array of links
  component?: string;   // Optional identifier for component type (e.g., 'Framework')
}

// Define the structure for the overall about page data
export interface AboutData {
  title: string;        // Main title for the about page
  contentHtml?: string; // Main HTML content for the page
  image?: string;       // Optional main image URL (e.g., profile picture)
  name?: string;        // Optional main name (e.g., profile name)
  items?: AboutItem[];  // Optional array of about items/sections
  excerpt?: string;     // Optional excerpt for meta description
}

// Function to return all about page slugs
export const getAllAboutSlugs = (): string[] => {
  const aboutDirectory = path.join(process.cwd(), 'src', 'content', 'about');
  const filenames = fs.readdirSync(aboutDirectory);
  
  return filenames
    .filter(filename => filename.endsWith('.md'))
    .map(filename => filename.replace(/\.md$/, ''));
};

// Function to return the about data for a specific slug
export const getAboutData = async (slug: string): Promise<AboutData | null> => {
  const aboutDirectory = path.join(process.cwd(), 'src', 'content', 'about');
  const fullPath = path.join(aboutDirectory, `${slug}.md`);

  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);
    const contentHtml = processedContent.toString();

    // Return the combined data
    return {
      ...matterResult.data as Omit<AboutData, 'contentHtml'>,
      contentHtml,
    };
  } catch (error) {
    console.error(`Error reading about file for ${slug}:`, error);
    return null;
  }
};
