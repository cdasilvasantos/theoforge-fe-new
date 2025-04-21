import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define the structure matching the frontmatter and adding content
export interface ForgeProjectData {
  id: string;
  title: string;
  githubUrl: string;
  liveUrl?: string;
  tryUrl?: string;
  tags?: string[];
  featured?: boolean;
  image?: string; // Added image field
  status?: string; // Added status for TBA
  content: string; // The main markdown content (description)
}

const projectsDirectory = path.join(process.cwd(), 'src/content/forge');

export function getAllForgeProjects(): ForgeProjectData[] {
  // Get file names under /src/content/forge
  let filenames: string[] = [];
  try {
    filenames = fs.readdirSync(projectsDirectory);
  } catch (error) {
    console.error("Error reading forge projects directory:", error);
    return []; // Return empty if directory doesn't exist or error reading
  }

  const allProjectsData = filenames
    .filter((filename) => filename.endsWith('.md')) // Ensure we only read markdown files
    .map((filename) => {
      // Remove ".md" from file name to get id
      const id = filename.replace(/\.md$/, '');

      // Read markdown file as string
      const fullPath = path.join(projectsDirectory, filename);
      let fileContents;
      try {
        fileContents = fs.readFileSync(fullPath, 'utf8');
      } catch (error) {
        console.error(`Error reading file ${filename}:`, error);
        return null; // Skip this file if it can't be read
      }

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the id and content
      return {
        id,
        content: matterResult.content.trim(),
        ...(matterResult.data as { // Type assertion for frontmatter structure
          title: string;
          githubUrl: string;
          liveUrl?: string;
          tryUrl?: string;
          tags?: string[];
          featured?: boolean;
          image?: string;
          status?: string;
        }),
      } as ForgeProjectData;
    });

  // Filter out any null results from file read errors and sort (optional, e.g., by featured)
  return allProjectsData
    .filter((project): project is ForgeProjectData => project !== null)
    .sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1)); // Example sort: featured first
}
