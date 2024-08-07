import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { logFolderContents } = require('./folder-tracker.js');

export default defineConfig({
  output: 'server',
  adapter: netlify({
    dist: new URL('./dist/', import.meta.url),
  }),
  vite: {
    plugins: [
      {
        name: 'folder-tracker',
        buildStart() {
          const logFile = path.join(__dirname, 'folder-tracker.log');
          fs.writeFileSync(logFile, 'Build Start\n');
          logFolderContents(__dirname, logFile);
        },
        closeBundle() {
          const logFile = path.join(__dirname, 'folder-tracker.log');
          fs.appendFileSync(logFile, '\nBuild End\n');
          logFolderContents(__dirname, logFile);
          logFolderContents(path.join(__dirname, 'dist'), logFile);
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