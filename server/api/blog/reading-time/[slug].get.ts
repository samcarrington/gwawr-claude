import readingTime from 'reading-time';

// In-memory cache for reading times
// In production, you might want to use Redis or another persistent cache
const readingTimeCache = new Map<string, { text: string; minutes: number; time: number; words: number; cachedAt: number }>();

// Cache TTL: 24 hours
const CACHE_TTL = 24 * 60 * 60 * 1000;

function stripMarkdownAndHtml(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove markdown images
    .replace(/\[.*?\]\(.*?\)/g, '') // Remove markdown links
    .replace(/[#*_`~]/g, '') // Remove markdown formatting
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

async function fetchBlogContent(slug: string, event: any): Promise<string> {
  // Check if Contentful is configured
  const config = useRuntimeConfig(event);
  const spaceId = config.public.contentfulSpaceId;
  const accessToken = config.public.contentfulAccessToken;

  if (!spaceId || !accessToken) {
    // Fallback to mock data
    const { getBlogPostBySlug } = await import('#shared/data/blog');
    const mockPost = getBlogPostBySlug(slug);
    return mockPost?.content || '';
  }

  // Fetch from Contentful
  const { createClient } = await import('contentful');
  const client = createClient({
    space: spaceId,
    accessToken: accessToken,
  });

  const response = await client.getEntries({
    content_type: 'blogPost',
    'fields.slug': slug,
    limit: 1,
  });

  const entry = response.items[0];
  if (!entry || !entry.fields.content) {
    return '';
  }

  return entry.fields.content as string;
}

export default defineEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, 'slug');
    
    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug parameter is required',
      });
    }

    // Check cache first
    const cached = readingTimeCache.get(slug);
    const now = Date.now();
    
    if (cached && (now - cached.cachedAt) < CACHE_TTL) {
      // Set cache headers for cached responses
      setHeader(event, 'Cache-Control', 'public, max-age=3600'); // 1 hour
      setHeader(event, 'X-Cache', 'HIT');
      
      return {
        text: cached.text,
        minutes: cached.minutes,
        time: cached.time,
        words: cached.words,
      };
    }

    // Fetch blog content
    const content = await fetchBlogContent(slug, event);
    
    if (!content) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Blog post not found',
      });
    }

    // Calculate reading time
    const plainText = stripMarkdownAndHtml(content);
    const stats = readingTime(plainText);

    // Cache the result
    readingTimeCache.set(slug, {
      text: stats.text,
      minutes: stats.minutes,
      time: stats.time,
      words: stats.words,
      cachedAt: now,
    });

    // Set cache headers
    setHeader(event, 'Cache-Control', 'public, max-age=3600'); // 1 hour
    setHeader(event, 'X-Cache', 'MISS');

    return {
      text: stats.text,
      minutes: stats.minutes,
      time: stats.time,
      words: stats.words,
    };

  } catch (error) {
    console.error(`[API] Failed to calculate reading time for "${getRouterParam(event, 'slug')}":`, error);
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to calculate reading time',
      data: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
});