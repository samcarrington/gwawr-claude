<template>
  <MoleculesCardsBase
    variant="default"
    size="md"
    padding="md"
    hover
    overflow
  >
    <!-- Project Image -->
    <template #header>
      <MoleculesCardsImage
        :src="project.image"
        :alt="project.title"
        :category="project.category"
        aspect-ratio="video"
        fallback-icon="i-heroicons-photo"
      />
    </template>

    <!-- Project Content -->
    <template #default>
      <!-- Status and Featured Badge -->
      <div class="flex items-center gap-2 mb-3">
        <AtomsBadges
          :label="project.status"
          :variant="getStatusVariant(project.status)"
          size="sm"
        />
        <AtomsBadges
          v-if="project.featured"
          label="Featured"
          variant="primary"
          size="sm"
        />
      </div>

      <AtomsTypographyCard tag="h3" size="default" spacing="tight">
        {{ project.title }}
      </AtomsTypographyCard>
      <p class="text-gray-600 mb-4 line-clamp-3">
        {{ project.description }}
      </p>

      <!-- Technologies -->
      <div class="mb-4">
        <MoleculesListsTags
          :tags="project.technologies"
          variant="default"
          size="xs"
        />
      </div>

    </template>

    <!-- Project Links -->
    <template #footer>
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
          v-if="project.repositoryUrl"
          size="sm"
          variant="ghost"
          :to="project.repositoryUrl"
          target="_blank"
          external
        >
          <UIcon name="i-heroicons-code-bracket" class="mr-1" />
          Repository
        </UButton>
      </div>
    </template>
  </MoleculesCardsBase>
</template>

<script setup lang="ts">
import type { Project } from '~/types/project'

defineProps<{
  project: Project
}>()

// Get badge variant based on project status
function getStatusVariant(status: Project['status']): string {
  switch (status) {
    case 'completed':
      return 'success'
    case 'in-progress':
      return 'warning'
    case 'planned':
      return 'info'
    default:
      return 'default'
  }
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
