<template>
  <div class="py-12">
    <UContainer>
      <!-- Page Header -->
      <div class="text-center mb-16">
        <AtomsTypographyPage size="large" spacing="default">
          Developer's Journal
        </AtomsTypographyPage>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Thoughts, tutorials, and insights on web development, technology
          trends, and the ever-evolving world of software engineering.
        </p>
      </div>

      <!-- Category Filter -->
      <div class="mb-12">
        <div class="flex flex-wrap gap-3 justify-center">
          <AtomsButtonsBase
            v-for="category in categories"
            :key="category"
            :variant="selectedCategory === category ? 'solid' : 'outline'"
            size="md"
            color="primary"
            @click="selectedCategory = category"
          >
            {{ category }}
          </AtomsButtonsBase>
        </div>
      </div>

      <!-- Featured Post -->
      <section v-if="featuredPost" class="mb-16">
        <AtomsTypographySection size="default" align="left" spacing="default">Featured Article</AtomsTypographySection>
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
              <AtomsTypographyCard tag="h3" size="large" spacing="tight">
                {{ featuredPost.title }}
              </AtomsTypographyCard>
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
        <AtomsTypographySection size="default" align="left" spacing="loose">Recent Articles</AtomsTypographySection>
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          role="list"
          aria-label="Blog posts"
        >
          <OrganismsCardsBlog
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
          <AtomsTypographyCard tag="h3" size="default" align="center" spacing="tight">No articles found</AtomsTypographyCard>
          <p class="text-lg">
            Try selecting a different category or check back later for new
            content.
          </p>
        </div>
      </section>

      <!-- Call-to-Action -->
      <OrganismsSectionsCallToAction
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
      </OrganismsSectionsCallToAction>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '~/utils/date';
import type { BlogPost } from '~/types/blog';
import {
  getSortedBlogPosts,
  getFeaturedBlogPost,
  getBlogCategories,
} from '~/data/blog';

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

// Get blog data
const allBlogPosts = getSortedBlogPosts();
const featuredPost = getFeaturedBlogPost();

// Non-featured posts
const regularPosts = computed(() =>
  allBlogPosts.filter(post => !post.featured)
);

// Filter functionality
const selectedCategory = ref('All');

const categories = computed(() => ['All', ...getBlogCategories()]);

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
