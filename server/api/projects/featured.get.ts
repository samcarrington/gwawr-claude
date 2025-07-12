import { getContentfulClient } from '~/utils/contentful-client'

// TODO: Move to utils/contentful-transformers.ts
function transformProject(entry: any) {
  const fields = entry.fields
  
  return {
    id: entry.sys.id,
    title: fields.title,
    slug: fields.slug,
    description: fields.description,
    fullDescription: fields.fullDescription,
    technologies: fields.technologies || [],
    images: fields.images || [],
    liveUrl: fields.liveUrl,
    repositoryUrl: fields.repositoryUrl,
    featured: fields.featured || false,
    category: fields.category,
    startDate: fields.date, // Legacy field name
    endDate: fields.endDate,
    status: fields.status || 'completed',
  }
}

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters
    const query = getQuery(event)
    const limit = query.limit ? parseInt(query.limit as string) : 3
    
    // Set cache headers
    setHeader(event, 'Cache-Control', 'public, max-age=600') // 10 minutes
    
    // Get Contentful client and fetch featured projects
    const client = getContentfulClient()
    const response = await client.getEntriesByType('project', {
      'fields.featured': true,
      order: '-fields.date',
      limit,
    })
    
    // Transform the data
    const transformedProjects = response.items.map(transformProject)
    
    return transformedProjects
  } catch (error) {
    console.error('[API] Failed to fetch featured projects:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch featured projects',
      data: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    })
  }
})