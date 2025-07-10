<template>
  <article
    class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
  >
    <!-- Featured Image -->
    <div class="relative aspect-[16/9] bg-gray-200 overflow-hidden">
      <img
        v-if="post.featuredImage"
        :src="post.featuredImage"
        :alt="post.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200"
      >
        <UIcon name="i-heroicons-document-text" class="w-16 h-16" />
      </div>

      <!-- Category Badge -->
      <div class="absolute top-4 left-4">
        <span
          class="px-3 py-1 bg-primary text-white text-sm rounded-full font-medium"
        >
          {{ post.category }}
        </span>
      </div>
    </div>

    <!-- Post Content -->
    <div class="p-6">
      <!-- Meta Information -->
      <div class="flex items-center text-sm text-gray-500 mb-3">
        <time :datetime="post.publishedAt">
          {{ formatDate(post.publishedAt) }}
        </time>
        <span class="mx-2">•</span>
        <span>{{ post.readTime }} min read</span>
      </div>

      <!-- Title -->
      <h2
        class="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors"
      >
        {{ post.title }}
      </h2>

      <!-- Excerpt -->
      <p class="text-gray-600 mb-4 line-clamp-3">
        {{ post.excerpt }}
      </p>

      <!-- Tags -->
      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- Read More Link -->
      <NuxtLink
        :to="`/blog/${post.slug}`"
        class="inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors"
        :aria-label="`Read full article: ${post.title}`"
      >
        Read More
        <UIcon name="i-heroicons-arrow-right" class="ml-1 w-4 h-4" />
      </NuxtLink>
    </div>
  </article>
</template>

<script setup>
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
