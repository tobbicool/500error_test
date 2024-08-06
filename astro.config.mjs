import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server',
  adapter: netlify(),
  hooks: {
    'astro:config:setup': ({ updateConfig }) => {
      updateConfig({
        vite: {
          plugins: [
            {
              name: 'bypass-netlify-nft',
              resolveId(source) {
                if (source.includes('@astrojs/netlify/dist/lib/nft')) {
                  return 'virtual:empty-module';
                }
              },
              load(id) {
                if (id === 'virtual:empty-module') {
                  return 'export function copyDependenciesToFunction() { return Promise.resolve({ handler: "entry.mjs" }); }';
                }
              },
            },
          ],
        },
      });
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