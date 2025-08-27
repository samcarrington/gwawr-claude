import {
  getContentfulClient,
  isContentfulConfigured,
  getContentfulConfig,
} from '~/server/utils/contentful';
import { transformProject } from '~/utils/contentful-transformers';

export default defineEventHandler(async event => {
  const slug = getRouterParam(event, 'slug');

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Project slug is required',
    });
  }

  try {
    // Set cache headers for individual projects (longer cache since they change less frequently)
    setHeader(event, 'Cache-Control', 'public, max-age=1800'); // 30 minutes

    // Get Contentful client using centralized service
    const client = getContentfulClient(event);

    if (!client) {
      const config = getContentfulConfig(event);
      console.warn('[API] Contentful not available, config:', config);
      console.warn('[API] Using mock data for project:', slug);

      // Fallback to mock data
      const { getProjects } = await import('~/data/projects');
      const mockProjects = getProjects();
      const project = mockProjects.find(p => p.slug === slug);

      if (!project) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Project not found',
        });
      }

      return { project };
    }

    // Fetch project by slug from Contentful
    const response = await client.getEntries({
      content_type: 'project',
      'fields.slug': slug,
      include: 3, // Include linked entries (categories, technologies, etc.)
      limit: 1,
    });

    if (!response.items || response.items.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Project not found',
      });
    }

    // Transform the project data
    const transformedProject = await transformProject(response.items[0]);

    if (!transformedProject) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to process project data',
      });
    }

    return { project: transformedProject };
  } catch (error: unknown) {
    console.error('[API] Failed to fetch project:', slug, error);

    // If it's already a Nuxt error (has statusCode), re-throw it
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    // For other errors, try fallback to mock data
    try {
      const { getProjects } = await import('~/data/projects');
      const mockProjects = getProjects();
      const project = mockProjects.find(p => p.slug === slug);

      if (!project) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Project not found',
        });
      }

      console.log('[API] Using mock data for project:', slug);
      return { project };
    } catch (fallbackError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch project data',
      });
    }
  }
});
