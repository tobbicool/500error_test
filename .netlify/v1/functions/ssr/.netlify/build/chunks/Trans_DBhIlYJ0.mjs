import { c as createComponent, r as renderTemplate, a as addAttribute, e as renderHead, f as renderSlot, b as createAstro, m as maybeRenderHead, u as unescapeHTML } from './astro/server_CO2dTrhU.mjs';
import 'kleur/colors';
import 'clsx';
import i18next from 'i18next';
import DOMPurify from 'isomorphic-dompurify';

const supportedLngs = ["en", "no"];
const defaultLng = "en";
const namespaces = ["common", "routes"];
const i18n = i18next.createInstance();
let isInitialized = false;
async function loadTranslations(lng, ns) {
  console.log(`Attempting to load translations for ${lng}/${ns}`);
  if (typeof window === "undefined") {
    console.log("Running in server-side environment");
    {
      console.log("Loading translations in production environment");
      try {
        const response = await fetch(`https://your-api-endpoint.com/translations/${lng}/${ns}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Successfully loaded translations for ${lng}/${ns} in production`);
        return data;
      } catch (error) {
        console.error(`Failed to load translations for ${lng}/${ns} in production:`, error);
        return {};
      }
    }
  } else {
    console.log("Running in client-side environment");
    try {
      const response = await fetch(`/api/translations/${lng}/${ns}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(`Successfully loaded translations for ${lng}/${ns} on client-side`);
      return data;
    } catch (error) {
      console.error(`Failed to load translations for ${lng}/${ns} on client-side:`, error);
      return {};
    }
  }
}
async function initI18n() {
  if (isInitialized) {
    console.log("i18n is already initialized");
    return i18n;
  }
  console.log("Initializing i18n");
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
    defaultNS: "common",
    resources,
    interpolation: {
      escapeValue: false
      // This allows HTML in translations
    },
    debug: true
    // Enable debug mode for more detailed logging
  });
  console.log("i18n initialization completed");
  isInitialized = true;
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

const $$Astro$1 = createAstro();
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Layout;
  Astro2.props;
  const lang = setupI18n(Astro2.url.pathname);
  const i18n = await initI18n();
  i18n.changeLanguage(lang);
  return renderTemplate`<html${addAttribute(lang, "lang")}> <head><title>Plants</title>${renderHead()}</head> <body> <main> ${renderSlot($$result, $$slots["default"])} </main> </body></html>`;
}, "C:/Users/Tobias Norheim/OneDrive/Koding/deploy testing/github-g4pecm/src/layouts/Layout.astro", void 0);

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

export { $$Layout as $, $$Trans as a, initI18n as i, setupI18n as s };
