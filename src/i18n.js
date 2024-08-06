// src/i18n.js
import i18next from 'i18next';

export const supportedLngs = ['en', 'no'];
export const defaultLng = 'en';

export const languageMapping = {
  'nb': 'no',
  'nn': 'no',
  'nb-no': 'no',
  'nn-no': 'no',
  'en-us': 'en',
  'en-gb': 'en',
};

export const namespaces = ['common', 'routes', 'char-info'];

const i18n = i18next.createInstance();

// This function will be replaced with an API call in the browser
import path from 'path';

async function loadTranslations(lng, ns) {
  if (typeof window === 'undefined') {
    // Server-side: Use fs and path
    const fs = await import('fs');
    
    // Determine the base path
    const basePath = process.env.NETLIFY 
      ? path.join(process.cwd(), '.next/server/pages') 
      : path.resolve('.');

    // Try multiple possible paths
    const possiblePaths = [
      path.join(basePath, 'dist', 'locales', lng, `${ns}.json`),
      path.join(basePath, 'locales', lng, `${ns}.json`),
      path.join(process.cwd(), 'dist', 'locales', lng, `${ns}.json`),
      path.join(process.cwd(), 'locales', lng, `${ns}.json`),
    ];

    for (const filePath of possiblePaths) {
      try {
        console.log(`Attempting to read file from: ${filePath}`);
        const data = await fs.promises.readFile(filePath, 'utf8');
        console.log(`Successfully read file from: ${filePath}`);
        return JSON.parse(data);
      } catch (error) {
        console.error(`Failed to read file from ${filePath}:`, error.message);
      }
    }

    console.error(`Failed to load translations for ${lng}/${ns} from any location`);
    return {};
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
      escapeValue: false // This allows HTML in translations
    }
  });

  return i18n;
}

export { i18n };