// src/i18n.js
import i18next from 'i18next';
import fs from 'fs/promises';
import path from 'path';

export const supportedLngs = ['en', 'no'];
export const defaultLng = 'en';
export const namespaces = ['common', 'routes', 'char-info'];

const i18n = i18next.createInstance();

async function loadTranslations(lng, ns) {
  if (typeof window === 'undefined') {
    // Server-side: Use fs and path
    try {
      let filePath;
      if (process.env.NETLIFY) {
        // Netlify environment
        filePath = path.join(process.cwd(), 'dist', 'locales', lng, `${ns}.json`);
      } else {
        // Local environment
        filePath = path.resolve(`public/locales/${lng}/${ns}.json`);
      }
      console.log(`Attempting to read file from: ${filePath}`);
      const data = await fs.readFile(filePath, 'utf8');
      console.log(`Successfully read file from: ${filePath}`);
      return JSON.parse(data);
    } catch (error) {
      console.error(`Failed to load translations for ${lng}/${ns}:`, error);
      return {};
    }
  } else {
    // Client-side: Fetch from an API endpoint
    try {
      const response = await fetch(`/api/translations/${lng}/${ns}`);
      return await response.json();
    } catch (error) {
      console.error(`Failed to load translations for ${lng}/${ns}:`, error);
      return {};
    }
  }
}

export async function initI18n() {
  const resources = {};
  for (const lng of supportedLngs) {
    resources[lng] = {};
    for (const ns of namespaces) {
      resources[lng][ns] = await loadTranslations(lng, ns);
    }
  }

  await i18n.init({
    fallbackLng: defaultLng,
    supportedLngs,
    ns: namespaces,
    defaultNS: 'common',
    resources,
    interpolation: {
      escapeValue: false
    }
  });

  return i18n;
}

export { i18n };