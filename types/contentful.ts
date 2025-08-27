import type { Entry, Asset, OrderFilterPaths } from 'contentful';

// Base Contentful types
export interface ContentfulEntry<T = any> extends Entry<T> {
  sys: {
    id: string;
    type: 'Entry';
    // FIXME: Fragile ISO date format, should be string declaration with JSDoc or a type alias
    createdAt: `${number}-${number}-${number}T${number}:${number}:${number}Z`;
    updatedAt: `${number}-${number}-${number}T${number}:${number}:${number}Z`;
    locale: string;
    revision: number;
    space: {
      sys: {
        id: string;
        type: 'Link';
        linkType: 'Space';
      };
    };
    environment: {
      sys: {
        id: string;
        type: 'Link';
        linkType: 'Environment';
      };
    };
    contentType: {
      sys: {
        id: string;
        linkType: 'ContentType';
        type: 'Link';
      };
    };
    publishedVersion: number;
    publishedAt: string;
    firstPublishedAt: string;
    publishedCounter: number;
  };
  fields: T;
}

export interface ContentfulAsset extends Asset {
  fields: {
    title: string;
    description?: string;
    file: {
      url: string;
      details: {
        size: number;
        image?: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
  };
}

// Blog Content Types
export interface ContentfulBlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: any; // Rich text document
  category: ContentfulEntry<ContentfulCategory>;
  tags?: ContentfulEntry<ContentfulTag>[];
  featuredImage?: ContentfulAsset;
  publishedAt: string;
  readTime: number;
  featured: boolean;
}

export interface ContentfulCategory {
  name: string;
  slug: string;
  description?: string;
}

export interface ContentfulTag {
  name: string;
  slug: string;
}

// Project Content Types
export interface ContentfulProject {
  title: string;
  slug: string;
  description: string;
  fullDescription?: any; // Rich text document
  technologies: string[] | ContentfulEntry<ContentfulCategory>[]; // Can be strings or category entries
  images: ContentfulAsset[];
  liveUrl?: string;
  repositoryUrl?: string;
  featured: boolean;
  category: string | ContentfulEntry<ContentfulCategory>[]; // Can be string or array of category entries
  startDate?: string;
  endDate?: string;
  status: 'completed' | 'in-progress' | 'planned';
}

// Testimonial Content Types
export interface ContentfulTestimonial {
  clientName: string;
  clientTitle?: string;
  company: string;
  testimonialText: any; // Rich text document
  clientImage?: ContentfulAsset;
  rating?: number;
  featured: boolean;
  projectReference?: ContentfulEntry<ContentfulProject>;
}

// About Content Types
export interface ContentfulAbout {
  title: string;
  bio: any; // Rich text document
  skills: string[];
  experience: ContentfulEntry<ContentfulExperience>[];
  resumeFile?: ContentfulAsset;
  profileImage?: ContentfulAsset;
}

export interface ContentfulExperience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: any; // Rich text document
  technologies?: string[];
  companyLogo?: ContentfulAsset;
}

// Content type definitions for Contentful client
export interface ContentfulContentTypes {
  blogPost: ContentfulBlogPost;
  category: ContentfulCategory;
  tag: ContentfulTag;
  project: ContentfulProject;
  testimonial: ContentfulTestimonial;
  about: ContentfulAbout;
  experience: ContentfulExperience;
}

// API Response types
export interface ContentfulCollection<T> {
  items: ContentfulEntry<T>[];
  total: number;
  skip: number;
  limit: number;
}

// Error types
export interface ContentfulError {
  sys: {
    id: string;
    type: 'Error';
  };
  name: string;
  message: string;
  details?: any;
}

// Client configuration
export interface ContentfulClientConfig {
  space: string;
  accessToken: string;
  previewAccessToken?: string;
  environment?: string;
  host?: string;
  timeout?: number;
  retryOnError?: boolean;
  logHandler?: (level: string, data: any) => void;
}

// Query options
export interface ContentfulQueryOptions {
  content_type?: string;
  'fields.slug'?: string;
  'fields.featured'?: boolean;
  'fields.category.sys.id'?: string;
  'fields.tags.sys.id[in]'?: string;
  order?: OrderFilterPaths[];
  limit?: number;
  skip?: number;
  include?: number;
  locale?: string;
  preview?: boolean;
}
