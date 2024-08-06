const fs = require('fs-extra');
const path = require('path');

const sourceDir = path.join(__dirname, '../public/locales');
const targetDir = path.join(__dirname, '../.netlify/functions-internal/ssr/public/locales');

async function copyLocales() {
  try {
    await fs.copy(sourceDir, targetDir);
    console.log('Locales copied successfully');
  } catch (err) {
    console.error('Error copying locales:', err);
    process.exit(1);
  }
}

copyLocales();