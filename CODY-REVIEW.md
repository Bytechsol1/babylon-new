# Cody’s confirmation checklist

Updated for the client brief on **3 November 2026**. All review items remain pending. Appearance on the legacy website is evidence of earlier messaging, not new approval to publish a stronger claim.

Confirmed company facts: **founded 2016**; **2221 Oakland Rd, San Jose, CA 95131**. The brief confirms **ISO 22716 held through 2027**; scope and exact expiry are not inferred from that year. The public general email is **info@babylonllc.com**, separate from an approved automated-form recipient.

## Public and draft separation

Public page URLs contain neutral or supported copy. Each local development route accepts `?review=1` to show its separate review panel. Production builds exclude both review modules, so the query cannot reveal placeholders on a deployed build. Proposed product formats are review-only until approved; form options describe customer requests, not verified capabilities. Pending FAQ entries expose only a question and a human-contact link publicly, never a draft answer.

## Home

Local review: http://127.0.0.1:4187/?review=1

- **Planning:** [confirm with Cody: minimum order quantities, development and production lead times]

## Services

Local review: http://127.0.0.1:4187/services?review=1

- **Development models:** [confirm with Cody: service-specific scope, customer responsibilities, and Babylon responsibilities for OEM, ODM, and co-development]
- **Commercial terms:** [confirm with Cody: commercial terms and formula ownership arrangements]
- **Bulk manufacturing:** [confirm with Cody: batch quantities and bulk handoff arrangements]
- **Filling & assembly:** [confirm with Cody: filling formats, packaging requirements, and assembly scope]
- **Concept to finished product:** [confirm with Cody: included development, manufacturing, and documentation responsibilities]
- **Legacy turnkey services:** [confirm with Cody: current Brand Design, Marketing, and Fulfillment service offerings]
- **Other business models:** [confirm with Cody: OBM before adding it to the service offering]

## Capabilities

Local review: http://127.0.0.1:4187/capabilities?review=1

- **Method scope:** [confirm with Cody: project-specific application of formulation, colloid and emulsion science, materials selection, process engineering, scale-up, and quality control]
- **Confidentiality:** [confirm with Cody: approved public examples and confidentiality review before adding any customer-specific material]

## Products

Local review: http://127.0.0.1:4187/products?review=1

- **Proposed list:** [confirm with Cody: product formats]
- **Creams:** [confirm with Cody: creams manufacturing capability]
- **Lotions:** [confirm with Cody: lotions manufacturing capability]
- **Serums:** [confirm with Cody: serums manufacturing capability]
- **Cleansers:** [confirm with Cody: cleansers manufacturing capability]
- **Other formats:** [confirm with Cody: any additional product formats before publication]

## Quality

Local review: http://127.0.0.1:4187/quality?review=1

- **Certificate scope:** [confirm with Cody: certification scope]
- **Certificate expiry:** [confirm with Cody: exact certification expiry date]
- **Renewal:** [confirm with Cody: current ISO 22716 certification status after expiry or before any renewal claim]
- **Mark permission:** [confirm with Cody: written permission to display the Intertek mark]
- **Testing:** [confirm with Cody: testing protocols, acceptance criteria, in-house versus external testing, and available release documents]
- **QC:** [confirm with Cody: QC tests, specifications, and batch release requirements]
- **Stability:** [confirm with Cody: stability protocol, duration, and shelf-life decision process]
- **Compatibility:** [confirm with Cody: packaging compatibility protocol and acceptance criteria]
- **Challenge testing:** [confirm with Cody: challenge testing method, applicability, and provider]
- **Records:** [confirm with Cody: batch record availability and lot traceability process]

## Process

Local review: http://127.0.0.1:4187/process?review=1

- **Order quantities:** [confirm with Cody: minimum order quantities]
- **Development:** [confirm with Cody: development lead time]
- **Samples:** [confirm with Cody: sample development timeline]
- **Testing:** [confirm with Cody: stability and other testing timelines]
- **Production:** [confirm with Cody: production lead time]
- **Shipment:** [confirm with Cody: shipping arrangements]
- **Reorders:** [confirm with Cody: reorder terms and change-control process]

## About

Local review: http://127.0.0.1:4187/about?review=1

- **Our Story & Our Mission:** [confirm with Cody: clean, ethical, effective, and health or well-being claims]
  Approve the intended meaning and evidence for each term before any such wording is added. The public page currently uses neutral copy and omits clean-beauty positioning and health outcomes.
- **Innovation:** [confirm with Cody: any specific innovation, technology, or results claims]
  The public value describes exploring ideas only. No named technology, measured result, or industry-leadership claim is included.
- **Safety:** [confirm with Cody: safety testing and ingredient review details]
  Confirm processes, evidence, applicability, and approved wording before stating that every product undergoes rigorous testing or that ingredient selection assures safety.
- **Good Manufacturing Practices (GMP):** [confirm with Cody: applicable GMP standard and verified manufacturing practices]
  The public value describes GMP as a framework. It makes no assertion of strict GMP compliance, a particular standard, certification, or guaranteed product characteristics.
