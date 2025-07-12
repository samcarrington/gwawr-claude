import type { BlogPost } from '~/types/blog'

interface BlogPostsResponse {
  items: BlogPost[]
  total: number
  skip: number
  limit: number
}

interface UseBlogPostsOptions {
  category?: string
  featured?: boolean
  search?: string
  limit?: number
  skip?: number
  server?: boolean
  lazy?: boolean
}

/**
 * Composable for fetching blog posts from Contentful
 */
export const useBlogPosts = (options: UseBlogPostsOptions = {}) => {
  // Build query parameters
  const query = computed(() => {
    const params: Record<string, any> = {}
    
    if (options.category) params.category = options.category
    if (options.featured !== undefined) params.featured = options.featured
    if (options.search) params.search = options.search
    if (options.limit) params.limit = options.limit
    if (options.skip) params.skip = options.skip
    
    return params
  })
  
  // Generate cache key based on query parameters
  const key = computed(() => {
    const queryString = JSON.stringify(query.value, Object.keys(query.value).sort())
    return `blog-posts-${Buffer.from(queryString).toString('base64')}`
  })
  
  // Choose fetch method based on options
  const fetchMethod = options.lazy ? useLazyFetch : useFetch
  
  return fetchMethod<BlogPostsResponse>('/api/blog/posts', {
    key: key.value,
    query: query.value,
    default: () => ({ items: [], total: 0, skip: 0, limit: 0 }),
    server: options.server ?? true,
    transform: (data: BlogPostsResponse) => {
      // Additional client-side transformation if needed
      return {
        ...data,
        items: data.items.map(post => ({
          ...post,
          // Ensure dates are properly formatted
          publishedAt: post.publishedAt,
        }))
      }
    },
    onResponseError({ response }) {
      console.error('Failed to fetch blog posts:', response._data)
    }
  })
}

/**
 * Composable for fetching a single blog post by slug
 */
export const useBlogPost = (slug: string | Ref<string>) => {
  const slugRef = isRef(slug) ? slug : ref(slug)
  
  return useFetch<BlogPost>(`/api/blog/posts/${slugRef.value}`, {
    key: `blog-post-${slugRef.value}`,
    server: true, // Always SSR for individual posts (SEO)
    transform: (data: BlogPost) => {
      // Ensure the data is properly typed and formatted
      return {
        ...data,
        publishedAt: data.publishedAt,
      }
    },
    onResponseError({ response }) {
      if (response.status === 404) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Blog post not found'
        })
      }
      console.error(`Failed to fetch blog post "${slugRef.value}":`, response._data)
    }
  })
}

/**
 * Composable for fetching featured blog post
 */
export const useFeaturedBlogPost = () => {
  return useFetch<BlogPost | null>('/api/blog/featured', {
    key: 'featured-blog-post',
    default: () => null,
    server: true,
    onResponseError({ response }) {
      console.error('Failed to fetch featured blog post:', response._data)
    }
  })
}

/**
 * Composable for fetching blog categories
 */
export const useBlogCategories = () => {
  return useFetch<string[]>('/api/blog/categories', {
    key: 'blog-categories',
    default: () => [],
    server: true,
    onResponseError({ response }) {
      console.error('Failed to fetch blog categories:', response._data)
    }
  })
}

/**
 * Composable for fetching related blog posts
 */
export const useRelatedBlogPosts = (postId: string | Ref<string>, limit = 3) => {
  const postIdRef = isRef(postId) ? postId : ref(postId)
  
  return useLazyFetch<BlogPost[]>(`/api/blog/related/${postIdRef.value}`, {
    key: `related-blog-posts-${postIdRef.value}`,
    query: { limit },
    default: () => [],
    server: false, // Client-side only for related posts
    onResponseError({ response }) {
      console.error(`Failed to fetch related posts for "${postIdRef.value}":`, response._data)
    }
  })
}

/**
 * Reactive composable for blog post filtering
 */
export const useBlogPostFilter = () => {
  const selectedCategory = ref<string>('All')
  const searchQuery = ref<string>('')
  const showFeaturedOnly = ref<boolean>(false)
  
  // Reactive blog posts based on filters
  const { data: posts, pending, error, refresh } = useBlogPosts({
    category: computed(() => selectedCategory.value === 'All' ? undefined : selectedCategory.value),
    search: computed(() => searchQuery.value || undefined),
    featured: computed(() => showFeaturedOnly.value || undefined),
    lazy: true,
  })
  
  // Reset filters
  const resetFilters = () => {
    selectedCategory.value = 'All'
    searchQuery.value = ''
    showFeaturedOnly.value = false
  }
  
  return {
    // Filter state
    selectedCategory,
    searchQuery,
    showFeaturedOnly,
    
    // Data
    posts: computed(() => posts.value?.items || []),
    total: computed(() => posts.value?.total || 0),
    pending,
    error,
    
    // Actions
    resetFilters,
    refresh,
  }
}