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

  css: ['@/assets/css/main.css'],

  // srcDir: join(rootDir, '.docs'),

  nullkitSvgSprite: { inputDir: 'assets/img/svg' },

  alias: { '@null-kit/ui': join(rootDir, 'app/assets/css') },

  routeRules: { '/': { redirect: '/getting-started/installation' } },

  robots: { robotsTxt: false },
  mcp: { enabled: false },

  eslint: { config: { rootDir: '..' } },

  $production: {
    app: { baseURL: '/ui/' }
  }
});
