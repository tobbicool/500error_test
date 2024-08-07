import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

import { fileURLToPath } from 'url';
import path from 'path';
import { logFolderContents } from './folder-tracker.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  output: 'server',
  adapter: netlify({
    dist: new URL('./dist/', import.meta.url),
  }),
  vite: {
    plugins: [
      {
        name: 'folder-tracker',
        async buildStart() {
          console.log('Build Start - Folder Structure:');
          await logFolderContents(__dirname);
        },
        async closeBundle() {
          console.log('\nBuild End - Folder Structure:');
          await logFolderContents(__dirname);
          console.log('\nDist Folder Structure:');
          await logFolderContents(path.join(__dirname, 'dist'));
        },
      },
    ],
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