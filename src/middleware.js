import { defaultLng, supportedLngs, languageMapping } from './i18n';
import { getLocalizedPath } from './utils/route-translation';

// This code checks the browser's preference for language and redirects to that language. 
// It can be overwritten by setting a cookie when changing language through the DropdownLang.astro component.

function getPreferredLanguage(request) {
    // Check for manually set language in cookie
    const cookies = request.headers.get('cookie');
    if (cookies) {
        const prefLangCookie = cookies.split(';').find(c => c.trim().startsWith('preferredLanguage='));
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
        const languages = acceptLanguage.split(',').map(lang => {
            const [language, quality = '1'] = lang.trim().split(';q=');
            return { language: language.toLowerCase(), quality: parseFloat(quality) };
        }).sort((a, b) => b.quality - a.quality);

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

export async function onRequest({ request }, next) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/media/')) {
        return next();
    }

    const pathSegments = url.pathname.split('/').filter(Boolean);
    const currentLang = supportedLngs.includes(pathSegments[0]) ? pathSegments[0] : defaultLng;
    const preferredLang = getPreferredLanguage(request);

    if (currentLang !== preferredLang) {
        const newPath = getLocalizedPath(url.pathname, currentLang, preferredLang);
        return Response.redirect(new URL(newPath, request.url), 302);
    } else {
        // Set the required headers for the new security feature
        const response = await next();
        const locals = { language: preferredLang };
        const headers = new Headers(response.headers);
        headers.set('x-astro-locals', JSON.stringify(locals));
        headers.set('x-astro-middleware-secret', process.env.MIDDLEWARE_SECRET);

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers
        });
    }
}