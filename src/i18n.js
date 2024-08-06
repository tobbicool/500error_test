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

async function loadTranslations(lng, ns) {
  if (typeof window === 'undefined') {
    // Server-side: Use environment variables or a different approach
    try {
      // This assumes you've set up environment variables for each translation
      const envKey = `TRANSLATION_${lng.toUpperCase()}_${ns.toUpperCase()}`;
      const translationJson = process.env[envKey];
      if (!translationJson) {
        throw new Error(`Translation not found for ${lng}/${ns}`);
      }
      return JSON.parse(translationJson);
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
      escapeValue: false // This allows HTML in translations
    }
  });

  return i18n;
}

i18n.on('initialized', (options) => {
  console.log('i18next initialized with options:', JSON.stringify(options, null, 2));
});

i18n.on('loaded', (loaded) => {
  console.log('i18next resources loaded:', JSON.stringify(loaded, null, 2));
});

i18n.on('failedLoading', (lng, ns, msg) => {
  console.error(`i18next failed loading: ${lng} ${ns} ${msg}`);
});

export { i18n };