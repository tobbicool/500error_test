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
    functionPerRoute: false,
    binaryMediaTypes: ['image/*', 'video/*', 'application/*', 'font/*'],
    functionRuntimePath: "dist/.netlify/functions/",
  }),
  vite: {
    ssr: {
      external: ['@astrojs/netlify']
    }
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