<template>
  <div class="py-12">
    <UContainer>
      <!-- Page Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Developer's Journal
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Thoughts, tutorials, and insights on web development, technology
          trends, and the ever-evolving world of software engineering.
        </p>
      </div>

      <!-- Category Filter -->
      <div class="mb-12">
        <div class="flex flex-wrap gap-3 justify-center">
          <UButton
            v-for="category in categories"
            :key="category"
            :variant="selectedCategory === category ? 'solid' : 'outline'"
            size="md"
            class="px-6 py-2.5 font-medium"
            @click="selectedCategory = category"
          >
            {{ category }}
          </UButton>
        </div>
      </div>

      <!-- Featured Post -->
      <section v-if="featuredPost" class="mb-16">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Featured Article</h2>
        <article
          class="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 md:p-12"
        >
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div class="mb-4">
                <span
                  class="px-4 py-2 bg-primary text-white text-sm rounded-full font-medium"
                >
                  {{ featuredPost.category }} • Featured
                </span>
              </div>
              <h3 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {{ featuredPost.title }}
              </h3>
              <p class="text-lg text-gray-600 mb-6">
                {{ featuredPost.excerpt }}
              </p>
              <div class="flex items-center text-sm text-gray-500 mb-6">
                <time :datetime="featuredPost.publishedAt">
                  {{ formatDate(featuredPost.publishedAt) }}
                </time>
                <span class="mx-2">•</span>
                <span>{{ featuredPost.readTime }} min read</span>
              </div>
              <NuxtLink
                :to="`/blog/${featuredPost.slug}`"
                class="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Read Article
                <UIcon name="i-heroicons-arrow-right" class="ml-2 w-4 h-4" />
              </NuxtLink>
            </div>
            <div class="relative">
              <div
                class="aspect-[4/3] bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <img
                  v-if="featuredPost.featuredImage"
                  :src="featuredPost.featuredImage"
                  :alt="featuredPost.title"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200"
                >
                  <UIcon name="i-heroicons-document-text" class="w-20 h-20" />
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>

      <!-- Blog Posts Grid -->
      <section>
        <h2 class="text-2xl font-bold text-gray-900 mb-8">Recent Articles</h2>
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          role="list"
          aria-label="Blog posts"
        >
          <BlogCard
            v-for="post in filteredPosts"
            :key="post.id"
            :post="post"
            role="listitem"
          />
        </div>

        <!-- Empty State -->
        <div
          v-if="filteredPosts.length === 0"
          class="text-center py-16 text-gray-500"
        >
          <UIcon
            name="i-heroicons-document-magnifying-glass"
            class="w-16 h-16 mx-auto mb-4"
          />
          <h3 class="text-xl font-semibold mb-2">No articles found</h3>
          <p class="text-lg">
            Try selecting a different category or check back later for new
            content.
          </p>
        </div>
      </section>

      <!-- Call-to-Action -->
      <CallToAction
        variant="light"
        title="Stay Updated"
        description="Subscribe to get notified when I publish new articles about web development, technology insights, and coding tutorials."
      >
        <template #primary-button="{ variant, classes }">
          <UButton
            size="lg"
            :variant="variant"
            :class="classes"
            @click="navigateTo('/projects')"
            aria-label="View my portfolio projects"
          >
            <UIcon name="i-heroicons-code-bracket" class="mr-2" />
            View My Projects
          </UButton>
        </template>
        <template #secondary-button="{ variant, classes }">
          <UButton
            size="lg"
            :variant="variant"
            :class="classes"
            @click="openEmailClient"
            aria-label="Send me an email to get in touch"
          >
            <UIcon name="i-heroicons-envelope" class="mr-2" />
            Get In Touch
          </UButton>
        </template>
      </CallToAction>
    </UContainer>
  </div>
</template>

<script setup>
import { formatDate } from '~/utils/date';

// Page metadata
useHead({
  title: 'Blog - Sam Carrington',
  meta: [
    {
      name: 'description',
      content:
        'Read the latest articles by Sam Carrington on web development, technology trends, and software engineering insights.',
    },
  ],
});

// Sample blog posts data
const blogPosts = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
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

// Sort posts by date (most recent first)
const sortedPosts = computed(() =>
  blogPosts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
);

// Featured post
const featuredPost = computed(() =>
  sortedPosts.value.find(post => post.featured)
);

// Non-featured posts
const regularPosts = computed(() =>
  sortedPosts.value.filter(post => !post.featured)
);

// Filter functionality
const selectedCategory = ref('All');

const categories = computed(() => [
  'All',
  ...new Set(blogPosts.map(post => post.category)),
]);

const filteredPosts = computed(() => {
  if (selectedCategory.value === 'All') {
    return regularPosts.value;
  }
  return regularPosts.value.filter(
    post => post.category === selectedCategory.value
  );
});

// Navigation functions
const openEmailClient = () => {
  const subject = encodeURIComponent('Blog Subscription');
  const body = encodeURIComponent(
    "Hi Sam,\n\nI'd like to stay updated with your latest blog posts and articles.\n\nBest regards,"
  );
  window.location.href = `mailto:sam@gwawr.com?subject=${subject}&body=${body}`;
};
</script>
