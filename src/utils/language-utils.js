// This js will make sure the pages are translated
import { i18n, supportedLngs, defaultLng } from '../i18n';

export function changeLanguage(pathname) {
  const pathParts = pathname.split('/');
  return pathParts[1] && supportedLngs.includes(pathParts[1]) ? pathParts[1] : defaultLng;
}

export function setupI18n(pathname) {
  const lang = changeLanguage(pathname);
  i18n.changeLanguage(lang);
  return lang;
}