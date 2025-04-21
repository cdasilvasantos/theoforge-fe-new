import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ServiceData } from '@/types/service';

const servicesDirectory = path.join(process.cwd(), 'src/content/services');

// Helper function to get all service slugs (filenames without .md)
export function getAllServiceSlugs() {
  try {
    const fileNames = fs.readdirSync(servicesDirectory);
    return fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => fileName.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error reading services directory:', error);
    return []; 
  }
}

// Helper function to get data for a single service by slug
export function getServiceData(slug: string): ServiceData | null {
  const fullPath = path.join(servicesDirectory, `${slug}.md`);
  try {
    if (!fs.existsSync(fullPath)) {
      console.warn(`Markdown file not found for service slug: ${slug}`);
      return null; 
    }
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the service metadata section
    const { data, content } = matter(fileContents);

    // Basic validation for required fields
    if (!data.title || !data.excerpt) {
      console.error(`Missing required frontmatter in ${slug}.md`);
      return null;
    }

    // Combine the data with the slug and content
    return {
      slug,
      ...(data as { 
        title: string;
        excerpt: string;
        image?: string;
        icon?: string;
        order?: number;
      }),
      content,
      link: `/services/${slug}` 
    };
  } catch (error) {
    console.error(`Error reading or parsing markdown file for service slug ${slug}:`, error);
    return null; 
  }
}

// Helper function to get sorted data for all services
export function getSortedServicesData(): ServiceData[] {
  const allSlugs = getAllServiceSlugs();
  const allServicesData = allSlugs
    .map(slug => getServiceData(slug)) 
    .filter((service): service is ServiceData => service !== null);

  // Sort services: prioritize 'order', then alphabetically by title
  return allServicesData.sort((a, b) => {
    // Prioritize services with an 'order' field, sorting them numerically
    if (a.order !== undefined && b.order !== undefined) {
      if (a.order < b.order) return -1;
      if (a.order > b.order) return 1;
      // If orders are equal, fall back to title sorting
    } else if (a.order !== undefined) {
      return -1; 
    } else if (b.order !== undefined) {
      return 1; 
    }

    // If neither has an order or orders are equal, sort by title
    if (a.title < b.title) return -1;
    if (a.title > b.title) return 1;
    return 0;
  });
}
