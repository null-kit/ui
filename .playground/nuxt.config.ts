import { fileURLToPath } from 'node:url';

export default defineNuxtConfig({
  ssr: false,
  extends: ['..'],
  modules: ['@nuxt/eslint'],
  eslint: {
    config: {
      rootDir: fileURLToPath(new URL('..', import.meta.url))
    }
  },
  app: {
    baseURL: '/ui/'
  },
  css: ['assets/css/app.css'],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {}
    }
  }
});
