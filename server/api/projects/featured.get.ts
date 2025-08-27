import { createClient } from 'contentful';

export default defineEventHandler(async event => {
  try {
    // Get query parameters
    const query = getQuery(event);
    const limit = query.limit ? parseInt(query.limit as string) : 3;

    // Set cache headers
    setHeader(event, 'Cache-Control', 'public, max-age=600'); // 10 minutes

    // Check if Contentful is configured
    const config = useRuntimeConfig(event);
    if (
      !config.public.contentfulSpaceId ||
      !config.public.contentfulAccessToken
    ) {
      console.warn(
        '[API] Contentful not configured, using mock data for featured projects'
      );

      // Fallback to mock data
      const { getFeaturedProjects } = await import('#shared/data/projects');
      const featuredProjects = getFeaturedProjects();

      return featuredProjects.slice(0, limit);
    }

    // Create Contentful client directly in server context
    const client = createClient({
      space: config.public.contentfulSpaceId,
      accessToken: config.public.contentfulAccessToken,
      environment: config.public.contentfulEnvironment || 'master',
      host: config.public.contentfulHost || 'cdn.contentful.com',
    });

    const response = await client.getEntries({
      content_type: 'project',
      'fields.featured': true,
      order: '-fields.date',
      limit,
    });

    // Transform the data - use Promise.all to handle async transformations
    const transformedProjects = await Promise.all(
      response.items.map(item => transformProject(item))
    );

    return transformedProjects;
  } catch (error) {
    console.error('[API] Failed to fetch featured projects:', error);

    // Fallback to mock data on error
    try {
      console.warn(
        '[API] Falling back to mock data for featured projects due to error'
      );
      const { getFeaturedProjects } = await import('#shared/data/projects');
      const featuredProjects = getFeaturedProjects();
      const query = getQuery(event);
      const limit = query.limit ? parseInt(query.limit as string) : 3;

      return featuredProjects.slice(0, limit);
    } catch (fallbackError) {
      console.error('[API] Even mock data fallback failed:', fallbackError);

      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch featured projects',
        data: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  }
});
