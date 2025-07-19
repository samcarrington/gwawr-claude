import { createClient } from 'contentful'
import { transformTestimonial } from '~/utils/contentful-transformers'

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters
    const query = getQuery(event)
    const limit = query.limit ? parseInt(query.limit as string) : 5
    
    // Set cache headers
    setHeader(event, 'Cache-Control', 'public, max-age=900') // 15 minutes
    
    // Check if Contentful is configured
    const config = useRuntimeConfig(event)
    if (!config.public.contentfulSpaceId || !config.public.contentfulAccessToken) {
      throw createError({
        statusCode: 503,
        statusMessage: 'Contentful not configured'
      })
    }
    
    // Create Contentful client directly in server context
    const client = createClient({
      space: config.public.contentfulSpaceId,
      accessToken: config.public.contentfulAccessToken,
      environment: config.public.contentfulEnvironment || 'master',
      host: config.public.contentfulHost || 'cdn.contentful.com',
    })
    
    const response = await client.getEntries({
      content_type: 'testimonial',
      'fields.featured': true,
      order: '-fields.rating,-sys.createdAt', // Order by rating first, then by creation date
      limit,
      include: 2, // Include linked entries
    })
    
    // Transform the data
    const transformedTestimonials = await Promise.all(response.items.map(transformTestimonial))
    
    return transformedTestimonials
  } catch (error) {
    console.error('[API] Failed to fetch featured testimonials:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch featured testimonials',
      data: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    })
  }
})