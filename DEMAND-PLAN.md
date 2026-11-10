# Babylon demand plan — pre-launch gates

Status: local implementation and fixture checks only. No production deployment,
Google Ads launch, Search Console connection or live conversion claim is authorized
or completed by this task.

| Gate | Status | Evidence / next step |
| --- | --- | --- |
| Final public custom domain | Pending Babylon | The owner will supply the domain. Set the public `siteOrigin` in `src/seo.js` to that exact HTTPS origin, rebuild and verify ownership/routing. Do not change the inquiry backend origin as part of this design/SEO task. |
| Website pages and approved claims | Implemented locally; publication review pending | Nine existing pages, source-backed copy, explicit pending commercial details and draft-only review modules. Obtain final content approval; do not publish unconfirmed claims, formats, ownership, timings or certificate details. |
| Initial HTML and metadata | Implemented locally | Build prerenders the existing React components into nine HTML pages, with distinct titles/descriptions. No provider requests run during prerender. |
| Canonicals, robots and sitemap | Awaiting final domain | Until an origin is confirmed, builds use `noindex, follow`, blocking preview robots and no sitemap/canonical. Once set, the build emits nine self-canonicals and a sitemap containing only the existing public routes. Check the resulting URLs before publication. |
| Inquiry reaches info@babylonllc.com | Unverified — launch blocker | Existing secure API/Resend path is retained. Fixtures establish acceptance/error behavior, not real delivery. Configure the existing missing settings, confirm the sender is verified, submit a real inquiry, inspect provider acceptance and confirm the approved inbox receives every field. |
| Email/security configuration | Pending production access | Local audit lacks `RESEND_API_KEY`, `INQUIRY_FROM`, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`. Production values are unverified. See CONTACT-FORM-SETUP.md; never put secrets in this plan or frontend. |
| CRM / lead handling | Pending | No CRM connection was verified. Confirm the system, field mapping, access, duplicate handling and an actual accepted inquiry creating the expected lead. Email acceptance is not CRM delivery. |
| Follow-up owner and response process | Pending Babylon | Name an owner, backup and response/escalation process. Do not promise a response time before approval. |
| Privacy / consent | Pending review | Confirm applicable privacy disclosures, provider processing and consent requirements before introducing advertising or analytics. No policy, consent manager or tracking completion is implied. No accessibility overlay was added. |
| Conversion tracking | Not configured / unverified | No advertising or analytics tag was added. After privacy approval, configure and test a lead conversion triggered only by backend-confirmed acceptance, deduplicate it, and verify it in the intended analytics/Ads tools. Never count submit clicks, downloads, validation failures or fixture events as real leads. |
| Google Search Console | Pending final domain and owner access | Create/select the authorized property, verify ownership, inspect the deployed canonicals/indexability and submit the generated sitemap. Request indexing only after launch approval. Account access is not connected or claimed. |
| Google Ads | Not launched | All gates above must be reviewed before campaign launch. Confirm approved offers, landing pages, destination delivery, CRM routing, follow-up ownership, privacy/consent and verified conversions first. |

## Release verification sequence

1. Confirm the custom domain and set only the public SEO origin in `src/seo.js`.
2. Run `npm test`, `npm run build`, `npm run test:seo`, `npm run test:publication`
   and the local browser checks. Inspect HTML with JavaScript disabled.
3. Separately authorize publication, hosting/environment changes and real provider
   checks. This task does not perform them.
4. On the authorized deployment, verify clean URLs, trailing-slash redirects,
   genuine 404 responses, sitemap/robots/canonicals and mobile/keyboard behavior.
5. Complete the real inbox, CRM, follow-up, consent and conversion checks above.
   Keep each item pending until its actual behavior is verified.

Implementation references: [Vite prerendering](https://vite.dev/guide/ssr),
[Vercel URL configuration](https://vercel.com/docs/project-configuration),
[Google JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).
