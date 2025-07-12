<template>
  <div class="py-12">
    <UContainer>
      <!-- Page Header -->
      <div class="text-center mb-12">
        <AtomsTypographyPage size="large" spacing="tight">
          My Projects
        </AtomsTypographyPage>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          A showcase of my recent work in web development, from full-stack
          applications to creative frontend projects.
        </p>
      </div>

      <!-- Featured Project -->
      <OrganismsHeroesProject v-if="featuredProject" :project="featuredProject" />

      <!-- Filter Tabs -->
      <div class="mb-12">
        <div v-if="pending" class="flex flex-wrap gap-3 justify-center">
          <USkeleton class="h-10 w-20" v-for="i in 5" :key="i" />
        </div>
        <div v-else class="flex flex-wrap gap-3 justify-center">
          <AtomsButtonsBase
            v-for="category in categories"
            :key="category"
            :variant="selectedCategory === category ? 'solid' : 'outline'"
            size="md"
            color="primary"
            @click="selectedCategory = category"
          >
            {{ category }}
          </AtomsButtonsBase>
        </div>
      </div>

      <!-- Status Filter -->
      <div class="mb-8">
        <div class="flex flex-wrap gap-2 justify-center">
          <AtomsButtonsBase
            v-for="status in statusOptions"
            :key="status"
            :variant="selectedStatus === status ? 'solid' : 'ghost'"
            size="sm"
            color="secondary"
            @click="selectedStatus = status"
          >
            {{ status === 'All' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1) }}
          </AtomsButtonsBase>
        </div>
      </div>

      <!-- Error State -->
      <UAlert
        v-if="error"
        color="red"
        variant="soft"
        title="Failed to load projects"
        :description="error.message || 'Please try refreshing the page'"
        class="mb-8"
      />

      <!-- Loading State -->
      <div
        v-else-if="pending"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <div v-for="i in 6" :key="i" class="space-y-4">
          <USkeleton class="h-48 w-full rounded-lg" />
          <USkeleton class="h-4 w-3/4" />
          <USkeleton class="h-4 w-1/2" />
          <div class="flex gap-2">
            <USkeleton class="h-6 w-16" />
            <USkeleton class="h-6 w-20" />
          </div>
        </div>
      </div>

      <!-- Projects Grid -->
      <div
        v-else-if="projects.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        role="list"
        aria-label="Projects"
      >
        <OrganismsCardsProject
          v-for="project in projects"
          :key="project.id"
          :project="project"
          role="listitem"
        />
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="text-center py-16 text-gray-500"
      >
        <UIcon name="i-heroicons-folder-open" class="w-16 h-16 mx-auto mb-4" />
        <AtomsTypographyCard tag="h3" size="default" align="center" spacing="tight">No projects found</AtomsTypographyCard>
        <p class="text-lg">
          Try selecting a different category or status, or check back later for new projects.
        </p>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
// Page metadata
useHead({
  title: 'Projects - Sam Carrington',
  meta: [
    {
      name: 'description',
      content:
        'Browse my portfolio of web development projects, featuring full-stack applications, frontend showcases, and creative coding experiments.',
    },
  ],
})

// Use new Contentful data fetching strategy (non-blocking for better UX)
const { data: featuredProjects } = useFeaturedProjects(1)

// Filter functionality using the new composable
const {
  selectedCategory,
  selectedStatus,
  categories,
  statusOptions,
  projects,
  pending,
  error,
} = useProjectFilter()

// Featured project (first featured project)
const featuredProject = computed(() => 
  featuredProjects.value && featuredProjects.value.length > 0 
    ? featuredProjects.value[0] 
    : null
)
</script>
