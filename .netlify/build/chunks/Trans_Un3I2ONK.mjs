import i18next from 'i18next';
import { c as createComponent, r as renderTemplate, m as maybeRenderHead, a as addAttribute, u as unescapeHTML, b as createAstro } from './astro/server_BT9xpBHY.mjs';
import 'kleur/colors';
import 'clsx';
import DOMPurify from 'isomorphic-dompurify';

// src/i18n.js

const supportedLngs = ['en', 'no'];
const defaultLng = 'en';

const namespaces = ['common', 'routes', 'char-info'];

const i18n = i18next.createInstance();

// This function will be replaced with an API call in the browser
async function loadTranslations(lng, ns) {
  if (typeof window === 'undefined') {
    // Server-side: Use fs and path
    const fs = await import('fs');
    const path = await import('path');
    const filePath = path.resolve(`public/locales/${lng}/${ns}.json`);
    try {
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

async function initI18n(lang = defaultLng) {
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
    lng: lang,
    ns: namespaces,
    defaultNS: 'common',
    resources,
    interpolation: {
      escapeValue: false
    }
  });

  return i18n;
}

function getLanguageFromURL(pathname) {
    const pathSegments = pathname.split('/').filter(Boolean);
    return supportedLngs.includes(pathSegments[0]) ? pathSegments[0] : defaultLng;
}

const $$Astro = createAstro();
const $$Trans = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Trans;
  const { key, ns = "common", i18n } = Astro2.props;
  if (!i18n) {
    throw new Error("i18n instance not provided to Trans component");
  }
  const unsafeHtml = i18n.t(key, { ns });
  const purifyConfig = {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li"],
    ALLOWED_ATTR: ["href", "target"]
  };
  const safeHtml = DOMPurify.sanitize(unsafeHtml, purifyConfig);
  return renderTemplate`${maybeRenderHead()}<span class="i18n-span"${addAttribute(key, "data-i18n-key")}${addAttribute(ns, "data-i18n-ns")}>${unescapeHTML(safeHtml)}</span> `;
}, "C:/Users/Tobias Norheim/OneDrive/Koding/deploy testing/github-g4pecm/src/components/Trans.astro", void 0);

export { $$Trans as $, getLanguageFromURL as g, initI18n as i };
