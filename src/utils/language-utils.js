import { supportedLngs, defaultLng } from "../i18n";

export function getLanguageFromURL(pathname) {
    const pathSegments = pathname.split('/').filter(Boolean);
    return supportedLngs.includes(pathSegments[0]) ? pathSegments[0] : defaultLng;
}