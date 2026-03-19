import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

export default defineNuxtConfig({
  compatibilityDate: 'latest',

  extends: [
    ['docus', { install: true }],
    ['..', { install: true }]
  ],

  modules: ['@nuxt/ui', '@nuxt/eslint'],

  css: ['@/assets/css/app.css'],

  nullkitSvgSprite: {
    inputDir: 'assets/img/svg'
  },

  alias: {
    '@null-kit/ui': join(rootDir, 'app', 'assets', 'css')
  },

  app: {
    baseURL: '/ui/'
  },

  routeRules: {
    '/': {
      redirect: '/getting-started/installation'
    }
  },

  mcp: {
    enabled: false
  },

  eslint: {
    config: {
      rootDir: '..'
    }
  }
});
