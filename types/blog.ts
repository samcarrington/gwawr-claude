export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featuredImage: string | null;
  publishedAt: string;
  readTime: number;
  featured: boolean;
}

export interface BlogCategory {
  name: string;
  slug: string;
  description?: string;
}

export interface BlogTag {
  name: string;
  slug: string;
}
