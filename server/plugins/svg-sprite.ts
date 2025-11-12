import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import { consola } from 'consola';
import { fileURLToPath } from 'url';

export default defineNitroPlugin((nitro) => {
  const rootDir = fileURLToPath(import.meta.url).split('/.nuxt')[0];

  if (!rootDir) throw new Error('Root directory not found');

  const icons = path.resolve(rootDir, 'app/assets/img/svg');
  const spritePath = path.resolve(rootDir, '.nuxt/generated/sprite.svg');

  const generateSprite = () => {
    if (!fs.existsSync(icons)) return;

    const files = fs.readdirSync(icons).filter((f) => f.endsWith('.svg'));

    let symbols = '';

    for (const file of files) {
      const svg = fs.readFileSync(path.join(icons, file), 'utf8');
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

    consola.success('SVG Sprite generated');

    return sprite;
  };

  generateSprite();

  if (process.env.NODE_ENV === 'development') {
    const watcher = chokidar.watch(icons, { ignoreInitial: true });

    watcher.on('add', generateSprite);
    watcher.on('change', generateSprite);
    watcher.on('unlink', generateSprite);
  }

  nitro.hooks.hook('request', () => {
    nitro.router.get(
      '/_sprite.svg',
      eventHandler((event) => {
        if (!fs.existsSync(spritePath)) return;

        setHeader(event, 'Content-Type', 'image/svg+xml');

        return fs.readFileSync(spritePath, 'utf8');
      })
    );
  });
});
