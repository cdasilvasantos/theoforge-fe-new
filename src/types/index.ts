// src/types/index.ts

export interface CardData {
  id: string | number; // Unique identifier
  title: string;
  description: string;
  image?: string; // Optional image path
  tags?: string[]; // Optional tags (for Forge, Blog)
  url?: string; // Optional URL for link/button
  buttonText?: string; // Optional text for button (defaults might apply)
  author?: string; // Optional author name (for Testimonials, Blog)
  role?: string; // Optional role/company (for Testimonials)
  featured?: boolean; // Optional flag (for filtering/styling)
  status?: string; // Optional status (e.g., 'Coming Soon' for Forge)
}

// Add other shared types here as needed
