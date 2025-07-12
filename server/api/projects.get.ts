import { getContentfulClient } from '~/utils/contentful-client'
import { transformProjects } from '~/utils/contentful-transformers'
import type { ContentfulQueryOptions } from '~/types/contentful'

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters for filtering and pagination
    const query = getQuery(event) as Record<string, any>
    
    // Set cache headers
    setHeader(event, 'Cache-Control', 'public, max-age=600') // 10 minutes for projects
    
    // Check if Contentful is configured
    const runtimeConfig = useRuntimeConfig()
    const spaceId = runtimeConfig.contentfulSpaceId
    const accessToken = runtimeConfig.contentfulAccessToken
    
    if (!spaceId || !accessToken) {
      console.warn('[API] Contentful not configured, using mock data for projects')
      
      // Fallback to mock data
      const { getProjects } = await import('~/data/projects')
      const mockProjects = getProjects()
      
      // Apply filters to mock data
      let filteredProjects = mockProjects
      
      if (query.category && query.category !== 'All') {
        filteredProjects = filteredProjects.filter(project => project.category === query.category)
      }
      
      if (query.featured !== undefined) {
        filteredProjects = filteredProjects.filter(project => project.featured === (query.featured === 'true'))
      }
      
      if (query.status) {
        filteredProjects = filteredProjects.filter(project => project.status === query.status)
      }
      
      if (query.search) {
        const searchTerm = query.search.toLowerCase()
        filteredProjects = filteredProjects.filter(project => 
          project.title.toLowerCase().includes(searchTerm) ||
          project.description.toLowerCase().includes(searchTerm) ||
          project.category.toLowerCase().includes(searchTerm) ||
          project.technologies.some(tech => tech.toLowerCase().includes(searchTerm))
        )
      }
      
      // Apply pagination
      const limit = query.limit ? parseInt(query.limit as string) : 20
      const skip = query.skip ? parseInt(query.skip as string) : 0
      const paginatedProjects = filteredProjects.slice(skip, skip + limit)
      
      return {
        items: paginatedProjects,
        total: filteredProjects.length,
        skip,
        limit,
      }
    }
    
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
    
    // Fallback to mock data on error
    try {
      console.warn('[API] Falling back to mock data for projects due to error')
      const { getProjects } = await import('~/data/projects')
      const mockProjects = getProjects()
      
      return {
        items: mockProjects,
        total: mockProjects.length,
        skip: 0,
        limit: mockProjects.length,
      }
    } catch (fallbackError) {
      console.error('[API] Even mock data fallback failed:', fallbackError)
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch projects',
        data: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      })
    }
  }
})