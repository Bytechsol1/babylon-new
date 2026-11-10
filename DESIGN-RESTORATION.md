# Approved design restoration

Reference: git commit `4afdd96`, the last approved design before the copy rewrite. The restoration uses its existing components and CSS, fitting approved copy into that structure. No new visual concept, font, dependency, production deployment or email test was introduced.

## Restored

- Original compact logo/icon navbar, gold line icons, active states, menu and project CTA; About stays first. The approved copy label "What we make" remains at `/products`.
- Cream, navy and gold styling, Manrope, original spacing, borders, shapes, buttons and footer invitation/columns. All approved CSS files are byte-for-byte unchanged from the task-start reference.
- Home circular image/orbit, original partnership selector, chemistry scroll animation, cinematic frame sequence, quality preview and compact journey.
- Services image/selector/detail panel and three original manufacturing cards.
- Capabilities six-image selector, methods note and Quality CTA.
- Products panoramic hero and three asymmetric image studies.
- Quality original image hero, certification panel, image-switching testing accordion and records section.
- Process original six-stage image stepper; old and rewritten stage hash links resolve to the appropriate steps.
- About original story/image, company facts, mission and value cards; FAQ original topic filters and accordions.

Existing illustrative imagery is identified as illustration/concept imagery. It does not establish actual factory, staff, customers, equipment or production specifications.

## Copy and protected behavior

Preserved the approved founding year/address, broad services, skincare/personal-care positioning, technology facts, exact mission, three work models, six process stages and six source-backed FAQ answers. ISO 22716 retains only the confirmed through-2027 fact and the existing visibility guard. Unknown issuer, scope, exact expiry, marks, formats, fill-only service, commercial terms, testing inclusions/locations, shipment documents, ownership and NDA details remain pending or omitted. Draft review modules remain development-only.

The unavailable chatbot remains hidden; no backend readiness or email-delivery claim was added. The contact form component, inquiry schema, every API/server file, email documentation/configuration, environment files, hosting/Vite/package settings and all six FAQ records were hashed before and after: unchanged. Existing uncommitted contact/email work was preserved, not reset. Only the surrounding Contact page presentation uses the original layout and approved copy.

Removed the rejected visual files `src/components/EditorialPages.jsx` and `src/editorial.css`. Kept `src/editorialContent.js` as copy data.

## Verification

- `npm test`: 35 passing tests.
- `npm run build`: passes; original stylesheet bundle remains `index-DPxnJc0f.css`.
- `npm run test:publication`: 3 passing checks for draft content, review modules and server-only code/secrets.
- `npm run test:browser`: nine routes at 1440, 820, 390 and 320px; no horizontal overflow, broken loaded images or runtime errors. Original image selectors, quality image switching, process tabs, approved copy, route/prefill behavior, mobile Escape/focus and hidden unavailable assistant verified.
- An isolated local runtime of `4afdd96` was compared with the restored site at 1440 and 390px. Typography, colors, border/radius, padding and gaps match across Home, Services, Capabilities, Products, Quality, Process and About. Reference/restored screenshots were visually reviewed; different text wrapping from approved copy is expected.
- Both original scroll sequences scrub forward and reverse. Reduced-motion behavior passes.
- Task-start protected-file hash check passes, including CSS, FAQ, form, APIs, email and environment/configuration files.

To repeat the optional style comparison, serve a separate local checkout of `4afdd96` without secrets/API middleware and set `DESIGN_REFERENCE_URL` to its URL before `npm run test:browser`. Normal browser tests do not require a reference server. Browser screenshots and task-local snapshots are ignored under `.sites/`.

## Files adjusted in this restoration

- Components: `src/components/Header.jsx`, `OriginalHero.jsx`, `Hero.jsx`, `ProcessStrip.jsx`, `SitePages.jsx`, `PartnershipModels.jsx`, `CapabilitiesPage.jsx`, `ProductsPage.jsx`, `QualityPage.jsx`, `ProcessPage.jsx`, `AboutPage.jsx`.
- Content: `src/content.js`, `src/aboutContent.js`, `src/productContent.js`.
- Entry: `src/main.jsx` (original stylesheet imports restored).
- QA/docs: `tests/browser.mjs`, `README.md`, `REWRITE-IMPLEMENTATION.md`, `DESIGN-RESTORATION.md`.
- Removed rejected visual additions: `src/components/EditorialPages.jsx`, `src/editorial.css`.

Other working-tree changes existed before this restoration. No commit, push or production deployment was performed.
