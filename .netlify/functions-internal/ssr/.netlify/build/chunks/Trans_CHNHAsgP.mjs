import { c as createComponent, r as renderTemplate, m as maybeRenderHead, a as addAttribute, u as unescapeHTML, b as createAstro } from './astro/server_CQbmQ8IQ.mjs';
import 'kleur/colors';
import 'clsx';
import i18next from 'i18next';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import DOMPurify from 'isomorphic-dompurify';

// src/i18n.js

const __filename = fileURLToPath(import.meta.url);
path.dirname(__filename);

const supportedLngs = ['en', 'no'];
const defaultLng = 'en';

const namespaces = ['common', 'routes', 'char-info'];

const i18n = i18next.createInstance();

function resolveLocalePath(lng, ns) {
  const possibilities = [
    path.join(process.cwd(), 'public', 'locales', lng, `${ns}.json`),
    path.join(process.cwd(), '.netlify', 'functions-internal', 'ssr', 'public', 'locales', lng, `${ns}.json`),
    path.join('/var', 'task', 'public', 'locales', lng, `${ns}.json`)
  ];

  for (const filePath of possibilities) {
    try {
      fs.accessSync(filePath, fs.constants.R_OK);
      console.log(`Found locale file: ${filePath}`);
      return filePath;
    } catch (error) {
      // File doesn't exist or is not readable
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
      const data = await fs.readFile(filePath, 'utf8');
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

async function initI18n() {
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

i18n.on('initialized', (options) => {
  console.log('i18next initialized with options:', JSON.stringify(options, null, 2));
});

i18n.on('loaded', (loaded) => {
  console.log('i18next resources loaded:', JSON.stringify(loaded, null, 2));
});

i18n.on('failedLoading', (lng, ns, msg) => {
  console.error(`i18next failed loading: ${lng} ${ns} ${msg}`);
});

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
