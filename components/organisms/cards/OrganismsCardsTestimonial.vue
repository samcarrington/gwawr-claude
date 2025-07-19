<template>
  <MoleculesCardsBase
    variant="default"
    size="md"
    padding="lg"
    hover
  >
    <!-- Quote Icon -->
    <div class="mb-6">
      <UIcon
        name="i-heroicons-chat-bubble-left-ellipsis"
        class="w-8 h-8 text-primary/60"
      />
    </div>

    <!-- Testimonial Content -->
    <blockquote
      class="testimonial-quote text-gray-700 text-lg leading-relaxed mb-6 italic"
    >
      {{ testimonial.content }}
    </blockquote>

    <!-- Author Info -->
    <div class="flex items-center">
      <!-- Avatar -->
      <div
        class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4"
      >
        <span class="text-primary font-semibold text-lg">
          {{ getInitials(clientName) }}
        </span>
      </div>

      <!-- Author Details -->
      <div>
        <h4 class="font-semibold text-gray-900">
          {{ clientName }}
        </h4>
        <p class="text-gray-600 text-sm">
          {{ clientTitle }}
          <span v-if="clientCompany" class="text-gray-400">
            at {{ clientCompany }}
          </span>
        </p>
      </div>
    </div>

    <!-- Rating Stars (if provided) -->
    <div v-if="testimonial.rating" class="flex mt-4">
      <UIcon
        v-for="star in 5"
        :key="star"
        name="i-heroicons-star-solid"
        :class="[
          'w-4 h-4',
          star <= testimonial.rating ? 'text-yellow-400' : 'text-gray-300',
        ]"
      />
    </div>
  </MoleculesCardsBase>
</template>

<script setup>
const props = defineProps({
  testimonial: {
    type: Object,
    required: true,
  },
});

// Computed properties to handle both legacy and enhanced field names
const clientName = computed(() => {
  return props.testimonial.clientName || props.testimonial.name || 'Anonymous'
})

const clientTitle = computed(() => {
  return props.testimonial.clientTitle || props.testimonial.title || ''
})

const clientCompany = computed(() => {
  return props.testimonial.clientCompany || props.testimonial.company || ''
})

// Helper function to get initials from name
const getInitials = name => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('');
};
</script>

<style scoped>
.testimonial-quote {
  position: relative;
}

.testimonial-quote::before {
  content: '"';
  font-size: 1.5em;
  color: rgb(var(--color-primary-500) / 0.6);
  font-weight: bold;
  position: absolute;
  left: -0.5em;
  top: -0.1em;
}

.testimonial-quote::after {
  content: '"';
  font-size: 1.5em;
  color: rgb(var(--color-primary-500) / 0.6);
  font-weight: bold;
  margin-left: 0.1em;
}
</style>
