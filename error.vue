<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <UContainer>
      <div class="text-center">
        <!-- Error Code -->
        <div class="mb-8">
          <h1 class="text-9xl font-bold text-gray-200 mb-4">
            {{ error.statusCode }}
          </h1>
          <div class="w-24 h-1 bg-primary mx-auto mb-8"></div>
        </div>

        <!-- Error Message -->
        <div class="mb-8">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {{ errorTitle }}
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            {{ errorMessage }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            size="lg"
            @click="handleError"
            aria-label="Go back to previous page"
          >
            <UIcon name="i-heroicons-arrow-left" class="mr-2" />
            Go Back
          </UButton>
          <UButton
            size="lg"
            variant="outline"
            @click="navigateTo('/')"
            aria-label="Go to homepage"
          >
            <UIcon name="i-heroicons-home" class="mr-2" />
            Go Home
          </UButton>
        </div>

        <!-- Additional Help -->
        <div class="mt-12 text-center">
          <p class="text-gray-500 mb-4">
            Need help? Check out these popular pages:
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <NuxtLink
              to="/projects"
              class="text-primary hover:text-primary/80 transition-colors"
            >
              Projects
            </NuxtLink>
            <NuxtLink
              to="/blog"
              class="text-primary hover:text-primary/80 transition-colors"
            >
              Blog
            </NuxtLink>
            <NuxtLink
              to="/testimonials"
              class="text-primary hover:text-primary/80 transition-colors"
            >
              Testimonials
            </NuxtLink>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number;
    statusMessage: string;
    message: string;
  };
}>();

// Page metadata
useHead({
  title: `${props.error.statusCode} - Sam Carrington`,
  meta: [
    {
      name: 'description',
      content: `Error ${props.error.statusCode}: ${props.error.statusMessage}`,
    },
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
});

// Error-specific content
const errorTitle = computed(() => {
  switch (props.error.statusCode) {
    case 404:
      return 'Page Not Found';
    case 500:
      return 'Server Error';
    default:
      return 'Something went wrong';
  }
});

const errorMessage = computed(() => {
  switch (props.error.statusCode) {
    case 404:
      return "Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.";
    case 500:
      return "We're experiencing some technical difficulties. Please try again later or contact support if the problem persists.";
    default:
      return (
        props.error.statusMessage ||
        'An unexpected error occurred. Please try again.'
      );
  }
});

// Handle error actions
const handleError = () => {
  // Try to go back in history, fallback to home
  if (window.history.length > 1) {
    window.history.back();
  } else {
    navigateTo('/');
  }
};

// Clear error on navigation
onMounted(() => {
  // Optional: Clear error state if needed
  clearError();
});
</script>
