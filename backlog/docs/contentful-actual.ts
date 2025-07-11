import type { Entry, Asset, RichTextDocument } from 'contentful'

// Base Contentful types that match actual API structure
export interface ContentfulEntry<T = any> extends Entry<T> {
  sys: {
    id: string
    type: 'Entry'
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: string
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
  fields: T
}

export interface ContentfulAsset extends Asset {
  sys: {
    id: string
    type: 'Asset'
    createdAt: string
    updatedAt: string
    locale: string
  }
  fields: {
    title: string
    description?: string
    file: {
      url: string
      details: {
        size: number
        image?: {
          width: number
          height: number
        }
      }
      fileName: string
      contentType: string
    }
  }
}

// ACTUAL CONTENTFUL CONTENT TYPES (matching current structure)

/**
 * blogPost Content Type - Matches actual Contentful structure
 */
export interface ContentfulBlogPost {
  title: string                    // ✅ Present
  content: RichTextDocument        // ✅ Present
  thumbnail: ContentfulAsset       // ✅ Present (required)
  excerpt?: string                 // ✅ Present (optional)
  author: ContentfulEntry<ContentfulPerson>  // ✅ Present (required)
  // Missing fields that application expects:
  // slug, category, tags, publishedAt, readTime, featured
}

/**
 * project Content Type - Matches actual Contentful structure
 */
export interface ContentfulProject {
  slug: string                                    // ✅ Present
  title: string                                   // ✅ Present
  excerpt?: RichTextDocument                      // ✅ Present (optional)
  description: string                             // ✅ Present
  category?: ContentfulEntry<ContentfulProjectCategory>[]  // ✅ Present (optional, array)
  skills?: ContentfulEntry<ContentfulSkill>[]     // ✅ Present (optional, array)
  date?: string                                   // ✅ Present (optional)
  bannerImage?: ContentfulAsset                   // ✅ Present (optional)
  thumbnail?: ContentfulAsset                     // ✅ Present (optional)
  technologies?: ContentfulEntry<ContentfulTechnology>[]  // ✅ Present (optional, array)
  // Missing fields that application expects:
  // liveUrl, repositoryUrl, featured, endDate, status
}

/**
 * testimonial Content Type - Matches actual Contentful structure
 */
export interface ContentfulTestimonial {
  title?: string                                  // ✅ Present (optional)
  quote?: RichTextDocument                        // ✅ Present (optional)
  attribution: ContentfulEntry<ContentfulPerson> // ✅ Present (required)
  // Missing fields that application expects:
  // rating, featured, projectReference, direct company/title fields
}

/**
 * person Content Type - Matches actual Contentful structure
 */
export interface ContentfulPerson {
  name: string        // ✅ Present (required)
  jobTitle?: string   // ✅ Present (optional)
  company?: string    // ✅ Present (optional)
}

/**
 * projectCategory Content Type - Matches actual Contentful structure
 */
export interface ContentfulProjectCategory {
  title: string  // ✅ Present (required)
  slug: string   // ✅ Present (required)
}

/**
 * technology Content Type - Matches actual Contentful structure
 */
export interface ContentfulTechnology {
  name: string  // ✅ Present (required)
}

/**
 * skill Content Type - Matches actual Contentful structure
 */
export interface ContentfulSkill {
  title?: string  // ✅ Present (optional)
}

/**
 * about Content Type - Matches actual Contentful structure
 */
export interface ContentfulAbout {
  content?: RichTextDocument  // ✅ Present (optional)
}

// ENHANCED CONTENT TYPES (what they should be for full application support)

/**
 * Enhanced blogPost Content Type - Recommended structure
 */
export interface ContentfulBlogPostEnhanced {
  title: string                                   // ✅ Existing
  slug: string                                    // ❌ Missing - needs to be added
  content: RichTextDocument                       // ✅ Existing
  excerpt: string                                 // ✅ Existing (should be required)
  thumbnail?: ContentfulAsset                     // ✅ Existing (should be optional)
  author: ContentfulEntry<ContentfulPerson>      // ✅ Existing
  category: string                                // ❌ Missing - needs to be added
  tags?: string[]                                 // ❌ Missing - needs to be added
  publishedAt: string                             // ❌ Missing - needs to be added
  readTime?: number                               // ❌ Missing - needs to be added
  featured: boolean                               // ❌ Missing - needs to be added
}

/**
 * Enhanced project Content Type - Recommended structure
 */
export interface ContentfulProjectEnhanced {
  slug: string                                    // ✅ Existing
  title: string                                   // ✅ Existing
  excerpt?: RichTextDocument                      // ✅ Existing
  description: string                             // ✅ Existing
  category?: ContentfulEntry<ContentfulProjectCategory>[]  // ✅ Existing
  skills?: ContentfulEntry<ContentfulSkill>[]     // ✅ Existing
  date?: string                                   // ✅ Existing
  endDate?: string                                // ❌ Missing - needs to be added
  bannerImage?: ContentfulAsset                   // ✅ Existing
  thumbnail?: ContentfulAsset                     // ✅ Existing
  technologies?: ContentfulEntry<ContentfulTechnology>[]  // ✅ Existing
  liveUrl?: string                                // ❌ Missing - needs to be added
  repositoryUrl?: string                          // ❌ Missing - needs to be added
  featured: boolean                               // ❌ Missing - needs to be added
  status: 'completed' | 'in-progress' | 'planned'  // ❌ Missing - needs to be added
}

/**
 * Enhanced testimonial Content Type - Recommended structure
 */
export interface ContentfulTestimonialEnhanced {
  title?: string                                  // ✅ Existing
  quote: RichTextDocument                         // ✅ Existing (should be required)
  attribution?: ContentfulEntry<ContentfulPerson> // ✅ Existing (should be optional)
  // Direct fields for better data management
  clientName: string                              // ❌ Missing - needs to be added
  clientTitle?: string                            // ❌ Missing - needs to be added
  clientCompany?: string                          // ❌ Missing - needs to be added
  clientImage?: ContentfulAsset                   // ❌ Missing - needs to be added
  rating?: number                                 // ❌ Missing - needs to be added (1-5)
  featured: boolean                               // ❌ Missing - needs to be added
  projectReference?: ContentfulEntry<ContentfulProject>  // ❌ Missing - needs to be added
}

// Content type definitions for Contentful client
export interface ContentfulContentTypes {
  blogPost: ContentfulBlogPost
  project: ContentfulProject
  testimonial: ContentfulTestimonial
  person: ContentfulPerson
  projectCategory: ContentfulProjectCategory
  technology: ContentfulTechnology
  skill: ContentfulSkill
  about: ContentfulAbout
}

// Enhanced content type definitions
export interface ContentfulContentTypesEnhanced {
  blogPost: ContentfulBlogPostEnhanced
  project: ContentfulProjectEnhanced
  testimonial: ContentfulTestimonialEnhanced
  person: ContentfulPerson
  projectCategory: ContentfulProjectCategory
  technology: ContentfulTechnology
  skill: ContentfulSkill
  about: ContentfulAbout
}

// API Response types
export interface ContentfulCollection<T> {
  items: ContentfulEntry<T>[]
  total: number
  skip: number
  limit: number
}

// Error types
export interface ContentfulError {
  sys: {
    id: string
    type: 'Error'
  }
  name: string
  message: string
  details?: any
}

// Client configuration
export interface ContentfulClientConfig {
  space: string
  accessToken: string
  environment?: string
  host?: string
  timeout?: number
  retryOnError?: boolean
  logHandler?: (level: string, data: any) => void
}

// Query options
export interface ContentfulQueryOptions {
  content_type?: string
  'fields.slug'?: string
  'fields.featured'?: boolean
  'fields.category.sys.id'?: string
  'fields.tags.sys.id[in]'?: string
  order?: string
  limit?: number
  skip?: number
  include?: number
  locale?: string
  preview?: boolean
}

// Content transformation helpers
export interface TransformedBlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  featuredImage: string | null
  publishedAt: string
  readTime: number
  featured: boolean
  author: {
    name: string
    title?: string
    company?: string
  }
}

