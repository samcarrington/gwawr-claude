<template>
  <div class="py-12">
    <UContainer>
      <!-- Page Header -->
      <div class="text-center mb-16">
        <AtomsTypographyPage size="large" spacing="default">
          What People Say
        </AtomsTypographyPage>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Here's what clients, colleagues, and collaborators have said about
          working with me. These testimonials reflect my commitment to quality,
          collaboration, and delivering exceptional results.
        </p>
      </div>

      <!-- Featured Testimonials Section -->
      <div v-if="featuredTestimonials?.length" class="mb-16">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            Featured Testimonials
          </h2>
          <p class="text-gray-600">Highlighted feedback from valued clients</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="testimonial in featuredTestimonials"
            :key="`featured-${testimonial.id}`"
            class="relative"
          >
            <!-- Featured Badge -->
            <div class="absolute -top-2 -right-2 z-10">
              <div
                class="bg-primary text-white text-xs px-2 py-1 rounded-full font-semibold"
              >
                ⭐ Featured
              </div>
            </div>
            <OrganismsCardsTestimonial
              :testimonial="testimonial"
              class="border-2 border-primary/20 shadow-lg"
            />
          </div>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="mb-8 flex flex-wrap gap-4 justify-center">
        <div class="flex items-center gap-2">
          <label for="rating-filter" class="text-sm font-medium text-gray-700">
            Minimum Rating:
          </label>
          <select
            id="rating-filter"
            v-model="selectedRating"
            class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
          </select>
        </div>

        <UButton
          :variant="showFeaturedOnly ? 'solid' : 'outline'"
          size="sm"
          @click="showFeaturedOnly = !showFeaturedOnly"
        >
          <UIcon name="i-heroicons-star" class="mr-1" />
          {{ showFeaturedOnly ? 'Show All' : 'Featured Only' }}
        </UButton>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="text-center py-12">
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-8 h-8 animate-spin text-primary mx-auto mb-4"
        />
        <p class="text-gray-600">Loading testimonials...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <UIcon
          name="i-heroicons-exclamation-triangle"
          class="w-8 h-8 text-red-500 mx-auto mb-4"
        />
        <p class="text-red-600 mb-4">Failed to load testimonials</p>
        <UButton @click="refresh()" variant="outline">
          <UIcon name="i-heroicons-arrow-path" class="mr-2" />
          Try Again
        </UButton>
      </div>

      <!-- All Testimonials Grid -->
      <div v-else-if="filteredTestimonials?.length" class="mb-16">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            All Testimonials
          </h2>
          <p class="text-gray-600">
            {{ filteredTestimonials.length }} testimonial{{
              filteredTestimonials.length !== 1 ? 's' : ''
            }}
          </p>
        </div>
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          role="list"
          aria-label="Client testimonials"
        >
          <OrganismsCardsTestimonial
            v-for="testimonial in filteredTestimonials"
            :key="testimonial.id"
            :testimonial="testimonial"
            role="listitem"
          />
        </div>
      </div>

      <!-- No Results State -->
      <div v-else class="text-center py-12">
        <UIcon
          name="i-heroicons-chat-bubble-left-ellipsis"
          class="w-12 h-12 text-gray-400 mx-auto mb-4"
        />
        <p class="text-gray-600 text-lg mb-2">No testimonials found</p>
        <p class="text-gray-500">
          Try adjusting your filters or check back later.
        </p>
      </div>

      <!-- Call-to-Action Section -->
      <OrganismsSectionsCallToAction
        variant="light"
        title="Ready to Work Together?"
        description="Join these satisfied clients and let's create something amazing together. I'm always excited to take on new challenges and deliver exceptional results."
      >
        <template #primary-button="{ variant, classes }">
          <UButton
            size="lg"
            :variant="variant"
            :class="classes"
            @click="navigateTo('/projects')"
            aria-label="View my portfolio projects"
          >
            <UIcon name="i-heroicons-eye" class="mr-2" />
            View My Work
          </UButton>
        </template>
        <template #secondary-button="{ variant, classes }">
          <UButton
            size="lg"
            :variant="variant"
            :class="classes"
            @click="openEmailClient"
            aria-label="Send me an email to start a conversation"
          >
            <UIcon name="i-heroicons-envelope" class="mr-2" />
            Get In Touch
          </UButton>
        </template>
      </OrganismsSectionsCallToAction>
    </UContainer>
  </div>
</template>

<script setup>
// Page metadata
useHead({
  title: 'Testimonials - Sam Carrington',
  meta: [
    {
      name: 'description',
      content:
        'Read what clients and colleagues say about working with Sam Carrington. Testimonials highlighting quality work, collaboration, and exceptional results.',
    },
  ],
});

// Use simple useFetch for debugging
const {
  data: testimonialsResponse,
  pending,
  error,
  refresh,
} = await useFetch('/api/testimonials', {
  key: 'testimonials-all',
  query: { limit: 20 },
  default: () => ({ items: [], total: 0, skip: 0, limit: 0 }),
  server: true,
});

// Get featured testimonials with simple fetch
const { data: featuredTestimonials } = await useFetch(
  '/api/testimonials/featured',
  {
    key: 'testimonials-featured',
    query: { limit: 3 },
    default: () => [],
    server: true,
  }
);

// Extract testimonials from response
const testimonials = computed(() => testimonialsResponse.value?.items || []);

// Filter controls
const selectedRating = ref('');
const showFeaturedOnly = ref(false);

// Computed filtered testimonials
const filteredTestimonials = computed(() => {
  if (!testimonials.value) return [];

  let filtered = [...testimonials.value];

  // Filter by rating
  if (selectedRating.value) {
    const minRating = parseInt(selectedRating.value);
    filtered = filtered.filter(
      testimonial => testimonial.rating && testimonial.rating >= minRating
    );
  }

  // Filter by featured status
  if (showFeaturedOnly.value) {
    filtered = filtered.filter(testimonial => testimonial.featured);
  }

  // Exclude featured testimonials from main list to avoid duplication
  if (featuredTestimonials.value?.length) {
    const featuredIds = new Set(featuredTestimonials.value.map(t => t.id));
    filtered = filtered.filter(testimonial => !featuredIds.has(testimonial.id));
  }

  return filtered;
});

// Navigation functions
const openEmailClient = () => {
  const subject = encodeURIComponent("Let's work together!");
  const body = encodeURIComponent(
    'Hi Sam,\n\nI came across your testimonials and would love to discuss a potential project. Could we schedule a time to chat?\n\nBest regards,'
  );
  window.location.href = `mailto:sam@gwawr.com?subject=${subject}&body=${body}`;
};
</script>
