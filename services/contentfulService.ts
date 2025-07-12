import { getContentfulClient } from '~/utils/contentful-client'
import { 
  transformBlogPost, 
  transformBlogPosts,
  handleTransformationError
} from '~/utils/contentful-transformers'
import type { ContentfulQueryOptions } from '~/types/contentful'
import type { BlogPost } from '~/types/blog'

/**
 * Service layer for Contentful operations
 * Centralizes business logic and data transformation
 */
export class ContentfulService {
  private client: ReturnType<typeof getContentfulClient>
  
  constructor() {
    this.client = getContentfulClient()
  }
  
  // Blog Post Operations
  
  /**
   * Get all blog posts with optional filtering
   */
  async getBlogPosts(options: {
    category?: string
    featured?: boolean
    search?: string
    limit?: number
    skip?: number
  } = {}): Promise<{ items: BlogPost[]; total: number; skip: number; limit: number }> {
    try {
      const query: ContentfulQueryOptions = {
        content_type: 'blogPost',
        order: '-fields.publishedAt',
        limit: options.limit || 20,
        skip: options.skip || 0,
      }
      
      // Add filters
      if (options.category && options.category !== 'All') {
        query['fields.category'] = options.category
      }
      
      if (options.featured !== undefined) {
        query['fields.featured'] = options.featured
      }
      
      if (options.search) {
        query['query'] = options.search
      }
      
      const response = await this.client.getEntriesByType('blogPost', query)
      const transformedPosts = transformBlogPosts(response.items)
      
      return {
        items: transformedPosts,
        total: response.total,
        skip: response.skip,
        limit: response.limit,
      }
    } catch (error) {
      handleTransformationError(error, 'getBlogPosts')
      throw new Error('Failed to fetch blog posts')
    }
  }
  
  /**
   * Get a single blog post by slug
   */
  async getBlogPost(slug: string): Promise<BlogPost | null> {
    try {
      const entry = await this.client.getEntryBySlug('blogPost', slug, {
        include: 2,
      })
      
      return entry ? transformBlogPost(entry) : null
    } catch (error) {
      handleTransformationError(error, `getBlogPost(${slug})`)
      return null
    }
  }
  
  /**
   * Get featured blog post
   */
  async getFeaturedBlogPost(): Promise<BlogPost | null> {
    try {
      const response = await this.client.getEntriesByType('blogPost', {
        'fields.featured': true,
        order: '-fields.publishedAt',
        limit: 1,
      })
      
      return response.items.length > 0 ? transformBlogPost(response.items[0]) : null
    } catch (error) {
      handleTransformationError(error, 'getFeaturedBlogPost')
      return null
    }
  }
  
  /**
   * Get blog categories
   */
  async getBlogCategories(): Promise<string[]> {
    try {
      const response = await this.client.getEntriesByType('blogPost', {
        select: 'fields.category',
        limit: 1000,
      })
      
      const categories = new Set<string>()
      response.items.forEach((entry: any) => {
        const category = entry.fields.category
        if (category && typeof category === 'string') {
          categories.add(category)
        }
      })
      
      return Array.from(categories).sort()
    } catch (error) {
      handleTransformationError(error, 'getBlogCategories')
      return []
    }
  }
  
  /**
   * Get related blog posts by category
   */
  async getRelatedBlogPosts(postId: string, limit = 3): Promise<BlogPost[]> {
    try {
      // First get the current post to find its category
      const currentPost = await this.client.getEntry(postId)
      if (!currentPost) return []
      
      const category = currentPost.fields.category
      if (!category) return []
      
      // Get related posts
      const response = await this.client.getEntriesByType('blogPost', {
        'fields.category': category,
        'sys.id[ne]': postId,
        order: '-fields.publishedAt',
        limit,
      })
      
      return transformBlogPosts(response.items)
    } catch (error) {
      handleTransformationError(error, `getRelatedBlogPosts(${postId})`)
      return []
    }
  }
  
  // Project Operations
  
  /**
   * Get all projects with optional filtering
   */
  async getProjects(options: {
    category?: string
    featured?: boolean
    status?: string
    search?: string
    limit?: number
    skip?: number
  } = {}): Promise<{ items: any[]; total: number; skip: number; limit: number }> {
    try {
      const query: ContentfulQueryOptions = {
        content_type: 'project',
        order: '-fields.date',
        limit: options.limit || 20,
        skip: options.skip || 0,
      }
      
      // Add filters
      if (options.category && options.category !== 'All') {
        query['fields.category'] = options.category
      }
      
      if (options.featured !== undefined) {
        query['fields.featured'] = options.featured
      }
      
      if (options.status) {
        query['fields.status'] = options.status
      }
      
      if (options.search) {
        query['query'] = options.search
      }
      
      const response = await this.client.getEntriesByType('project', query)
      
      // Basic transformation (TODO: Create proper transformer)
      const transformedProjects = response.items.map((entry: any) => ({
        id: entry.sys.id,
        title: entry.fields.title,
        slug: entry.fields.slug,
        description: entry.fields.description,
        fullDescription: entry.fields.fullDescription,
        technologies: entry.fields.technologies || [],
        images: entry.fields.images || [],
        liveUrl: entry.fields.liveUrl,
        repositoryUrl: entry.fields.repositoryUrl,
        featured: entry.fields.featured || false,
        category: entry.fields.category,
        startDate: entry.fields.date,
        endDate: entry.fields.endDate,
        status: entry.fields.status || 'completed',
      }))
      
      return {
        items: transformedProjects,
        total: response.total,
        skip: response.skip,
        limit: response.limit,
      }
    } catch (error) {
      handleTransformationError(error, 'getProjects')
      throw new Error('Failed to fetch projects')
    }
  }
  
