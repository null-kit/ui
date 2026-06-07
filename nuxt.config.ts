import { createResolver } from 'nuxt/kit';

const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  alias: {
    '@null-kit/ui': resolve('./app/assets/css'),
    '@null-kit/utils': resolve('./shared/utils')
  },

  modules: [resolve('modules/svg-sprite')],

  // fix unovis issues
  vite: {
    resolve: {
      alias: {
        'to-px': 'to-px/browser.js',
        striptags: 'striptags/src/striptags.js'
      }
    },
    optimizeDeps: {
      include: ['@floating-ui/vue', '@tanstack/vue-table', '@vue/devtools-core', '@vue/devtools-kit']
    }
  }
});
