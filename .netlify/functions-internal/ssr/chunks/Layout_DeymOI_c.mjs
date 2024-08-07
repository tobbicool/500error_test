import { c as createComponent, r as renderTemplate, a as addAttribute, e as renderHead, f as renderSlot, b as createAstro } from './astro/server_CQbmQ8IQ.mjs';
import 'kleur/colors';
import 'clsx';
import { s as setupI18n, i as initI18n } from './Trans_BgIvjd2L.mjs';

const $$Astro = createAstro();
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  Astro2.props;
  const lang = setupI18n(Astro2.url.pathname);
  const i18n = await initI18n();
  i18n.changeLanguage(lang);
  return renderTemplate`<html${addAttribute(lang, "lang")}> <head><title>Plants</title>${renderHead()}</head> <body> <main> ${renderSlot($$result, $$slots["default"])} </main> </body></html>`;
}, "C:/Users/Tobias Norheim/OneDrive/Koding/deploy testing/github-g4pecm/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
