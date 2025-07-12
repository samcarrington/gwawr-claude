# Contentful Data Fetching and Hydration Strategy

## Overview

This document defines a comprehensive strategy for fetching, transforming, and hydrating data from Contentful into Vue components. It ensures consistent data handling, optimal performance, and maintainable code across the application.

## Current State Analysis

### What We Have ✅
- **ContentfulClient**: Robust client with error handling, preview mode, caching
- **ContentfulCache**: In-memory caching with TTL and cleanup
- **Transformers**: Data transformation utilities for blog posts
- **Type Definitions**: TypeScript interfaces for Contentful data

### What's Missing ❌
- **Consistent Data Fetching Patterns**: Mixed approach between mock data and Contentful
- **SSR/Hydration Strategy**: No clear pattern for server-side rendering
- **Component-Level Data Management**: Components don't know about Contentful integration
- **Error Handling**: No unified error handling for data fetching failures
- **Loading States**: No consistent loading state management

## Data Fetching Strategy

### 1. Layered Architecture

```
┌─────────────────────────────────────────────┐
│                 Components                   │ ← Pure presentation layer
├─────────────────────────────────────────────┤
│              Composables                     │ ← Data fetching logic
├─────────────────────────────────────────────┤
│               Services                       │ ← Business logic & transformation
├─────────────────────────────────────────────┤
│           Contentful Client                  │ ← Raw data fetching
└─────────────────────────────────────────────┘
```

### 2. Data Fetching Patterns

#### Pattern 1: Server-Side Rendering (SSR)
**When to use**: Initial page loads, SEO-critical content
**Implementation**: `useFetch` with server-side execution

```typescript
// Example: Blog list page
const { data: posts, pending, error } = await useFetch('/api/blog/posts', {
  key: 'blog-posts',
  transform: transformBlogPosts,
  server: true // SSR
})
```

#### Pattern 2: Client-Side Hydration
**When to use**: Interactive features, user-specific content
**Implementation**: `useLazyFetch` for progressive loading

```typescript
// Example: Related posts
const { data: relatedPosts, pending } = await useLazyFetch(`/api/blog/related/${post.id}`, {
  key: `related-posts-${post.id}`,
  server: false // Client-side only
})
```

#### Pattern 3: Real-time Updates
**When to use**: Content that changes frequently
**Implementation**: `refreshCookie` or reactive fetching

```typescript
// Example: Featured content
const { data: featured, refresh } = await useFetch('/api/content/featured', {
  key: 'featured-content',
  transform: transformFeaturedContent
})
```

## Implementation Architecture

### 1. Composables Layer

Create dedicated composables for each content type:

```typescript
// composables/useBlogPosts.ts
export const useBlogPosts = (options = {}) => {
  return useFetch('/api/blog/posts', {
    key: 'blog-posts',
    transform: transformBlogPosts,
    ...options
  })
}

// composables/useBlogPost.ts
export const useBlogPost = (slug: string) => {
  return useFetch(`/api/blog/posts/${slug}`, {
    key: `blog-post-${slug}`,
    transform: transformBlogPost
  })
}

// composables/useProjects.ts
export const useProjects = (options = {}) => {
  return useFetch('/api/projects', {
    key: 'projects',
    transform: transformProjects,
    ...options
  })
}
```

### 2. API Routes Layer

Create Nuxt API routes that handle Contentful integration:

```typescript
// server/api/blog/posts.get.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const contentfulService = getContentfulService()
  
  try {
    const posts = await contentfulService.getBlogPosts(query)
    return posts
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch blog posts'
    })
  }
})
```

### 3. Service Layer

Business logic and data transformation:

```typescript
// services/contentfulService.ts
export class ContentfulService {
  private client: ContentfulClient
  
  constructor() {
    this.client = getContentfulClient()
  }
  
  async getBlogPosts(options = {}) {
    const { data } = await this.client.getEntriesByType('blogPost', options)
    return transformBlogPosts(data.items)
  }
  
  async getBlogPost(slug: string) {
    const entry = await this.client.getEntryBySlug('blogPost', slug)
    return entry ? transformBlogPost(entry) : null
  }
}
```

