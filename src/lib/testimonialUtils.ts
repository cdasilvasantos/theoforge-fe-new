// src/lib/testimonialUtils.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define the structure matching TestimonialCard props (and frontmatter)
export interface TestimonialData {
  id: string; // Slug or unique ID
  quote: string;
  name: string;
  title: string;
  company: string;
  image?: string; // Optional image path
  // Add other potential fields like 'order' if needed for sorting
}

const testimonialsDirectory = path.join(process.cwd(), 'src/content/testimonials');

export function getTestimonialSlugs() {
  try {
    const fileNames = fs.readdirSync(testimonialsDirectory);
    return fileNames.map((fileName) => fileName.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error reading testimonial slugs:', error);
    return [];
  }
}

export function getTestimonialBySlug(slug: string): TestimonialData | null {
  const fullPath = path.join(testimonialsDirectory, `${slug}.md`);
  try {
    if (!fs.existsSync(fullPath)) {
      console.warn(`Testimonial file not found: ${fullPath}`);
      return null;
    }
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Basic validation
    if (!data.name || !data.title || !data.company || !data.quote) {
        console.warn(`Skipping testimonial ${slug}: missing required frontmatter (name, title, company, quote).`);
        return null;
    }

    return {
      id: slug,
      quote: data.quote,
      name: data.name,
      title: data.title,
      company: data.company,
      image: data.image || undefined, // Ensure undefined if missing
      ...(data as Partial<TestimonialData>), // Spread other potential fields
    };
  } catch (error) {
    console.error(`Error reading testimonial ${slug}:`, error);
    return null;
  }
}

export function getAllTestimonials(): TestimonialData[] {
  const slugs = getTestimonialSlugs();
  const testimonials = slugs
    .map((slug) => getTestimonialBySlug(slug))
    .filter((testimonial): testimonial is TestimonialData => testimonial !== null); // Type guard to filter out nulls
  
  // Add sorting logic here if needed (e.g., by an 'order' frontmatter field)
  // testimonials.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  return testimonials;
}
