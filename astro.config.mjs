import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  output: 'server',
  adapter: netlify(),
  vite: {
    resolve: {
      alias: {
        '@astrojs/netlify/dist/lib/nft': path.resolve(__dirname, './empty-nft.js'),
      },
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'no'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  routes: [
    {
      path: '/api/translations/:lang/:ns',
      component: 'src/pages/api/translations/[lang]/[ns].js',
    },
  ], 
});