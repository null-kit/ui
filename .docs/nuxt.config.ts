export default defineNuxtConfig({
  compatibilityDate: 'latest',

  extends: ['docus', '..'],

  modules: ['@nuxt/ui', '@nuxt/eslint'],

  css: ['~/assets/css/app.css'],

  mcp: {
    enabled: false
  },

  eslint: {
    config: {
      rootDir: '..'
    }
  }
});
