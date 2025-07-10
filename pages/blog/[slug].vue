<template>
  <div>
    <!-- Article Header -->
    <section class="py-12 bg-gradient-to-r from-gray-50 to-gray-100">
      <UContainer>
        <div class="max-w-4xl mx-auto text-center">
          <!-- Category Badge -->
          <div class="mb-6">
            <span
              class="px-4 py-2 bg-primary text-white text-sm rounded-full font-medium"
            >
              {{ post.category }}
            </span>
          </div>

          <!-- Title -->
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {{ post.title }}
          </h1>

          <!-- Meta Information -->
          <div
            class="flex items-center justify-center text-gray-600 mb-8 flex-wrap gap-4"
          >
            <div class="flex items-center">
              <UIcon name="i-heroicons-calendar" class="w-5 h-5 mr-2" />
              <time :datetime="post.publishedAt">
                {{ formatDate(post.publishedAt) }}
              </time>
            </div>
            <div class="flex items-center">
              <UIcon name="i-heroicons-clock" class="w-5 h-5 mr-2" />
              <span>{{ post.readTime }} min read</span>
            </div>
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2 justify-center">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="px-3 py-1 bg-white text-gray-700 text-sm rounded-full border hover:bg-gray-50 transition-colors"
            >
              #{{ tag }}
            </span>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Featured Image -->
    <section v-if="post.featuredImage" class="py-8">
      <UContainer>
        <div class="max-w-4xl mx-auto">
          <div class="aspect-[16/9] rounded-xl overflow-hidden shadow-lg">
            <img
              :src="post.featuredImage"
              :alt="post.title"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Article Content -->
    <article class="py-12">
      <UContainer>
        <div class="max-w-4xl mx-auto">
          <!-- Article Body -->
          <div class="prose prose-lg prose-gray max-w-none">
            <!-- This would normally be rendered from markdown or rich text -->
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
              <div class="flex">
                <UIcon
                  name="i-heroicons-exclamation-triangle"
                  class="w-6 h-6 text-yellow-400 mr-3 mt-1"
                />
                <div>
                  <h3 class="text-lg font-medium text-yellow-800 mb-2">
                    Coming Soon
                  </h3>
                  <p class="text-yellow-700">
                    This is a placeholder for the blog post content. In a real
                    implementation, this would be rendered from a headless CMS
                    like Contentful or from markdown files.
                  </p>
                </div>
              </div>
            </div>

            <!-- Sample content structure -->
            <div class="space-y-6">
              <p class="text-xl text-gray-600 leading-relaxed">
                {{ post.excerpt }}
              </p>

              <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Introduction
              </h2>
              <p class="text-gray-700 leading-relaxed">
                This article would contain the full content of the blog post.
                The content would typically be fetched from a headless CMS or
                parsed from markdown files using a tool like @nuxt/content.
              </p>

              <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Key Concepts
              </h2>
              <p class="text-gray-700 leading-relaxed">
                The actual implementation would include rich text content with
                proper formatting, code blocks, images, and other multimedia
                elements.
              </p>

              <div class="bg-gray-50 rounded-lg p-6 my-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-3">
                  Code Example
                </h3>
                <pre
                  class="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto"
                ><code>// This would be a real code example
const example = () => {
  console.log('Hello, World!');
};</code></pre>
              </div>

              <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Conclusion
              </h2>
              <p class="text-gray-700 leading-relaxed">
                This placeholder demonstrates the structure and layout that
                would be used for actual blog post content in the final
                implementation.
              </p>
            </div>
          </div>

          <!-- Article Footer -->
          <footer class="mt-12 pt-8 border-t border-gray-200">
            <div class="flex items-center justify-between flex-wrap gap-4">
              <div class="flex items-center">
                <span class="text-sm text-gray-500">Share this article:</span>
                <div class="flex items-center ml-4 space-x-3">
                  <button
                    class="text-gray-400 hover:text-primary transition-colors"
                    @click="shareOnTwitter"
                    aria-label="Share on Twitter"
                  >
                    <UIcon name="i-heroicons-share" class="w-5 h-5" />
                  </button>
                  <button
                    class="text-gray-400 hover:text-primary transition-colors"
                    @click="copyLink"
                    aria-label="Copy link"
                  >
                    <UIcon name="i-heroicons-link" class="w-5 h-5" />
                  </button>
                </div>
              </div>
              <NuxtLink
                to="/blog"
                class="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
              >
                <UIcon name="i-heroicons-arrow-left" class="w-4 h-4 mr-2" />
                Back to Blog
              </NuxtLink>
            </div>
          </footer>
        </div>
      </UContainer>
    </article>

    <!-- Related Posts -->
    <section class="py-16 bg-gray-50">
      <UContainer>
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">
            Related Articles
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BlogCard
              v-for="relatedPost in relatedPosts"
              :key="relatedPost.id"
              :post="relatedPost"
            />
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Call-to-Action -->
    <CallToAction
      variant="dark"
      title="Enjoyed This Article?"
      description="If you found this helpful, check out my other projects or get in touch to discuss your next development challenge."
    >
      <template #primary-button="{ variant, classes }">
        <UButton
          size="lg"
          :variant="variant"
          :class="classes"
          @click="navigateTo('/projects')"
          aria-label="View my portfolio projects"
        >
          View My Projects
        </UButton>
      </template>
      <template #secondary-button="{ variant, classes }">
        <UButton
          size="lg"
          :variant="variant"
          :class="classes"
          @click="openEmailClient"
          aria-label="Send me an email to start a conversation"
        >
          Start a Conversation
        </UButton>
      </template>
    </CallToAction>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '~/utils/date';
import type { BlogPost } from '~/types/blog';
import { getBlogPostBySlug, getRelatedBlogPosts } from '~/data/blog';

const route = useRoute();
const router = useRouter();

// Find the post by slug
const post = computed(() => {
  const foundPost = getBlogPostBySlug(route.params.slug as string);
  if (!foundPost) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Blog post not found',
    });
  }
  return foundPost;
});

// Get related posts (same category, excluding current post)
const relatedPosts = computed(() => {
  return getRelatedBlogPosts(post.value, 3);
});

// Page metadata
useHead(() => ({
  title: `${post.value.title} - Sam Carrington`,
  meta: [
    {
      name: 'description',
      content: post.value.excerpt,
    },
    {
      property: 'og:title',
      content: post.value.title,
    },
    {
      property: 'og:description',
      content: post.value.excerpt,
    },
    {
      property: 'og:type',
      content: 'article',
    },
    {
      property: 'article:published_time',
      content: post.value.publishedAt,
    },
    {
      property: 'article:author',
      content: 'Sam Carrington',
    },
    {
      property: 'article:section',
      content: post.value.category,
    },
    ...post.value.tags.map(tag => ({
      property: 'article:tag',
      content: tag,
    })),
  ],
}));

// Social sharing functions
const shareOnTwitter = () => {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(
    `Check out this article: ${post.value.title}`
  );
  window.open(
    `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    '_blank'
  );
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
    console.log('Link copied to clipboard');
  } catch (err) {
    console.error('Failed to copy link:', err);
  }
};

// Navigation functions
const openEmailClient = () => {
  const subject = encodeURIComponent(`Re: ${post.value.title}`);
  const body = encodeURIComponent(
    `Hi Sam,\n\nI just read your article "${post.value.title}" and wanted to discuss it further.\n\nBest regards,`
  );
  window.location.href = `mailto:sam@gwawr.com?subject=${subject}&body=${body}`;
};
</script>
