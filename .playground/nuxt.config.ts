import { fileURLToPath } from 'node:url';

export default defineNuxtConfig({
  compatibilityDate: '2025-11-03',
  ssr: false,
  extends: ['..'],
  modules: ['@nuxt/eslint'],
  eslint: {
    config: {
      rootDir: fileURLToPath(new URL('..', import.meta.url))
    }
  },
  css: ['@/assets/css/app.css'],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {}
    }
  }
});
