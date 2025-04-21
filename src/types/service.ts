/**
 * Represents the structure of service data loaded from Markdown files.
 */
export interface ServiceData {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    image?: string; // Optional image path
    icon?: string; // Optional Material Icon name
    order?: number; // Optional sort order
    link: string; // Generated link to the service page
  }
