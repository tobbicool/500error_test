// src/i18n.js
import i18next from 'i18next';

import { logNetlifyEnvironment } from './logger.js';

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

async function loadTranslations(lng, ns) {
  if (typeof window === 'undefined') {
    // Server-side: Fetch from deployed asset URL
    try {
      const assetUrl = `${process.env.URL}/locales/${lng}/${ns}.json`;
      console.log(`Attempting to fetch from: ${assetUrl}`);
      const response = await fetch(assetUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(`Successfully fetched from: ${assetUrl}`);
      return data;
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
  // logNetlifyEnvironment();

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