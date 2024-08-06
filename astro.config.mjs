import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

const middlewareSecret = process.env.MIDDLEWARE_SECRET;

export default defineConfig({
  output: 'server',
  adapter: netlify({
    middlewareSecret
  }),
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