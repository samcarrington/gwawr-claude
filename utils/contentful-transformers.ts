import type { BlogPost, BlogCategory, BlogTag } from '~/types/blog';
import type {
  ContentfulEntry,
  ContentfulBlogPost,
  ContentfulCategory,
  ContentfulTag,
  ContentfulAsset,
} from '~/types/contentful';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types';
import { marked } from 'marked';
import { sanitizeUrl } from '~/utils/url';

/**
 * Detect content type and render appropriately
 * Handles both markdown strings and Contentful Rich Text documents
 */
export async function renderContent(content: any): Promise<string> {
  if (!content) return '';

  // If it's a string, assume it's markdown and render it
  if (typeof content === 'string') {
    return await renderMarkdown(content);
  }

  // If it's a Contentful Rich Text document, render it
  if (typeof content === 'object' && content.nodeType === 'document') {
    return await renderRichText(content);
  }

  // Fallback for any other content type
  return String(content);
}

/**
 * Render markdown string to HTML
 */
export async function renderMarkdown(markdown: string): Promise<string> {
  try {
    // Properly await the Promise returned by marked
    const result = await marked(markdown, {
      breaks: true,
      gfm: true,
    });
    return result;
  } catch (error) {
    console.warn('[Content Renderer] Failed to parse markdown:', error);
    return markdown;
  }
}

/**
 * Render Contentful Rich Text document to HTML
 */
export async function renderRichText(document: any): Promise<string> {
  try {
    return documentToHtmlString(document, {
      renderNode: {
        [BLOCKS.PARAGRAPH]: (node, next) =>
          `<p class="mb-4">${next(node.content)}</p>`,
        [BLOCKS.HEADING_1]: (node, next) =>
          `<h1 class="text-3xl font-bold mb-6">${next(node.content)}</h1>`,
        [BLOCKS.HEADING_2]: (node, next) =>
          `<h2 class="text-2xl font-bold mb-4">${next(node.content)}</h2>`,
        [BLOCKS.HEADING_3]: (node, next) =>
          `<h3 class="text-xl font-bold mb-3">${next(node.content)}</h3>`,
        [BLOCKS.UL_LIST]: (node, next) =>
          `<ul class="list-disc pl-6 mb-4">${next(node.content)}</ul>`,
        [BLOCKS.OL_LIST]: (node, next) =>
          `<ol class="list-decimal pl-6 mb-4">${next(node.content)}</ol>`,
        [BLOCKS.LIST_ITEM]: (node, next) =>
          `<li class="mb-2">${next(node.content)}</li>`,
        [BLOCKS.QUOTE]: (node, next) =>
          `<blockquote class="border-l-4 border-gray-300 pl-4 italic mb-4">${next(node.content)}</blockquote>`,
        [INLINES.HYPERLINK]: (node, next) => {
          const safeUri = sanitizeUrl(node.data.uri);
          return `<a href="${safeUri}" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">${next(node.content)}</a>`;
        },
      },
      renderMark: {
        [MARKS.BOLD]: text => `<strong>${text}</strong>`,
        [MARKS.ITALIC]: text => `<em>${text}</em>`,
        [MARKS.CODE]: text =>
          `<code class="bg-gray-100 px-2 py-1 rounded text-sm">${text}</code>`,
      },
    });
  } catch (error) {
    console.warn('[Content Renderer] Failed to render rich text:', error);
    return extractTextFromNodes(document.content || []);
  }
}

/**
 * Legacy function - kept for backward compatibility
 * Use renderContent() for new implementations
 */
export async function processRichText(document: any): Promise<string> {
  return await renderContent(document);
}

/**
 * Extract text content from rich text nodes
 */
function extractTextFromNodes(nodes: any[]): string {
  return nodes
    .map(node => {
      if (node.nodeType === 'paragraph' && node.content) {
        return extractTextFromNodes(node.content);
      }
      if (node.nodeType === 'text') {
        return node.value || '';
      }
      if (node.content) {
        return extractTextFromNodes(node.content);
      }
      return '';
    })
    .join(' ');
}

