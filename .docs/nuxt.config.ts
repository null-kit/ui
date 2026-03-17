export default defineNuxtConfig({
  compatibilityDate: 'latest',
  extends: ['docus', '..'],
  modules: ['@nuxt/ui', '@nuxt/eslint'],
  css: ['~/assets/css/app.css'],

  eslint: {
    config: {
      rootDir: '..'
    }
  }
});
