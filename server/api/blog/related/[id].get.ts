import { getContentfulClient } from '~/utils/contentful-client'
import { transformBlogPosts } from '~/utils/contentful-transformers'

export default defineEventHandler(async (event) => {
  try {
    // Get ID from route parameters
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Post ID parameter is required',
      })
    }
    
    // Get query parameters
    const query = getQuery(event)
    const limit = query.limit ? parseInt(query.limit as string) : 3
    
    // Set cache headers
    setHeader(event, 'Cache-Control', 'public, max-age=600') // 10 minutes
    
    // Get Contentful client
    const client = getContentfulClient()
    
    // First, get the current post to find its category
    const currentPost = await client.getEntry(id)
    
    if (!currentPost) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Blog post not found',
      })
    }
    
    const currentCategory = currentPost.fields.category
    
    if (!currentCategory) {
      // If no category, return empty array
      return []
    }
    
    // Fetch related posts in the same category, excluding current post
    const response = await client.getEntriesByType('blogPost', {
      'fields.category': currentCategory,
      'sys.id[ne]': id, // Exclude current post
      order: '-fields.publishedAt',
      limit,
    })
    
    // Transform the data
    const transformedPosts = transformBlogPosts(response.items)
    
    return transformedPosts
  } catch (error) {
    console.error(`[API] Failed to fetch related posts for ID "${getRouterParam(event, 'id')}":`, error)
    
    // Re-throw 404 errors as-is
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 404) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch related blog posts',
      data: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    })
  }
})