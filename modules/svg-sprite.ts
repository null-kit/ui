import { defineNuxtModule, addDevServerHandler } from 'nuxt/kit';
import { defineEventHandler, setHeader } from 'h3';
import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import { consola } from 'consola';

export default defineNuxtModule({
  meta: {
    name: 'null-kit-svg-sprite',
    configKey: 'nullKit'
  },

  defaults: {
    inputDir: 'app/assets/img/svg',
    outputDir: '.output/public',
    filename: 'sprite.svg'
  },

  setup(options, nuxt) {
    const rootDir = nuxt.options.rootDir;
    const iconsDir = path.resolve(rootDir, options.inputDir);

    const outputPath = nuxt.options.dev ? '.nuxt/generated' : options.outputDir;

    const spritePath = path.resolve(rootDir, outputPath, options.filename);

    const generateSprite = () => {
      if (!fs.existsSync(iconsDir)) {
        consola.warn(`Svg Icons folder not found: ${iconsDir}`);
        return;
      }

      const files = fs.readdirSync(iconsDir).filter((f) => f.endsWith('.svg'));

      let symbols = '';

      for (const file of files) {
        const svg = fs.readFileSync(path.join(iconsDir, file), 'utf8');
        const id = path.basename(file, '.svg');
        const content = svg
          .replace(/<\?xml.*?\?>/, '')
          .replace(/<!DOCTYPE.*?>/, '')
          .replace(/<svg[^>]*>/, '')
          .replace(/<\/svg>/, '')
          .replace(/fill="(?!none")[^"]*"/g, 'fill="currentColor"');

        const viewBox = svg.match(/viewBox="([^"]*)"/)?.[1] || '0 0 24 24';

        symbols += `<symbol id="${id}" viewBox="${viewBox}">${content}</symbol>\n`;
      }

      const sprite = `<svg xmlns="http://www.w3.org/2000/svg">\n${symbols}</svg>`;

      fs.mkdirSync(path.dirname(spritePath), { recursive: true });
      fs.writeFileSync(spritePath, sprite, 'utf8');

      consola.success(`SVG Sprite Generated with ${files.length} icons`);
    };

    nuxt.hook('nitro:build:public-assets', generateSprite);

    if (nuxt.options.dev) {
      nuxt.hook('ready', () => {
        if (fs.existsSync(iconsDir)) {
          const watcher = chokidar.watch(iconsDir, { ignoreInitial: true });

          watcher.on('add', generateSprite);
          watcher.on('change', generateSprite);
          watcher.on('unlink', generateSprite);
        }
      });

      addDevServerHandler({
        route: `/${options.filename}`,
        handler: defineEventHandler((event) => {
          if (!fs.existsSync(spritePath)) return;

          setHeader(event, 'Content-Type', 'image/svg+xml');

          return fs.readFileSync(spritePath, 'utf8');
        })
      });
    }
  }
});
