<template>
  <footer class="bg-gray-900 text-white">
    <UContainer class="mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Brand/Contact Section -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">Portfolio</h3>
          <p class="text-gray-300 text-sm">
            Building exceptional digital experiences with modern web
            technologies.
          </p>
          <div class="text-gray-300 text-sm">
            <p>Get in touch to discuss your next project.</p>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">Quick Links</h3>
          <nav class="flex flex-col space-y-2">
            <NuxtLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              class="text-gray-300 hover:text-white text-sm transition-colors"
            >
              {{ item.name }}
            </NuxtLink>
          </nav>
        </div>

        <!-- Social Media -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">Connect</h3>
          <div class="flex flex-col space-y-2">
            <ULink
              v-for="social in socialLinks"
              :key="social.name"
              :to="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-300 hover:text-white text-sm transition-colors inline-flex items-center space-x-2"
            >
              <UIcon :name="social.icon" class="w-4 h-4" />
              <span>{{ social.name }}</span>
            </ULink>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="mt-8 pt-8 border-t border-gray-700">
        <div
          class="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0"
        >
          <p class="text-gray-400 text-sm">
            © {{ currentYear }} Portfolio. All rights reserved.
          </p>
          <p class="text-gray-400 text-sm">Built with Nuxt 3 & Tailwind CSS</p>
        </div>
      </div>
    </UContainer>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Testimonials', href: '/testimonials' },
  { name: 'Blog', href: '/blog' },
];

const socialLinks = [
  {
    name: 'BlueSky',
    url: 'https://gwawr.bsky.social',
    icon: 'i-simple-icons-bluesky',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/gwawr/',
    icon: 'i-simple-icons-instagram',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/gwawr/',
    icon: 'i-simple-icons-linkedin',
  },
  {
    name: 'Github',
    url: 'https://github.com/samcarrington',
    icon: 'i-simple-icons-github',
  },
];
</script>
