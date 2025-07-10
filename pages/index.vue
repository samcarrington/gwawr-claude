<template>
  <div>
    <!-- Hero Section -->
    <section
      class="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 to-gray-100"
    >
      <UContainer class="text-center">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Hi, I'm <span class="text-primary">Sam Carrington</span>
          </h1>
          <p class="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Full-stack developer passionate about creating exceptional digital
            experiences through clean code and innovative solutions.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              size="lg"
              class="px-8 py-3"
              @click="navigateTo('/projects')"
            >
              View My Work
            </UButton>
            <UButton
              size="lg"
              variant="outline"
              class="px-8 py-3"
              @click="scrollToSection('contact')"
            >
              Get In Touch
            </UButton>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Skills & Highlights Section -->
    <section class="py-20 bg-white">
      <UContainer>
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What I Do
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            I specialize in building modern web applications with a focus on
            performance, user experience, and scalable architecture.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SkillCard
            v-for="skill in skills"
            :key="skill.title"
            :icon="skill.icon"
            :title="skill.title"
            :description="skill.description"
            :technologies="skill.technologies"
          />
        </div>
      </UContainer>
    </section>

    <!-- Call-to-Action Section -->
    <section id="contact" class="py-20 bg-gray-900 text-white">
      <UContainer>
        <div class="text-center max-w-3xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold mb-6">
            Ready to Build Something Amazing?
          </h2>
          <p class="text-xl text-gray-300 mb-8">
            I'm always excited to work on new projects and collaborate with
            passionate teams. Let's discuss how we can bring your ideas to life.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              size="lg"
              variant="outline"
              class="px-8 py-3 border-white text-white hover:bg-white hover:text-gray-900"
              @click="navigateTo('/projects')"
            >
              View My Projects
            </UButton>
            <UButton
              size="lg"
              class="px-8 py-3 bg-primary hover:bg-primary/90"
              @click="openEmailClient"
            >
              Start a Conversation
            </UButton>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>

<script setup>
// Page metadata
useHead({
  title: 'Sam Carrington - Full-Stack Developer',
  meta: [
    {
      name: 'description',
      content:
        'Full-stack developer passionate about creating exceptional digital experiences through clean code and innovative solutions.',
    },
  ],
});

// Skills data
const skills = [
  {
    icon: 'i-heroicons-code-bracket',
    title: 'Frontend Development',
    description:
      'Building responsive, interactive user interfaces with modern frameworks and tools.',
    technologies: ['Vue.js', 'Nuxt.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    icon: 'i-heroicons-server',
    title: 'Backend Development',
    description:
      'Designing and implementing robust server-side solutions and APIs.',
    technologies: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB'],
  },
  {
    icon: 'i-heroicons-rocket-launch',
    title: 'Full-Stack Solutions',
    description:
      'End-to-end application development from concept to deployment.',
    technologies: ['AWS', 'Docker', 'CI/CD', 'DevOps'],
  },
];

// Navigation functions
const scrollToSection = sectionId => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const openEmailClient = () => {
  window.location.href = "mailto:sam@gwawr.com?subject=Let's work together!";
};
</script>
