<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <OrganismsNavigationHeader />
    <main class="flex-grow">
      <slot />
    </main>
    <OrganismsNavigationFooter />
  </div>
</template>

<script setup>
// Components are now auto-imported by Nuxt
</script>
