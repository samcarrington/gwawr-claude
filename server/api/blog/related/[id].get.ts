import { createClient } from 'contentful';
import { transformBlogPosts } from '#shared/utils/contentful-transformers';

export default defineEventHandler(async event => {
  try {
    // Get runtime config and validate Contentful configuration
    const config = useRuntimeConfig(event);
    const spaceId = config.public.contentfulSpaceId;
    const accessToken = config.public.contentfulAccessToken;

    if (!spaceId || !accessToken) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Contentful configuration is missing',
      });
    }

    // Get ID from route parameters
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Post ID parameter is required',
      });
    }

    // Get query parameters
    const query = getQuery(event);
    const limit = query.limit ? parseInt(query.limit as string) : 3;

    // Set cache headers
    setHeader(event, 'Cache-Control', 'public, max-age=600'); // 10 minutes

    // Create Contentful client
    const client = createClient({
      space: spaceId,
      accessToken: accessToken,
    });

    // First, get the current post to find its category
    const currentPost = await client.getEntry(id);

    if (!currentPost) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Blog post not found',
      });
    }

    const currentCategory = currentPost.fields.category;

    if (!currentCategory) {
      // If no category, return empty array
      return [];
    }

    // Fetch related posts in the same category, excluding current post
    const response = await client.getEntries({
      content_type: 'blogPost',
      'fields.category': currentCategory,
      'sys.id[ne]': id, // Exclude current post
      order: '-fields.publishedAt', // Most recent first
      limit,
    } as any);

    // Transform the data
    const transformedPosts = await transformBlogPosts(response.items);

    return transformedPosts;
  } catch (error) {
    console.error(
      `[API] Failed to fetch related posts for ID "${getRouterParam(event, 'id')}":`,
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

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch related blog posts',
      data: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
});