  /**
   * Get featured projects
   */
  async getFeaturedProjects(limit = 3): Promise<any[]> {
    try {
      const response = await this.client.getEntriesByType('project', {
        'fields.featured': true,
        order: '-fields.date',
        limit,
      })
      
      // Basic transformation (TODO: Create proper transformer)
      return response.items.map((entry: any) => ({
        id: entry.sys.id,
        title: entry.fields.title,
        slug: entry.fields.slug,
        description: entry.fields.description,
        fullDescription: entry.fields.fullDescription,
        technologies: entry.fields.technologies || [],
        images: entry.fields.images || [],
        liveUrl: entry.fields.liveUrl,
        repositoryUrl: entry.fields.repositoryUrl,
        featured: entry.fields.featured || false,
        category: entry.fields.category,
        startDate: entry.fields.date,
        endDate: entry.fields.endDate,
        status: entry.fields.status || 'completed',
      }))
    } catch (error) {
      handleTransformationError(error, 'getFeaturedProjects')
      return []
    }
  }
  
  // Testimonial Operations
  
  /**
   * Get all testimonials with optional filtering
   */
  async getTestimonials(options: {
    featured?: boolean
    minRating?: number
    search?: string
    limit?: number
    skip?: number
  } = {}): Promise<{ items: any[]; total: number; skip: number; limit: number }> {
    try {
      const query: ContentfulQueryOptions = {
        content_type: 'testimonial',
        order: '-sys.createdAt',
        limit: options.limit || 20,
        skip: options.skip || 0,
        include: 2,
      }
      
      // Add filters
      if (options.featured !== undefined) {
        query['fields.featured'] = options.featured
      }
      
      if (options.minRating) {
        query['fields.rating[gte]'] = options.minRating
      }
      
      if (options.search) {
        query['query'] = options.search
      }
      
      const response = await this.client.getEntriesByType('testimonial', query)
      
      // Basic transformation (TODO: Create proper transformer)
      const transformedTestimonials = response.items.map((entry: any) => ({
        id: entry.sys.id,
        title: entry.fields.title,
        content: entry.fields.content || entry.fields.testimonialText,
        clientName: entry.fields.clientName,
        clientTitle: entry.fields.clientTitle,
        clientCompany: entry.fields.clientCompany,
        company: entry.fields.company,
        name: entry.fields.name,
        rating: entry.fields.rating,
        featured: entry.fields.featured || false,
        projectReference: entry.fields.projectReference,
        attribution: entry.fields.attribution,
      }))
      
      return {
        items: transformedTestimonials,
        total: response.total,
        skip: response.skip,
        limit: response.limit,
      }
    } catch (error) {
      handleTransformationError(error, 'getTestimonials')
      throw new Error('Failed to fetch testimonials')
    }
  }
  
  /**
   * Get featured testimonials
   */
  async getFeaturedTestimonials(limit = 5): Promise<any[]> {
    try {
      const response = await this.client.getEntriesByType('testimonial', {
        'fields.featured': true,
        order: '-fields.rating,-sys.createdAt',
        limit,
        include: 2,
      })
      
      // Basic transformation (TODO: Create proper transformer)
      return response.items.map((entry: any) => ({
        id: entry.sys.id,
        title: entry.fields.title,
        content: entry.fields.content || entry.fields.testimonialText,
        clientName: entry.fields.clientName,
        clientTitle: entry.fields.clientTitle,
        clientCompany: entry.fields.clientCompany,
        company: entry.fields.company,
        name: entry.fields.name,
        rating: entry.fields.rating,
        featured: entry.fields.featured || false,
        projectReference: entry.fields.projectReference,
        attribution: entry.fields.attribution,
      }))
    } catch (error) {
      handleTransformationError(error, 'getFeaturedTestimonials')
      return []
    }
  }
  
  // Health Check
  
  /**
   * Test Contentful connection
   */
  async healthCheck(): Promise<{ status: 'ok' | 'error'; message?: string }> {
    try {
      await this.client.healthCheck()
      return { status: 'ok' }
    } catch (error) {
      return { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }
}

// Singleton instance
let contentfulService: ContentfulService | null = null

/**
 * Get singleton ContentfulService instance
 */
export function getContentfulService(): ContentfulService {
  if (!contentfulService) {
    contentfulService = new ContentfulService()
  }
  return contentfulService
}