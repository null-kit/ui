export default defineNuxtConfig({
  compatibilityDate: 'latest',

  $development: {
    extends: ['docus', '..']
  },

  $production: {
    extends: [
      ['docus', { install: true }],
      ['github:null-kit/ui', { install: true }]
    ]
  },

  modules: ['@nuxt/ui', '@nuxt/eslint'],

  css: ['@/assets/css/app.css'],

  nullkitSvgSprite: {
    inputDir: 'assets/img/svg'
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