/**
 * Get asset URL with optional transformations
 */
export function getAssetUrl(
  asset: ContentfulAsset | undefined,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpg' | 'png' | 'webp';
  }
): string | null {
  if (!asset?.fields?.file?.url) return null;

  let url = asset.fields.file.url;

  // Add protocol if missing
  if (url.startsWith('//')) {
    url = `https:${url}`;
  }

  // Add transformations if provided
  if (options) {
    const params = new URLSearchParams();
    if (options.width) params.append('w', options.width.toString());
    if (options.height) params.append('h', options.height.toString());
    if (options.quality) params.append('q', options.quality.toString());
    if (options.format) params.append('fm', options.format);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }
  }

  return url;
}

/**
 * Transform Contentful blog category to our BlogCategory type
 */
export function transformCategory(
  entry: ContentfulEntry<ContentfulCategory>
): BlogCategory {
  return {
    name: entry.fields.name,
    slug: entry.fields.slug,
    description: entry.fields.description,
  };
}

/**
 * Transform Contentful tag to our BlogTag type
 */
export function transformTag(entry: ContentfulEntry<ContentfulTag>): BlogTag {
  return {
    name: entry.fields.name,
    slug: entry.fields.slug,
  };
}

/**
 * Transform Contentful blog post to our BlogPost type
 */
export async function transformBlogPost(
  entry: ContentfulEntry<ContentfulBlogPost>
): Promise<BlogPost> {
  const fields = entry.fields;

  return {
    id: entry.sys.id, // Use Contentful ID directly as string
    title: fields.title,
    slug: fields.slug,
    excerpt: fields.excerpt,
    content: await processRichText(fields.content),
    category: fields.category
      ? typeof fields.category === 'string'
        ? fields.category
        : transformCategory(fields.category).name
      : 'Uncategorized',
    tags: fields.tags
      ? fields.tags.map(tag =>
          typeof tag === 'string' ? tag : transformTag(tag).name
        )
      : [],
    featuredImage: getAssetUrl(fields.featuredImage),
    publishedAt: fields.publishedAt,
    readTime: fields.readTime,
    featured: fields.featured || false,
  };
}

/**
 * Transform multiple blog posts
 */
export async function transformBlogPosts(
  entries: ContentfulEntry<ContentfulBlogPost>[]
): Promise<BlogPost[]> {
  // Use Promise.all to wait for all async transformations to complete
  return Promise.all(entries.map(entry => transformBlogPost(entry)));
}

/**
 * Transform multiple categories
 */
export function transformCategories(
  entries: ContentfulEntry<ContentfulCategory>[]
): BlogCategory[] {
  return entries.map(transformCategory);
}

/**
 * Transform multiple tags
 */
export function transformTags(
  entries: ContentfulEntry<ContentfulTag>[]
): BlogTag[] {
  return entries.map(transformTag);
}

/**
 * Calculate estimated reading time based on content
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Validate required fields for blog post
 */
export function validateBlogPost(
  entry: ContentfulEntry<ContentfulBlogPost>
): boolean {
  const requiredFields = ['title', 'slug', 'excerpt', 'content', 'publishedAt'];

  return requiredFields.every(field => {
    const value = entry.fields[field as keyof ContentfulBlogPost];
    return value !== undefined && value !== null && value !== '';
  });
}

/**
 * Sort blog posts by publication date (newest first)
 */
