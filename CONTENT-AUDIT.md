# Babylon content audit

> Current rewrite: the user-supplied November copy/design brief supersedes the earlier layout and animation notes below. The active pages now use visible comparisons, method/test tables, a timeline and six approved-fact FAQ answers. Generated facility visuals, orbit/film sections and repeated slogans are not rendered. Contact form/API/environment remain unchanged. See [REWRITE-IMPLEMENTATION.md](REWRITE-IMPLEMENTATION.md) for the current source decisions and verification.


Reviewed against the supplied client brief and public website on **2 November 2026**. The client brief takes precedence where legacy website claims need fresh approval. This audit records content decisions; it does not approve draft FAQ answers or activate production delivery.

## Sources

- [Current home page](https://babylonllc.com/): formulation-led introduction, brand messaging, and a repeated turnkey-process overview.
- [About](https://babylonllc.com/about): the 2016 founding date and legacy brand positioning.
- [Manufacturing](https://babylonllc.com/manufacturing): contract manufacturing, bulk production, filling/assembly, development support, and legacy testing/operational claims.
- [Contact](https://babylonllc.com/contact-us): the San Jose address and public general-inquiry email.
- Supplied client brief: the nine-page structure, OEM/ODM/co-development, six methods, customer journey, ISO 22716 held through 2027, approval requirements, and form/chatbot requirements.

The public site is reference material. A legacy claim appearing there does not replace the client’s instruction to seek current confirmation. No customer or proprietary content was collected.

## Retained

| Content | Source | Treatment |
| --- | --- | --- |
| Cosmetic formulation and manufacturing | Home; Manufacturing | Plain introduction, now made explicit in the home headline and introductory copy. |
| Founded 2016 | About; client brief | Shared company data used by About and the footer. |
| 2221 Oakland Rd, San Jose, CA 95131 | Contact; client brief | Shared company data used consistently. |
| info@babylonllc.com | Contact; explicit user instruction 2026-11-07 | Public contact address and authorized server-side contact-form recipient. No mailto-based form submission. |
| Bulk, filling/assembly, and concept-to-product support | Manufacturing | Concise explanations on Services, with the project scope explicitly awaiting confirmation. |
| Co-development | Manufacturing; client brief | Rewritten around customer input, Babylon’s role, and project steps. |
| ISO 22716 held through 2027 | Client brief | Text-only display; exact scope/expiry remain unconfirmed. |

## Revised

- Replaced broad beauty messaging with a clear cosmetic formulation and contract-manufacturing introduction. The existing visual identity, logo, Manrope font, cream/navy/gold palette, reference-style navbar, About-first order, imagery, and scroll-driven science animation are retained.
- Separated OEM, ODM, and co-development from the practical manufacturing stages. These models and stages are related project choices, not interchangeable service names.
- Replaced repeated legacy process descriptions with distinct stages from inquiry through shipment, written as a proposed journey with explicit approval checkpoints.
- Explained the six requested methods without customer formulas, ingredient percentages, or proprietary process settings.
- Explained QC, stability, compatibility, preservative challenge testing, batch records, and lot traceability as topics whose project-specific inclusion and implementation require agreement.
- Replaced certainty/perfection wording with evaluation language; no guaranteed outcome, technical health claim, or pricing promise is added.
- Standardized draft details to `[confirm with Cody: …]`. FAQ answers remain `[Cody to confirm answer]`, each with a separate review-date field.
- Preserved the working animation and compressed its three full-composition image layers from about 4.38 MB to 295 KB, without changing the scroll behavior or masks.

## Excluded from the published offering

- Brand design, marketing, and fulfillment: current availability needs Cody’s confirmation; they are not included in the main Services offering.
- OBM: not confirmed in the brief.
- Legacy quantities, capacity, line count, rush scheduling, and development/production durations: not published as current facts or commitments.
- Legacy low-MOQ, speed, affordability, superiority, and industry-transformation claims: not carried into the new copy.
- Legacy testing fees, automatic inclusion, particular protocols, provider accreditations, or regulatory compliance assertions: no project commitment is made without confirmation.
- The legacy clean/ethical/effective positioning: not a verified technical or health claim. In the revised About page it is confined to the development-only approval review; see the update below.
- Testimonials, customer names/logos, awards, and case studies: none are used.
- Intertek and other third-party marks: none are displayed. No FDA certification claim is made.
- General office hours, extra phone/support channels, and walk-in promises: not copied into this focused inquiry experience.

## Current operational status

All nine routes are implemented. The contact form has the requested fields and a configurable Vercel backend with validation, honeypot checks, Turnstile verification, durable IP/session limits, and Resend acceptance checks. The authorized recipient is info@babylonllc.com. Missing credentials disable sending with an explicit setup-pending state; local brief download is separate. Provider acceptance is not a claim of inbox delivery. Mock tests send no email.

No approved FAQ answers were supplied. The FAQ is a reviewable draft, and the assistant stays visibly non-live. Its knowledge gate requires an approved, non-empty answer and a valid calendar review date. The guarded server FAQ endpoint is separate from the prototype UI.

Every visible placeholder and the remaining production setup items are listed in [CODY-REVIEW.md](CODY-REVIEW.md). Setup and verification instructions are in [README.md](README.md).

## About-page update — 3 November 2026

The user supplied a focused About-page brief. Only About content and its review structure were revised; the reference navbar, About-first order, home animation, other pages, and shared footer remain intact.

- **Added/rebuilt:** the exact About Babylon title, Our Story, Our Mission, and a balanced Core Values section, reusing the existing concept image and shared company facts. The shared footer supplies the simple Start a project closing invitation.
- **Retained:** founding in 2016, cosmetic manufacturing, a modest interest in innovation, and the fixed address.
- **Revised:** the mission into neutral brand-support wording; Safety into a discussion of project requirements; GMP into a generic manufacturing/documentation framework. These revisions do not approve the original safety, standards, or product-outcome claims.
- **Omitted publicly:** leadership/superiority language, clean/ethical/effective and health/well-being claims, rigorous-testing assurances, strict GMP or particular certification claims, pricing promises, and low-MOQ/fast-lead-time promises. The pricing and lead-time values remain review-only items. No About certificate badge or third-party mark is displayed.
- **Removed from About:** the unrelated facility/team/equipment/capacity placeholder section. No invented replacement figures were added.
- **Separated:** seven pending approval records live in a development-only module, available at `/about?review=1` locally. The public `/about` page contains neutral wording, not draft placeholders. Production excludes the review module and ignores the review query.

The [existing About page](https://babylonllc.com/about) and the user’s provided copy were used as source material; legacy website assertions were not treated as new approvals. The public and draft versions were checked in a browser at desktop, tablet, and mobile widths, and the production bundle was checked for excluded review claims. See [CODY-REVIEW.md](CODY-REVIEW.md) for the seven remaining approval topics.
## Site-wide publication update — 3 November 2026

The latest client brief extends the About-page draft/public separation to the entire nine-page site. This section supersedes earlier descriptions of visible public placeholders.

- **Retained:** the existing React/Vite framework, local Manrope font, cream/navy/gold theme, reference-style About-first navbar, logo, supported company facts and public contact email, OEM/ODM/co-development explanations, six methods, customer journey, and guarded inquiry backend. Both restored home animations remain intact: the full-width four-chapter film and the science droplet. Their components, engines, and protected styles were hash-checked unchanged during this update.
- **Revised:** public Services and Process now use neutral scope/planning language. Public Quality describes the six requested topics as methods to discuss rather than automatically included Babylon services. The ISO 22716 year comes from the brief; scope and exact expiry render only when confirmed values exist. Expired/disabled certification is omitted rather than replaced by an update placeholder.
- **Separated:** all literal confirmation placeholders, legacy-claim approvals, proposed product formats, and pending FAQ answers/dates now live in build-time development-only review modules. Every local page supports `?review=1`; production query parameters cannot enable those modules.
- **Products:** proposed creams, lotions, serums, and cleansers are now draft-review examples only. Until approved format records exist, public Products helps visitors prepare an intended-use, texture/application, packaging, and market brief. Its packaging silhouette is explicitly illustrative. Customer-selected inquiry options do not assert a manufacturing capability.
- **FAQ:** public questions, filters, and contact links remain. Only approved, dated records can supply answers; pending answers are absent, not silently replaced by invented copy. The non-live prototype label and human contact remain clear.
- **Omitted:** unapproved turnkey Brand Design/Marketing/Fulfillment and OBM offerings, legacy quantitative operating claims, affordability/low-MOQ/speed promises, specific GMP or health-result assertions, unpermitted marks, and customer material. These remain approval items where relevant, never verified public claims.

The existing website’s [Home](https://babylonllc.com/), [About](https://babylonllc.com/about), [Manufacturing](https://babylonllc.com/manufacturing), and [Contact](https://babylonllc.com/contact-us) pages were reviewed as references. Their repeated process copy and unsupported or approval-dependent claims were not copied as current commitments. The latest brief remains controlling.

Validation covered all nine public routes at four widths; all nine built review-query bypass attempts on desktop and mobile; every development review view; absence of draft placeholders and review modules from built assets; form/FAQ interactions; API/security and approval-date checks; contrast; and forward/reverse scrolling for both home animations. Review content and operational dependencies are enumerated in [CODY-REVIEW.md](CODY-REVIEW.md).
