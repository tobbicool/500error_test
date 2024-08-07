import { c as createComponent, r as renderTemplate, a as addAttribute, e as renderHead, f as renderSlot, b as createAstro, d as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_CQbmQ8IQ.mjs';
import 'kleur/colors';
import 'clsx';
import { s as setupI18n, i as initI18n, $ as $$Trans } from '../chunks/Trans_BdFylph3.mjs';
/* empty css                                 */
import fs from 'fs';
import path from 'path';
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro();
const $$MainLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$MainLayout;
  Astro2.props;
  const lang = setupI18n(Astro2.url.pathname);
  const i18n = await initI18n();
  i18n.changeLanguage(lang);
  return renderTemplate`<html${addAttribute(lang, "lang")}> <head><!--
        Author: Tobias Norheim
        Note: Snarveien
        Revision: v0.16.11.8
        Date: 03.08.2024
        Time: 23:08
        "For God so loved the world,
        that he gave his only Son, that
        whoever believes in him should
        not perish but have eternal life."
        - John 3:16
    --><link rel="preload" href="/media/logo.svg" as="image"><title>Bible Characters</title><!-- meta tags --><!-- <HeadComponent /> --><!-- To display amount of characters in infographics -->${renderHead()}</head> <body> <!-- <Navbar /> --> <main> ${renderSlot($$result, $$slots["default"])} </main> <!-- <FooterComponent /> --> <!-- <CookieConsentModal /> --> </body></html>`;
}, "C:/Users/Tobias Norheim/OneDrive/Koding/deploy testing/github-g4pecm/src/layouts/MainLayout.astro", void 0);

////// Count amount of characters (persons) in the js and use the number on the front page

function countCharacters() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'locales', 'en', 'char-info.json');
    // console.log('Attempting to read file from:', filePath);
    
    if (!fs.existsSync(filePath)) {
      console.error('File does not exist:', filePath);
      return 0;
    }

    const data = fs.readFileSync(filePath, 'utf-8');
    // console.log('File contents:', data.substring(0, 100) + '...'); // Log the first 100 characters

    const json = JSON.parse(data);
    const count = Object.keys(json.characters).length;
    // console.log('Character count:', count);
    
    return count;
  } catch (error) {
    console.error('Error in countCharacters:', error);
    return 0;
  }
}

