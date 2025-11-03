import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const playgroundDir = fileURLToPath(new URL('.', import.meta.url));
const rootDir = fileURLToPath(new URL('..', import.meta.url));

export default defineNuxtConfig({
  ssr: false,
  extends: ['..'],
  alias: {
    '@null-kit/ui': join(rootDir, 'app', 'assets', 'css')
  },
  srcDir: join(playgroundDir, 'app'),
  modules: ['@nuxt/eslint'],
  eslint: {
    config: {
      rootDir: fileURLToPath(new URL('..', import.meta.url))
    }
  },
  css: [join(playgroundDir, 'app', 'assets', 'css', 'app.css')],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {}
    }
  }
});
