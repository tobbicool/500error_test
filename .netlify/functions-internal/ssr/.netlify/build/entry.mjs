import { renderers } from './renderers.mjs';
import { manifest } from './manifest_TPQRx52A.mjs';
import * as serverEntrypointModule from '@astrojs/netlify/ssr-function.js';
import { onRequest } from './_noop-middleware.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/translations/_lang_/_ns_.astro.mjs');
const _page2 = () => import('./pages/no/planter.astro.mjs');
const _page3 = () => import('./pages/no.astro.mjs');
const _page4 = () => import('./pages/plants.astro.mjs');
const _page5 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/translations/[lang]/[ns].js", _page1],
    ["src/pages/no/planter/index.astro", _page2],
    ["src/pages/no/index.astro", _page3],
    ["src/pages/plants/index.astro", _page4],
    ["src/pages/index.astro", _page5]
]);
const serverIslandMap = new Map();

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: onRequest
});
const _args = {
    "middlewareSecret": "a29bc3ac-f296-4e37-aa0a-e09aa71e5e00"
};
const _exports = serverEntrypointModule.createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
