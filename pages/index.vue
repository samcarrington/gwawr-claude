<template>
  <div>
    <!-- Hero Section -->
    <section
      class="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
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
          <!-- Frontend Development -->
          <div
            class="text-center p-8 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div
              class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <UIcon
                name="i-heroicons-code-bracket"
                class="w-8 h-8 text-primary"
              />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              Frontend Development
            </h3>
            <p class="text-gray-600 mb-4">
              Building responsive, interactive user interfaces with modern
              frameworks and tools.
            </p>
            <div class="flex flex-wrap gap-2 justify-center">
              <span
                class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >Vue.js</span
              >
              <span
                class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >Nuxt.js</span
              >
              <span
                class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >TypeScript</span
              >
              <span
                class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >Tailwind CSS</span
              >
            </div>
          </div>

          <!-- Backend Development -->
          <div
            class="text-center p-8 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div
              class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <UIcon name="i-heroicons-server" class="w-8 h-8 text-primary" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              Backend Development
            </h3>
            <p class="text-gray-600 mb-4">
              Designing and implementing robust server-side solutions and APIs.
            </p>
            <div class="flex flex-wrap gap-2 justify-center">
              <span
                class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >Node.js</span
              >
              <span
                class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >Python</span
              >
              <span
                class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >PostgreSQL</span
              >
              <span
                class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >MongoDB</span
              >
            </div>
          </div>

          <!-- Full-Stack Solutions -->
          <div
            class="text-center p-8 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div
              class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <UIcon
                name="i-heroicons-rocket-launch"
                class="w-8 h-8 text-primary"
              />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              Full-Stack Solutions
            </h3>
            <p class="text-gray-600 mb-4">
              End-to-end application development from concept to deployment.
            </p>
            <div class="flex flex-wrap gap-2 justify-center">
              <span
                class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >AWS</span
              >
              <span
                class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >Docker</span
              >
              <span
                class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >CI/CD</span
              >
              <span
                class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >DevOps</span
              >
            </div>
          </div>
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
