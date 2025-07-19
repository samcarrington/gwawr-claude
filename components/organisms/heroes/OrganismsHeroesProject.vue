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
        <div class="text-lg text-gray-600 mb-6">
          <AtomsContentRenderer
            :content="project.description"
            size="lg"
            fallback-text="No description available"
          />
        </div>

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
          <AtomsButtonsPrimary
            v-if="project.liveUrl"
            size="lg"
            :to="project.liveUrl"
            target="_blank"
            external
          >
            <template #leading>
              <UIcon name="i-heroicons-globe-alt" />
            </template>
            View Live Project
          </AtomsButtonsPrimary>
          <AtomsButtonsSecondary
            v-if="project.repositoryUrl"
            size="lg"
            :to="project.repositoryUrl"
            target="_blank"
            external
          >
            <template #leading>
              <UIcon name="i-heroicons-code-bracket" />
            </template>
            View Code
          </AtomsButtonsSecondary>
        </div>
      </div>

      <!-- Project Image -->
      <div class="relative">
        <div class="aspect-video bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            v-if="projectImage"
            :src="projectImage"
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

<script setup lang="ts">
import type { Project } from '~/types/project';

const props = defineProps<{
  project: Project;
}>();

// Get the first image from the images array
const projectImage = computed(() => {
  return props.project.images && props.project.images.length > 0
    ? props.project.images[0]
    : null;
});
</script>
