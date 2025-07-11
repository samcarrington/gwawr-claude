<template>
  <header class="bg-white shadow-sm">
    <UContainer class="mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo/Brand -->
        <div class="flex-shrink-0">
          <NuxtLink
            to="/"
            class="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
          >
            Portfolio
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex space-x-8">
          <NuxtLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            class="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
            :class="{ 'text-gray-900 font-semibold': isActiveRoute(item.href) }"
          >
            {{ item.name }}
          </NuxtLink>
        </nav>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <BaseButton
            variant="ghost"
            size="sm"
            color="neutral"
            :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'"
            @click="isMenuOpen = !isMenuOpen"
          >
            <template #leading>
              <UIcon name="i-heroicons-bars-3" />
            </template>
          </BaseButton>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="isMenuOpen" class="md:hidden">
        <div
          class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200"
        >
          <NuxtLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            :class="{
              'text-gray-900 bg-gray-50 font-semibold': isActiveRoute(
                item.href
              ),
            }"
            @click="isMenuOpen = false"
          >
            {{ item.name }}
          </NuxtLink>
        </div>
      </div>
    </UContainer>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const route = useRoute();
const isMenuOpen = ref(false);

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Testimonials', href: '/testimonials' },
  { name: 'Blog', href: '/blog' },
];

// Check if route is active (handles dynamic routes)
const isActiveRoute = (href: string) => {
  if (href === '/') {
    return route.path === '/';
  }
  return route.path === href || route.path.startsWith(href + '/');
};

// Close mobile menu when route changes
watch(
  () => route.path,
  () => {
    isMenuOpen.value = false;
  }
);
</script>
