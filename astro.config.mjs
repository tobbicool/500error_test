import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

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
          const logFile = path.join(process.cwd(), 'folder-tracker.log');
          fs.writeFileSync(logFile, 'Build Start\n');
          logFolderContents(process.cwd(), logFile);
        },
        writeBundle() {
          const logFile = path.join(process.cwd(), 'folder-tracker.log');
          fs.appendFileSync(logFile, '\nBuild End\n');
          logFolderContents(process.cwd(), logFile);
          logFolderContents(path.join(process.cwd(), 'dist'), logFile);
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