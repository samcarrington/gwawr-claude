import { createClient } from 'contentful'
import { transformBlogPosts } from '~/utils/contentful-transformers'

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters for filtering and pagination
    const query = getQuery(event) as Record<string, any>
    
    // Set cache headers
    setHeader(event, 'Cache-Control', 'public, max-age=300') // 5 minutes
    
    // Check if Contentful is configured
    const config = useRuntimeConfig(event)
    if (!config.contentfulSpaceId || !config.contentfulAccessToken) {
      console.warn('[API] Contentful not configured, using mock data')
      
      // Fallback to mock data
      const { getSortedBlogPosts } = await import('~/data/blog')
      const mockPosts = getSortedBlogPosts()
      
      // Apply filters to mock data
      let filteredPosts = mockPosts
      
      if (query.category && query.category !== 'All') {
        filteredPosts = filteredPosts.filter(post => post.category === query.category)
      }
      
      if (query.featured !== undefined) {
        filteredPosts = filteredPosts.filter(post => post.featured === (query.featured === 'true'))
      }
      
      if (query.search) {
        const searchTerm = query.search.toLowerCase()
        filteredPosts = filteredPosts.filter(post => 
          post.title.toLowerCase().includes(searchTerm) ||
          post.excerpt.toLowerCase().includes(searchTerm) ||
          post.category.toLowerCase().includes(searchTerm) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        )
      }
      
      // Apply pagination
      const limit = query.limit ? parseInt(query.limit as string) : 20
      const skip = query.skip ? parseInt(query.skip as string) : 0
      const paginatedPosts = filteredPosts.slice(skip, skip + limit)
      
      return {
        items: paginatedPosts,
        total: filteredPosts.length,
        skip,
        limit,
      }
    }
    
    // Build Contentful query
    const contentfulQuery: any = {
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
    
    // Create Contentful client directly in server context
    const client = createClient({
      space: config.contentfulSpaceId,
      accessToken: config.contentfulAccessToken,
      environment: config.contentfulEnvironment || 'master',
      host: config.contentfulHost || 'cdn.contentful.com',
    })
    
    const response = await client.getEntries(contentfulQuery)
    
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
    
    // Fallback to mock data on any error
    try {
      console.warn('[API] Falling back to mock data due to error')
      const { getSortedBlogPosts } = await import('~/data/blog')
      const mockPosts = getSortedBlogPosts()
      
      return {
        items: mockPosts,
        total: mockPosts.length,
        skip: 0,
        limit: mockPosts.length,
      }
    } catch (fallbackError) {
      console.error('[API] Even mock data fallback failed:', fallbackError)
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch blog posts',
        data: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      })
    }
  }
})