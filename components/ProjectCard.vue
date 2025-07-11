<template>
  <BaseCard
    variant="default"
    size="md"
    padding="md"
    hover
    overflow
  >
    <!-- Project Image -->
    <template #header>
      <CardImage
        :src="project.image"
        :alt="project.title"
        :category="project.category"
        aspect-ratio="video"
        fallback-icon="i-heroicons-photo"
      />
    </template>

    <!-- Project Content -->
    <template #default>
      <CardTitle tag="h3" size="default" spacing="tight">
        {{ project.title }}
      </CardTitle>
      <p class="text-gray-600 mb-4 line-clamp-3">
        {{ project.description }}
      </p>

      <!-- Technologies -->
      <div class="mb-4">
        <TagList
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
    </template>
  </BaseCard>
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
