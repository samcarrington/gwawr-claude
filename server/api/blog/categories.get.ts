import { getContentfulClient } from '~/utils/contentful-client'

export default defineEventHandler(async (event) => {
  try {
    // Set cache headers - categories change infrequently
    setHeader(event, 'Cache-Control', 'public, max-age=900') // 15 minutes
    
    // Check if Contentful is configured
    const runtimeConfig = useRuntimeConfig()
    const spaceId = runtimeConfig.contentfulSpaceId
    const accessToken = runtimeConfig.contentfulAccessToken
    
    if (!spaceId || !accessToken) {
      console.warn('[API] Contentful not configured, using mock data for categories')
      
      // Fallback to mock data
      const { getBlogCategories } = await import('~/data/blog')
      return getBlogCategories()
    }
    
    // Get Contentful client and fetch all blog posts to extract categories
    const client = getContentfulClient()
    const response = await client.getEntriesByType('blogPost', {
      select: 'fields.category',
      limit: 1000, // Get all posts to extract unique categories
    })
    
    // Extract unique categories from the posts
    const categories = new Set<string>()
    
    response.items.forEach((entry: any) => {
      const category = entry.fields.category
      if (category && typeof category === 'string') {
        categories.add(category)
      }
    })
    
    // Convert to sorted array
    const sortedCategories = Array.from(categories).sort()
    
    return sortedCategories
  } catch (error) {
    console.error('[API] Failed to fetch blog categories:', error)
    
    // Fallback to mock data on error
    try {
      console.warn('[API] Falling back to mock data for categories due to error')
      const { getBlogCategories } = await import('~/data/blog')
      return getBlogCategories()
    } catch (fallbackError) {
      console.error('[API] Even mock data fallback failed:', fallbackError)
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch blog categories',
        data: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      })
    }
  }
})