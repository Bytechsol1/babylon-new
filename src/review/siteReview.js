// Review-only copy. Never import from public page content or production handlers.
export const siteReview = {
  home: { title: 'Home', items: [
    ['Planning', '[confirm with Cody: minimum order quantities, development and production lead times]'],
  ] },
  services: { title: 'Services', items: [
    ['Development models', '[confirm with Cody: service-specific scope, customer responsibilities, and Babylon responsibilities for OEM, ODM, and co-development]'],
    ['Commercial terms', '[confirm with Cody: commercial terms and formula ownership arrangements]'],
    ['Bulk manufacturing', '[confirm with Cody: batch quantities and bulk handoff arrangements]'],
    ['Filling & assembly', '[confirm with Cody: filling formats, packaging requirements, and assembly scope]'],
    ['Concept to finished product', '[confirm with Cody: included development, manufacturing, and documentation responsibilities]'],
    ['Legacy turnkey services', '[confirm with Cody: current Brand Design, Marketing, and Fulfillment service offerings]'],
    ['Other business models', '[confirm with Cody: OBM before adding it to the service offering]'],
  ] },
  capabilities: { title: 'Capabilities', items: [
    ['Method scope', '[confirm with Cody: project-specific application of formulation, colloid and emulsion science, materials selection, process engineering, scale-up, and quality control]'],
    ['Confidentiality', '[confirm with Cody: approved public examples and confidentiality review before adding any customer-specific material]'],
  ] },
  products: { title: 'Products', items: [
    ['Proposed list', '[confirm with Cody: product formats]'],
    ['Creams', '[confirm with Cody: creams manufacturing capability]'],
    ['Lotions', '[confirm with Cody: lotions manufacturing capability]'],
    ['Serums', '[confirm with Cody: serums manufacturing capability]'],
    ['Cleansers', '[confirm with Cody: cleansers manufacturing capability]'],
    ['Other formats', '[confirm with Cody: any additional product formats before publication]'],
  ] },
  quality: { title: 'Quality', items: [
    ['Certificate scope', '[confirm with Cody: certification scope]'],
    ['Certificate expiry', '[confirm with Cody: exact certification expiry date]'],
    ['Renewal', '[confirm with Cody: current ISO 22716 certification status after expiry or before any renewal claim]'],
    ['Mark permission', '[confirm with Cody: written permission to display the Intertek mark]'],
    ['Testing', '[confirm with Cody: testing protocols, acceptance criteria, in-house versus external testing, and available release documents]'],
    ['QC', '[confirm with Cody: QC tests, specifications, and batch release requirements]'],
    ['Stability', '[confirm with Cody: stability protocol, duration, and shelf-life decision process]'],
    ['Compatibility', '[confirm with Cody: packaging compatibility protocol and acceptance criteria]'],
    ['Challenge testing', '[confirm with Cody: challenge testing method, applicability, and provider]'],
    ['Records', '[confirm with Cody: batch record availability and lot traceability process]'],
  ] },
  process: { title: 'Process', items: [
    ['Order quantities', '[confirm with Cody: minimum order quantities]'],
    ['Development', '[confirm with Cody: development lead time]'],
    ['Samples', '[confirm with Cody: sample development timeline]'],
    ['Testing', '[confirm with Cody: stability and other testing timelines]'],
    ['Production', '[confirm with Cody: production lead time]'],
    ['Shipment', '[confirm with Cody: shipping arrangements]'],
    ['Reorders', '[confirm with Cody: reorder terms and change-control process]'],
  ] },
  faq: { title: 'FAQ', items: [
    ['Answer approval', '[confirm with Cody: approved answer, supporting source, and review date for every FAQ entry]'],
    ['Assistant activation', '[confirm with Cody: production FAQ backend, human handoff, unanswered-question review workflow, retention, IP/session limits, and message-length limits]'],
  ] },
  contact: { title: 'Contact', items: [
    ['Recipient', '[confirm with Cody: project inquiry recipient and response expectations]'],
    ['Quantity options', '[confirm with Cody: first-order estimate ranges as inquiry options rather than MOQs]'],
    ['Production security', '[confirm with Cody: production hostname and Turnstile configuration]'],
    ['Rate limiting', '[confirm with Cody: shared Redis rate-limit configuration and private HMAC secret]'],
    ['Delivery', '[confirm with Cody: Resend credentials, verified sender, recipient, and genuine delivery verification]'],
  ] },
};
export const proposedFormats = [
  ['Creams', 'Discuss a richer, structured texture and its intended application.', 'jar'],
  ['Lotions', 'Discuss spreadability, skin feel, and a suitable dispensing format.', 'pump'],
  ['Serums', 'Discuss the desired texture, application, and packaging approach.', 'dropper'],
  ['Cleansers', 'Discuss the cleansing experience, format, and intended use.', 'tube'],
];
