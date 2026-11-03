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

The production output is `dist/`. Browser QA uses an already running Chromium-compatible browser with a local debugging port; run `BROWSER_DEBUG_PORT=9237 npm run test:browser` (set the variable using your shell’s syntax). It checks all nine routes at 1440, 820, 390, and 320 pixels, navigation, form validation, downloads, FAQ filters, service tabs, and assistant handoff. Browser QA uses mock form details and creates artifacts under the ignored `.sites/` directory.

## Routes and content

Home `/`, Services `/services`, Capabilities `/capabilities`, Products `/products`, Quality `/quality`, Process `/process`, About `/about`, FAQ `/faq`, Contact `/contact`.

`src/content.js` is the source of company facts, service descriptions, methods, process steps, certification settings, and FAQ records. Confirmed company facts come from the supplied brief: founded 2016, 2221 Oakland Rd, San Jose, CA 95131, ISO 22716 held through 2027. Unconfirmed details are stored in development-only review modules and excluded from public copy and production builds. The public website has also been reviewed for source-backed manufacturing and contact messaging. Review [CONTENT-AUDIT.md](CONTENT-AUDIT.md) for retained, revised, and excluded material, and [CODY-REVIEW.md](CODY-REVIEW.md) for every approval item before launch.

`src/components/SitePages.jsx` contains the page layouts. `src/components/ProjectForm.jsx` contains the inquiry flow. `src/site.css` extends the existing theme. Original artwork remains in `src/assets/`; the hero and all three layers of the restored scroll-driven chemistry animation use compressed WebP derivatives. The chemistry animation falls, absorbs, and reverses with scrolling; reduced-motion users see its static starting state. Home also includes the restored full-width film after the science section, using the original 240-frame footage, four scroll chapters, and reverse scrubbing. It starts loading only near the viewport and caches a limited number of frames. Three.js is not loaded. Hero contains that film; legacy ManufacturingSection and ClosingSections exports point to the current components; fabricated testimonials and unsupported figures have been removed.

The small History API router in `src/router.jsx` supports real URLs, native links, modifier clicks, browser history, route titles, and focus management. `vercel.json` routes page requests to the app while preserving `/api`, assets, and files. Other static hosts must serve `index.html` for page paths.

## Inquiry form and production setup

Without configuration, the inquiry form is visibly **LOCAL PREVIEW · DOWNLOAD ONLY**. It validates the required fields, downloads a project brief, and explicitly says nothing has been sent. It does not persist or transmit the entered details. Quantity options are planning ranges, not accepted order sizes or MOQs.

Production submissions use Vercel Functions in `api/`. Configure every value in `.env.example` through Vercel’s environment settings or an untracked `.env.local` for local development. The Vite dev server also serves the handlers. Restart after changing environment values. No new runtime dependencies are needed.