const CHARACTER_COUNT = countCharacters();
// console.log('Exported CHARACTER_COUNT:', CHARACTER_COUNT);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const i18n = await initI18n();
  const lang = setupI18n(Astro2.url.pathname);
  function getLocalizedPath(key) {
    const basePath = i18n.t(key);
    const normalizedBasePath = basePath.startsWith("/") ? basePath.slice(1) : basePath;
    return `/${lang === "en" ? "" : lang + "/"}${normalizedBasePath}`;
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$MainLayout, { "title": i18n.t("title", { ns: "home" }) }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", '<section class="home-hero fadeInDown"> <div class="home-hero__top"> <!-- <InfiniteSlider /> --> </div> <div class="home-hero__bottom"> <header class="fadeInDown fade2"> <h1>', "</h1> <p>", '</p> <!-- <SearchBar enableStyleChange={false} /> --> </header> <a href="#" class="arrow-down" id="scroll-down-arrow"> <img src="/media/icons/arrow.svg" alt="Scroll"> </a> <div id="hero-cta" class="home-hero__cta"> <div class="home-hero__card fadeInDown fade4"> <img src="/media/icons/fam-tree-icon.svg" alt=""> <a class="btn"', "> ", ' </a> </div> <div class="home-hero__card fadeInDown fade5"> <img src="/media/icons/char-list-icon.svg" alt=""> <a class="btn"', "> ", ' </a> </div> </div> </div> </section> <section id="about" class="about info-section"> <img class="fade-in-left" src="/media/home/explore-characters.svg" alt="home:altAboutImg"> <div class="info-section__text fade-in-left"> <h2>A New Way to Explore the Characters of the Bible</h2> <p>\nDoes it take a lot of effort reading the Bible? Bible Characters\n                will give you all the information about the characters in the\n                Bible into short, easy to read summaries. You can even have the\n                texts read aloud.\n</p> <a href="/about" class="btn">Read more</a> <!-- TODO: Make link translatable --> </div> </section> <section id="infographics" class="info-section infographics"> <div class="infographics__content"> <p class="starter-text pop-in">Amount of characters...</p> <div class="circle-content pop-in"> <div class="circle circle-1">', `</div> <!-- Counts the amount of characters in the char-info.json (en) --> <p>... to explore</p> </div> <div class="circle-content pop-in"> <div class="circle circle-2"> <span id="node-count-display"></span> <!-- js to get the number is at the bottom  --> </div> <p>... in family tree</p> </div> <div id="overall-progress" class="circle-content pop-in"> <div id="overall-progress-circle" class="circle circle-3"> <div id="overall-progress-text"></div> </div> <p>Your current progress</p> </div> </div> </section> <section id="beliefs" class="beliefs info-section"> <div class="beliefs__text"> <h2 class="fade-in-left">A Life Worth Living</h2> <p class="fade-in-left">
There is no denying we are all going to pass away some day. Some
                people choose not to think about it, <strong>we embrace it</strong>.
</p> <p class="fade-in-left">
Jesus, when he lived here 2000 years ago, did incredible things.
                He healed people, showed <strong>love, compassion and grace</strong>, he stunned the Pharisees with his teachings, but most
                importantly he made us a promise:
<br> <br> <strong>We shall not perish</strong> if we choose to believe in him.
                He took our sin with him on the cross, and it was buried for eternity
                as he rose from the dead on the third day. This is <strong>God's gift to us</strong>.
</p> <p class="fade-in-left">
As Christians we let this affect our daily life. We don't have
                to worry about what is going to happen to us when we pass away.
                The gift we have received has made us want to show love and
<strong>share the gospel</strong> with others. Essentially, that
                is what has inspired us to make this website.
</p> <p class="fade-in-left">
Hopefully Bible Characters can inspire you to read this
                fantastic book called <strong>the Bible</strong>.
</p> </div> </section>    <script lang="js">
        async function countNodes() {
            try {
                // familyTree is loaded in the head in MainLayout
                while (!window.familyTree) {
                    await new Promise((resolve) => setTimeout(resolve, 100));
                }

                const root = d3.hierarchy(window.familyTree);
                const nodeCount = root.descendants().length;

                document.getElementById("node-count-display").innerText =
                    nodeCount;
            } catch (error) {
                console.error("Error processing family tree data:", error);
                document.getElementById("node-count-display").innerText =
                    "Error";
            }
        }

        document.addEventListener("DOMContentLoaded", () => {
            countNodes();
        });

        ///// Scroll when clicking arrow
        document.addEventListener("DOMContentLoaded", () => {
            const scrollDownArrow =
                document.getElementById("scroll-down-arrow");

            if (scrollDownArrow) {
                scrollDownArrow.addEventListener("click", (e) => {
                    e.preventDefault();

                    const halfViewportHeight = window.innerHeight * 0.5; // This is equivalent to 50svh

                    window.scrollTo({
                        top: halfViewportHeight,
                        behavior: "smooth",
                    });
                });
            }
        });

        ////// Move CTA outside .home-hero when 1300px or less
        document.addEventListener("DOMContentLoaded", function () {
            const homeHero = document.querySelector(".home-hero");
            const cta = document.getElementById("hero-cta");
            const homeHeroBottom = document.querySelector(".home-hero__bottom");

            function moveCTA() {
                if (window.innerWidth <= 1300) {
                    if (cta.parentNode !== homeHero.nextElementSibling) {
                        homeHero.after(cta);
                    }
                } else {
                    if (cta.parentNode !== homeHeroBottom) {
                        homeHeroBottom.appendChild(cta);
                    }
                }
            }

            // Initial call
            moveCTA();

            // Store the initial width
            let previousWidth = window.innerWidth;

            // Call on window resize, but only if width has changed
            window.addEventListener("resize", function () {
                if (window.innerWidth !== previousWidth) {
                    moveCTA();
                    previousWidth = window.innerWidth;
                }
            });
        });
    <\/script>   `])), maybeRenderHead(), renderComponent($$result2, "Trans", $$Trans, { "key": "common:heroHeader" }), renderComponent($$result2, "Trans", $$Trans, { "key": "common:heroDescription" }), addAttribute(getLocalizedPath("links:url-family-tree"), "href"), renderComponent($$result2, "Trans", $$Trans, { "key": "home:familyTreeButton" }), addAttribute(getLocalizedPath("links:url-characters"), "href"), renderComponent($$result2, "Trans", $$Trans, { "key": "home:characterListButton" }), CHARACTER_COUNT) })}`;
}, "C:/Users/Tobias Norheim/OneDrive/Koding/deploy testing/github-g4pecm/src/pages/index.astro", void 0);

const $$file = "C:/Users/Tobias Norheim/OneDrive/Koding/deploy testing/github-g4pecm/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
