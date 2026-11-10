import { workModels, labMethods, processStages } from './editorialContent.js';
// Sources: client brief; https://babylonllc.com/about; https://babylonllc.com/contact-us.
// The public general-inquiry address does not automatically enable form delivery.
export const company = { founded: 2016, address: '2221 Oakland Rd, San Jose, CA 95131', email: 'info@babylonllc.com' };

// Reviewed website evidence is separate from approval to offer legacy services.
// See CONTENT-AUDIT.md for retained, revised, excluded, and pending claims.
export const manufacturingSupport = [
  { title: 'Formulation and R&D', text: 'Product briefs, formulation development and sample evaluation.', scope: 'formulation and development' },
  { title: 'GMP production', text: 'Cosmetic manufacturing and filling under ISO 22716.', scope: 'manufacturing and filling' },
  { title: 'Regulatory support & fulfillment', text: 'Regulatory support and fulfillment are part of our offering. Specific deliverables and shipping scope are awaiting confirmation.', scope: 'specific regulatory and fulfillment deliverables await confirmation' },
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
export const navigation = [['/', 'Home'], ['/services', 'Services'], ['/capabilities', 'Capabilities'], ['/products', 'What we make'], ['/quality', 'Quality'], ['/process', 'Process'], ['/about', 'About'], ['/faq', 'FAQ'], ['/contact', 'Contact']];
export const services = workModels.map(model => ({
  id: model.id, name: model.code, label: model.startingPoint, description: model.summary,
  provides: model.brings, does: model.work, ownership: model.ownership,
  steps: ['Review the product brief and scope', 'Review development or transfer samples', 'Review required tests and pilot units', 'Authorize the approved production specification'],
}));
export const capabilities = labMethods.map((method, index) => ({
  title: method.title, text: method.text,
  question: ['Intended use, target feel and product requirements.', 'Ingredient dispersion, texture and physical stability.', 'Material function, compatibility and supply requirements.', 'Material handling, mixing, filling and documentation.', 'The move from bench sample to pilot and production.', 'Product specifications, checks and results.'][index],
}));
export const journey = processStages.map((stage, index) => ({
  title: stage.title, text: stage.text, approval: stage.checkpoint,
  output: ['An initial project brief', 'A product brief and project scope', 'Bench samples for review', 'Samples and required test results', 'Pilot units for review', 'Production and shipping requirements'][index],
}));
export const qualityChecks = [
  ['QC testing', 'Compares a sample or batch with its product specification. Microbial limits assess microbial levels against specified limits.'],
  ['Stability testing', 'Assesses changes under defined storage conditions over time. Freeze-thaw methods assess physical changes during cycles of freezing and thawing.'],
  ['Compatibility testing', 'Assesses how the formula and its intended packaging affect one another.'],
  ['Challenge testing', 'Evaluates a preservative system against a defined microbial challenge.'],
  ['Batch records', 'Batch records document materials, manufacturing activities, checks and approvals. Documents supplied with a shipment are awaiting confirmation.'],
  ['Lot traceability', 'Our manufacturing execution system provides lot traceability across production.'],
];
// The sole future chatbot knowledge source. Drafts are never returned as answers.
export const faq = [
  { id: 'models', category: 'Working together', question: 'What is the difference between OEM, ODM, and co-development?', answer: 'OEM starts with your finished formula and product specification. With ODM, we develop a formulation from your brief. Co-development means working together on a concept or formula in progress.', status: 'approved', reviewedAt: '2026-11-09', source: 'Supplied Babylon website rewrite and implementation brief: supported service-model descriptions; no ownership or timing promise.' },
  { id: 'formats', category: 'Products', question: 'Which product formats can Babylon manufacture?', answer: '', status: 'pending', reviewedAt: null, source: 'Product-format list requires confirmation.' },
  { id: 'moq', category: 'Planning', question: 'What is the minimum order quantity?', answer: '', status: 'pending', reviewedAt: null, source: 'No approved MOQ supplied.' },
  { id: 'timing', category: 'Planning', question: 'How long does development and production take?', answer: '', status: 'pending', reviewedAt: null, source: 'No approved lead times supplied.' },
  { id: 'formula', category: 'Working together', question: 'Can I bring an existing formula?', answer: 'Yes. OEM starts from an existing formula and product specification. Send an initial project brief through the contact form; keep confidential formula details out of that first inquiry.', status: 'approved', reviewedAt: '2026-11-09', source: 'Supplied rewrite: OEM; existing inquiry confidentiality guidance. No NDA or ownership terms inferred.' },
  { id: 'quality', category: 'Quality', question: 'Which quality tests and documents are included?', answer: '', status: 'pending', reviewedAt: null, source: 'Testing scope, providers, and documents require confirmation.' },
  { id: 'certification', category: 'Quality', question: 'What is the scope and expiry of the ISO 22716 certification?', answer: '', status: 'pending', reviewedAt: null, source: 'Brief confirms held through 2027; exact expiry and scope not supplied.' },
  { id: 'reorders', category: 'Planning', question: 'How do reorders work?', answer: '', status: 'pending', reviewedAt: null, source: 'Reorder policy requires approval.' },
  { id: 'ownership', category: 'Working together', question: 'How are formula ownership and confidentiality handled?', answer: '', status: 'pending', reviewedAt: null, source: 'Commercial terms and confidentiality policy require approval.' },
  { id: 'location', category: 'Company', question: 'Where are you based?', answer: 'We are based at 2221 Oakland Rd, San Jose, CA 95131.', status: 'approved', reviewedAt: '2026-11-09', source: 'Approved company address in the supplied rewrite.' },
  { id: 'founded', category: 'Company', question: 'When was Babylon founded?', answer: 'We were founded in 2016.', status: 'approved', reviewedAt: '2026-11-09', source: 'Approved founding year in the supplied rewrite.' },
  { id: 'technology', category: 'Manufacturing', question: 'What production technology do you build in house?', answer: 'Our in-house technology includes a manufacturing execution system with lot traceability, camera inspection on the line, robotic cells tested in simulation, and machine learning on production data.', status: 'approved', reviewedAt: '2026-11-09', source: 'Approved in-house production technology in the supplied rewrite.' },
  { id: 'certification-status', category: 'Quality', question: 'Do you hold ISO 22716 certification?', answer: 'We hold ISO 22716 certification through 2027. The issuing body, certificate scope and exact expiry date are not published until confirmed.', status: 'approved', reviewedAt: '2026-11-09', source: 'Confirmed certification year in the supplied rewrite; unconfirmed certificate details withheld.' },
];
export function getApprovedFAQ(entries = faq) {
  return entries.filter(item => {
    if (item.status !== 'approved' || !item.answer?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(item.reviewedAt || '')) return false;
    const reviewed = new Date(`${item.reviewedAt}T00:00:00Z`);
    return Number.isFinite(reviewed.getTime()) && reviewed.toISOString().slice(0, 10) === item.reviewedAt;
  });
}
export const approvedFAQ = getApprovedFAQ();
