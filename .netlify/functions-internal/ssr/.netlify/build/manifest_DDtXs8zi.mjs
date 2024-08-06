import 'cookie';
import 'kleur/colors';
import './chunks/astro/server_CQbmQ8IQ.mjs';
import 'clsx';
import 'html-escaper';
import { compile } from 'path-to-regexp';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    const path = toPath(sanitizedParams);
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware(_, next) {
      return next();
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/Tobias%20Norheim/OneDrive/Koding/deploy%20testing/github-g4pecm/","adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/translations/[lang]/[ns]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/translations\\/([^/]+?)\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"translations","dynamic":false,"spread":false}],[{"content":"lang","dynamic":true,"spread":false}],[{"content":"ns","dynamic":true,"spread":false}]],"params":["lang","ns"],"component":"src/pages/api/translations/[lang]/[ns].js","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.DSAysvKF.js"}],"styles":[],"routeData":{"route":"/no/planter","isIndex":true,"type":"page","pattern":"^\\/no\\/planter\\/?$","segments":[[{"content":"no","dynamic":false,"spread":false}],[{"content":"planter","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/no/planter/index.astro","pathname":"/no/planter","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.DSAysvKF.js"}],"styles":[],"routeData":{"route":"/no","isIndex":true,"type":"page","pattern":"^\\/no\\/?$","segments":[[{"content":"no","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/no/index.astro","pathname":"/no","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.DSAysvKF.js"}],"styles":[],"routeData":{"route":"/plants","isIndex":true,"type":"page","pattern":"^\\/plants\\/?$","segments":[[{"content":"plants","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/plants/index.astro","pathname":"/plants","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.BaIX-rAy.js"}],"styles":[{"type":"external","src":"/_astro/index.CdJAEKuG.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/Tobias Norheim/OneDrive/Koding/deploy testing/github-g4pecm/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/Tobias Norheim/OneDrive/Koding/deploy testing/github-g4pecm/src/pages/no/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/Tobias Norheim/OneDrive/Koding/deploy testing/github-g4pecm/src/pages/no/planter/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/Tobias Norheim/OneDrive/Koding/deploy testing/github-g4pecm/src/pages/plants/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/api/translations/[lang]/[ns]@_@js":"pages/api/translations/_lang_/_ns_.astro.mjs","\u0000@astro-page:src/pages/no/planter/index@_@astro":"pages/no/planter.astro.mjs","\u0000@astro-page:src/pages/no/index@_@astro":"pages/no.astro.mjs","\u0000@astro-page:src/pages/plants/index@_@astro":"pages/plants.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-manifest":"manifest_DDtXs8zi.mjs","/astro/hoisted.js?q=1":"_astro/hoisted.DSAysvKF.js","/astro/hoisted.js?q=0":"_astro/hoisted.BaIX-rAy.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/index.CdJAEKuG.css","/favicon.svg","/_astro/hoisted.BaIX-rAy.js","/_astro/hoisted.DSAysvKF.js","/_astro/Trans.astro_astro_type_script_index_0_lang.BxduubZX.js","/locales/en/char-info.json","/locales/en/common.json","/locales/en/routes.json","/locales/no/char-info.json","/locales/no/common.json","/locales/no/routes.json"],"i18n":{"strategy":"pathname-prefix-other-locales","locales":["en","no"],"defaultLocale":"en","domainLookupTable":{}},"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"experimentalEnvGetSecretEnabled":false});

export { manifest };
