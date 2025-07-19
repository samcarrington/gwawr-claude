---
id: task-60
title: Implement dynamic route pre-rendering with Nitro
status: To Do
assignee:
  - '@Claude'
created_date: '2025-07-19'
labels: ['performance', 'seo', 'nitro', 'ssg']
dependencies: []
priority: medium
---

## Description

Implement proper pre-rendering of dynamic routes using Nitro's hybrid rendering capabilities to improve performance, SEO, and user experience. Currently, dynamic routes like `/blog/[slug]` and `/projects/[slug]` are rendered on-demand, which can impact initial page load times and SEO performance.

The goal is to pre-render these routes at build time while maintaining the ability to fall back to SSR for new content or routes that weren't pre-rendered.

## Problem Statement

- Dynamic routes (`/blog/[slug]`, `/projects/[slug]`) are currently rendered on-demand
- This impacts initial page load performance and SEO scores
- Search engines may have difficulty indexing dynamic content
- Users experience slower initial page loads for blog posts and project pages
- No build-time optimization for static content that rarely changes

## Solution Approach

Implement Nitro's hybrid rendering with route-specific pre-rendering rules:
1. Pre-render all existing blog posts and projects at build time
2. Configure fallback to SSR for new or missing routes
3. Set up incremental static regeneration (ISR) for content updates
4. Optimize build process to fetch and pre-render dynamic routes

## Acceptance Criteria

- [ ] Configure Nitro pre-rendering for dynamic blog routes (`/blog/[slug]`)
- [ ] Configure Nitro pre-rendering for dynamic project routes (`/projects/[slug]`)
- [ ] Implement build-time route discovery using Contentful API
- [ ] Set up proper fallback handling for non-pre-rendered routes
- [ ] Configure incremental static regeneration (ISR) for content updates
- [ ] Add build-time validation to ensure all routes are discoverable
- [ ] Update deployment pipeline to support pre-rendering
- [ ] Verify SEO improvements with pre-rendered routes
- [ ] Test fallback behavior for new content
- [ ] Document pre-rendering configuration and deployment process

## Technical Requirements

### Nitro Configuration
- Configure `nitro.prerender.routes` to include dynamic routes
- Set up route discovery function to fetch all blog/project slugs from Contentful
- Configure hybrid rendering with appropriate fallback strategies

### Route Discovery
- Create build-time script to fetch all blog post slugs from Contentful
- Create build-time script to fetch all project slugs from Contentful
- Handle pagination for large content sets
- Implement error handling for API failures during build

### Fallback Strategy
- Configure SSR fallback for routes not pre-rendered
- Implement proper 404 handling for non-existent content
- Set up ISR for automatic regeneration of updated content

### Performance Optimization
- Optimize build time by parallelizing route generation
- Implement selective pre-rendering based on content priority
- Configure appropriate cache headers for pre-rendered routes

## Implementation Plan

1. **Phase 1: Basic Pre-rendering Setup**
   - Configure Nitro prerender settings in `nuxt.config.ts`
   - Create route discovery utilities
   - Test pre-rendering with a subset of routes

2. **Phase 2: Content Integration**
   - Integrate with Contentful API for route discovery
   - Handle all blog posts and projects
   - Implement error handling and validation

3. **Phase 3: Advanced Features**
   - Set up ISR for content updates
   - Optimize build performance
   - Add monitoring and analytics

4. **Phase 4: Deployment & Testing**
   - Update deployment pipeline
   - Test in staging environment
   - Validate SEO improvements
   - Document the process

## Reference Links

- [Nuxt 3 Hybrid Rendering - Pre-render Dynamic Routes (SSG)](https://www.docs4.dev/posts/nuxt-3-hybrid-rendering-pre-render-dynamic-routes-ssg)
- [Nuxt Rendering Concepts](https://nuxt.com/docs/4.x/guide/concepts/rendering)
- [Nitro Pre-rendering Documentation](https://nitro.unjs.io/guide/routing#pre-rendering)
- [Nuxt Hybrid Rendering](https://nuxt.com/docs/guide/concepts/rendering#hybrid-rendering)
- [Nitro Route Rules](https://nitro.unjs.io/guide/routing#route-rules)
- [Nuxt ISR (Incremental Static Regeneration)](https://nuxt.com/docs/guide/concepts/rendering#incremental-static-regeneration)

## Expected Benefits

- **Performance**: Faster initial page loads for blog posts and project pages
- **SEO**: Better search engine indexing and ranking
- **User Experience**: Improved perceived performance and reduced loading times
- **Scalability**: Reduced server load for frequently accessed content
- **Cost Efficiency**: Lower hosting costs due to reduced server-side rendering

## Risks & Considerations

- **Build Time**: Pre-rendering many routes may increase build time significantly
- **Content Freshness**: Pre-rendered content may become stale between deployments
- **API Dependencies**: Build process becomes dependent on Contentful API availability
- **Complexity**: Increased configuration and deployment complexity

## Success Metrics

- Measure page load performance improvements (Core Web Vitals)
- Track SEO performance changes (search rankings, indexing)
- Monitor build time impact
- Validate fallback behavior for edge cases
- Measure reduction in server-side rendering requests

## Notes

- Consider implementing selective pre-rendering based on content popularity or recency
- Ensure proper error handling during build process to prevent deployment failures
- Plan for content preview functionality that may bypass pre-rendered routes
- Consider implementing build-time content validation to catch issues early