export interface TransformedProject {
  id: string
  title: string
  slug: string
  description: string
  excerpt?: string
  category: string[]
  technologies: string[]
  skills: string[]
  image: string | null
  bannerImage: string | null
  liveUrl?: string
  repoUrl?: string
  featured: boolean
  date: string
  endDate?: string
  status: 'completed' | 'in-progress' | 'planned'
}

export interface TransformedTestimonial {
  id: string
  content: string
  name: string
  title?: string
  company?: string
  rating?: number
  featured: boolean
  projectReference?: string
}

// Content gaps for migration planning
export interface ContentGaps {
  blogPost: {
    missingFields: string[]
    requiredUpdates: string[]
    dataTransformation: string[]
  }
  project: {
    missingFields: string[]
    requiredUpdates: string[]
    dataTransformation: string[]
  }
  testimonial: {
    missingFields: string[]
    requiredUpdates: string[]
    dataTransformation: string[]
  }
}

export const CONTENT_GAPS: ContentGaps = {
  blogPost: {
    missingFields: ['slug', 'category', 'tags', 'publishedAt', 'readTime', 'featured'],
    requiredUpdates: ['excerpt should be required'],
    dataTransformation: ['RichText to string', 'Asset to URL', 'Person to simple object']
  },
  project: {
    missingFields: ['liveUrl', 'repositoryUrl', 'featured', 'endDate', 'status'],
    requiredUpdates: [],
    dataTransformation: ['RichText to string', 'Asset to URL', 'Linked entries to strings']
  },
  testimonial: {
    missingFields: ['clientName', 'clientTitle', 'clientCompany', 'rating', 'featured', 'projectReference'],
    requiredUpdates: ['quote should be required'],
    dataTransformation: ['RichText to string', 'Person link to direct fields']
  }
}