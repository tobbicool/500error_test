// scripts/copy-locales.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../public/locales');
const supportedLngs = ['en', 'no'];
const namespaces = ['common', 'routes', 'char-info'];

async function setTranslationEnvVars() {
  try {
    for (const lng of supportedLngs) {
      for (const ns of namespaces) {
        const filePath = path.join(sourceDir, lng, `${ns}.json`);
        const content = await fs.readFile(filePath, 'utf8');
        const envKey = `TRANSLATION_${lng.toUpperCase()}_${ns.toUpperCase()}`;
        process.env[envKey] = content;
        console.log(`Set environment variable: ${envKey}`);
      }
    }
    console.log('Translation environment variables set successfully');
  } catch (err) {
    console.error('Error setting translation environment variables:', err);
    process.exit(1);
  }
}

setTranslationEnvVars();