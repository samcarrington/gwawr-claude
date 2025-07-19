import { createClient } from 'contentful'
import { transformTestimonials } from '~/utils/contentful-transformers'

export default defineEventHandler(async (event) => {
  try {
    // Get runtime config and validate Contentful configuration
    const config = useRuntimeConfig(event)
    const spaceId = config.public.contentfulSpaceId
    const accessToken = config.public.contentfulAccessToken
    
    if (!spaceId || !accessToken) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Contentful configuration is missing',
      })
    }
    
    // Get query parameters for filtering and pagination
    const query = getQuery(event) as Record<string, any>
    
    // Set cache headers
    setHeader(event, 'Cache-Control', 'public, max-age=900') // 15 minutes for testimonials
    
    // Build Contentful query
    const contentfulQuery: any = {
      content_type: 'testimonial',
      order: '-sys.createdAt', // Most recent first
      limit: query.limit ? parseInt(query.limit as string) : 20,
      skip: query.skip ? parseInt(query.skip as string) : 0,
      include: 2, // Include linked entries (projects, persons)
    }
    
    // Add featured filter if provided
    if (query.featured !== undefined) {
      contentfulQuery['fields.featured'] = query.featured === 'true'
    }
    
    // Add rating filter if provided
    if (query.minRating) {
      contentfulQuery['fields.rating[gte]'] = parseInt(query.minRating as string)
    }
    
    // Add search if provided
    if (query.search) {
      contentfulQuery['query'] = query.search
    }
    
    // Create Contentful client and fetch data
    const client = createClient({
      space: spaceId,
      accessToken: accessToken,
    })
    
    const response = await client.getEntries(contentfulQuery)
    
    // Transform the data
    const transformedTestimonials = await transformTestimonials(response.items)
    
    return {
      items: transformedTestimonials,
      total: response.total,
      skip: response.skip,
      limit: response.limit,
    }
  } catch (error) {
    console.error('[API] Failed to fetch testimonials:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch testimonials',
      data: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    })
  }
})