- `SITE_ORIGIN`: exact production origin, such as `https://your-confirmed-domain.example`, with no path.
- `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`: keys for a Turnstile widget authorized for the deployment hostname. Use managed/non-interactive mode; the client uses `appearance: interaction-only`. Security scripts load only after the visitor selects **Prepare secure submission**.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`: shared Redis credentials. Atomic Lua counters enforce three attempts per IP and session per 15 minutes, across serverless instances. IP and session keys use HMAC hashes and expire.
- `RATE_LIMIT_SECRET`: a private random secret for the HMAC hashes.
- `RESEND_API_KEY`, `INQUIRY_FROM`, `INQUIRY_TO`: delivery credentials, a verified sender, and Cody’s confirmed recipient. The visitor’s email is the reply-to. No email is sent during tests.

`/api/config` exposes only the form mode and public site key. The client enables submission only when the server reports that all required settings exist. The server rejects unsupported methods, foreign origins, oversized requests, invalid field values, honeypot entries, missing tokens, wrong challenge hostnames/actions, and excessive attempts. Missing configuration, failed security checks, unavailable Redis, and delivery failures all fail closed. Success is displayed only after the delivery provider acknowledges the inquiry. Existing visitor details stay in the form if submission fails. Production provider connectivity and real token/delivery acceptance must be verified with configured credentials before launch.

Server secrets must never use the `VITE_` prefix. Deploy to Vercel with the repository root as the project root, using `npm ci`, `npm run build`, and `dist/`. Static-only hosting serves the preview form; it cannot run the server handlers.

Implementation references: [Turnstile client rendering](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/), [server-side token validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/), and [Upstash Redis REST API](https://upstash.com/docs/redis/features/restapi).

## FAQ assistant

All nine FAQ records are pending: no FAQ answer has been approved. Their `answer` is empty and `reviewedAt` is null. The public FAQ shows the question structure and human-contact links; it publishes answers and review dates only for approved records. Pending answer/date placeholders are development-review content only.

The icon-only launcher in `src/components/FAQAssistant.jsx` now connects to `api/faq.js`. On opening, `GET /api/faq` checks approved content, server configuration, and actual Redis connectivity. It reports `prototype`, `unavailable`, or `ready`; a successful Redis health check is cached for 30 seconds. The UI shows **Approved FAQ** only when the server is ready, otherwise a clear prototype or unavailable state. The current local endpoint reports `prototype`, with zero approved answers and missing backend configuration.

When ready, the UI sends questions to `POST /api/faq`. Matching happens on the server only, against the same approved FAQ records used by the FAQ page. Case, whitespace, terminal punctuation, and typographic quote/dash differences are normalized. Exact matches need no model call. When server-only `OPENAI_API_KEY` is configured, `server/faqOpenAI.js` uses the OpenAI Responses API (`gpt-4.1-mini`) for paraphrases and translated questions. A strict structured response can select only one approved FAQ ID or null. The server returns the selected record's verbatim answer, ID and review date; model-written answers never reach the UI. No other website pages or external knowledge are retrieved. Ambiguous exact matches and explicit mismatched IDs bypass AI and hand off. Unknown questions offer Contact or `info@babylonllc.com`. Suggested questions also come only from approved records. The handoff links prefill the existing inquiry form or email composer with the visitor's question.

The endpoint enforces the exact configured origin, JSON/body limits, 1–500 character questions, valid session IDs, and an atomic Redis limit of **12 questions per IP and per session per hour**, including unknown questions. Redis receives HMAC-hashed counter keys only; the application does not log questions or chat history on the server. If AI matching is enabled, only the current question and approved FAQ records go to OpenAI; no session ID, IP or chat history is sent. Requests use `store: false`; that does not override provider retention policies. The ready UI discloses this processing and asks visitors to avoid confidential information. Provider errors, refusals, timeouts, incomplete output and invalid IDs fail closed with human handoff. Conversation history stays in component memory and clears on reload. A random session ID is stored in `sessionStorage`; no conversation is stored there. The UI handles loading, empty or oversized input, unknown questions, timeout/network errors, and HTTP 429 cooldowns. It prevents simultaneous duplicate submissions and provides human handoff in every unanswered/error state.

To activate the real FAQ service:

1. Obtain Cody-approved wording for each question and answer in `src/content.js`; set `status: 'approved'`, a non-empty `answer`, a real `reviewedAt: 'YYYY-MM-DD'`, and supporting `source`. Questions must fit the 500-character limit. All nine existing records are still pending; none were silently approved.
2. Configure `SITE_ORIGIN` (the exact HTTPS origin, or localhost for development), `UPSTASH_REDIS_REST_URL` (HTTPS), `UPSTASH_REDIS_REST_TOKEN`, and a private random `RATE_LIMIT_SECRET` of at least 32 bytes on the server. Use untracked `.env.local` locally or the hosting environment settings. Never prefix these secrets with `VITE_`.
3. Run the Vercel functions or an equivalent Node server; static-only hosting cannot serve the endpoint. Restart/redeploy after setting content and environment values. Verify `GET /api/faq` returns `ready`, an approved question returns its exact approved answer, unknown questions hand off, and the limit is enforced before describing the service as operational.

`OPENAI_API_KEY` is optional for exact FAQ matching, required for AI paraphrase matching, and must be set only in untracked `.env.local` or the host's server environment. It never uses a `VITE_` prefix and never enters frontend code. The supplied development key is stored locally only; replace it with a rotated key because it was shared in chat. Local origin and a cryptographically random rate-limit secret are configured, but Redis credentials and all nine approved FAQ answers are still missing. A key alone does not activate the FAQ. Set the production origin and server variables separately on the hosting platform; this change does not deploy them. Resend and Turnstile remain separate inquiry-form requirements.

Implementation follows the [official OpenAI Structured Outputs documentation](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses). `npm test` covers approval-gating, origin, validation, rate limits, verbatim answers, approved-only AI routing and provider failures using isolated fixtures. These fixtures do not activate the website. `npm run test:faq-browser` verifies the actual prototype UI plus isolated response fixtures for approved-answer, loading, fallback, error, cooldown and plain-text rendering. `npm run test:publication` checks that server credential names and handler code are absent from the frontend bundle.

## Certification lifecycle

In `src/content.js`, set `certification.enabled = false` to remove the certification display. Enter a confirmed `scope` and ISO `confirmedExpiry` date only after checking the certificate. The display automatically hides on the confirmed expiry date, or from 1 January 2028 if only the supplied “through 2027” information is available. Unconfirmed scope and exact expiry appear only in development review; the public certificate displays those fields only when confirmed values are supplied. No Intertek or other third-party certification mark is included.

## Accessibility and privacy

Pages include a skip link, landmarks, one main heading, keyboard-accessible service tabs and FAQ controls, visible focus, explicit form labels, error/status announcements, a mobile menu with Escape handling, and a pause control for the orbit. Reduced motion disables animation. Form text is 16px on narrow screens; layouts are checked down to 320px. This is an implementation and browser review, not an independent WCAG certification.

No analytics, advertising, external font requests, accessibility overlays, customer logos, or testimonial claims are included. The only third-party client script is the optional user-initiated Turnstile security check on a configured form.

## About page: public copy and Cody’s review

The About page is implemented in `src/components/AboutPage.jsx`, with neutral public content in `src/aboutContent.js` and page-scoped styles in `src/about.css`. It includes About Babylon, Our Story, Our Mission, three neutral Core Values, the shared company facts, and the existing footer project invitation. It preserves the current font, theme, logo, supplied concept imagery, and navigation.

Open `/about` for the public version. In local development only, open `/about?review=1` to review the unconfirmed original claims and exact placeholders. `src/review/AboutReview.jsx` and `src/review/aboutReview.js` are dynamically imported only under `import.meta.env.DEV`; production builds exclude the review module. A query string cannot enable the review panel in production. Do not move draft claims into `src/aboutContent.js` without the appropriate approval and evidence.

The public version makes no safety-testing guarantee, specific GMP compliance/certification claim, pricing promise, or low-MOQ/fast-lead-time promise. The two commercial values are omitted publicly and retained as draft review items. No About-page certificate badge or third-party mark is shown. The neutral wording does not approve the original clean/ethical/effective or health/well-being claims. See the About section of [CODY-REVIEW.md](CODY-REVIEW.md) for all remaining approvals.

Verified in development and production at 1440, 820, 390, and 320 pixels, including the exact page title, public text, draft-only placeholders, production query bypass protection, absence of the review claims from built JavaScript, active About link, and project CTA.
## Site-wide draft review and publication protection

All nine routes have a development-only review view: append `?review=1` to any local page URL, including `/?review=1` for Home. About uses `src/review/aboutReview.js`; the other pages use `src/review/siteReview.js`. Both modules contain pending content only. Their UI modules are guarded by the build-time `import.meta.env.DEV` flag, not merely by a query string. Production never imports them, including when a visitor requests the review query.

Public Products uses a product-brief introduction and illustrative packaging study while no format is approved. Proposed creams, lotions, serums, and cleansers remain in the Products review view. Add source-backed records to `src/productContent.js` only after Cody approves them; the public catalog selects only explicitly approved records with source, name, and description. The contact form’s product options describe the visitor’s request and do not establish verified manufacturing capabilities.

Public FAQ keeps the questions, topic filters, and contact links. Pending records do not display draft answers, approval notices, or placeholder dates publicly. Only `approvedFAQ` supplies factual answers and reviewed dates. The chatbot remains clearly marked as a non-live prototype until approved answers and a connected backend exist.

The certificate displays only its confirmed year and any supplied confirmed scope/expiry fields. It disappears when disabled or expired, rather than exposing an update placeholder. Public process and service copy explains what to discuss without committing to unconfirmed MOQs, schedules, testing scope, commercial terms, or formula ownership. Every actual draft placeholder is listed in [CODY-REVIEW.md](CODY-REVIEW.md).

After building, run `npm run test:publication` to reject draft placeholders or review modules in production assets. Browser verification also checks every built route with `?review=1`, every local review view, public product/FAQ separation, responsive behavior, and both home scroll animations. Existing API/security checks remain available with `npm test`.
