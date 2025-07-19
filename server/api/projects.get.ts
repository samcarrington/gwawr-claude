import { createClient } from 'contentful';
import { transformProjects } from '~/utils/contentful-transformers';

export default defineEventHandler(async event => {
  // Get query parameters for filtering and pagination (moved outside try-catch for scope)
  const query = getQuery(event) as Record<string, any>;

  try {
    // Set cache headers
    setHeader(event, 'Cache-Control', 'public, max-age=600'); // 10 minutes for projects

    // Check if Contentful is configured
    const config = useRuntimeConfig(event);
    if (
      !config.public.contentfulSpaceId ||
      !config.public.contentfulAccessToken
    ) {
      console.warn(
        '[API] Contentful not configured, using mock data for projects'
      );

      // Fallback to mock data
      const { getProjects } = await import('~/data/projects');
      const mockProjects = getProjects();

      // Apply filters to mock data
      let filteredProjects = mockProjects;

      if (query.category && query.category !== 'All') {
        filteredProjects = filteredProjects.filter(
          project => project.category === query.category
        );
      }

      if (query.featured !== undefined) {
        filteredProjects = filteredProjects.filter(
          project => project.featured === (query.featured === 'true')
        );
      }

      if (query.status) {
        filteredProjects = filteredProjects.filter(
          project => project.status === query.status
        );
      }

      if (query.search) {
        const searchTerm = query.search.toLowerCase();
        filteredProjects = filteredProjects.filter(
          project =>
            project.title.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm) ||
            project.category.toLowerCase().includes(searchTerm) ||
            project.technologies.some(tech =>
              tech.toLowerCase().includes(searchTerm)
            )
        );
      }

      // Apply pagination
      const limit = query.limit ? parseInt(query.limit as string) : 20;
      const skip = query.skip ? parseInt(query.skip as string) : 0;
      const paginatedProjects = filteredProjects.slice(skip, skip + limit);

      return {
        items: paginatedProjects,
        total: filteredProjects.length,
        skip,
        limit,
      };
    }

    // Build Contentful query
    const contentfulQuery: any = {
      content_type: 'project',
      order: '-fields.date', // Most recent first (using legacy field name)
      limit: query.limit ? parseInt(query.limit as string) : 20,
      skip: query.skip ? parseInt(query.skip as string) : 0,
      include: 2, // Include linked entries up to 2 levels deep
    };

    // Add status filter if provided
    if (query.status) {
      contentfulQuery['fields.status'] = query.status;
    }

    // Add featured filter if provided
    if (query.featured !== undefined) {
      contentfulQuery['fields.featured'] = query.featured === 'true';
    }

    // For category filter, we'll fetch all projects and filter client-side
    // since category is a linked field (Array of Links to projectCategory)
    // This avoids complex Contentful query syntax for linked fields

    // Add search if provided
    if (query.search) {
      contentfulQuery['query'] = query.search;
    }

    // Create Contentful client directly in server context
    const client = createClient({
      space: config.public.contentfulSpaceId,
      accessToken: config.public.contentfulAccessToken,
      environment: config.public.contentfulEnvironment || 'master',
      host: config.public.contentfulHost || 'cdn.contentful.com',
    });

    const response = await client.getEntries(contentfulQuery);

    // Transform the data
    let transformedProjects = await transformProjects(response.items);

    // Apply client-side filtering for linked fields that can't be queried directly
    if (query.category && query.category !== 'All') {
      transformedProjects = transformedProjects.filter(project => {
        // Check if project category matches the requested category
        return project && project.category === query.category;
      });
    }

    // Apply client-side search filtering if needed
    if (query.search) {
      const searchTerm = query.search.toLowerCase();
      transformedProjects = transformedProjects.filter(
        project =>
          project &&
          (project.title.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm) ||
            project.category.toLowerCase().includes(searchTerm) ||
            project.technologies.some(tech =>
              tech.toLowerCase().includes(searchTerm)
            ))
      );
    }

    // Apply client-side pagination after filtering
    const limit = query.limit ? parseInt(query.limit as string) : 20;
    const skip = query.skip ? parseInt(query.skip as string) : 0;
    const paginatedProjects = transformedProjects.slice(skip, skip + limit);

    return {
      items: paginatedProjects,
      total: transformedProjects.length,
      skip,
      limit,
    };
  } catch (error) {
    console.error('[API] Failed to fetch projects:', error);

    // Fallback to mock data on error
    try {
      console.warn('[API] Falling back to mock data for projects due to error');
      const { getProjects } = await import('~/data/projects');
      const mockProjects = getProjects();

      // Apply filters to mock data (same logic as initial fallback)
      let filteredProjects = mockProjects;

      if (query.category && query.category !== 'All') {
        filteredProjects = filteredProjects.filter(
          project => project.category === query.category
        );
      }

      if (query.featured !== undefined) {
        filteredProjects = filteredProjects.filter(
          project => project.featured === (query.featured === 'true')
        );
      }

      if (query.status) {
        filteredProjects = filteredProjects.filter(
          project => project.status === query.status
        );
      }

      if (query.search) {
        const searchTerm = query.search.toLowerCase();
        filteredProjects = filteredProjects.filter(
          project =>
            project.title.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm) ||
            project.category.toLowerCase().includes(searchTerm) ||
            project.technologies.some(tech =>
              tech.toLowerCase().includes(searchTerm)
            )
        );
      }

      // Apply pagination
      const limit = query.limit ? parseInt(query.limit as string) : 20;
      const skip = query.skip ? parseInt(query.skip as string) : 0;
      const paginatedProjects = filteredProjects.slice(skip, skip + limit);

      return {
        items: paginatedProjects,
        total: filteredProjects.length,
        skip,
        limit,
      };
    } catch (fallbackError) {
      console.error('[API] Even mock data fallback failed:', fallbackError);

      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch projects',
        data: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  }
});
