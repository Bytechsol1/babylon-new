# Babylon

A nine-page React/Vite concept that preserves Babylon’s existing cream and navy palette, gold details, local Manrope font, rounded buttons, circular hero, supplied logo, and original imagery.

## Local development

Use Node.js 22 or later. From this repository:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4187. From the parent workspace, `npm run dev` also starts this project.

```sh
npm test
npm run build
npm run preview
```

The production output is `dist/`, with a separate prerendered HTML file for every existing public route. See [SEO-READINESS.md](SEO-READINESS.md) for metadata, canonical-domain status and URL routing; [DEMAND-PLAN.md](DEMAND-PLAN.md) records launch gates. Browser QA uses a running Chromium-compatible browser on debug port 9237. `npm run test:browser` checks all nine routes at 1440, 820, 390 and 320px, restored selectors/accordions/stepper, image switching, contact prefills, navigation breakpoints and scroll/reduced-motion behavior. Set `DESIGN_REFERENCE_URL` to a separately running checkout of approved commit `4afdd96` to also compare computed visual styles and save reference/restored screenshots under ignored `.sites/`. The separate FAQ/contact browser suites use isolated provider fixtures.

## Routes and content

Home `/`, Services `/services`, Capabilities `/capabilities`, Products `/products`, Quality `/quality`, Process `/process`, About `/about`, FAQ `/faq`, Contact `/contact`.

`src/content.js` is the source of company facts, service descriptions, methods, process steps, certification settings, and FAQ records. Confirmed company facts come from the supplied brief: founded 2016, 2221 Oakland Rd, San Jose, CA 95131, ISO 22716 held through 2027. Unconfirmed details are stored in development-only review modules and excluded from public copy and production builds. The public website has also been reviewed for source-backed manufacturing and contact messaging. Review [CONTENT-AUDIT.md](CONTENT-AUDIT.md) for retained, revised, and excluded material, and [CODY-REVIEW.md](CODY-REVIEW.md) for every approval item before launch.

The visual design is restored from approved commit `4afdd96`: `SitePages.jsx` and the original page components render the icon navbar, original cards, imagery, selectors and scroll-driven films. The same approved CSS and local font are retained. The rewrite's approved facts and copy remain in the existing components, `src/content.js`, `src/aboutContent.js`, `src/productContent.js` and the data-only `src/editorialContent.js`. The rejected `EditorialPages.jsx` and `editorial.css` layouts were removed. Illustrative images are not presented as photographs of Babylon's actual facility or staff. `ProjectForm.jsx`, its schema, APIs, backend/env and hosting settings were not changed by this restoration. See [DESIGN-RESTORATION.md](DESIGN-RESTORATION.md) for current implementation and verification; [REWRITE-IMPLEMENTATION.md](REWRITE-IMPLEMENTATION.md) retains the copy decisions.

The small History API router in `src/router.jsx` supports real URLs, native links, modifier clicks, browser history, route titles, and focus management. `vercel.json` uses clean URLs for the prerendered pages, normalizes trailing slashes and preserves the existing `/api` functions. There is no catch-all rewrite that turns unknown pages into a 200 homepage. Other hosts must serve the matching HTML files and the real 404 page.

## Inquiry form and production setup

Supabase delivery is prepared behind the existing same-origin inquiry API. See
[SUPABASE-CONTACT-SETUP.md](SUPABASE-CONTACT-SETUP.md) for current env locations,
signed proxy/Edge authentication, deployment and delivery checks. The supplied
project URL/publishable key passed a read-only API check and are stored locally
in ignored `.env.local`; the remote function is now reachable, with missing Edge
settings and real inbox delivery still pending. Resend secrets belong in Supabase Edge Function secrets. The
direct Vercel delivery described below remains the legacy mode only when both
Supabase settings are absent. Form fields/UI and the FAQ backend are unchanged.

Contact submissions use the existing **React/Vite → Vercel API → Resend** path. The approved destination is **info@babylonllc.com**; visitors cannot override it. Required fields are Name, Work Email, Brand/Company, Work Model and Product Type. Optional fields default safely on the server. Quantity options are planning ranges, not accepted order sizes or MOQs. The contact form never uses `mailto:`.

