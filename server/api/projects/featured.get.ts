import { getContentfulClient } from '~/utils/contentful-client'
import { transformProject } from '~/utils/contentful-transformers'

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters
    const query = getQuery(event)
    const limit = query.limit ? parseInt(query.limit as string) : 3
    
    // Set cache headers
    setHeader(event, 'Cache-Control', 'public, max-age=600') // 10 minutes
    
    // Check if Contentful is configured
    const runtimeConfig = useRuntimeConfig()
    const spaceId = runtimeConfig.contentfulSpaceId
    const accessToken = runtimeConfig.contentfulAccessToken
    
    if (!spaceId || !accessToken) {
      console.warn('[API] Contentful not configured, using mock data for featured projects')
      
      // Fallback to mock data
      const { getFeaturedProjects } = await import('~/data/projects')
      const featuredProjects = getFeaturedProjects()
      
      return featuredProjects.slice(0, limit)
    }
    
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
    
    // Fallback to mock data on error
    try {
      console.warn('[API] Falling back to mock data for featured projects due to error')
      const { getFeaturedProjects } = await import('~/data/projects')
      const featuredProjects = getFeaturedProjects()
      const query = getQuery(event)
      const limit = query.limit ? parseInt(query.limit as string) : 3
      
      return featuredProjects.slice(0, limit)
    } catch (fallbackError) {
      console.error('[API] Even mock data fallback failed:', fallbackError)
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch featured projects',
        data: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      })
    }
  }
})