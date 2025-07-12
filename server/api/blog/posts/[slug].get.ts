import { getContentfulClient } from '~/utils/contentful-client'
import { transformBlogPost } from '~/utils/contentful-transformers'

export default defineEventHandler(async (event) => {
  try {
    // Get slug from route parameters
    const slug = getRouterParam(event, 'slug')
    
    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug parameter is required',
      })
    }
    
    // Set cache headers
    setHeader(event, 'Cache-Control', 'public, max-age=600') // 10 minutes for individual posts
    
    // Get Contentful client and fetch data
    const client = getContentfulClient()
    const entry = await client.getEntryBySlug('blogPost', slug, {
      include: 2, // Include linked entries up to 2 levels deep
    })
    
    if (!entry) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Blog post not found',
      })
    }
    
    // Transform the data
    const transformedPost = transformBlogPost(entry)
    
    return transformedPost
  } catch (error) {
    console.error(`[API] Failed to fetch blog post with slug "${getRouterParam(event, 'slug')}":`, error)
    
    // Re-throw 404 errors as-is
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 404) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch blog post',
      data: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    })
  }
})