The form shows **Submit email** without a startup setup-pending banner. If configuration is not ready, a valid submit rechecks the backend and preserves entered details. Connection failures show an error and retry action after an attempt. The form handles validation, CAPTCHA failure, sending, confirmed provider acceptance and retry without clearing details on failure. Inputs and repeat submission are disabled while checking/sending; success requires the API's explicit success acknowledgment.

Production submissions use Vercel Functions in `api/`. Configure every value in `.env.example` through Vercel’s environment settings or an untracked `.env.local` for local development. The Vite dev server also serves the handlers. Restart after changing environment values. No new runtime dependencies are needed.

- `SITE_ORIGIN`: exact production origin, such as `https://your-confirmed-domain.example`, with no path.
- `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`: keys for a Turnstile widget authorized for the deployment hostname. Use managed/non-interactive mode; the client uses `appearance: interaction-only`. Security scripts load only after the visitor selects **Prepare secure submission**.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`: shared Redis credentials. Atomic Lua counters enforce three attempts per IP and session per 15 minutes, across serverless instances. IP and session keys use HMAC hashes and expire.
- `RATE_LIMIT_SECRET`: a private random secret of at least 32 bytes for HMAC hashes and private retry keys.
- `RESEND_API_KEY`: Resend sending credentials. `INQUIRY_FROM`: an address on any authorized domain already verified for sending in that account; no unverified sender default is supplied. `INQUIRY_TO`: `info@babylonllc.com`; another destination is rejected. The visitor's validated single mailbox is Reply-To. The restricted `onboarding@resend.dev` testing sender can target this recipient only if it is the Resend account's own email; it is never selected automatically. No real email is sent during fixture tests.

`/api/config` exposes only the configuration mode and public Turnstile site key. The server validates origin/Redis URLs, sender syntax, the fixed recipient and secret strength before enabling submissions. It rejects unsupported methods, foreign origins, oversized requests, invalid field values, honeypot entries, missing tokens, wrong challenge hostnames/actions, and excessive attempts. Missing configuration, failed security checks, unavailable Redis, and delivery failures all fail closed. A session/content HMAC supplies Resend's idempotency header so unchanged retries do not create duplicate emails in its retention window; no raw contact data is placed in that key. The API returns success only after Resend acknowledges an email ID; this does not establish final inbox placement. Actual credentials, security verification and mailbox delivery still need a real deployment check.

See [CONTACT-FORM-SETUP.md](CONTACT-FORM-SETUP.md) for all nine variables, DNS-free options, production setup and end-to-end verification. Local origin, private rate-limit secret and the fixed recipient are configured. Missing locally: `RESEND_API_KEY`, `INQUIRY_FROM`, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. The unverified sender assumption has been removed. Production settings and actual email delivery are unverified. `npm run check:contact` prints safe variable-name diagnostics and checks sender/Redis metadata without sending email. A sending-only key may require dashboard confirmation of the domain. `npm test` and `npm run test:contact-browser` use isolated provider/widget fixtures.

Server secrets must never use the `VITE_` prefix. Deploy to Vercel with the repository root as the project root, using `npm ci`, `npm run build`, and `dist/`. Static-only hosting serves the preview form; it cannot run the server handlers.

Implementation references: [Turnstile client rendering](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/), [server-side token validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/), and [Upstash Redis REST API](https://upstash.com/docs/redis/features/restapi).

## FAQ assistant

The rewrite publishes six FAQ answers supported by the supplied approved facts: service models, bringing an existing formula, company address, founding year, production technology and ISO 22716 certification through 2027. MOQ, formats, timings, test inclusions, exact certificate scope/expiry, reorders, ownership and NDA terms remain unresolved. Pending records are omitted from the public answer list. No candidate fact was promoted to an answer.

The assistant checks the existing `GET /api/faq` endpoint on mount. Its launcher stays hidden unless the backend reports `ready` with approved questions. A failure during an already-open chat retains error/handoff UI, then hides the unavailable launcher when closed. No prototype is presented as a live assistant. Existing API configuration and matching/security logic were not changed by this rewrite.

When ready, the UI sends questions to `POST /api/faq`. Matching happens on the server only, against the same approved FAQ records used by the FAQ page. Case, whitespace, terminal punctuation, and typographic quote/dash differences are normalized. Exact matches need no model call. When server-only `OPENAI_API_KEY` is configured, `server/faqOpenAI.js` uses the OpenAI Responses API (`gpt-4.1-mini`) for paraphrases and translated questions. A strict structured response can select only one approved FAQ ID or null. The server returns the selected record's verbatim answer, ID and review date; model-written answers never reach the UI. No other website pages or external knowledge are retrieved. Ambiguous exact matches and explicit mismatched IDs bypass AI and hand off. Unknown questions offer Contact or `info@babylonllc.com`. Suggested questions also come only from approved records. The handoff links prefill the existing inquiry form or email composer with the visitor's question.

The endpoint enforces the exact configured origin, JSON/body limits, 1–500 character questions, valid session IDs, and an atomic Redis limit of **12 questions per IP and per session per hour**, including unknown questions. Redis receives HMAC-hashed counter keys only; the application does not log questions or chat history on the server. If AI matching is enabled, only the current question and approved FAQ records go to OpenAI; no session ID, IP or chat history is sent. Requests use `store: false`; that does not override provider retention policies. The ready UI discloses this processing and asks visitors to avoid confidential information. Provider errors, refusals, timeouts, incomplete output and invalid IDs fail closed with human handoff. Conversation history stays in component memory and clears on reload. A random session ID is stored in `sessionStorage`; no conversation is stored there. The UI handles loading, empty or oversized input, unknown questions, timeout/network errors, and HTTP 429 cooldowns. It prevents simultaneous duplicate submissions and provides human handoff in every unanswered/error state.

To activate the real FAQ service:

1. Obtain Cody-approved wording for each question and answer in `src/content.js`; set `status: 'approved'`, a non-empty `answer`, a real `reviewedAt: 'YYYY-MM-DD'`, and supporting `source`. Questions must fit the 500-character limit. Only six answers supported by the supplied approved facts are currently published. Obtain approval for unresolved commercial details before adding them.
2. Configure `SITE_ORIGIN` (the exact HTTPS origin, or localhost for development), `UPSTASH_REDIS_REST_URL` (HTTPS), `UPSTASH_REDIS_REST_TOKEN`, and a private random `RATE_LIMIT_SECRET` of at least 32 bytes on the server. Use untracked `.env.local` locally or the hosting environment settings. Never prefix these secrets with `VITE_`.
3. Run the Vercel functions or an equivalent Node server; static-only hosting cannot serve the endpoint. Restart/redeploy after setting content and environment values. Verify `GET /api/faq` returns `ready`, an approved question returns its exact approved answer, unknown questions hand off, and the limit is enforced before describing the service as operational.

`OPENAI_API_KEY` is optional for exact FAQ matching, required for AI paraphrase matching, and must be set only in untracked `.env.local` or the host's server environment. It never uses a `VITE_` prefix and never enters frontend code. The supplied development key is stored locally only; replace it with a rotated key because it was shared in chat. Local origin and a cryptographically random rate-limit secret are configured, but Redis credentials and all nine approved FAQ answers are still missing. A key alone does not activate the FAQ. Set the production origin and server variables separately on the hosting platform; this change does not deploy them. Resend and Turnstile remain separate inquiry-form requirements.

Implementation follows the [official OpenAI Structured Outputs documentation](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses). `npm test` covers approval-gating, origin, validation, rate limits, verbatim answers, approved-only AI routing and provider failures using isolated fixtures. These fixtures do not activate the website. `npm run test:faq-browser` verifies the actual prototype UI plus isolated response fixtures for approved-answer, loading, fallback, error, cooldown and plain-text rendering. `npm run test:publication` checks that server credential names and handler code are absent from the frontend bundle.

## Certification lifecycle

In `src/content.js`, set `certification.enabled = false` to remove the certification display. Enter a confirmed `scope` and ISO `confirmedExpiry` date only after checking the certificate. The display automatically hides on the confirmed expiry date, or from 1 January 2028 if only the supplied “through 2027” information is available. Unconfirmed scope and exact expiry appear only in development review; the public certificate displays those fields only when confirmed values are supplied. No Intertek or other third-party certification mark is included.

## Accessibility and privacy

Pages include a skip link, landmarks, one main heading, native table semantics, visible FAQ/timeline content, keyboard focus, explicit form labels and status announcements, plus a mobile menu with Escape handling. Rewritten body copy is 17–18px and section labels are at least 12px. Content is visible without scroll/reveal triggers; reduced motion is supported. Contact-form implementation is preserved. Layouts are checked down to 320px; this is not an independent WCAG certification.

No analytics, advertising, external font requests, accessibility overlays, customer logos, or testimonial claims are included. The only third-party client script is the optional user-initiated Turnstile security check on a configured form.

## About page: public copy and Cody’s review

The About page is implemented in `src/components/AboutPage.jsx`, with neutral public content in `src/aboutContent.js` and page-scoped styles in `src/about.css`. It includes About Babylon, Our Story, Our Mission, three neutral Core Values, the shared company facts, and the existing footer project invitation. It preserves the current font, theme, logo, supplied concept imagery, and navigation.

Open `/about` for the public version. In local development only, open `/about?review=1` to review the unconfirmed original claims and exact placeholders. `src/review/AboutReview.jsx` and `src/review/aboutReview.js` are dynamically imported only under `import.meta.env.DEV`; production builds exclude the review module. A query string cannot enable the review panel in production. Do not move draft claims into `src/aboutContent.js` without the appropriate approval and evidence.

The public version makes no safety-testing guarantee, specific GMP compliance/certification claim, pricing promise, or low-MOQ/fast-lead-time promise. The two commercial values are omitted publicly and retained as draft review items. No About-page certificate badge or third-party mark is shown. The neutral wording does not approve the original clean/ethical/effective or health/well-being claims. See the About section of [CODY-REVIEW.md](CODY-REVIEW.md) for all remaining approvals.

Verified in development and production at 1440, 820, 390, and 320 pixels, including the exact page title, public text, draft-only placeholders, production query bypass protection, absence of the review claims from built JavaScript, active About link, and project CTA.
## Site-wide draft review and publication protection

All nine routes have a development-only review view: append `?review=1` to any local page URL, including `/?review=1` for Home. About uses `src/review/aboutReview.js`; the other pages use `src/review/siteReview.js`. Both modules contain pending content only. Their UI modules are guarded by the build-time `import.meta.env.DEV` flag, not merely by a query string. Production never imports them, including when a visitor requests the review query.

Public Products uses a product-brief introduction and illustrative packaging study while no format is approved. Proposed creams, lotions, serums, and cleansers remain in the Products review view. Add source-backed records to `src/productContent.js` only after Cody approves them; the public catalog selects only explicitly approved records with source, name, and description. The contact form’s product options describe the visitor’s request and do not establish verified manufacturing capabilities.

Public FAQ shows only source-backed approved answers in the original filter and accordion layout. Unresolved questions are omitted rather than guessed. The assistant launcher is hidden until both approved knowledge and the existing backend are ready.

The certificate displays only its confirmed year and any supplied confirmed scope/expiry fields. It disappears when disabled or expired, rather than exposing an update placeholder. Public process and service copy explains what to discuss without committing to unconfirmed MOQs, schedules, testing scope, commercial terms, or formula ownership. Every actual draft placeholder is listed in [CODY-REVIEW.md](CODY-REVIEW.md).

After building, run `npm run test:publication` to reject draft brackets, review modules and server secrets from production assets. `npm run test:browser` checks the restored approved layouts, responsive behavior and interactions; the FAQ and contact suites check isolated API/UI states. Backend regressions remain available with `npm test`.
