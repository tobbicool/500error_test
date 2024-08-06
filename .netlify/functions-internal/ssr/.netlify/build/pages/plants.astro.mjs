import { c as createComponent, r as renderTemplate, d as renderComponent, b as createAstro, m as maybeRenderHead } from '../chunks/astro/server_CQbmQ8IQ.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_BioXmzhf.mjs';
import { i as initI18n, s as setupI18n, $ as $$Trans } from '../chunks/Trans_DE3bQZBv.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const i18n = await initI18n();
  setupI18n(Astro2.url.pathname);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": i18n.t("title", { ns: "home" }) }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="home-hero fadeInDown"> <div class="home-hero__top"></div> <div class="home-hero__bottom"> <header class="fadeInDown fade2"> <h1>${renderComponent($$result2, "Trans", $$Trans, { "key": "common:heroHeader" })}</h1> <h1>Hey</h1> <p>${renderComponent($$result2, "Trans", $$Trans, { "key": "common:heroDescription" })}</p> </header> </div> </section> ` })}`;
}, "C:/Users/Tobias Norheim/OneDrive/Koding/deploy testing/github-g4pecm/src/pages/plants/index.astro", void 0);

const $$file = "C:/Users/Tobias Norheim/OneDrive/Koding/deploy testing/github-g4pecm/src/pages/plants/index.astro";
const $$url = "/plants";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
   __proto__: null,
   default: $$Index,
   file: $$file,
   url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
