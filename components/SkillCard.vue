<template>
  <BaseCard
    variant="flat"
    size="md"
    padding="lg"
    hover
    class="text-center"
  >
    <div
      class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
    >
      <UIcon :name="icon" class="w-8 h-8 text-primary" />
    </div>
    <h3 class="text-xl font-semibold text-gray-900 mb-4">
      {{ title }}
    </h3>
    <p class="text-gray-600 mb-4">
      {{ description }}
    </p>
    <TagList
      :tags="technologies"
      variant="primary"
      size="sm"
      align="center"
    />
  </BaseCard>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  technologies: {
    type: Array,
    required: true,
  },
});
</script>
