import { getContentfulClient } from '~/utils/contentful-client'
import { transformProjects } from '~/utils/contentful-transformers'
import type { ContentfulQueryOptions } from '~/types/contentful'

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters for filtering and pagination
    const query = getQuery(event) as Record<string, any>
    
    // Set cache headers
    setHeader(event, 'Cache-Control', 'public, max-age=600') // 10 minutes for projects
    
    // Build Contentful query
    const contentfulQuery: ContentfulQueryOptions = {
      content_type: 'project',
      order: '-fields.date', // Most recent first (using legacy field name)
      limit: query.limit ? parseInt(query.limit as string) : 20,
      skip: query.skip ? parseInt(query.skip as string) : 0,
    }
    
    // Add status filter if provided
    if (query.status) {
      contentfulQuery['fields.status'] = query.status
    }
    
    // Add featured filter if provided
    if (query.featured !== undefined) {
      contentfulQuery['fields.featured'] = query.featured === 'true'
    }
    
    // Add category filter if provided
    if (query.category && query.category !== 'All') {
      contentfulQuery['fields.category'] = query.category
    }
    
    // Add search if provided
    if (query.search) {
      contentfulQuery['query'] = query.search
    }
    
    // Get Contentful client and fetch data
    const client = getContentfulClient()
    const response = await client.getEntriesByType('project', contentfulQuery)
    
    // Transform the data
    const transformedProjects = transformProjects(response.items)
    
    return {
      items: transformedProjects,
      total: response.total,
      skip: response.skip,
      limit: response.limit,
    }
  } catch (error) {
    console.error('[API] Failed to fetch projects:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch projects',
      data: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    })
  }
})