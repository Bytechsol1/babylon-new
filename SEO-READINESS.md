# Babylon design and SEO readiness

## Scope

This pass preserves the cream/navy/gold palette, local Manrope font, logo,
navbar arrangement, existing page layouts and mobile breakpoints. Body copy is
18px on desktop and 17px on mobile; section labels are at least 12px. Display
headlines, the mission quote and founding year keep their larger sizes.

Decorative navbar pictograms, page counters, repeated footer wording and adjacent
duplicate project invitations are removed. Internal navigation uses right arrows;
no new external website links were introduced. Existing functional form/chat
icons and the brand logo remain. The Home film keeps one always-visible story
instead of repetitive scroll-dependent chapters, with its poster and reduced-motion
fallback. Chemistry and film visuals remain supported.

Services uses a semantic comparison table with row/column headers, while retaining
the approved three-column appearance and stacking models on mobile. The Process
timeline and visible Quality table remain. No new business claims are added.

Protected-file checks verify that form fields/behavior, chatbot, APIs, server code,
email/environment settings, schemas and approved shared facts are unchanged.

## Every page's metadata

Titles/descriptions are in both initial built HTML and client navigation.
Their single source is `src/seo.js`.

| Existing route | Title | Meta description |
| --- | --- | --- |
| / | Cosmetics, engineered. \| Babylon | We formulate, manufacture and fill skincare and personal-care products for brands. Based in San Jose, California, since 2016. |
| /services | OEM, ODM & Co-development Services \| Babylon | Compare OEM, ODM and co-development: what you bring, our formulation and manufacturing work, and your project approval steps. |
| /capabilities | Formulation & Manufacturing Capabilities \| Babylon | Explore formulation, colloid and emulsion science, materials selection, process engineering, scale-up and quality control methods. |
| /products | What We Make: Skincare & Personal Care \| Babylon | We formulate, manufacture and fill cosmetics for skincare and personal-care brands, starting from an existing formula or a product brief. |
| /quality | Quality Checks & Lot Traceability \| Babylon | Read about cosmetics GMP certification, QC specification review, production records and lot traceability. Testing scope is project-specific. |
| /process | From Inquiry to Production & Shipping \| Babylon | Follow six project stages, from inquiry and a product brief to samples, a pilot batch, production and shipping, with customer review checkpoints. |
| /about | About Babylon: Cosmetics Manufacturing in San Jose | Founded in 2016 in San Jose, California, we work in cosmetic formulation, manufacturing and filling, with in-house production technology. |
| /faq | Cosmetics Manufacturing FAQ \| Babylon | Answers about OEM, ODM, co-development, existing formulas, product categories, quality review, certification and our San Jose company. |
| /contact | Start a Cosmetics Project \| Contact Babylon | Share your product, texture, packaging, quantity, target markets and launch date. Contact us at info@babylonllc.com in San Jose, California. |

## Domain, sitemap and robots status

**Final custom domain pending from Babylon.** The owner selected “Final custom
domain bataunga”; the earlier Vercel review URL is not assumed to be canonical.

Until the domain is supplied, public SEO `siteOrigin` is null. Builds deliberately
emit no canonical links or sitemap, set pages to `noindex, follow` and generate
a preview `robots.txt` that blocks crawling. This does not alter the deployed site.

Once the exact HTTPS origin is confirmed, set only public `siteOrigin` in
`src/seo.js` and rebuild. The build automatically emits nine self-canonicals,
`sitemap.xml` containing exactly those public routes, and robots allowing public
crawling while excluding `/api/`. No private/review routes, queries, hashes,
duplicate `.html` URLs, 404 or nonexistent `/what-we-make` route are included.
The What we make page retains `/products`.

This public SEO setting is separate from backend `SITE_ORIGIN`. Do not copy,
modify or expose backend environment settings to configure SEO.

## Initial HTML and URL handling

`npm run build` runs Vite, then compiles the existing React components with Vite
SSR and prerenders them with React's server renderer. No runtime dependency,
API route or deployment browser is added. Effects do not execute at build time;
network calls during static rendering are blocked. Existing client interactivity
and APIs continue after load.

Output includes `index.html`, eight route HTML files and a noindex `404.html`.
Vercel configuration now uses `cleanUrls: true`, `trailingSlash: false` and a
permanent `/index.html` and `/index` → `/` redirects. The old catch-all homepage rewrite is
removed so each page receives its own HTML and unknown paths can return 404.
Existing functions and assets retain their routes. Local tests exercise these
rules; actual production HTTP behavior still needs an authorized deployment check.

## Verification

- `npm test`: existing 35 backend/form/FAQ fixture tests.
- `npm run build`, `npm run test:seo`, `npm run test:publication`: initial HTML,
  unique metadata, built assets, domain gating, redirects, and exclusion of draft
  review material and server-only code from public output.
- `npm run test:browser`: development routes at 1440/820/390/320px, comparisons,
  timeline, testing information, navigation and existing motion.
- `npm run test:sitewide-browser`: built pages with JavaScript disabled at
  1440/390/320px; readable body/labels, visible headings, overflow, menu/focus,
  client metadata, reduced motion, production draft exclusion and local URL rules.
  Requires Chromium/Edge on debug port 9237. Its isolated static fixture server
  never sends email or calls CRM/chat providers.
- `npm run test:contact-browser` and `npm run test:faq-browser`: existing isolated
  interaction fixtures, separate from real service verification.
- `npm run check:contact`: read-only audit. Currently blocked by the six missing
  local settings listed in DEMAND-PLAN.md. No real email was sent or received.

This is targeted responsive, keyboard and readability/contrast QA, not independent
WCAG certification. Real inbox delivery, production sender status, CRM, Search
Console, privacy/consent and conversion tracking remain unverified. See
[DEMAND-PLAN.md](DEMAND-PLAN.md). No Ads or production deployment was performed.

Local result: build passed; 35 existing tests, six SEO tests and three publication
tests passed. Development and built/no-JavaScript browser checks, semantic table
accessibility, sampled 4.5:1 text contrast, keyboard/focus, reduced motion and the
existing contact/chatbot interaction fixtures passed. The contact configuration
audit remains incomplete because six required local settings are missing; fixture
success is not real inbox or CRM delivery.

## Changed files in this pass

- `src/App.jsx`, `src/main.jsx`, `src/seo.js`, `src/readability.css`
- `src/components/Header.jsx`, `Hero.jsx`, `OriginalHero.jsx`, `ProcessStrip.jsx`,
  `PartnershipModels.jsx`, `SitePages.jsx`, `AboutPage.jsx`, `CapabilitiesPage.jsx`,
  `ProductsPage.jsx`, `QualityPage.jsx`, `ProcessPage.jsx`, `ServicesComparison.jsx`
- `src/components/ServicesComparison.module.css`, `CapabilitiesSections.module.css`,
  `QualityTable.module.css`
- `scripts/prerender.mjs`, `scripts/render-site.jsx`
- `tests/browser.mjs`, `publication.test.mjs`, `seo.test.mjs`,
  `sitewide-browser.mjs`, `staticPreview.mjs`
- `package.json`, `vercel.json`, `README.md`, `DEMAND-PLAN.md`, `SEO-READINESS.md`
