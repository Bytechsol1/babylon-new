// Sources: client brief; https://babylonllc.com/about; https://babylonllc.com/contact-us.
// The public general-inquiry address does not automatically enable form delivery.
export const company = { founded: 2016, address: '2221 Oakland Rd, San Jose, CA 95131', email: 'info@babylonllc.com' };

// Reviewed website evidence is separate from approval to offer legacy services.
// See CONTENT-AUDIT.md for retained, revised, excluded, and pending claims.
export const manufacturingSupport = [
  { title: 'Bulk manufacturing', text: 'Discuss production of the bulk formula and agree on the handoff to your next manufacturing stage.', scope: 'batch quantities and bulk handoff arrangements' },
  { title: 'Filling & assembly', text: 'Discuss filling supplied bulk into the agreed packaging, assembly requirements, and preparation for shipment.', scope: 'filling formats, packaging requirements, and assembly scope' },
  { title: 'Concept to finished product', text: 'Discuss the formulation and manufacturing stages needed to turn your product brief into an approved finished product.', scope: 'included development, manufacturing, and documentation responsibilities' },
];

// Edit or disable in one place after checking the current certificate.
// Automatically hide after confirmed expiry, or after 2027 if only the year is known.
// Never display a third-party certification mark without written permission.
export const certification = { enabled: true, standard: 'ISO 22716', heldThroughYear: 2027, confirmedExpiry: null, scope: null };
export function certificationVisible(today = new Date()) {
  if (!certification.enabled) return false;
  if (certification.confirmedExpiry) return today.getTime() < new Date(`${certification.confirmedExpiry}T00:00:00Z`).getTime();
  return today.getUTCFullYear() <= certification.heldThroughYear;
}
export const navigation = [['/', 'Home'], ['/services', 'Services'], ['/capabilities', 'Capabilities'], ['/products', 'Products'], ['/quality', 'Quality'], ['/process', 'Process'], ['/about', 'About'], ['/faq', 'FAQ'], ['/contact', 'Contact']];
export const services = [
  { id: 'oem', name: 'OEM', label: 'Your formula. Our manufacturing.', description: 'Bring an existing formula and a clear product specification. The starting point is a review of what it will take to transfer it into production.', provides: 'Your formula, product specifications, packaging requirements, and the markets you want to enter.', does: 'Reviews the transfer requirements, prepares samples for approval, and plans the agreed testing and production process.', steps: ['Review the formula and specifications', 'Agree on transfer and testing requirements', 'Approve samples and the pilot plan', 'Approve production and shipment'] },
  { id: 'odm', name: 'ODM', label: 'Your brief. A formula to build on.', description: 'Start with the product you want to create. Discuss a development route with Babylon instead of arriving with a finished formula.', provides: 'A product brief: intended use, desired texture, performance goals, packaging ideas, and target markets.', does: 'Reviews the brief, proposes a formulation direction, develops samples, and defines the next steps toward production.', steps: ['Define the product brief', 'Review the formulation direction', 'Evaluate samples and testing', 'Agree on pilot and production requirements'] },
  { id: 'co-development', name: 'Co-development', label: 'A shared brief. A shared process.', description: 'Work through a new concept or an existing formula together, with clear responsibilities and approval points.', provides: 'Your concept or starting formula, technical input, product goals, and feedback on development samples.', does: 'Works through formulation, materials, and process questions with you, then agrees on a path to testing and scale-up.', steps: ['Set shared goals and responsibilities', 'Develop and review samples together', 'Agree on testing and changes', 'Approve the scale-up and production plan'] },
];
export const capabilities = [
  { title: 'Formulation', text: 'Turn a product brief into a formula direction. Define the desired feel, application, performance goals, and constraints before evaluating samples.', question: 'What should the product do, and how should it feel?' },
  { title: 'Colloid & emulsion science', text: 'Explore how ingredients disperse and how oil and water phases work together. Evaluate texture and physical stability as part of development.', question: 'How do the different parts of the formula behave together?' },
  { title: 'Materials selection', text: 'Review raw materials and packaging against the brief. Consider their function, compatibility, supply requirements, and target-market needs.', question: 'Which materials fit the formula and its intended use?' },
  { title: 'Process engineering', text: 'Define a repeatable manufacturing approach, with checkpoints for material handling, mixing, filling, and documentation as applicable.', question: 'How can an approved sample become a repeatable process?' },
  { title: 'Scale-up', text: 'Evaluate the move from a development sample to a pilot and production batch. Review product characteristics and agree on acceptance criteria.', question: 'What needs to be checked when the batch gets larger?' },
  { title: 'Quality control', text: 'Compare samples and batches with agreed specifications. Document checks, review results, and define release requirements for the project.', question: 'How will we know the product meets the agreed standard?' },
];
export const journey = [
  { title: 'Inquiry', text: 'Tell us about your brand, product idea, formula status, and preferred way of working.', output: 'An initial project overview', approval: 'Confirm the fit and what information is needed.' },
  { title: 'Brief', text: 'Work through the intended use, texture, packaging, markets, and commercial goals. Agree on responsibilities before development begins.', output: 'An agreed product brief', approval: 'Approve the brief and project scope.' },
  { title: 'Formulate or transfer formula', text: 'Develop a formulation direction, or review how an existing formula can be transferred. Keep proprietary details in the appropriate private project documents.', output: 'A development or transfer plan', approval: 'Agree on the formula direction and evaluation criteria.' },
  { title: 'Samples and testing', text: 'Review samples and provide consolidated feedback. Agree on the necessary quality, stability, packaging compatibility, and microbiological evaluations.', output: 'Samples, feedback, and a testing plan', approval: 'Approve the sample and review the required results.' },
  { title: 'Pilot and production', text: 'Review pilot requirements, approved specifications, packaging, and batch documentation before authorizing production.', output: 'An approved production specification and batch records', approval: 'Give written approval before the agreed production stage.' },
  { title: 'Ship and support', text: 'Confirm shipping arrangements and the agreed release documents. For reorders, review the specification, materials, and any requested changes.', output: 'Shipment and agreed project documents', approval: 'Confirm delivery requirements and the reorder process.' },
];
export const qualityChecks = [
  ['QC testing', 'Checks compare a sample or batch against agreed specifications. The relevant appearance, physical, and microbiological checks must be defined for each project.'],
  ['Stability testing', 'Evaluates how a product changes under defined storage conditions over time. The protocol, acceptance criteria, and shelf-life decision need project-specific review.'],
  ['Compatibility testing', 'Evaluates the formula together with its intended packaging, including possible changes to the product, container, or dispensing performance.'],
  ['Challenge testing', 'Evaluates how a preservative system performs against a defined microbial challenge where applicable. The method and testing provider must be agreed.'],
  ['Batch records', 'Document the materials, manufacturing activities, checks, and approvals associated with a batch. Agree on the records and release documents your project needs.'],
  ['Lot traceability', 'Links material and finished-product lot identifiers with the associated batch documentation, so relevant records can be located for review.'],
];
// The sole future chatbot knowledge source. Drafts are never returned as answers.
export const faq = [
  { id: 'models', category: 'Working together', question: 'What is the difference between OEM, ODM, and co-development?', answer: '', status: 'pending', reviewedAt: null, source: 'Services copy requires Cody’s FAQ approval.' },
  { id: 'formats', category: 'Products', question: 'Which product formats can Babylon manufacture?', answer: '', status: 'pending', reviewedAt: null, source: 'Product-format list requires confirmation.' },
  { id: 'moq', category: 'Planning', question: 'What is the minimum order quantity?', answer: '', status: 'pending', reviewedAt: null, source: 'No approved MOQ supplied.' },
  { id: 'timing', category: 'Planning', question: 'How long does development and production take?', answer: '', status: 'pending', reviewedAt: null, source: 'No approved lead times supplied.' },
  { id: 'formula', category: 'Working together', question: 'Can I bring an existing formula?', answer: '', status: 'pending', reviewedAt: null, source: 'Formula transfer requirements require approval.' },
  { id: 'quality', category: 'Quality', question: 'Which quality tests and documents are included?', answer: '', status: 'pending', reviewedAt: null, source: 'Testing scope, providers, and documents require confirmation.' },
  { id: 'certification', category: 'Quality', question: 'What is the scope and expiry of the ISO 22716 certification?', answer: '', status: 'pending', reviewedAt: null, source: 'Brief confirms held through 2027; exact expiry and scope not supplied.' },
  { id: 'reorders', category: 'Planning', question: 'How do reorders work?', answer: '', status: 'pending', reviewedAt: null, source: 'Reorder policy requires approval.' },
  { id: 'ownership', category: 'Working together', question: 'How are formula ownership and confidentiality handled?', answer: '', status: 'pending', reviewedAt: null, source: 'Commercial terms and confidentiality policy require approval.' },
];
export function getApprovedFAQ(entries = faq) {
  return entries.filter(item => {
    if (item.status !== 'approved' || !item.answer?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(item.reviewedAt || '')) return false;
    const reviewed = new Date(`${item.reviewedAt}T00:00:00Z`);
    return Number.isFinite(reviewed.getTime()) && reviewed.toISOString().slice(0, 10) === item.reviewedAt;
  });
}
export const approvedFAQ = getApprovedFAQ();
