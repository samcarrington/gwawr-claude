<template>
  <div
    class="text-center p-8 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
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
    <div class="flex flex-wrap gap-2 justify-center">
      <span
        v-for="tech in technologies"
        :key="tech"
        class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
      >
        {{ tech }}
      </span>
    </div>
  </div>
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
