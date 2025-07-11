<template>
  <div class="py-12">
    <UContainer>
      <!-- Page Header -->
      <div class="text-center mb-12">
        <PageTitle size="large" spacing="tight">
          My Projects
        </PageTitle>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          A showcase of my recent work in web development, from full-stack
          applications to creative frontend projects.
        </p>
      </div>

      <!-- Featured Project -->
      <ProjectHero v-if="featuredProject" :project="featuredProject" />

      <!-- Filter Tabs -->
      <div class="mb-12">
        <div class="flex flex-wrap gap-3 justify-center">
          <BaseButton
            v-for="category in categories"
            :key="category"
            :variant="selectedCategory === category ? 'solid' : 'outline'"
            size="md"
            color="primary"
            @click="selectedCategory = category"
          >
            {{ category }}
          </BaseButton>
        </div>
      </div>

      <!-- Projects Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ProjectCard
          v-for="project in filteredProjects"
          :key="project.id"
          :project="project"
        />
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredProjects.length === 0"
        class="text-center py-12 text-gray-500"
      >
        <UIcon name="i-heroicons-folder-open" class="w-16 h-16 mx-auto mb-4" />
        <p class="text-lg">No projects found for this category.</p>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
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
});

// Sample projects data
const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description:
      'A full-stack e-commerce solution built with Nuxt.js and Node.js. Features include user authentication, shopping cart, payment processing, and admin dashboard.',
    category: 'Full-Stack',
    technologies: ['Nuxt.js', 'Node.js', 'PostgreSQL', 'Stripe', 'Tailwind'],
    image: null,
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/example/ecommerce',
    featured: true,
    date: '2024-12',
  },
  {
    id: 2,
    title: 'Task Management App',
    description:
      'A collaborative task management application with real-time updates, team workspaces, and progress tracking.',
    category: 'Full-Stack',
    technologies: ['Vue.js', 'Express.js', 'MongoDB', 'Socket.io'],
    image: null,
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/example/taskapp',
    featured: false,
    date: '2024-11',
  },
  {
    id: 3,
    title: 'Portfolio Website',
    description:
      'A responsive portfolio website showcasing modern design principles and smooth animations.',
    category: 'Frontend',
    technologies: ['Nuxt.js', 'Tailwind CSS', 'GSAP', 'Netlify'],
    image: null,
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/example/portfolio',
    featured: false,
    date: '2024-10',
  },
  {
    id: 4,
    title: 'Weather Dashboard',
    description:
      'An interactive weather dashboard with location-based forecasts and data visualizations.',
    category: 'Frontend',
    technologies: ['React', 'Chart.js', 'OpenWeather API', 'CSS Modules'],
    image: null,
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/example/weather',
    featured: false,
    date: '2024-09',
  },
  {
    id: 5,
    title: 'API Documentation Site',
    description:
      'A comprehensive API documentation platform with interactive examples and code snippets.',
    category: 'Documentation',
    technologies: ['VuePress', 'Markdown', 'Prism.js', 'GitHub Pages'],
    image: null,
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/example/api-docs',
    featured: false,
    date: '2024-08',
  },
  {
    id: 6,
    title: 'Mobile App Backend',
    description:
      'RESTful API backend for a mobile application with user management and data synchronization.',
    category: 'Backend',
    technologies: ['Node.js', 'Express', 'JWT', 'Redis', 'Docker'],
    image: null,
    liveUrl: null,
    repoUrl: 'https://github.com/example/mobile-api',
    featured: false,
    date: '2024-07',
  },
];

// Sort projects by date (most recent first)
const sortedProjects = computed(() =>
  projects.sort((a, b) => new Date(b.date) - new Date(a.date))
);

// Featured project (most recent)
const featuredProject = computed(() =>
  sortedProjects.value.find(project => project.featured)
);

// Non-featured projects
const regularProjects = computed(() =>
  sortedProjects.value.filter(project => !project.featured)
);

// Filter functionality
const selectedCategory = ref('All');

const categories = computed(() => [
  'All',
  ...new Set(projects.map(project => project.category)),
]);

const filteredProjects = computed(() => {
  if (selectedCategory.value === 'All') {
    return regularProjects.value;
  }
  return regularProjects.value.filter(
    project => project.category === selectedCategory.value
  );
});
</script>
