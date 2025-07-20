export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  fullDescription?: string; // Rendered HTML from markdown or Rich Text
  technologies: string[];
  thumbnail?: string | null; // Thumbnail image URL for list pages
  bannerImage?: string | null; // Banner image URL for detail pages
  images: string[]; // Array of additional image URLs (backward compatibility)
  liveUrl?: string;
  repositoryUrl?: string;
  featured: boolean;
  category: string;
  startDate?: string;
  endDate?: string;
  status: 'completed' | 'in-progress' | 'planned';
}

export interface ProjectsResponse {
  items: Project[];
  total: number;
  skip: number;
  limit: number;
}
