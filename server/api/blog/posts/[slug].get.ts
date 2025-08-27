import { createClient } from 'contentful';
import { transformBlogPost } from '#shared/utils/contentful-transformers';

export default defineEventHandler(async event => {
  try {
    // Get slug from route parameters
    const slug = getRouterParam(event, 'slug');

    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug parameter is required',
      });
    }

    // Set cache headers
    setHeader(event, 'Cache-Control', 'public, max-age=600'); // 10 minutes for individual posts

    // Check if Contentful is configured
    const config = useRuntimeConfig(event);
    const spaceId = config.public.contentfulSpaceId;
    const accessToken = config.public.contentfulAccessToken;

    if (!spaceId || !accessToken) {
      console.warn(
        '[API] Contentful not configured, using mock data for blog post'
      );

      // Fallback to mock data
      const { getBlogPostBySlug } = await import('#shared/data/blog');
      const mockPost = getBlogPostBySlug(slug);

      if (!mockPost) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Blog post not found',
        });
      }

      return mockPost;
    }

    // Create Contentful client and fetch data
    const client = createClient({
      space: spaceId,
      accessToken: accessToken,
    });

    const response = await client.getEntries({
      content_type: 'blogPost',
      'fields.slug': slug,
      include: 2, // Include linked entries up to 2 levels deep
      limit: 1,
    });

    const entry = response.items[0];

    if (!entry) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Blog post not found',
      });
    }

    // Transform the data
    const transformedPost = await transformBlogPost(entry);

    return transformedPost;
  } catch (error) {
    console.error(
      `[API] Failed to fetch blog post with slug "${getRouterParam(event, 'slug')}":`,
      error
    );

    // Re-throw 404 errors as-is
    if (
      error &&
      typeof error === 'object' &&
      'statusCode' in error &&
      error.statusCode === 404
    ) {
      throw error;
    }

    // Fallback to mock data on error
    try {
      console.warn(
        '[API] Falling back to mock data for blog post due to error'
      );
      const { getBlogPostBySlug } = await import('#shared/data/blog');
      const mockPost = getBlogPostBySlug(
        getRouterParam(event, 'slug') as string
      );

      if (!mockPost) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Blog post not found',
        });
      }

      return mockPost;
    } catch (fallbackError) {
      console.error('[API] Even mock data fallback failed:', fallbackError);

      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch blog post',
        data: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  }
});
