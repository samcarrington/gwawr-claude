import type { BlogPost, BlogCategory, BlogTag } from '~/types/blog'
import type {
  ContentfulEntry,
  ContentfulBlogPost,
  ContentfulCategory,
  ContentfulTag,
  ContentfulAsset,
} from '~/types/contentful'

/**
 * Rich text document processor
 * Converts Contentful rich text to HTML string
 */
export function processRichText(document: any): string {
  if (!document) return ''
  
  // Simple implementation - in a real app you'd use @contentful/rich-text-html-renderer
  // For now, we'll extract plain text or implement basic conversion
  if (typeof document === 'string') return document
  
  // If it's a rich text document, extract content
  if (document.nodeType === 'document' && document.content) {
    return extractTextFromNodes(document.content)
  }
  
  return JSON.stringify(document)
}

/**
 * Extract text content from rich text nodes
 */
function extractTextFromNodes(nodes: any[]): string {
  return nodes
    .map(node => {
      if (node.nodeType === 'paragraph' && node.content) {
        return extractTextFromNodes(node.content)
      }
      if (node.nodeType === 'text') {
        return node.value || ''
      }
      if (node.content) {
        return extractTextFromNodes(node.content)
      }
      return ''
    })
    .join(' ')
}

/**
 * Get asset URL with optional transformations
 */
export function getAssetUrl(asset: ContentfulAsset | undefined, options?: {
  width?: number
  height?: number
  quality?: number
  format?: 'jpg' | 'png' | 'webp'
}): string | null {
  if (!asset?.fields?.file?.url) return null
  
  let url = asset.fields.file.url
  
  // Add protocol if missing
  if (url.startsWith('//')) {
    url = `https:${url}`
  }
  
  // Add transformations if provided
  if (options) {
    const params = new URLSearchParams()
    if (options.width) params.append('w', options.width.toString())
    if (options.height) params.append('h', options.height.toString())
    if (options.quality) params.append('q', options.quality.toString())
    if (options.format) params.append('fm', options.format)
    
    if (params.toString()) {
      url += `?${params.toString()}`
    }
  }
  
  return url
}

/**
 * Transform Contentful blog category to our BlogCategory type
 */
export function transformCategory(entry: ContentfulEntry<ContentfulCategory>): BlogCategory {
  return {
    name: entry.fields.name,
    slug: entry.fields.slug,
    description: entry.fields.description,
  }
}

/**
 * Transform Contentful tag to our BlogTag type
 */
export function transformTag(entry: ContentfulEntry<ContentfulTag>): BlogTag {
  return {
    name: entry.fields.name,
    slug: entry.fields.slug,
  }
}

/**
 * Transform Contentful blog post to our BlogPost type
 */
export function transformBlogPost(entry: ContentfulEntry<ContentfulBlogPost>): BlogPost {
  const fields = entry.fields
  
  return {
    id: entry.sys.id, // Use Contentful ID directly as string
    title: fields.title,
    slug: fields.slug,
    excerpt: fields.excerpt,
    content: processRichText(fields.content),
    category: fields.category ? transformCategory(fields.category).name : 'Uncategorized',
    tags: fields.tags ? fields.tags.map(tag => transformTag(tag).name) : [],
    featuredImage: getAssetUrl(fields.featuredImage),
    publishedAt: fields.publishedAt,
    readTime: fields.readTime,
    featured: fields.featured || false,
  }
}

/**
 * Transform multiple blog posts
 */
export function transformBlogPosts(entries: ContentfulEntry<ContentfulBlogPost>[]): BlogPost[] {
  return entries.map(transformBlogPost)
}

/**
 * Transform multiple categories
 */
export function transformCategories(entries: ContentfulEntry<ContentfulCategory>[]): BlogCategory[] {
  return entries.map(transformCategory)
}

/**
 * Transform multiple tags
 */
export function transformTags(entries: ContentfulEntry<ContentfulTag>[]): BlogTag[] {
  return entries.map(transformTag)
}

/**
 * Calculate estimated reading time based on content
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

/**
 * Validate required fields for blog post
 */
export function validateBlogPost(entry: ContentfulEntry<ContentfulBlogPost>): boolean {
  const requiredFields = ['title', 'slug', 'excerpt', 'content', 'publishedAt']
  
  return requiredFields.every(field => {
    const value = entry.fields[field as keyof ContentfulBlogPost]
    return value !== undefined && value !== null && value !== ''
  })
}

/**
 * Sort blog posts by publication date (newest first)
 */
export function sortBlogPostsByDate(posts: BlogPost[]): BlogPost[] {
  return posts.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

/**
 * Filter blog posts by category
 */
export function filterBlogPostsByCategory(posts: BlogPost[], category: string): BlogPost[] {
  if (category === 'All') return posts
  return posts.filter(post => post.category === category)
}

/**
 * Filter blog posts by tag
 */
export function filterBlogPostsByTag(posts: BlogPost[], tag: string): BlogPost[] {
  return posts.filter(post => post.tags.includes(tag))
}

/**
 * Get unique categories from blog posts
 */
export function getUniqueCategoriesFromPosts(posts: BlogPost[]): string[] {
  return [...new Set(posts.map(post => post.category))]
}

/**
 * Get unique tags from blog posts
 */
export function getUniqueTagsFromPosts(posts: BlogPost[]): string[] {
  const allTags = posts.flatMap(post => post.tags)
  return [...new Set(allTags)]
}

/**
 * Get related posts by category (excluding current post)
 */
export function getRelatedPosts(posts: BlogPost[], currentPost: BlogPost, limit = 3): BlogPost[] {
  return posts
    .filter(post => 
      post.category === currentPost.category && 
      post.id !== currentPost.id
    )
    .slice(0, limit)
}

/**
 * Transform Contentful project to our Project type
 */
export function transformProject(entry: any) {
  const fields = entry.fields
  
  return {
    id: entry.sys.id,
    title: fields.title,
    slug: fields.slug,
    description: fields.description,
    fullDescription: fields.fullDescription,
    technologies: fields.technologies || [],
    images: fields.images || [],
    liveUrl: fields.liveUrl,
    repositoryUrl: fields.repositoryUrl,
    featured: fields.featured || false,
    category: fields.category,
    startDate: fields.date, // Legacy field name
    endDate: fields.endDate,
    status: fields.status || 'completed',
  }
}

/**
 * Transform multiple projects
 */
export function transformProjects(entries: any[]) {
  return entries.map(transformProject)
}

/**
 * Transform Contentful testimonial to our Testimonial type
 */
export function transformTestimonial(entry: any) {
  const fields = entry.fields
  
  return {
    id: entry.sys.id,
    title: fields.title,
    content: fields.content || fields.testimonialText, // Handle both field names
    clientName: fields.clientName,
    clientTitle: fields.clientTitle,
    clientCompany: fields.clientCompany,
    company: fields.company, // Legacy field
    name: fields.name, // Legacy field - may be overridden by clientName
    rating: fields.rating,
    featured: fields.featured || false,
    projectReference: fields.projectReference,
    attribution: fields.attribution, // Legacy person link
  }
}

/**
 * Transform multiple testimonials
 */
export function transformTestimonials(entries: any[]) {
  return entries.map(transformTestimonial)
}

/**
 * Error handler for transformation failures
 */
export function handleTransformationError(error: any, context: string): void {
  console.error(`[Contentful Transformer Error] ${context}:`, error)
  
  // In production, you might want to send this to a logging service
  if (process.env.NODE_ENV === 'production') {
    // Log to external service
  }
}