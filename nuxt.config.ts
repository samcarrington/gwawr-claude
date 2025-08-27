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
  // Optimize font loading to prevent FOUC
  fonts: {
    families: [
      // Add your font families here for better optimization
      { name: 'Inter', provider: 'google' },
      { name: 'JetBrains Mono', provider: 'google' }
    ],
    // Use font-display: swap to prevent invisible text during font swap
    defaults: {
      fallbacks: {
        'sans-serif': ['Inter', 'system-ui', 'sans-serif'],
        'monospace': ['JetBrains Mono', 'monospace']
      }
    }
  },
  css: ['~/assets/css/main.css'],
  // Add critical CSS inlining and optimization
  nitro: {
    compressPublicAssets: true,
  },
  vite: {
    plugins: [tailwindcss()],
    css: {
      // Inline critical CSS for faster initial paint
      devSourcemap: true,
    },
    build: {
      // Exclude test files from client-side build
      rollupOptions: {
        external: id => {
          return /\.(test|spec)\.(js|ts|vue)$/.test(id);
        },
      },
      // Optimize CSS delivery
      cssCodeSplit: true,
    },
    optimizeDeps: {
      // Exclude test files from dependency optimization
      exclude: ['vitest'],
    },
  },
  // Use Nuxt's built-in loading and transition system
  ssr: true,
  app: {
    // Built-in page transitions
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },
  // Optimize critical resource loading
  experimental: {
    payloadExtraction: false,
    viewTransition: true,
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
