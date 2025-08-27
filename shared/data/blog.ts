import type { BlogPost } from '~/types/blog';

/**
 * Sample blog posts data
 * In a real application, this would be fetched from a headless CMS like Contentful
 * or generated from markdown files using @nuxt/content
 */
export const blogPosts: BlogPost[] = [
  {
    id: '1XvYNQKLVEJ4cY6oM5ZyXh',
    title: 'Building Scalable Vue.js Applications with Composition API',
    slug: 'building-scalable-vue-applications-composition-api',
    excerpt:
      "Learn how to leverage Vue 3's Composition API to build maintainable and scalable applications. We'll explore patterns, best practices, and real-world examples.",
    content: 'Full article content would go here...',
    category: 'Vue.js',
    tags: ['vue', 'composition-api', 'javascript', 'frontend'],
    featuredImage: null,
    publishedAt: '2024-12-15',
    readTime: 8,
    featured: true,
  },
  {
    id: '2BkwPQMLYDK5dZ7pN6AzYi',
    title: 'Modern CSS Techniques: Container Queries and Subgrid',
    slug: 'modern-css-techniques-container-queries-subgrid',
    excerpt:
      'Explore the latest CSS features that are changing how we approach responsive design and layout systems in modern web development.',
    content: 'Full article content would go here...',
    category: 'CSS',
    tags: ['css', 'responsive-design', 'container-queries', 'subgrid'],
    featuredImage: null,
    publishedAt: '2024-12-10',
    readTime: 6,
    featured: false,
  },
  {
    id: '3CmxQRNMZEL6eA8qO7BaZj',
    title: 'TypeScript Best Practices for Large Applications',
    slug: 'typescript-best-practices-large-applications',
    excerpt:
      'Discover proven strategies for using TypeScript effectively in large-scale applications, including type organization, module patterns, and performance optimization.',
    content: 'Full article content would go here...',
    category: 'TypeScript',
    tags: ['typescript', 'best-practices', 'architecture', 'performance'],
    featuredImage: null,
    publishedAt: '2024-12-05',
    readTime: 10,
    featured: false,
  },
  {
    id: '4DnyRSONA9M7fB9rP8CbAk',
    title: 'Deploying Nuxt.js Applications to Production',
    slug: 'deploying-nuxt-applications-production',
    excerpt:
      'A comprehensive guide to deploying Nuxt.js applications with different hosting providers, optimization techniques, and performance monitoring.',
    content: 'Full article content would go here...',
    category: 'DevOps',
    tags: ['nuxt', 'deployment', 'performance', 'production'],
    featuredImage: null,
    publishedAt: '2024-11-28',
    readTime: 12,
    featured: false,
  },
  {
    id: '5EozSTPOB0N8gC0sQ9DcBl',
    title: 'JavaScript Design Patterns in 2024',
    slug: 'javascript-design-patterns-2024',
    excerpt:
      'An updated look at classic and modern JavaScript design patterns, including how they apply to current frameworks and development practices.',
    content: 'Full article content would go here...',
    category: 'JavaScript',
    tags: ['javascript', 'design-patterns', 'architecture', 'best-practices'],
    featuredImage: null,
    publishedAt: '2024-11-20',
    readTime: 9,
    featured: false,
  },
  {
    id: '6FpATUQPC1O9hD1tR0EdCm',
    title: 'API Design: RESTful vs GraphQL Considerations',
    slug: 'api-design-restful-vs-graphql-considerations',
    excerpt:
      'Compare REST and GraphQL approaches for API design, exploring when to use each approach and hybrid solutions for modern applications.',
    content: 'Full article content would go here...',
    category: 'Backend',
    tags: ['api', 'rest', 'graphql', 'backend', 'architecture'],
    featuredImage: null,
    publishedAt: '2024-11-15',
    readTime: 7,
    featured: false,
  },
];

/**
 * Get all blog posts sorted by date (most recent first)
 */
export const getSortedBlogPosts = (): BlogPost[] => {
  return blogPosts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
};

/**
 * Get a blog post by its slug
 */
export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

/**
 * Get featured blog post
 */
export const getFeaturedBlogPost = (): BlogPost | undefined => {
  return blogPosts.find(post => post.featured);
};

/**
 * Get related blog posts by category (excluding the current post)
 */
export const getRelatedBlogPosts = (
  currentPost: BlogPost,
  limit: number = 3
): BlogPost[] => {
  return blogPosts
    .filter(
      post =>
        post.category === currentPost.category && post.id !== currentPost.id
    )
    .slice(0, limit);
};

/**
 * Get all unique categories
 */
export const getBlogCategories = (): string[] => {
  return [...new Set(blogPosts.map(post => post.category))];
};

/**
 * Get all unique tags
 */
export const getBlogTags = (): string[] => {
  return [...new Set(blogPosts.flatMap(post => post.tags))];
};
