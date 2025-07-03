import { fileURLToPath } from 'url';

export default defineNuxtConfig({
  alias: {
    '@null-kit/ui': fileURLToPath(new URL('./assets/css', import.meta.url))
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
