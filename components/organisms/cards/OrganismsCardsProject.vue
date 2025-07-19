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
      <NuxtLink 
        :to="`/projects/${project.slug || project.id}`"
        class="block transition-transform duration-200 hover:scale-105"
        :aria-label="`View details for ${project.title}`"
      >
        <MoleculesCardsImage
          :src="projectImage"
          :alt="project.title"
          :category="project.category"
          aspect-ratio="video"
          fallback-icon="i-heroicons-photo"
        />
      </NuxtLink>
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

      <NuxtLink 
        :to="`/projects/${project.slug || project.id}`"
        class="block"
        :aria-label="`View details for ${project.title}`"
      >
        <AtomsTypographyCard 
          tag="h3" 
          size="default" 
          spacing="tight"
          class="transition-colors duration-200 hover:text-primary-600 hover:underline cursor-pointer"
        >
          {{ project.title }}
        </AtomsTypographyCard>
      </NuxtLink>
      <div class="text-gray-600 mb-4 line-clamp-3">
        <AtomsContentRenderer 
          :content="project.description" 
          size="sm"
          fallback-text="No description available"
        />
      </div>

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
      <div class="flex flex-col gap-3">
        <!-- Primary Action -->
        <UButton
          :to="`/projects/${project.slug || project.id}`"
          variant="solid"
          color="primary"
          size="sm"
          class="w-full"
          :aria-label="`View details for ${project.title}`"
        >
          <UIcon name="i-heroicons-eye" class="mr-1" />
          View Details
        </UButton>
        
        <!-- Secondary Actions -->
        <template v-if="project.liveUrl || project.repositoryUrl">
          <div class="flex gap-2">
            <UButton
              v-if="project.liveUrl"
              size="sm"
              variant="outline"
              :to="project.liveUrl"
              target="_blank"
              external
              class="flex-1"
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
              class="flex-1"
            >
              <UIcon name="i-heroicons-code-bracket" class="mr-1" />
              Repository
            </UButton>
          </div>
        </template>
      </div>
    </template>
  </MoleculesCardsBase>
</template>

<script setup lang="ts">
import type { Project } from '~/types/project'

const props = defineProps<{
  project: Project
}>()

// Get the first image from the images array
const projectImage = computed(() => {
  return props.project.images && props.project.images.length > 0 
    ? props.project.images[0] 
    : undefined
})

// Get badge variant based on project status
function getStatusVariant(status: Project['status']) {
  switch (status) {
    case 'completed':
      return 'success' as const
    case 'in-progress':
      return 'warning' as const
    case 'planned':
      return 'secondary' as const
    default:
      return 'default' as const
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
