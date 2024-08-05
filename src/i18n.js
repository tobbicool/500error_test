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

export const namespaces = ['common', 'routes'];

const i18n = i18next.createInstance();

// New: Add a flag to track initialization status
let isInitialized = false;

async function loadTranslations(lng, ns) {
  console.log(`Attempting to load translations for ${lng}/${ns}`);
  
  if (typeof window === 'undefined') {
    // Server-side logic
    console.log('Running in server-side environment');
    
    if (import.meta.env.PROD) {
      // Production environment
      console.log('Loading translations in production environment');
      try {
        // In production, we'll use an API call or a different method to load translations
        // This is a placeholder - replace with your actual production loading logic
        const response = await fetch(`https://cerulean-babka-d9e21d.netlify.app/translations/${lng}/${ns}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Successfully loaded translations for ${lng}/${ns} in production`);
        return data;
      } catch (error) {
        console.error(`Failed to load translations for ${lng}/${ns} in production:`, error);
        return {};
      }
    } else {
      // Development environment
      console.log('Loading translations in development environment');
      try {
        const fs = await import('fs');
        const path = await import('path');
        const filePath = path.resolve(`public/locales/${lng}/${ns}.json`);
        const data = await fs.promises.readFile(filePath, 'utf8');
        const parsedData = JSON.parse(data);
        console.log(`Successfully loaded translations for ${lng}/${ns} in development`);
        return parsedData;
      } catch (error) {
        console.error(`Failed to load translations for ${lng}/${ns} in development:`, error);
        return {};
      }
    }
  } else {
    // Client-side logic
    console.log('Running in client-side environment');
    try {
      const response = await fetch(`/api/translations/${lng}/${ns}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(`Successfully loaded translations for ${lng}/${ns} on client-side`);
      return data;
    } catch (error) {
      console.error(`Failed to load translations for ${lng}/${ns} on client-side:`, error);
      return {};
    }
  }
}

export async function initI18n() {
  // New: Check if i18n is already initialized
  if (isInitialized) {
    console.log('i18n is already initialized');
    return i18n;
  }

  console.log('Initializing i18n');
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
    },
    debug: true // Enable debug mode for more detailed logging
  });

  console.log('i18n initialization completed');
  
  // New: Set the initialization flag
  isInitialized = true;
  
  return i18n;
}

// Add a helper function to log the current state of i18n
export function logI18nState() {
  console.log('Current i18n state:');
  console.log('Language:', i18n.language);
  console.log('Namespaces:', i18n.options.ns);
  console.log('Resources:', i18n.options.resources);
}

export { i18n };