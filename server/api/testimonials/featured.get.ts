import { getContentfulClient } from '~/utils/contentful-client'
import { transformTestimonial } from '~/utils/contentful-transformers'

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters
    const query = getQuery(event)
    const limit = query.limit ? parseInt(query.limit as string) : 5
    
    // Set cache headers
    setHeader(event, 'Cache-Control', 'public, max-age=900') // 15 minutes
    
    // Get Contentful client and fetch featured testimonials
    const client = getContentfulClient()
    const response = await client.getEntriesByType('testimonial', {
      'fields.featured': true,
      order: '-fields.rating,-sys.createdAt', // Order by rating first, then by creation date
      limit,
      include: 2, // Include linked entries
    })
    
    // Transform the data
    const transformedTestimonials = response.items.map(transformTestimonial)
    
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