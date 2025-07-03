import { fileURLToPath } from 'node:url';

export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  ssr: false,
  extends: ['..'],
  modules: ['@nuxt/eslint'],
  eslint: {
    config: {
      rootDir: fileURLToPath(new URL('..', import.meta.url))
    }
  },
  alias: {
    '@null-kit/ui': fileURLToPath(new URL('../assets/css', import.meta.url))
  },
  app: {
    baseURL: '/ui/'
  },
  css: ['@/assets/css/app.css'],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {}
    }
  }
});
