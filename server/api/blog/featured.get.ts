import { createClient } from 'contentful';
import { transformBlogPost } from '~/utils/contentful-transformers';

export default defineEventHandler(async event => {
  try {
    // Set cache headers
    setHeader(event, 'Cache-Control', 'public, max-age=300'); // 5 minutes

    // Check if Contentful is configured
    const config = useRuntimeConfig(event);
    if (
      !config.public.contentfulSpaceId ||
      !config.public.contentfulAccessToken
    ) {
      console.warn(
        '[API] Contentful not configured, using mock data for featured post'
      );

      // Fallback to mock data
      const { getFeaturedBlogPost } = await import('~/data/blog');
      return getFeaturedBlogPost();
    }

    // Create Contentful client directly in server context
    const client = createClient({
      space: config.public.contentfulSpaceId,
      accessToken: config.public.contentfulAccessToken,
      environment: config.public.contentfulEnvironment || 'master',
      host: config.public.contentfulHost || 'cdn.contentful.com',
    });

    const response = await client.getEntries({
      content_type: 'blogPost',
      'fields.featured': true,
      order: '-fields.publishedAt',
      limit: 1, // Only get the most recent featured post
    });

    if (response.items.length === 0) {
      return null;
    }

    // Transform the first (most recent) featured post
    const transformedPost = await transformBlogPost(response.items[0]);

    return transformedPost;
  } catch (error) {
    console.error('[API] Failed to fetch featured blog post:', error);

    // Fallback to mock data on error
    try {
      console.warn(
        '[API] Falling back to mock data for featured post due to error'
      );
      const { getFeaturedBlogPost } = await import('~/data/blog');
      return getFeaturedBlogPost();
    } catch (fallbackError) {
      console.error('[API] Even mock data fallback failed:', fallbackError);

      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch featured blog post',
        data: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  }
});
