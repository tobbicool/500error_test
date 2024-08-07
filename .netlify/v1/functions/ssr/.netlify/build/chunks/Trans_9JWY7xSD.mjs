import { c as createComponent, r as renderTemplate, m as maybeRenderHead, a as addAttribute, u as unescapeHTML, b as createAstro } from './astro/server_CQbmQ8IQ.mjs';
import 'kleur/colors';
import 'clsx';
import i18next from 'i18next';
import DOMPurify from 'isomorphic-dompurify';

// src/i18n.js

const supportedLngs = ['en', 'no'];
const defaultLng = 'en';

const namespaces = ['common', 'routes', 'char-info'];

const i18n = i18next.createInstance();

// This function will be replaced with an API call in the browser
async function loadTranslations(lng, ns) {
  if (typeof window === 'undefined') {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const possiblePaths = [
      path.join(process.cwd(), 'locales', lng, `${ns}.json`),
      path.join(process.cwd(), 'public', 'locales', lng, `${ns}.json`),
      path.join(process.cwd(), '.netlify', 'functions-internal', 'ssr', 'locales', lng, `${ns}.json`),
      path.join(process.cwd(), '.netlify', 'build', 'locales', lng, `${ns}.json`),
      '/var/task/locales/${lng}/${ns}.json',
      '/var/task/.netlify/functions-internal/ssr/locales/${lng}/${ns}.json',
    ];
    
    for (const filePath of possiblePaths) {
      try {
        console.log(`Attempting to read file from: ${filePath}`);
        const data = await fs.readFile(filePath, 'utf8');
        console.log(`Successfully read file from: ${filePath}`);
        return JSON.parse(data);
      } catch (error) {
        console.error(`Failed to read file from ${filePath}:`, error.message);
      }
    }
    console.error(`Failed to load translations for ${lng}/${ns} from any location`);
    return {};
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

async function initI18n() {
  // logNetlifyEnvironment();

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

// This js will make sure the pages are translated

function changeLanguage(pathname) {
  const pathParts = pathname.split('/');
  return pathParts[1] && supportedLngs.includes(pathParts[1]) ? pathParts[1] : defaultLng;
}

function setupI18n(pathname) {
  const lang = changeLanguage(pathname);
  i18n.changeLanguage(lang);
  return lang;
}

const $$Astro = createAstro();
const $$Trans = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Trans;
  const { key, ns = "common" } = Astro2.props;
  const unsafeHtml = i18n.t(key, { ns });
  const purifyConfig = {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li"],
    ALLOWED_ATTR: ["href", "target"]
  };
  const safeHtml = DOMPurify.sanitize(unsafeHtml, purifyConfig);
  return renderTemplate`${maybeRenderHead()}<span class="i18n-span"${addAttribute(key, "data-i18n-key")}${addAttribute(ns, "data-i18n-ns")}>${unescapeHTML(safeHtml)}</span> `;
}, "C:/Users/Tobias Norheim/OneDrive/Koding/deploy testing/github-g4pecm/src/components/Trans.astro", void 0);

export { $$Trans as $, initI18n as i, setupI18n as s };
