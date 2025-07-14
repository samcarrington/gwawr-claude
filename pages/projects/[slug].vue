<template>
  <div>
    <!-- Loading State -->
    <div v-if="pending" class="min-h-screen">
      <!-- Header Loading -->
      <section class="py-12 bg-gradient-to-r from-gray-50 to-gray-100">
        <UContainer>
          <div class="max-w-4xl mx-auto text-center">
            <USkeleton class="h-8 w-32 mx-auto mb-6" />
            <USkeleton class="h-12 w-3/4 mx-auto mb-8" />
            <div class="flex items-center justify-center gap-4 mb-8">
              <USkeleton class="h-6 w-32" />
              <USkeleton class="h-6 w-32" />
            </div>
            <div class="flex flex-wrap gap-2 justify-center">
              <USkeleton class="h-8 w-16" v-for="i in 3" :key="i" />
            </div>
          </div>
        </UContainer>
      </section>
      
      <!-- Content Loading -->
      <article class="py-12">
        <UContainer>
          <div class="max-w-4xl mx-auto space-y-6">
            <USkeleton class="h-6 w-full" v-for="i in 10" :key="i" />
          </div>
        </UContainer>
      </article>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <UContainer>
        <div class="text-center">
          <UAlert
            color="red"
            variant="soft"
            title="Failed to load project"
            :description="error.message || 'The project could not be found or loaded.'"
            class="mb-8"
          />
          <NuxtLink
            to="/projects"
            class="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <UIcon name="i-heroicons-arrow-left" class="w-4 h-4 mr-2" />
            Back to Projects
          </NuxtLink>
        </div>
      </UContainer>
    </div>

    <!-- Project Content -->
    <div v-else-if="project">
      <!-- Project Hero -->
      <OrganismsHeroesProject :project="project" />

      <!-- Project Details -->
      <article class="py-12">
        <UContainer>
          <div class="max-w-4xl mx-auto">
            <!-- Project Images -->
            <section v-if="project.images && project.images.length > 1" class="mb-12">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Project Gallery</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  v-for="(image, index) in project.images.slice(1)" 
                  :key="index"
                  class="aspect-video rounded-lg overflow-hidden shadow-lg"
                >
                  <img
                    :src="image"
                    :alt="`${project.title} - Image ${index + 2}`"
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
            </section>

            <!-- Full Description -->
            <section v-if="project.fullDescription" class="mb-12">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">About This Project</h2>
              <div 
                class="prose prose-gray max-w-none prose-lg prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:text-gray-800 prose-blockquote:border-primary prose-blockquote:text-gray-700"
                v-html="project.fullDescription"
              />
            </section>

            <!-- Project Metadata -->
            <section class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <!-- Technologies -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Technologies Used</h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tech in project.technologies"
                    :key="tech"
                    class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>

              <!-- Project Info -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                <dl class="space-y-2">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Status</dt>
                    <dd class="text-sm text-gray-900 capitalize">{{ project.status.replace('-', ' ') }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Category</dt>
                    <dd class="text-sm text-gray-900">{{ project.category }}</dd>
                  </div>
                  <div v-if="project.startDate">
                    <dt class="text-sm font-medium text-gray-500">Start Date</dt>
                    <dd class="text-sm text-gray-900">{{ formatDate(project.startDate) }}</dd>
                  </div>
                  <div v-if="project.endDate">
                    <dt class="text-sm font-medium text-gray-500">End Date</dt>
                    <dd class="text-sm text-gray-900">{{ formatDate(project.endDate) }}</dd>
                  </div>
                </dl>
              </div>
            </section>

            <!-- Project Links -->
            <section class="flex gap-4 justify-center">
              <UButton
                v-if="project.liveUrl"
                size="lg"
                variant="solid"
                :to="project.liveUrl"
                target="_blank"
                external
              >
                <UIcon name="i-heroicons-globe-alt" class="mr-2" />
                View Live Project
              </UButton>
              <UButton
                v-if="project.repositoryUrl"
                size="lg"
                variant="outline"
                :to="project.repositoryUrl"
                target="_blank"
                external
              >
                <UIcon name="i-heroicons-code-bracket" class="mr-2" />
                View Source Code
              </UButton>
            </section>
          </div>
        </UContainer>
      </article>

      <!-- Call-to-Action -->
      <OrganismsSectionsCallToAction
        variant="light"
        title="Like What You See?"
        description="If this project caught your interest, let's discuss how I can help bring your ideas to life."
      >
        <template #primary-button="{ variant, classes }">
          <UButton
            size="lg"
            :variant="variant"
            :class="classes"
            @click="navigateTo('/projects')"
            aria-label="View more projects"
          >
            View More Projects
          </UButton>
        </template>
        <template #secondary-button="{ variant, classes }">
          <UButton
            size="lg"
            :variant="variant"
            :class="classes"
            @click="openEmailClient"
            aria-label="Contact me about this project"
          >
            Get In Touch
          </UButton>
        </template>
      </OrganismsSectionsCallToAction>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '~/utils/date'

const route = useRoute()

// Get project data using slug (non-blocking)
const { data: project, error, pending } = useProject(route.params.slug as string)

// Watch for when project loading completes and handle 404
watch([project, error, pending], ([projectData, projectError, projectPending]) => {
  // Only throw 404 after loading is complete and no project was found
  if (!projectPending && !projectData && !projectError) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Project not found',
    })
  }
}, { immediate: true })

// Page metadata (reactive to project data)
useHead(() => {
  if (!project.value) {
    return {
      title: 'Loading... - Sam Carrington'
    }
  }
  
  return {
    title: `${project.value.title} - Sam Carrington`,
    meta: [
      {
        name: 'description',
        content: project.value.description,
      },
      {
        property: 'og:title',
        content: project.value.title,
      },
      {
        property: 'og:description',
        content: project.value.description,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:image',
        content: project.value.images?.[0] || '',
      },
    ],
  }
})

// Contact function
const openEmailClient = () => {
  if (!project.value) return
  
  const subject = encodeURIComponent(`Re: ${project.value.title} Project`)
  const body = encodeURIComponent(
    `Hi Sam,\n\nI saw your project "${project.value.title}" and would like to discuss it further.\n\nBest regards,`
  )
  window.location.href = `mailto:sam@gwawr.com?subject=${subject}&body=${body}`
}
</script>