## Data Flow Patterns

### 1. Initial Page Load (SSR)

```
1. Server renders page
2. Nuxt calls composable during SSR
3. Composable calls API route
4. API route calls ContentfulService
5. Service fetches from Contentful
6. Data transforms through layers
7. Component receives hydrated data
8. Client-side hydration preserves state
```

### 2. Client-Side Navigation

```
1. User navigates to new page
2. Composable checks cache first
3. If cache miss, fetches from API
4. Loading state shown to user
5. Data transforms and updates
6. Component re-renders with new data
```

### 3. Interactive Updates

```
1. User triggers action (filter, search)
2. Composable called with new parameters
3. Cache key changes, triggers refetch
4. Loading state shown
5. New data fetched and transformed
6. Component updates reactively
```

## Error Handling Strategy

### 1. Layered Error Handling

```typescript
// At the service level
export class ContentfulService {
  async getBlogPosts(options = {}) {
    try {
      const { data } = await this.client.getEntriesByType('blogPost', options)
      return transformBlogPosts(data.items)
    } catch (error) {
      if (error.status === 404) {
        return []
      }
      throw new ContentfulServiceError('Failed to fetch blog posts', error)
    }
  }
}

// At the composable level
export const useBlogPosts = (options = {}) => {
  const { data, error, pending } = useFetch('/api/blog/posts', {
    key: 'blog-posts',
    default: () => [],
    onResponseError({ response }) {
      console.error('API Error:', response._data)
    }
  })
  
  return { data, error, pending }
}

// At the component level
const { data: posts, error, pending } = useBlogPosts()

// Handle errors in template
if (error.value) {
  // Show error state
}
```

### 2. Graceful Degradation

```typescript
// Fallback to mock data when Contentful fails
export const useBlogPosts = (options = {}) => {
  const { data, error } = useFetch('/api/blog/posts', {
    key: 'blog-posts',
    default: () => []
  })
  
  // Fallback to mock data if Contentful fails
  const posts = computed(() => {
    if (error.value && process.client) {
      console.warn('Contentful unavailable, using mock data')
      return getMockBlogPosts()
    }
    return data.value
  })
  
  return { posts, error, pending }
}
```

## Performance Optimization

### 1. Caching Strategy

```typescript
// Multi-level caching
const CACHE_CONFIG = {
  blogPosts: { ttl: 5 * 60 * 1000 }, // 5 minutes
  projects: { ttl: 10 * 60 * 1000 }, // 10 minutes
  testimonials: { ttl: 15 * 60 * 1000 }, // 15 minutes
}

// API route with caching headers
export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'public, max-age=300') // 5 minutes
  
  const posts = await contentfulService.getBlogPosts()
  return posts
})
```

### 2. Selective Fetching

```typescript
// Only fetch required fields
export const useBlogPostPreview = () => {
  return useFetch('/api/blog/posts', {
    query: {
      select: 'sys.id,fields.title,fields.slug,fields.excerpt,fields.featuredImage'
    }
  })
}

// Full data for detail pages
export const useBlogPostDetail = (slug: string) => {
  return useFetch(`/api/blog/posts/${slug}`, {
    query: {
      include: 2 // Include linked entries
    }
  })
}
```

### 3. Progressive Loading

```typescript
// Load critical content first
const { data: featuredPosts } = await useFetch('/api/blog/featured')

// Load additional content progressively
const { data: allPosts } = await useLazyFetch('/api/blog/posts', {
  server: false
})
```

## Component Integration Patterns

### 1. Data-Agnostic Components

Components should not know about Contentful directly:

```vue
<!-- OrganismsCardsBlog.vue -->
<template>
  <MoleculesCardsBase>
    <h2>{{ post.title }}</h2>
    <p>{{ post.excerpt }}</p>
    <AtomsBadges :tags="post.tags" />
  </MoleculesCardsBase>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/types/blog'

defineProps<{
  post: BlogPost // Uses transformed type, not Contentful type
}>()
</script>
```

### 2. Smart Page Components

