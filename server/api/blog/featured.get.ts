import { getContentfulClient } from '~/utils/contentful-client'
import { transformBlogPost } from '~/utils/contentful-transformers'

export default defineEventHandler(async (event) => {
  try {
    // Set cache headers
    setHeader(event, 'Cache-Control', 'public, max-age=300') // 5 minutes
    
    // Check if Contentful is configured
    const runtimeConfig = useRuntimeConfig()
    const spaceId = runtimeConfig.contentfulSpaceId
    const accessToken = runtimeConfig.contentfulAccessToken
    
    if (!spaceId || !accessToken) {
      console.warn('[API] Contentful not configured, using mock data for featured post')
      
      // Fallback to mock data
      const { getFeaturedBlogPost } = await import('~/data/blog')
      return getFeaturedBlogPost()
    }
    
    // Get Contentful client and fetch featured posts
    const client = getContentfulClient()
    const response = await client.getEntriesByType('blogPost', {
      'fields.featured': true,
      order: '-fields.publishedAt',
      limit: 1, // Only get the most recent featured post
    })
    
    if (response.items.length === 0) {
      return null
    }
    
    // Transform the first (most recent) featured post
    const transformedPost = transformBlogPost(response.items[0])
    
    return transformedPost
  } catch (error) {
    console.error('[API] Failed to fetch featured blog post:', error)
    
    // Fallback to mock data on error
    try {
      console.warn('[API] Falling back to mock data for featured post due to error')
      const { getFeaturedBlogPost } = await import('~/data/blog')
      return getFeaturedBlogPost()
    } catch (fallbackError) {
      console.error('[API] Even mock data fallback failed:', fallbackError)
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch featured blog post',
        data: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      })
    }
  }
})