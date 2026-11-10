# Babylon copy and design rewrite

> **Visual implementation superseded:** the user requested the pre-rewrite approved design. Commit `4afdd96` now supplies the original component structure, icon navbar, imagery, cards and animations; approved rewrite copy/facts remain. `EditorialPages.jsx` and `editorial.css` were removed. The layout descriptions and original verification record below describe the rejected visual pass, not the active site. See [DESIGN-RESTORATION.md](DESIGN-RESTORATION.md) for the current implementation. Fact decisions, pending approvals and protected-functionality boundaries below still apply. Current FAQ answers use the original accordion rather than displaying every answer at rest.

Implemented from the two user-supplied attachments: **Babylon website rewrite**, copy/design review dated 3 November 2026, and the accompanying implementation instructions. The latter controls scope: no contact-form functionality, backend, environment, email, deployment or domain changes.

## Pages and design

| Area | Implementation |
| --- | --- |
| Home | Keeps “Cosmetics, engineered.”; concrete formulation/manufacturing/filling introduction; four supported proof items; visible service summaries; in-house technology; quality/process previews and one closing invitation. The MOQ slot is replaced by the confirmed San Jose location. |
| Services | Side-by-side semantic comparison of OEM, ODM and co-development. A fourth fill-only column explicitly awaits confirmation. Shows inputs, work and sample/pilot checkpoints. Ownership terms stay pending; no timings, minimums or prices are invented. Scope lists formulation/R&D, GMP production, regulatory support and fulfillment without inventing detailed deliverables. |
| Capabilities | Existing `/capabilities` route retained for navigation and inbound-link continuity. Six visible editorial method rows replace the selector; no rhetorical questions. Quality and Services links connect the material without duplicating commercial promises. |
| Products | Renamed “What we make” at the existing `/products` route. Only the supported skincare/personal-care positioning is public. The candidate catalogue is not approved; a short visible status replaces fabricated product/packaging claims. |
| Quality | Confirmed ISO 22716 through-2027 statement; six visible method rows. Testing locations, standard-quote inclusions and shipped documents are not claimed. Records and traceability are explained without promising exact document contents or retrieval times. |
| Process | Six simultaneously visible stages: Inquiry, Brief, Formulate or transfer, Samples and testing, Pilot batch, Production and shipping. Sample/pilot review points are supported by the rewrite; durations and reorder commitments are withheld. |
| About | Founded 2016, fixed San Jose address, approved broad offering, exact mission line and production-technology story. No invented origin story, biographies, team counts or images. |
| FAQ | Six source-backed answers: models, bringing an existing formula, address, founding year, production technology and confirmed certification year. Unresolved commercial questions stay out of the public answer list. All published answers are visible at rest. |
| Contact copy | Only surrounding page headline and brief-writing guidance were rewritten; confidential formulas are still excluded from the initial inquiry. The actual ProjectForm module, its fields/validation, API, environment and delivery behavior were not changed. |
| Shared UI | Removes decorative nav icons, page-number/tagline labels, repeated slogans, orbit controls, film/reveal sections and duplicate footer invitations. Internal page links use →. Header active states, mobile menu, focus and real route destinations remain. Footer contains contact/company facts and useful navigation. |

The active page implementation is `src/components/EditorialPages.jsx`, with public editorial data in `src/editorialContent.js` and layout/type in `src/editorial.css`. Legacy image/animation components and assets were checked for imports and are left in source for compatibility/history; they are not imported by the rewritten pages or requested in the browser. Legacy exports still resolve. No new font or dependency was added.

## Fact decisions

Published only from the supplied brief's explicitly approved facts: F1 founding year, F2 address, the confirmed part of F3 (ISO 22716 through 2027), F4 broad offering, F7 production technology, and the exact F18 mission. The instruction also explicitly supports skincare/personal-care positioning and the three existing development models.

The technology story says only MES with lot traceability, camera inspection on the line, robotic cells tested in simulation, and machine learning on production data. It does **not** claim industry comparisons, defect detection rates, recalls completed in minutes, capacity forecasts, guaranteed lead times, measured improvements or customer results.

Still pending or omitted:

- F3: issuing body, certificate scope, exact expiry and mark permission.
- F5/F6/F9/F15: MOQ, sample/production/reorder times, batch-size range and inquiry response promise.
- F8/F12: candidate product/packaging formats, exclusions such as sticks/mascara, and fill-only availability.
- F10/F11: in-house/outside testing locations, included tests, protocols, and documents sent with a shipment.
- F13/F14: formula ownership/licensing/buyout and NDA policy. No “NDA first” or automatic client ownership promise was inferred.
- F16/F17/F19: public phone, specific regulatory deliverables, origin story and identifiable team information.

No literal fact-slot IDs or draft brackets are rendered in public copy. Explicit human-readable pending notices remain where the implementation brief permits them. Development-only review modules retain draft approval material and remain excluded from production.

## Photography

No authenticated factory/team photographs were supplied with this rewrite. Generated cosmetic/lab imagery was removed from the active page layouts rather than presented as Babylon's floor or staff. The hero's traceability diagram is a schematic, without fake customer data, lot IDs, production figures or proprietary settings. Real photographs can be added after supply and confidentiality review. No image generation was used in this pass.

## Assistant and protected functionality

The assistant requests the existing readiness endpoint on mount. Its launcher is hidden unless the backend reports ready with approved questions. A failure during an already-open chat retains its error/human-handoff UI; once closed, an unavailable launcher disappears. No prototype is exposed as a live assistant.

No API/server file, inquiry schema, contact form component, environment file/value, package setting, Vite/hosting configuration, domain setting or email delivery implementation was changed in this task. Public FAQ content is the only knowledge change; API configuration and matching/security rules are untouched. No real email was sent and no deployment was performed.

## Changed files

- New: `src/components/EditorialPages.jsx`, `src/editorialContent.js`, `src/editorial.css`, `REWRITE-IMPLEMENTATION.md`.
- Routes/shared UI: `src/components/SitePages.jsx`, `src/components/Header.jsx`, `src/components/FAQAssistant.jsx`, `src/components/PageReview.jsx`, `src/App.jsx`, `src/main.jsx`, `index.html`.
- Content/review: `src/content.js`, `src/review/siteReview.js`, `src/review/aboutReview.js`.
- Existing test updates: `tests/browser.mjs`, `tests/faq-browser.mjs`, `tests/faq.test.mjs`, `tests/inquiry.test.mjs` (FAQ assertions only).
- Documentation: `README.md`, `CONTENT-AUDIT.md`, `CODY-REVIEW.md`.

Earlier contact/email work was already uncommitted when this task began. A task-start hash snapshot and final comparison verify those protected modules/configuration are unchanged; they were not reset, committed or deployed as part of this rewrite.

## Verification

- `npm run build`.
- `npm test`: backend security and approved-knowledge regressions.
- `npm run test:browser`: nine routes at 1440/820/390/320px; 1101/1100px menu breakpoint; semantic headings, no page overflow or hidden sections, visible comparisons/methods/tests/timeline/answers, readable labels, route/form prefills, brief download, reduced motion and no fabricated-facility asset requests.
- `npm run test:faq-browser`: hidden disconnected launcher; ready-backend fixtures for keyboard, limits, loading, exact answers, unknown questions, errors, handoff and safe text rendering.
- `npm run test:contact-browser`: existing protected form regression using isolated fixtures; sends no email.
- `npm run test:publication`: no draft brackets, review modules or server secrets/API implementations in production output.

These are local/build checks, not verification of production hosting, sender verification, email delivery or live chatbot readiness.
