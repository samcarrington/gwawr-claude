import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'
import type { RichTextDocument } from 'contentful'
import type {
  ContentfulEntry,
  ContentfulAsset,
  ContentfulBlogPost,
  ContentfulProject,
  ContentfulTestimonial,
  ContentfulPerson,
  ContentfulProjectCategory,
  ContentfulTechnology,
  ContentfulSkill,
  TransformedBlogPost,
  TransformedProject,
  TransformedTestimonial
} from '~/types/contentful-actual'
import type { BlogPost } from '~/types/blog'

/**
 * Transform Contentful Asset to URL string
 */
export function transformAssetToUrl(asset: ContentfulAsset | undefined): string | null {
  if (!asset?.fields?.file?.url) return null
  
  // Ensure URL is absolute
  const url = asset.fields.file.url
  return url.startsWith('//') ? `https:${url}` : url
}

/**
 * Transform Contentful RichText to HTML string
 */
export function transformRichTextToHtml(richText: RichTextDocument | undefined): string {
  if (!richText) return ''
  
  try {
    return documentToHtmlString(richText)
  } catch (error) {
    console.error('Error transforming rich text to HTML:', error)
    return ''
  }
}

/**
 * Transform Contentful RichText to plain text string
 */
export function transformRichTextToPlainText(richText: RichTextDocument | undefined): string {
  if (!richText) return ''
  
  try {
    return documentToPlainTextString(richText)
  } catch (error) {
    console.error('Error transforming rich text to plain text:', error)
    return ''
  }
}

/**
 * Extract text content from RichText for excerpt generation
 */
export function extractExcerptFromRichText(richText: RichTextDocument | undefined, maxLength: number = 150): string {
  const plainText = transformRichTextToPlainText(richText)
  if (plainText.length <= maxLength) return plainText
  
  return plainText.substring(0, maxLength).trim() + '...'
}

/**
 * Estimate read time from content
 */
export function estimateReadTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/**
 * Transform Contentful BlogPost to Application BlogPost format
 */
export function transformBlogPost(
  entry: ContentfulEntry<ContentfulBlogPost>
): TransformedBlogPost {
  const fields = entry.fields
  
  // Generate missing fields with fallbacks
  const slug = generateSlug(fields.title)
  const content = transformRichTextToHtml(fields.content)
  const excerpt = fields.excerpt || extractExcerptFromRichText(fields.content)
  const readTime = estimateReadTime(content)
  
  return {
    id: entry.sys.id,
    title: fields.title,
    slug,
    excerpt,
    content,
    // Default values for missing fields
    category: 'General', // Default category
    tags: [], // No tags in current model
    featuredImage: transformAssetToUrl(fields.thumbnail),
    publishedAt: entry.sys.createdAt, // Use created date as fallback
    readTime,
    featured: false, // Default to false
    author: {
      name: fields.author.fields.name,
      title: fields.author.fields.jobTitle,
      company: fields.author.fields.company
    }
  }
}

/**
 * Transform Contentful BlogPost to Application BlogPost format (for blog.ts interface)
 */
export function transformBlogPostToApp(
  entry: ContentfulEntry<ContentfulBlogPost>
): BlogPost {
  const transformed = transformBlogPost(entry)
  
  return {
    id: parseInt(entry.sys.id.slice(-8), 16), // Convert ID to number
    title: transformed.title,
    slug: transformed.slug,
    excerpt: transformed.excerpt,
    content: transformed.content,
    category: transformed.category,
    tags: transformed.tags,
    featuredImage: transformed.featuredImage,
    publishedAt: transformed.publishedAt,
    readTime: transformed.readTime,
    featured: transformed.featured
  }
}

/**
 * Transform Contentful Project to Application Project format
 */
export function transformProject(
  entry: ContentfulEntry<ContentfulProject>
): TransformedProject {
  const fields = entry.fields
  
  // Transform linked entries to strings
  const categories = fields.category?.map(cat => cat.fields.title) || []
  const technologies = fields.technologies?.map(tech => tech.fields.name) || []
  const skills = fields.skills?.map(skill => skill.fields.title || 'Unknown') || []
  
  return {
    id: entry.sys.id,
    title: fields.title,
    slug: fields.slug,
    description: fields.description,
    excerpt: fields.excerpt ? transformRichTextToPlainText(fields.excerpt) : undefined,
    category: categories,
    technologies,
    skills,
    image: transformAssetToUrl(fields.thumbnail),
    bannerImage: transformAssetToUrl(fields.bannerImage),
    // Default values for missing fields
    liveUrl: undefined, // Missing in current model
    repoUrl: undefined, // Missing in current model
    featured: false, // Missing in current model
    date: fields.date || entry.sys.createdAt,
    endDate: undefined, // Missing in current model
    status: 'completed' as const // Default status
  }
}

/**
 * Transform Contentful Project to Application Project format (for projects page)
 */
export function transformProjectToApp(
  entry: ContentfulEntry<ContentfulProject>
): any {
  const transformed = transformProject(entry)
  
  return {
    id: parseInt(entry.sys.id.slice(-8), 16), // Convert ID to number
    title: transformed.title,
    slug: transformed.slug,
    description: transformed.description,
    category: transformed.category[0] || 'General', // Take first category
    technologies: transformed.technologies,
    image: transformed.image,
    liveUrl: transformed.liveUrl,
    repoUrl: transformed.repoUrl,
    featured: transformed.featured,
    date: transformed.date
  }
}

