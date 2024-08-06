import { c as createComponent, r as renderTemplate, a as addAttribute, d as renderHead, e as renderSlot, b as createAstro, f as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_BT9xpBHY.mjs';
import 'kleur/colors';
import 'clsx';
import { s as setupI18n, i as initI18n, $ as $$Trans } from '../chunks/Trans_CfystUqx.mjs';
export { renderers } from '../renderers.mjs';

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
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const i18n = await initI18n();
  setupI18n(Astro2.url.pathname);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": i18n.t("title", { ns: "home" }) }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="home-hero fadeInDown"> <div class="home-hero__top"></div> <div class="home-hero__bottom"> <header class="fadeInDown fade2"> <h1>${renderComponent($$result2, "Trans", $$Trans, { "key": "common:heroHeader" })}</h1> <h1>Hey</h1> <p>${renderComponent($$result2, "Trans", $$Trans, { "key": "common:heroDescription" })}</p> </header> </div> </section> ` })}`;
}, "C:/Users/Tobias Norheim/OneDrive/Koding/deploy testing/github-g4pecm/src/pages/no/index.astro", void 0);

const $$file = "C:/Users/Tobias Norheim/OneDrive/Koding/deploy testing/github-g4pecm/src/pages/no/index.astro";
const $$url = "/no";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
