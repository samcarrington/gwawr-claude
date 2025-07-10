<template>
  <div
    class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8 md:p-12 mb-12"
  >
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <!-- Project Content -->
      <div>
        <div class="mb-4">
          <span
            class="px-4 py-2 bg-primary text-white text-sm rounded-full font-medium"
          >
            {{ project.category }} • Featured Project
          </span>
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {{ project.title }}
        </h2>
        <p class="text-lg text-gray-600 mb-6">
          {{ project.description }}
        </p>

        <!-- Technologies -->
        <div class="flex flex-wrap gap-2 mb-6">
          <span
            v-for="tech in project.technologies"
            :key="tech"
            class="px-3 py-1 bg-white text-gray-700 text-sm rounded-full border"
          >
            {{ tech }}
          </span>
        </div>

        <!-- Project Links -->
        <div class="flex gap-4">
          <UButton
            v-if="project.liveUrl"
            size="lg"
            :to="project.liveUrl"
            target="_blank"
            external
          >
            <UIcon name="i-heroicons-globe-alt" class="mr-2" />
            View Live Project
          </UButton>
          <UButton
            v-if="project.repoUrl"
            size="lg"
            variant="outline"
            :to="project.repoUrl"
            target="_blank"
            external
          >
            <UIcon name="i-heroicons-code-bracket" class="mr-2" />
            View Code
          </UButton>
        </div>
      </div>

      <!-- Project Image -->
      <div class="relative">
        <div class="aspect-video bg-white rounded-lg shadow-lg overflow-hidden">
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
            <UIcon name="i-heroicons-photo" class="w-20 h-20" />
          </div>
        </div>
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