/**
 * Transform Contentful Testimonial to Application Testimonial format
 */
export function transformTestimonial(
  entry: ContentfulEntry<ContentfulTestimonial>
): TransformedTestimonial {
  const fields = entry.fields
  
  return {
    id: entry.sys.id,
    content: transformRichTextToPlainText(fields.quote),
    name: fields.attribution.fields.name,
    title: fields.attribution.fields.jobTitle,
    company: fields.attribution.fields.company,
    // Default values for missing fields
    rating: undefined, // Missing in current model
    featured: false, // Missing in current model
    projectReference: undefined // Missing in current model
  }
}

/**
 * Transform Contentful Testimonial to Application Testimonial format (for testimonials page)
 */
export function transformTestimonialToApp(
  entry: ContentfulEntry<ContentfulTestimonial>
): any {
  const transformed = transformTestimonial(entry)
  
  return {
    id: parseInt(entry.sys.id.slice(-8), 16), // Convert ID to number
    content: transformed.content,
    name: transformed.name,
    title: transformed.title,
    company: transformed.company,
    rating: transformed.rating || 5 // Default to 5 stars
  }
}

/**
 * Transform array of Contentful entries
 */
export function transformEntryArray<T, R>(
  entries: ContentfulEntry<T>[],
  transformer: (entry: ContentfulEntry<T>) => R
): R[] {
  return entries.map(transformer)
}

/**
 * Create fallback data for missing content
 */
export function createFallbackBlogPost(id: string): TransformedBlogPost {
  return {
    id,
    title: 'Coming Soon',
    slug: 'coming-soon',
    excerpt: 'This blog post is coming soon.',
    content: '<p>This blog post is coming soon.</p>',
    category: 'General',
    tags: [],
    featuredImage: null,
    publishedAt: new Date().toISOString(),
    readTime: 1,
    featured: false,
    author: {
      name: 'Sam Carrington',
      title: 'Developer',
      company: 'GWAWR'
    }
  }
}

/**
 * Create fallback data for missing projects
 */
export function createFallbackProject(id: string): TransformedProject {
  return {
    id,
    title: 'Coming Soon',
    slug: 'coming-soon',
    description: 'This project is coming soon.',
    category: ['General'],
    technologies: [],
    skills: [],
    image: null,
    bannerImage: null,
    featured: false,
    date: new Date().toISOString(),
    status: 'planned'
  }
}

/**
 * Create fallback data for missing testimonials
 */
export function createFallbackTestimonial(id: string): TransformedTestimonial {
  return {
    id,
    content: 'Testimonial coming soon.',
    name: 'Client Name',
    title: 'Position',
    company: 'Company',
    rating: 5,
    featured: false
  }
}

/**
 * Validate transformed data
 */
export function validateTransformedBlogPost(post: TransformedBlogPost): boolean {
  return !!(
    post.id &&
    post.title &&
    post.slug &&
    post.excerpt &&
    post.content &&
    post.category &&
    post.publishedAt &&
    post.author?.name
  )
}

export function validateTransformedProject(project: TransformedProject): boolean {
  return !!(
    project.id &&
    project.title &&
    project.slug &&
    project.description &&
    project.date
  )
}

export function validateTransformedTestimonial(testimonial: TransformedTestimonial): boolean {
  return !!(
    testimonial.id &&
    testimonial.content &&
    testimonial.name
  )
}

/**
 * Error handling for transformations
 */
export function safeTransformBlogPost(
  entry: ContentfulEntry<ContentfulBlogPost>
): TransformedBlogPost {
  try {
    const transformed = transformBlogPost(entry)
    
    if (!validateTransformedBlogPost(transformed)) {
      console.warn('Invalid blog post transformation:', entry.sys.id)
      return createFallbackBlogPost(entry.sys.id)
    }
    
    return transformed
  } catch (error) {
    console.error('Error transforming blog post:', error)
    return createFallbackBlogPost(entry.sys.id)
  }
}

export function safeTransformProject(
  entry: ContentfulEntry<ContentfulProject>
): TransformedProject {
  try {
    const transformed = transformProject(entry)
    
    if (!validateTransformedProject(transformed)) {
      console.warn('Invalid project transformation:', entry.sys.id)
      return createFallbackProject(entry.sys.id)
    }
    
    return transformed
  } catch (error) {
    console.error('Error transforming project:', error)
    return createFallbackProject(entry.sys.id)
  }
}

export function safeTransformTestimonial(
  entry: ContentfulEntry<ContentfulTestimonial>
): TransformedTestimonial {
  try {
    const transformed = transformTestimonial(entry)
    
    if (!validateTransformedTestimonial(transformed)) {
      console.warn('Invalid testimonial transformation:', entry.sys.id)
      return createFallbackTestimonial(entry.sys.id)
    }
    
    return transformed
  } catch (error) {
    console.error('Error transforming testimonial:', error)
    return createFallbackTestimonial(entry.sys.id)
  }
}

/**
 * Batch transformation with error handling
 */
export function batchTransformBlogPosts(
  entries: ContentfulEntry<ContentfulBlogPost>[]
): TransformedBlogPost[] {
  return entries.map(safeTransformBlogPost)
}

export function batchTransformProjects(
  entries: ContentfulEntry<ContentfulProject>[]
): TransformedProject[] {
  return entries.map(safeTransformProject)
}

export function batchTransformTestimonials(
  entries: ContentfulEntry<ContentfulTestimonial>[]
): TransformedTestimonial[] {
  return entries.map(safeTransformTestimonial)
}