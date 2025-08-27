<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// Preload critical fonts to prevent FOUC
useHead({
  link: [
    // Preload Inter font (most critical)
    {
      rel: 'preload',
      href: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZs.woff2',
      as: 'font',
      type: 'font/woff2',
      crossorigin: 'anonymous'
    }
  ]
})
</script>

<style>
/* 🔥 CRITICAL CSS - INLINED TO PREVENT FOUC (Minimal overlap with main.css) */

/* Only the most critical styles that need to render immediately */
html {
  background-color: #f9fafb; /* Prevent white flash before main.css loads */
}

/* Essential layout utilities that appear immediately */
.min-h-screen { min-height: 100vh; }
.bg-gray-50 { background-color: #f9fafb; }
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-grow { flex-grow: 1; }
</style>