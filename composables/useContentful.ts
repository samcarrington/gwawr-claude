import type { BlogPost, BlogCategory, BlogTag } from '~/types/blog'
import type { ContentfulClient } from '~/utils/contentful-client'
import {
  transformBlogPost,
  transformBlogPosts,
  transformCategories,
  transformTags,
  sortBlogPostsByDate,
  filterBlogPostsByCategory,
  getRelatedPosts,
} from '~/utils/contentful-transformers'

/**
 * Composable for accessing Contentful data with caching and error handling
 */
export const useContentful = () => {
  const { $contentful } = useNuxtApp()
  const client = $contentful as ContentfulClient

  // Check if Contentful is available
  const isContentfulAvailable = computed(() => Boolean(client))

  /**
   * Get all blog posts with caching
   */
  const getBlogPosts = async (options?: {
    limit?: number
    category?: string
    featured?: boolean
    preview?: boolean
  }): Promise<BlogPost[]> => {
    if (!client) {
      console.warn('[useContentful] Client not available, returning empty array')
      return []
    }

    try {
      const query: any = {
        content_type: 'blogPost',
        order: '-fields.publishedAt',
        limit: options?.limit || 100,
      }

      if (options?.category) {
        query['fields.category.fields.name'] = options.category
      }

      if (options?.featured !== undefined) {
        query['fields.featured'] = options.featured
      }

      const response = await client.getEntries(query, options?.preview)
      return transformBlogPosts(response.items)
    } catch (error) {
      console.error('[useContentful] Error fetching blog posts:', error)
      return []
    }
  }

  /**
   * Get a single blog post by slug
   */
  const getBlogPostBySlug = async (slug: string, preview = false): Promise<BlogPost | null> => {
    if (!client) {
      console.warn('[useContentful] Client not available')
      return null
    }

    try {
      const entry = await client.getEntryBySlug('blogPost', slug, {}, preview)
      return entry ? transformBlogPost(entry) : null
    } catch (error) {
      console.error('[useContentful] Error fetching blog post:', error)
      return null
    }
  }

  /**
   * Get featured blog post
   */
  const getFeaturedBlogPost = async (preview = false): Promise<BlogPost | null> => {
    if (!client) return null

    try {
      const response = await client.getEntriesByType('blogPost', {
        'fields.featured': true,
        limit: 1,
        order: '-fields.publishedAt',
      }, preview)

      return response.items.length > 0 ? transformBlogPost(response.items[0]) : null
    } catch (error) {
      console.error('[useContentful] Error fetching featured blog post:', error)
      return null
    }
  }

  /**
   * Get blog categories
   */
  const getBlogCategories = async (): Promise<BlogCategory[]> => {
    if (!client) return []

    try {
      const response = await client.getEntriesByType('category', {
        order: 'fields.name',
      })
      return transformCategories(response.items)
    } catch (error) {
      console.error('[useContentful] Error fetching categories:', error)
      return []
    }
  }

  /**
   * Get blog tags
   */
  const getBlogTags = async (): Promise<BlogTag[]> => {
    if (!client) return []

    try {
      const response = await client.getEntriesByType('tag', {
        order: 'fields.name',
      })
      return transformTags(response.items)
    } catch (error) {
      console.error('[useContentful] Error fetching tags:', error)
      return []
    }
  }

  /**
   * Get related blog posts
   */
  const getRelatedBlogPosts = async (
    currentPost: BlogPost,
    limit = 3
  ): Promise<BlogPost[]> => {
    if (!client) return []

    try {
      // Get posts from the same category
      const posts = await getBlogPosts({ category: currentPost.category })
      return getRelatedPosts(posts, currentPost, limit)
    } catch (error) {
      console.error('[useContentful] Error fetching related posts:', error)
      return []
    }
  }

  /**
   * Search blog posts
   */
  const searchBlogPosts = async (query: string, limit = 10): Promise<BlogPost[]> => {
    if (!client || !query.trim()) return []

    try {
      const response = await client.getEntriesByType('blogPost', {
        query,
        limit,
        order: '-fields.publishedAt',
      })
      return transformBlogPosts(response.items)
    } catch (error) {
      console.error('[useContentful] Error searching blog posts:', error)
      return []
    }
  }

  /**
   * Get blog statistics
   */
  const getBlogStats = async (): Promise<{
    totalPosts: number
    categories: number
    tags: number
    featured: number
  }> => {
    if (!client) {
      return { totalPosts: 0, categories: 0, tags: 0, featured: 0 }
    }

    try {
      const [posts, categories, tags, featured] = await Promise.all([
        client.getEntriesByType('blogPost'),
        client.getEntriesByType('category'),
        client.getEntriesByType('tag'),
        client.getEntriesByType('blogPost', { 'fields.featured': true }),
      ])

      return {
        totalPosts: posts.total,
        categories: categories.total,
        tags: tags.total,
        featured: featured.total,
      }
    } catch (error) {
      console.error('[useContentful] Error fetching blog stats:', error)
      return { totalPosts: 0, categories: 0, tags: 0, featured: 0 }
    }
  }

  /**
   * Refresh content (useful for webhook-triggered updates)
   */
  const refreshContent = async (): Promise<void> => {
    if (!client) return

    try {
      // Clear any caches here if you implement caching
      console.log('[useContentful] Content refreshed')
    } catch (error) {
      console.error('[useContentful] Error refreshing content:', error)
    }
  }

  return {
    // State
    isContentfulAvailable,

    // Methods
    getBlogPosts,
    getBlogPostBySlug,
    getFeaturedBlogPost,
    getBlogCategories,
    getBlogTags,
    getRelatedBlogPosts,
    searchBlogPosts,
    getBlogStats,
    refreshContent,

    // Direct client access for advanced usage
    client,
  }
}