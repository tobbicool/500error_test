import { c as createComponent, r as renderTemplate, m as maybeRenderHead, a as addAttribute, u as unescapeHTML, b as createAstro } from './astro/server_CQbmQ8IQ.mjs';
import 'kleur/colors';
import 'clsx';
import i18next from 'i18next';
import fs from 'fs';
import path from 'path';
import DOMPurify from 'isomorphic-dompurify';

function logDirectoryContents(dir, level = 0, maxDepth = 5) {
  if (level > maxDepth) return;
  
  const indent = '  '.repeat(level);
  console.log(`${indent}${dir}:`);
  
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        logDirectoryContents(itemPath, level + 1, maxDepth);
      } else {
        console.log(`${indent}  ${item}`);
      }
    }
  } catch (error) {
    console.error(`${indent}Error reading ${dir}: ${error.message}`);
  }
}

function logUsrDirectory() {
  console.log('Logging /usr directory structure:');
  logDirectoryContents('/usr', 0, 5);  // Increased max depth to 5 for more detailed exploration
  
  // Specifically check for i18n or locales directories
  const dirsToCheck = [
    '/usr/i18n',
    '/usr/locales',
    '/usr/src/i18n',
    '/usr/src/locales',
    '/usr/app/i18n',
    '/usr/app/locales'
  ];

  dirsToCheck.forEach(dir => {
    console.log(`\nChecking specific directory: ${dir}`);
    logDirectoryContents(dir, 0, 3);
  });

  console.log('\nEnvironment Variables:');
  console.log('NETLIFY:', process.env.NETLIFY);
  console.log('CONTEXT:', process.env.CONTEXT);
  console.log('DEPLOY_PRIME_URL:', process.env.DEPLOY_PRIME_URL);
  console.log('LAMBDA_TASK_ROOT:', process.env.LAMBDA_TASK_ROOT);
}

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

async function initI18n() {
  logUsrDirectory();

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
