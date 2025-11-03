import { fileURLToPath } from 'node:url';

export default defineNuxtConfig({
  alias: {
    '@null-kit/ui': fileURLToPath(new URL('./app/assets/css', import.meta.url))
  },

  // fix unovis issues
  vite: {
    resolve: {
      alias: {
        'to-px': 'to-px/browser.js',
        striptags: 'striptags/src/striptags.js'
      }
    }
  }
});
