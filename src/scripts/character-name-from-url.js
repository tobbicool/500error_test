
///// Dynamic characterName based on website url (will always be in english, because of the fallback I think)
///// In this way JSON-files will always need to be in English (it seems)

import { i18n } from '../i18n';

// Extract character name from URL
export function getCharacterName(url) {
    const fullUrl = new URL(url);
    const pathname = fullUrl.pathname;
    let characterName = pathname.split("/").filter(Boolean).pop();

    const currentLang = i18n.language;

    // Assuming you have a 'routes' namespace in your translations
    const characterRoutes = i18n.getResourceBundle(currentLang, 'routes')?.character || {};

    const routeKey = Object.keys(characterRoutes).find(
        (key) => characterRoutes[key] === characterName
    );

    return routeKey || characterName; // Fallback to the URL segment if not found in routes
}