- **Certification display:** [confirm with Cody: certificate scope, exact expiry date, and Intertek mark permission]
  The brief confirms ISO 22716 is held through 2027. The About page does not show a certificate badge, exact expiry, scope, or third-party mark while those details remain unconfirmed.
- **Draft value: Affordable Prices:** [confirm with Cody: pricing claim]
  This value is omitted from the public page. Approve the actual pricing claim and its conditions before adding it.
- **Draft value: Low MOQ and Low Lead Times:** [confirm with Cody: MOQ and lead time ranges]
  This value is omitted from the public page. Confirm actual ranges, applicability, conditions, and approved wording before adding it.
- **Optional company details:** [confirm with Cody: facility size, employee count, production capacity, equipment, line count, client count, and any experience claims before publication]
  These figures are omitted from the public page. The only company facts shown are the supported 2016 founding date and the fixed San Jose address.

## FAQ

Local review: http://127.0.0.1:4187/faq?review=1

- **Answer approval:** [confirm with Cody: approved answer, supporting source, and review date for every FAQ entry]
- **Assistant activation:** the UI is connected to the server handler, with optional server-only OpenAI matching that can only select an approved FAQ record. The real service remains a prototype until approved answers and rate-limit settings are supplied. A development AI key, local origin and private rate-limit secret are configured locally; the shared key needs rotation. [confirm with Cody: approved FAQ wording and review dates, production origin, Redis configuration, production secret, and external processing disclosure]
- **Connection verification (2026-11-04):** a synthetic routing request to OpenAI returned HTTP 429. Successful provider connectivity is not verified; inspect the project's billing/quota and rate limits before retrying. No FAQ records were approved or published by this test.

Every question below needs approved wording, a supporting source, and a valid calendar review date before status can become `approved`:

1. What is the difference between OEM, ODM, and co-development?
   Answer: [Cody to confirm answer]
   Review date: [confirm with Cody: answer review date]
2. Which product formats can Babylon manufacture?
   Answer: [Cody to confirm answer]
   Review date: [confirm with Cody: answer review date]
3. What is the minimum order quantity?
   Answer: [Cody to confirm answer]
   Review date: [confirm with Cody: answer review date]
4. How long does development and production take?
   Answer: [Cody to confirm answer]
   Review date: [confirm with Cody: answer review date]
5. Can I bring an existing formula?
   Answer: [Cody to confirm answer]
   Review date: [confirm with Cody: answer review date]
6. Which quality tests and documents are included?
   Answer: [Cody to confirm answer]
   Review date: [confirm with Cody: answer review date]
7. What is the scope and expiry of the ISO 22716 certification?
   Answer: [Cody to confirm answer]
   Review date: [confirm with Cody: answer review date]
8. How do reorders work?
   Answer: [Cody to confirm answer]
   Review date: [confirm with Cody: answer review date]
9. How are formula ownership and confidentiality handled?
   Answer: [Cody to confirm answer]
   Review date: [confirm with Cody: answer review date]

## Contact

Local review: http://127.0.0.1:4187/contact?review=1

- **Recipient:** [confirm with Cody: project inquiry recipient and response expectations]
- **Quantity options:** [confirm with Cody: first-order estimate ranges as inquiry options rather than MOQs]
- **Production security:** [confirm with Cody: production hostname and Turnstile configuration]
- **Rate limiting:** [confirm with Cody: shared Redis rate-limit configuration and private HMAC secret]
- **Delivery:** [confirm with Cody: Resend credentials, verified sender, recipient, and genuine delivery verification]

## Operational publication dependencies

- Confirm the production origin, Turnstile site/secret keys, shared Redis rate-limit service, HMAC secret, Resend credentials, verified sender, and inquiry recipient using the server-only settings in `.env.example`.
- Verify a genuine challenge, acknowledged inquiry delivery, failure handling, and IP/session limits on the configured deployment. Until configured, the form clearly downloads a brief and sends nothing.
- Approve FAQ answers and dates before activating the assistant. The UI now checks and calls `/api/faq`; unknown questions offer the existing inquiry form and email. No question/history log is retained on the server. Configure `SITE_ORIGIN`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and a random `RATE_LIMIT_SECRET` of at least 32 bytes, then verify the deployed endpoint. Limits are 500 characters and 12 questions per IP/session per hour. The current local endpoint reports zero approved answers and missing backend configuration.
- No Intertek mark, customer names/logos, testimonials, awards, or case studies are included. Obtain written permission and approved source material before adding customer material or marks.
- No specific GMP compliance claim or FDA certification claim is made. Customer formulas, ingredient percentages, and proprietary process settings remain outside public copy and assistant knowledge.

For retained/revised/omitted source decisions, see [CONTENT-AUDIT.md](CONTENT-AUDIT.md). For setup, validation, and approval-data locations, see [README.md](README.md).
