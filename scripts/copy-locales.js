// scripts/copy-locales.js
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../public/locales');
const targetDir = path.join(__dirname, '../.netlify/functions-internal/ssr/public/locales');

async function copyLocales() {
  try {
    await fs.copy(sourceDir, targetDir);
    console.log('Locales copied successfully');
    console.log('Source directory:', sourceDir);
    console.log('Target directory:', targetDir);
  } catch (err) {
    console.error('Error copying locales:', err);
    process.exit(1);
  }
}

copyLocales();