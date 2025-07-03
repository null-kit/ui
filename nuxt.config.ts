import { fileURLToPath } from 'url';

export default defineNuxtConfig({
  alias: {
    '@null-kit/ui': fileURLToPath(new URL('./assets/css', import.meta.url))
  }
});
