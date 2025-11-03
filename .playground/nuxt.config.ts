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
    // baseURL: '/ui/'
  },
  css: [fileURLToPath(new URL('app/assets/css/app.css', import.meta.url))],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {}
    }
  }
});