Pages handle data fetching and pass props to components:

```vue
<!-- pages/blog/index.vue -->
<template>
  <div>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error loading posts</div>
    <div v-else>
      <OrganismsCardsBlog
        v-for="post in posts"
        :key="post.id"
        :post="post"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Fetch data using composable
const { data: posts, pending, error } = await useBlogPosts()

// Handle SEO and meta
useHead({
  title: 'Blog Posts',
  meta: [
    { name: 'description', content: 'Latest blog posts' }
  ]
})
</script>
```

### 3. Loading and Error States

Consistent loading and error handling:

```vue
<template>
  <div>
    <!-- Loading skeleton -->
    <template v-if="pending">
      <div v-for="i in 6" :key="i" class="skeleton-card">
        <USkeleton class="h-48 w-full" />
        <USkeleton class="h-4 w-3/4 mt-4" />
        <USkeleton class="h-4 w-1/2 mt-2" />
      </div>
    </template>
    
    <!-- Error state -->
    <UAlert
      v-else-if="error"
      color="red"
      variant="soft"
      title="Failed to load content"
      description="Please try refreshing the page"
    />
    
    <!-- Success state -->
    <template v-else>
      <OrganismsCardsBlog
        v-for="post in posts"
        :key="post.id"
        :post="post"
      />
    </template>
  </div>
</template>
```

## Migration Strategy

### Phase 1: Setup Infrastructure
1. Create API routes for all content types
2. Create composables for data fetching
3. Create service layer for business logic
4. Test with existing mock data

### Phase 2: Migrate Blog Content
1. Update blog pages to use new composables
2. Test SSR and hydration
3. Add error handling and loading states
4. Performance testing

### Phase 3: Migrate Projects & Testimonials
1. Apply same patterns to projects and testimonials
2. Update components to use real Contentful data
3. Add filtering and search capabilities

### Phase 4: Optimization
1. Fine-tune caching strategies
2. Add performance monitoring
3. Implement progressive loading
4. Add real-time updates if needed

## Testing Strategy

### 1. Unit Tests
- Test composables with mock data
- Test transformers with sample Contentful responses
- Test error handling scenarios

### 2. Integration Tests
- Test API routes with Contentful
- Test SSR/hydration cycle
- Test caching behavior

### 3. E2E Tests
- Test complete user journeys
- Test loading and error states
- Test performance metrics

## Monitoring and Observability

### 1. Performance Metrics
- API response times
- Cache hit rates
- Hydration performance
- Bundle size impact

### 2. Error Tracking
- Contentful API failures
- Transformation errors
- Hydration mismatches
- Client-side errors

### 3. Business Metrics
- Content load success rates
- User engagement with content
- SEO performance

## Best Practices

### 1. Do's ✅
- Use typed composables for data fetching
- Implement graceful degradation
- Cache API responses appropriately
- Handle loading and error states consistently
- Keep components data-agnostic
- Use SSR for SEO-critical content

### 2. Don'ts ❌
- Don't put Contentful client calls directly in components
- Don't ignore error states
- Don't cache data too aggressively
- Don't mix mock and real data in production
- Don't forget to handle hydration mismatches
- Don't skip loading states

## Implementation Checklist

### Infrastructure Setup
- [ ] Create API routes structure
- [ ] Create composables directory
- [ ] Create service layer
- [ ] Setup error handling utilities
- [ ] Create loading state components

### Content Type Migration
- [ ] Blog posts data fetching
- [ ] Projects data fetching
- [ ] Testimonials data fetching
- [ ] Featured content handling
- [ ] Search and filtering

### Performance & Monitoring
- [ ] Implement caching strategy
- [ ] Add performance monitoring
- [ ] Setup error tracking
- [ ] Test SSR/hydration performance
- [ ] Optimize bundle size

### Testing & Documentation
- [ ] Unit tests for composables
- [ ] Integration tests for API routes
- [ ] E2E tests for user journeys
- [ ] Update component documentation
- [ ] Create usage examples

This strategy provides a robust foundation for Contentful integration while maintaining performance, type safety, and developer experience.