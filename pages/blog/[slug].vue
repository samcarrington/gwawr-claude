<template>
  <div>
    <!-- Loading State -->
    <div v-if="postPending" class="min-h-screen">
      <!-- Header Loading -->
      <section class="py-12 bg-gradient-to-r from-gray-50 to-gray-100">
        <UContainer>
          <div class="max-w-4xl mx-auto text-center">
            <USkeleton class="h-8 w-32 mx-auto mb-6" />
            <USkeleton class="h-12 w-3/4 mx-auto mb-8" />
            <div class="flex items-center justify-center gap-4 mb-8">
              <USkeleton class="h-6 w-32" />
              <USkeleton class="h-6 w-32" />
            </div>
            <div class="flex flex-wrap gap-2 justify-center">
              <USkeleton class="h-8 w-16" v-for="i in 3" :key="i" />
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Content Loading -->
      <article class="py-12">
        <UContainer>
          <div class="max-w-4xl mx-auto space-y-6">
            <USkeleton class="h-6 w-full" v-for="i in 10" :key="i" />
          </div>
        </UContainer>
      </article>
    </div>

    <!-- Error State -->
    <div
      v-else-if="postError"
      class="min-h-screen flex items-center justify-center"
    >
      <UContainer>
        <div class="text-center">
          <UAlert
            color="red"
            variant="soft"
            title="Failed to load article"
            :description="
              postError.message || 'The article could not be found or loaded.'
            "
            class="mb-8"
          />
          <NuxtLink
            to="/blog"
            class="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <UIcon name="i-heroicons-arrow-left" class="w-4 h-4 mr-2" />
            Back to Blog
          </NuxtLink>
        </div>
      </UContainer>
    </div>

    <!-- Article Content -->
    <div v-else-if="post">
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
            <AtomsTypographyPage size="large" spacing="default">
              {{ post.title }}
            </AtomsTypographyPage>

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
                <span>{{ readTime.text }}</span>
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

                <AtomsTypographySection
                  size="default"
                  align="left"
                  spacing="tight"
                >
                  Introduction
                </AtomsTypographySection>
                <p class="text-gray-700 leading-relaxed">
                  This article would contain the full content of the blog post.
                  The content would typically be fetched from a headless CMS or
                  parsed from markdown files using a tool like @nuxt/content.
                </p>

                <AtomsTypographySection
                  size="default"
                  align="left"
                  spacing="tight"
                >
                  Key Concepts
                </AtomsTypographySection>
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

                <AtomsTypographySection
                  size="default"
                  align="left"
                  spacing="tight"
                >
                  Conclusion
                </AtomsTypographySection>
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
            <AtomsTypographySection size="large" align="center" spacing="loose">
              Related Articles
            </AtomsTypographySection>

            <!-- Related Posts Loading -->
            <div
              v-if="relatedPending"
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <div v-for="i in 3" :key="i" class="space-y-4">
                <USkeleton class="h-48 w-full rounded-lg" />
                <USkeleton class="h-4 w-3/4" />
                <USkeleton class="h-4 w-1/2" />
              </div>
            </div>

            <!-- Related Posts Content -->
            <div
              v-else-if="relatedPosts && relatedPosts.length > 0"
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <OrganismsCardsBlog
                v-for="relatedPost in relatedPosts"
                :key="relatedPost.id"
                :post="relatedPost"
              />
            </div>

            <!-- No Related Posts -->
            <div v-else class="text-center py-8 text-gray-500">
              <p>No related articles found.</p>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Call-to-Action -->
      <OrganismsSectionsCallToAction
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
      </OrganismsSectionsCallToAction>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '~/utils/date';

const route = useRoute();

// Get post data using new Contentful strategy (non-blocking)
const {
  data: post,
  error: postError,
  pending: postPending,
} = useBlogPost(route.params.slug as string);

// Get related posts using post ID (only when post is loaded)
const { data: relatedPosts, pending: relatedPending } = useRelatedBlogPosts(
  computed(() => post.value?.id || ''),
  3
);

// Calculate read time dynamically from content
const readTime = useReadTime(() => post.value?.content || '');

// Watch for when post loading completes and handle 404
watch(
  [post, postError, postPending],
  ([postData, error, pending]) => {
    // Only throw 404 after loading is complete and no post was found
    if (!pending && !postData && !error) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Blog post not found',
      });
    }
  },
  { immediate: true }
);

// Page metadata (reactive to post data)
useHead(() => {
  if (!post.value) {
    return {
      title: 'Loading... - Sam Carrington',
    };
  }

  return {
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
      ...(post.value.tags || []).map(tag => ({
        property: 'article:tag',
        content: tag,
      })),
    ],
  };
});

// Social sharing functions
const shareOnTwitter = () => {
  if (!post.value) return;

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
  if (!post.value) return;

  const subject = encodeURIComponent(`Re: ${post.value.title}`);
  const body = encodeURIComponent(
    `Hi Sam,\n\nI just read your article "${post.value.title}" and wanted to discuss it further.\n\nBest regards,`
  );
  window.location.href = `mailto:sam@gwawr.com?subject=${subject}&body=${body}`;
};
</script>
