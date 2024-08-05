import { defaultLng, supportedLngs, languageMapping } from './i18n';
import { getLocalizedPath } from './utils/route-translation';

// This code checks the browser's preference for language and redirects to that language.
// It can be overwritten by setting a cookie when changing language through the DropdownLang.astro component.

function getPreferredLanguage(request) {
  // Check for manually set language in cookie
  const cookies = request.headers.get('cookie');
  if (cookies) {
    const prefLangCookie = cookies
      .split(';')
      .find((c) => c.trim().startsWith('preferredLanguage='));
    if (prefLangCookie) {
      const prefLang = prefLangCookie.split('=')[1].trim();
      if (supportedLngs.includes(prefLang)) {
        // console.log('Using manually set language:', prefLang);
        return prefLang;
      }
    }
  }

  // Fall back to browser language if no manual preference
  return getBrowserLanguage(request);
}

function getBrowserLanguage(request) {
  const acceptLanguage = request.headers.get('accept-language');
  // console.log('Accept-Language header:', acceptLanguage);

  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(',')
      .map((lang) => {
        const [language, quality = '1'] = lang.trim().split(';q=');
        return {
          language: language.toLowerCase(),
          quality: parseFloat(quality),
        };
      })
      .sort((a, b) => b.quality - a.quality);

    // console.log('Parsed languages:', languages);

    for (const lang of languages) {
      // console.log('Checking language:', lang.language);

      // Check for exact match or mapped language
      const mappedLang = languageMapping[lang.language] || lang.language;
      if (supportedLngs.includes(mappedLang)) {
        // console.log('Match found:', mappedLang);
        return mappedLang;
      }

      // Check for language without region
      const mainLang = lang.language.split('-')[0];
      const mappedMainLang = languageMapping[mainLang] || mainLang;
      if (supportedLngs.includes(mappedMainLang)) {
        // console.log('Main language match found:', mappedMainLang);
        return mappedMainLang;
      }
    }
  }

  // console.log('No supported language found, falling back to default:', defaultLng);
  return defaultLng;
}

export function onRequest({ request }, next) {
  // console.log('Middleware executed');
  const url = new URL(request.url);
  // console.log('Current URL:', url.toString());

  // Skip language redirection for asset requests
  if (url.pathname.startsWith('/media/')) {
    // console.log('Skipping language redirection for asset request');
    return next();
  }

  const pathSegments = url.pathname.split('/').filter(Boolean);
  const currentLang = supportedLngs.includes(pathSegments[0])
    ? pathSegments[0]
    : defaultLng;
  const preferredLang = getPreferredLanguage(request);

  // console.log('Current language from URL:', currentLang);
  // console.log('Preferred language:', preferredLang);

  if (currentLang !== preferredLang) {
    const newPath = getLocalizedPath(url.pathname, currentLang, preferredLang);
    // console.log('Redirecting to:', newPath);
    return Response.redirect(new URL(newPath, request.url), 302);
  } else {
    // console.log('No redirection needed');
    return next();
  }
}
