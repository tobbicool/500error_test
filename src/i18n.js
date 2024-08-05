import i18next from 'i18next';
import fs from 'fs/promises';
import path from 'path';

export const supportedLngs = ['en', 'no'];
export const defaultLng = 'en';
export const namespaces = ['common', 'routes'];

const i18n = i18next.createInstance();

async function loadTranslations(lng, ns) {
  if (import.meta.env.PROD) {
    // In production, fetch translations from an API endpoint
    const response = await fetch(`/api/translations/${lng}/${ns}`);
    return response.json();
  } else {
    // In development, load from file system
    const filePath = path.resolve(`public/locales/${lng}/${ns}.json`);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
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