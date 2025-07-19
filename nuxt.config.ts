// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    // Private keys (only available on server-side)
    contentfulPreviewAccessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
    contentfulManagementToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
    contentfulPreviewHost: process.env.CONTENTFUL_PREVIEW_HOST || 'preview.contentful.com',
    // Public keys (exposed to client-side)
    public: {
      // Safe Contentful config (Content Delivery API is read-only and safe for client-side)
      contentfulSpaceId: process.env.CONTENTFUL_SPACE_ID,
      contentfulAccessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      contentfulEnvironment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
      contentfulHost: process.env.CONTENTFUL_HOST || 'cdn.contentful.com',
      contentfulConfigured: !!(process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN)
    }
  },
});
