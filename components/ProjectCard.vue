<template>
  <div
    class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
  >
    <!-- Project Image -->
    <div class="relative aspect-video bg-gray-200">
      <img
        v-if="project.image"
        :src="project.image"
        :alt="project.title"
        class="w-full h-full object-cover"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center text-gray-400"
      >
        <UIcon name="i-heroicons-photo" class="w-16 h-16" />
      </div>
      <!-- Category Badge -->
      <div class="absolute top-4 left-4">
        <span
          class="px-3 py-1 bg-primary text-white text-sm rounded-full font-medium"
        >
          {{ project.category }}
        </span>
      </div>
    </div>

    <!-- Project Content -->
    <div class="p-6">
      <CardTitle tag="h3" size="default" spacing="tight">
        {{ project.title }}
      </CardTitle>
      <p class="text-gray-600 mb-4 line-clamp-3">
        {{ project.description }}
      </p>

      <!-- Technologies -->
      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tech in project.technologies"
          :key="tech"
          class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
        >
          {{ tech }}
        </span>
      </div>

      <!-- Project Links -->
      <div class="flex gap-3">
        <UButton
          v-if="project.liveUrl"
          size="sm"
          variant="outline"
          :to="project.liveUrl"
          target="_blank"
          external
        >
          <UIcon name="i-heroicons-globe-alt" class="mr-1" />
          Live Demo
        </UButton>
        <UButton
          v-if="project.repoUrl"
          size="sm"
          variant="ghost"
          :to="project.repoUrl"
          target="_blank"
          external
        >
          <UIcon name="i-heroicons-code-bracket" class="mr-1" />
          Code
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  project: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
