<template>
  <BaseCard
    tag="article"
    variant="default"
    size="md"
    padding="md"
    hover
    overflow
    class="group"
  >
    <!-- Featured Image -->
    <template #header>
      <CardImage
        :src="post.featuredImage"
        :alt="post.title"
        :category="post.category"
        aspect-ratio="wide"
        fallback-icon="i-heroicons-document-text"
        hover
        gradient
      />
    </template>

    <!-- Post Content -->
    <template #default>
      <!-- Meta Information -->
      <div class="flex items-center text-sm text-gray-500 mb-3">
        <time :datetime="post.publishedAt">
          {{ formatDate(post.publishedAt) }}
        </time>
        <span class="mx-2">•</span>
        <span>{{ post.readTime }} min read</span>
      </div>

      <!-- Title -->
      <CardTitle tag="h2" size="default" spacing="default" hover class="line-clamp-2">
        {{ post.title }}
      </CardTitle>

      <!-- Excerpt -->
      <p class="text-gray-600 mb-4 line-clamp-3">
        {{ post.excerpt }}
      </p>

      <!-- Tags -->
      <div class="mb-4">
        <TagList
          :tags="post.tags"
          variant="default"
          size="xs"
          prefix="#"
        />
      </div>

    </template>

    <!-- Read More Link -->
    <template #footer>
      <NuxtLink
        :to="`/blog/${post.slug}`"
        class="inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors"
        :aria-label="`Read full article: ${post.title}`"
      >
        Read More
        <UIcon name="i-heroicons-arrow-right" class="ml-1 w-4 h-4" />
      </NuxtLink>
    </template>
  </BaseCard>
</template>

<script setup lang="ts">
import { formatDate } from '~/utils/date';
import type { BlogPost } from '~/types/blog';

defineProps<{
  post: BlogPost;
}>();
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
