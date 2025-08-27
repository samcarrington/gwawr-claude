import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    globals: true, // This makes vi, describe, test, expect available globally
    environmentOptions: {
      nuxt: {
        domEnvironment: 'jsdom',
      },
    },
    setupFiles: ['./vitest.setup.ts'],
  },
});
