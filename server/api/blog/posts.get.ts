import { getContentfulClient } from '~/utils/contentful-client'
import { transformBlogPosts } from '~/utils/contentful-transformers'
import type { ContentfulQueryOptions } from '~/types/contentful'

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters for filtering and pagination
    const query = getQuery(event) as Record<string, any>
    
    // Set cache headers
    setHeader(event, 'Cache-Control', 'public, max-age=300') // 5 minutes
    
    // Build Contentful query
    const contentfulQuery: ContentfulQueryOptions = {
      content_type: 'blogPost',
      order: '-fields.publishedAt', // Most recent first
      limit: query.limit ? parseInt(query.limit as string) : 20,
      skip: query.skip ? parseInt(query.skip as string) : 0,
    }
    
    // Add category filter if provided
    if (query.category && query.category !== 'All') {
      contentfulQuery['fields.category'] = query.category
    }
    
    // Add featured filter if provided
    if (query.featured !== undefined) {
      contentfulQuery['fields.featured'] = query.featured === 'true'
    }
    
    // Add search if provided
    if (query.search) {
      contentfulQuery['query'] = query.search
    }
    
    // Get Contentful client and fetch data
    const client = getContentfulClient()
    const response = await client.getEntriesByType('blogPost', contentfulQuery)
    
    // Transform the data
    const transformedPosts = transformBlogPosts(response.items)
    
    return {
      items: transformedPosts,
      total: response.total,
      skip: response.skip,
      limit: response.limit,
    }
  } catch (error) {
    console.error('[API] Failed to fetch blog posts:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch blog posts',
      data: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    })
  }
})