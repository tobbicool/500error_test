import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
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
          const logFile = path.join(__dirname, 'folder-tracker.log');
          await fs.writeFile(logFile, 'Build Start\n');
          await logFolderContents(__dirname, logFile);
        },
        async closeBundle() {
          const logFile = path.join(__dirname, 'folder-tracker.log');
          await fs.appendFile(logFile, '\nBuild End\n');
          await logFolderContents(__dirname, logFile);
          await logFolderContents(path.join(__dirname, 'dist'), logFile);
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