export function sortBlogPostsByDate(posts: BlogPost[]): BlogPost[] {
  return posts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Filter blog posts by category
 */
export function filterBlogPostsByCategory(
  posts: BlogPost[],
  category: string
): BlogPost[] {
  if (category === 'All') return posts;
  return posts.filter(post => post.category === category);
}

/**
 * Filter blog posts by tag
 */
export function filterBlogPostsByTag(
  posts: BlogPost[],
  tag: string
): BlogPost[] {
  return posts.filter(post => post.tags.includes(tag));
}

/**
 * Get unique categories from blog posts
 */
export function getUniqueCategoriesFromPosts(posts: BlogPost[]): string[] {
  return [...new Set(posts.map(post => post.category))];
}

/**
 * Get unique tags from blog posts
 */
export function getUniqueTagsFromPosts(posts: BlogPost[]): string[] {
  const allTags = posts.flatMap(post => post.tags);
  return [...new Set(allTags)];
}

/**
 * Get related posts by category (excluding current post)
 */
export function getRelatedPosts(
  posts: BlogPost[],
  currentPost: BlogPost,
  limit = 3
): BlogPost[] {
  return posts
    .filter(
      post =>
        post.category === currentPost.category && post.id !== currentPost.id
    )
    .slice(0, limit);
}

/**
 * Extract technology names from Contentful entries or strings
 * Handles both string arrays and arrays of Contentful technology entries
 */
function extractTechnologyNames(technologies: any): string[] {
  if (!technologies) return [];

  // If it's already an array of strings, return as is
  if (
    Array.isArray(technologies) &&
    technologies.every(tech => typeof tech === 'string')
  ) {
    return technologies;
  }

  // If it's an array of Contentful entries
  if (Array.isArray(technologies)) {
    return technologies
      .map(tech => {
        // If it's a Contentful entry with fields.name
        if (
          tech &&
          typeof tech === 'object' &&
          tech.fields &&
          tech.fields.name
        ) {
          return tech.fields.name;
        }
        // If it's a string
        if (typeof tech === 'string') {
          return tech;
        }
        // Fallback: log warning and return safe value
        console.warn(
          '[Project Transformer] Technology is not a string or proper entry:',
          JSON.stringify(tech, null, 2)
        );
        return 'Unknown Technology';
      })
      .filter(Boolean);
  }

  // If it's a single entry/string
  if (
    typeof technologies === 'object' &&
    technologies.fields &&
    technologies.fields.name
  ) {
    return [technologies.fields.name];
  }

  if (typeof technologies === 'string') {
    return [technologies];
  }

  return [];
}

/**
 * Extract category name from Contentful entry, array, or string
 * Handles both single category strings and arrays of Contentful category entries
 * Takes the first category from an array if multiple categories are provided
 */
function extractCategoryName(category: any): string {
  if (!category) return 'Uncategorized';

  // If it's already a string, return as is
  if (typeof category === 'string') {
    return category;
  }

  // If it's an array of categories, take the first one
  if (Array.isArray(category)) {
    if (category.length === 0) return 'Uncategorized';
    const firstCategory = category[0];

    // Recursively extract from the first item
    if (typeof firstCategory === 'string') {
      return firstCategory;
    }

    if (typeof firstCategory === 'object' && firstCategory.fields) {
      return (
        firstCategory.fields.name ||
        firstCategory.fields.title ||
        'Uncategorized'
      );
    }

    console.warn(
      '[Project Transformer] First category in array is not a valid entry:',
      JSON.stringify(firstCategory)
    );
    return 'Uncategorized';
  }

  // If it's a Contentful entry with fields.name or fields.title
  if (typeof category === 'object' && category.fields) {
    return category.fields.name || category.fields.title || 'Uncategorized';
  }

  // Fallback: log the actual structure and return safe value
  console.warn(
    '[Project Transformer] Category is not a string, array, or proper entry:',
    JSON.stringify(category, null, 2)
  );
  return 'Uncategorized';
}

/**
 * Extract image URLs from Contentful assets
 */
function extractImageUrls(images: any): string[] {
  if (!images) return [];

  // If it's already an array of strings, return as is
  if (Array.isArray(images) && images.every(img => typeof img === 'string')) {
    return images;
  }

  // If it's an array of Contentful assets
  if (Array.isArray(images)) {
    return images.map(img => getAssetUrl(img)).filter(Boolean) as string[];
  }

  // If it's a single asset
  if (typeof images === 'object' && images.fields) {
    const url = getAssetUrl(images);
    return url ? [url] : [];
  }

  return [];
}

/**
 * Transform Contentful project to our Project type
 */
export async function transformProject(entry: any) {
  try {
    if (!entry || !entry.sys || !entry.fields) {
      console.warn('[Project Transformer] Invalid entry structure:', entry);
      return null;
    }

    const fields = entry.fields;

    // Validate required fields
    if (!fields.title || !fields.slug) {
      console.warn(
        '[Project Transformer] Missing required fields (title/slug):',
        entry.sys.id
      );
      return null;
    }

    return {
      id: entry.sys.id,
      title: fields.title || 'Untitled Project',
      slug: fields.slug || `project-${entry.sys.id}`,
      description: fields.description || '',
      fullDescription: fields.fullDescription
        ? await renderContent(fields.fullDescription)
        : undefined,
      technologies: extractTechnologyNames(fields.technologies),
      thumbnail: getAssetUrl(fields.thumbnail, { width: 400, quality: 80, format: 'webp' }),
      bannerImage: getAssetUrl(fields.bannerImage, { width: 1200, quality: 85, format: 'webp' }),
      images: extractImageUrls(fields.images), // Keep for backward compatibility
      liveUrl: fields.liveUrl || undefined,
      repositoryUrl: fields.repositoryUrl || undefined,
      featured: Boolean(fields.featured),
      category: extractCategoryName(fields.category),
      startDate: fields.date || fields.startDate || undefined,
      endDate: fields.endDate || undefined,
      status: fields.status || 'completed',
    };
  } catch (error) {
    handleTransformationError(
      error,
      `Project transformation for entry ${entry?.sys?.id || 'unknown'}`
    );
    return null;
  }
}

/**
 * Transform multiple projects
 */
export async function transformProjects(entries: any[]) {
  // Use Promise.all to wait for all async transformations to complete
  const results = await Promise.all(
    entries.map(entry => transformProject(entry))
  );
  return results.filter(Boolean);
}

/**
 * Transform Contentful testimonial to our Testimonial type
 */
export async function transformTestimonial(entry: any) {
  const fields = entry.fields;

  // Process the quote field (RichText) to get the testimonial content
  let content = '';
  if (fields.quote) {
    try {
      content = await renderContent(fields.quote);
      // Strip surrounding paragraph tags for cleaner testimonial display
      content = content.replace(/^<p[^>]*>/, '').replace(/<\/p>$/, '');
    } catch (error) {
      console.warn(
        '[Testimonial Transformer] Failed to render quote content:',
        error
      );
      content = extractTextFromNodes(fields.quote || ''); // Fallback to plain text or empty string // Fallback to raw content if rendering fails
    }
  }

  return {
    id: entry.sys.id,
    title: fields.title,
    content: content, // Use processed quote content
    clientName: fields.clientName,
    clientTitle: fields.clientTitle,
    clientCompany: fields.clientCompany,
    company: fields.company, // Legacy field
    name: fields.name, // Legacy field - may be overridden by clientName
    rating: fields.rating,
    featured: fields.featured || false,
    projectReference: fields.projectReference,
    attribution: fields.attribution, // Legacy person link
  };
}

/**
 * Transform multiple testimonials
 */
// Updated to accept actual Contentful SDK Entry types for better compatibility
export async function transformTestimonials(entries: any[]) {
  return Promise.all(entries.map(transformTestimonial));
}

/**
 * Error handler for transformation failures
 */
export function handleTransformationError(error: any, context: string): void {
  console.error(`[Contentful Transformer Error] ${context}:`, error);

  // In production, you might want to send this to a logging service
  if (process.env.NODE_ENV === 'production') {
    // Log to external service
  }
}
