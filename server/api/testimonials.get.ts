import { getContentfulClient } from '~/utils/contentful-client'
import type { ContentfulQueryOptions } from '~/types/contentful'

// TODO: Create transformTestimonials function similar to transformBlogPosts
// For now, using a basic transformation
function transformTestimonial(entry: any) {
  const fields = entry.fields
  
  return {
    id: entry.sys.id,
    title: fields.title,
    content: fields.content || fields.testimonialText, // Handle both field names
    clientName: fields.clientName,
    clientTitle: fields.clientTitle,
    clientCompany: fields.clientCompany,
    company: fields.company, // Legacy field
    name: fields.name, // Legacy field - may be overridden by clientName
    rating: fields.rating,
    featured: fields.featured || false,
    projectReference: fields.projectReference,
    attribution: fields.attribution, // Legacy person link
  }
}

function transformTestimonials(entries: any[]) {
  return entries.map(transformTestimonial)
}

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters for filtering and pagination
    const query = getQuery(event) as Record<string, any>
    
    // Set cache headers
    setHeader(event, 'Cache-Control', 'public, max-age=900') // 15 minutes for testimonials
    
    // Build Contentful query
    const contentfulQuery: ContentfulQueryOptions = {
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
    
    // Get Contentful client and fetch data
    const client = getContentfulClient()
    const response = await client.getEntriesByType('testimonial', contentfulQuery)
    
    // Transform the data
    const transformedTestimonials = transformTestimonials(response.items)
    
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