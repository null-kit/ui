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
    '@null-kit/ui': '../app/assets/css'
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
