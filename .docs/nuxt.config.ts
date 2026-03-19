export default defineNuxtConfig({
  compatibilityDate: 'latest',

  extends: ['docus', '..'],

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
