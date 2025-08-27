// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // Exclude test files from Nuxt's file scanning
  ignore: ['**/*.test.*', '**/*.spec.*'],
  modules: [
    // '@nuxt/content',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/fonts',
    '@nuxt/devtools',
    '@nuxt/test-utils/module',
    '@nuxt/scripts',
    '@nuxt/eslint',
  ],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Exclude test files from client-side build
      rollupOptions: {
        external: id => {
          return /\.(test|spec)\.(js|ts|vue)$/.test(id);
        },
      },
    },
    optimizeDeps: {
      // Exclude test files from dependency optimization
      exclude: ['vitest'],
    },
  },
  runtimeConfig: {
    // Private keys (only available on server-side)
    contentfulPreviewAccessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
    contentfulManagementToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
    contentfulPreviewHost:
      process.env.CONTENTFUL_PREVIEW_HOST || 'preview.contentful.com',
    // Public keys (exposed to client-side)
    public: {
      // Safe Contentful config (Content Delivery API is read-only and safe for client-side)
      contentfulSpaceId: process.env.CONTENTFUL_SPACE_ID,
      contentfulAccessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      contentfulEnvironment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
      contentfulHost: process.env.CONTENTFUL_HOST || 'cdn.contentful.com',
      contentfulConfigured: !!(
        process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN
      ),
    },
  },
});
