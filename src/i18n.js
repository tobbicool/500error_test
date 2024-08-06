// src/i18n.js
import i18next from 'i18next';
import fs from 'fs';
import path from 'path';

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

function resolveLocalePath(lng, ns) {
  const possibilities = [
    path.join(process.cwd(), 'public', 'locales', lng, `${ns}.json`),
    path.join(process.cwd(), '.netlify', 'functions-internal', 'ssr', 'public', 'locales', lng, `${ns}.json`),
    path.join('/var', 'task', 'public', 'locales', lng, `${ns}.json`)
  ];

  for (const filePath of possibilities) {
    if (fs.existsSync(filePath)) {
      console.log(`Found locale file: ${filePath}`);
      return filePath;
    }
  }

  console.error(`Unable to find locale file for ${lng}/${ns}`);
  console.log('Current working directory:', process.cwd());
  console.log('Directory contents:', fs.readdirSync(process.cwd()));
  throw new Error(`Unable to find locale file for ${lng}/${ns}`);
}

async function loadTranslations(lng, ns) {
  if (typeof window === 'undefined') {
    // Server-side: Use fs and path
    try {
      const filePath = resolveLocalePath(lng, ns);
      const data = await fs.promises.readFile(filePath, 'utf8');
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
      escapeValue: false // This allows HTML in translations
    }
  });

  return i18n;
}

// Add these event listeners for better debugging
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