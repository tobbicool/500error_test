// src/utils/route-translation.js
import { defaultLng, supportedLngs } from '../i18n';
import enRoutes from '../../public/locales/en/routes.json';
import noRoutes from '../../public/locales/no/routes.json';

const routeTranslations = {
  en: enRoutes,
  no: noRoutes,
  nb: noRoutes,
  nn: noRoutes
};

function findKeyByValue(obj, value) {
  for (const key in obj) {
    if (obj[key] === value || (typeof obj[key] === 'object' && obj[key]._folder === value)) {
      return key;
    }
    if (typeof obj[key] === 'object') {
      const nestedKey = findKeyByValue(obj[key], value);
      if (nestedKey) return `${key}.${nestedKey}`;
    }
  }
  return null;
}

function getValueByPath(obj, path) {
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    if (result[key] === undefined) return null;
    result = result[key];
  }
  return typeof result === 'object' && result._folder ? result._folder : result;
}

function translateSegment(segment, fromRoutes, toRoutes, fromLang, toLang) {
  // console.log(`Translating segment: ${segment} from ${fromLang} to ${toLang}`);
  
  // First, find the key in the source language
  const key = findKeyByValue(fromRoutes, segment);
  if (!key) {
    // console.log(`No translation found for: ${segment}`);
    return segment;
  }

  // Then, get the corresponding value in the target language
  const translatedValue = getValueByPath(toRoutes, key);
  if (!translatedValue) {
    // console.log(`No translation found for key: ${key}`);
    return segment;
  }

  // console.log(`Translated: ${segment} -> ${translatedValue}`);
  return translatedValue;
}

export function translatePath(path, fromLang, toLang) {
  // console.log(`Translating path: ${path} from ${fromLang} to ${toLang}`);
  const fromRoutes = routeTranslations[fromLang];
  const toRoutes = routeTranslations[toLang];

  const pathSegments = path.split('/').filter(Boolean);
  // console.log('Path segments:', pathSegments);
  
  const translatedSegments = pathSegments.map(segment => 
    translateSegment(segment, fromRoutes, toRoutes, fromLang, toLang)
  );

  const translatedPath = '/' + translatedSegments.join('/');
  // console.log(`Translated path: ${translatedPath}`);
  return translatedPath;
}

export function getLocalizedPath(path, currentLang, targetLang) {
  // console.log(`Getting localized path: ${path} from ${currentLang} to ${targetLang}`);
  // First, translate the path
  const translatedPath = translatePath(path, currentLang, targetLang);
  
  // Then, handle the language prefix
  const pathSegments = translatedPath.split('/').filter(Boolean);
  if (supportedLngs.includes(pathSegments[0])) {
    pathSegments.shift();
  }
  const result = targetLang === defaultLng ? `/${pathSegments.join('/')}` : `/${targetLang}/${pathSegments.join('/')}`;
  // console.log(`Localized path: ${result}`);
  return result;
}