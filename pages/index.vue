<template>
  <div>
    <!-- Hero Section -->
    <section
      class="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 to-gray-100"
    >
      <UContainer class="text-center">
        <div class="max-w-4xl mx-auto">
          <PageTitle size="hero" spacing="default">
            Hi, I'm <span class="text-primary">Sam Carrington</span>
          </PageTitle>
          <p class="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Cloud Architect and Engineering Leader with a passion for creative
            technology and innovation.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonPrimary
              size="lg"
              shadow
              @click="navigateTo('/projects')"
            >
              View My Work
            </ButtonPrimary>
            <ButtonSecondary
              size="lg"
              @click="scrollToSection('contact')"
            >
              Get In Touch
            </ButtonSecondary>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Skills & Highlights Section -->
    <section class="py-20 bg-white">
      <UContainer>
        <div class="text-center mb-16">
          <SectionTitle size="large" spacing="tight">
            What I Do
          </SectionTitle>
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
    <CallToAction
      variant="dark"
      title="Ready to Build Something Amazing?"
      description="I'm always excited to work on new projects and collaborate with passionate teams. Let's discuss how we can bring your ideas to life."
    >
      <template #primary-button="{ variant, classes }">
        <BaseButton
          size="lg"
          :variant="variant"
          :class="classes"
          @click="navigateTo('/projects')"
          aria-label="View my portfolio projects"
        >
          View My Projects
        </BaseButton>
      </template>
      <template #secondary-button="{ variant, classes }">
        <BaseButton
          size="lg"
          :variant="variant"
          :class="classes"
          @click="openEmailClient"
          aria-label="Send me an email to start a conversation"
        >
          Start a Conversation
        </BaseButton>
      </template>
    </CallToAction>
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
  const subject = encodeURIComponent("Let's work together!");
  window.location.href = `mailto:sam@gwawr.com?subject=${subject}`;
};
</script>
