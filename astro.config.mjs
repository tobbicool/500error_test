import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server',
  adapter: netlify({
    functionPerRoute: false,
    binaryMediaTypes: ['image/*', 'video/*', 'application/*', 'font/*'],
    dist: new URL('./dist/', import.meta.url),
  }),
  vite: {
    build: {
      assetsInlineLimit: 0,
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