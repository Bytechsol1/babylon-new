// Public facts approved in the supplied Babylon website rewrite. Candidate
// formats, quantities, timelines, ownership terms and test locations are excluded.
export const factoryTechnology = [
  { name: 'Manufacturing execution system', short: 'MES', text: 'Our manufacturing execution system provides lot traceability across production.' },
  { name: 'Camera inspection', short: 'Inspection', text: 'Cameras inspect product on the production line.' },
  { name: 'Robotics and digital twins', short: 'Robotics', text: 'We test robotic cells in simulation before they run in production.' },
  { name: 'Production data', short: 'Data', text: 'We use machine learning on our production data.' },
];
export const workModels = [
  { id: 'oem', name: 'Contract manufacturing', code: 'OEM', startingPoint: 'You have a formula.', summary: 'We manufacture from your existing formula and product specification.', brings: 'A finished formula, product specification and packaging requirements.', work: 'Formula transfer, sample preparation and manufacturing planning.', ownership: 'Ownership terms awaiting confirmation.', approval: 'Bench sample, test requirements and pilot batch.' },
  { id: 'odm', name: 'Custom formulation', code: 'ODM', startingPoint: 'You have a brief.', summary: 'We develop a formulation from your product brief.', brings: 'Intended use, target feel, product goals, target cost and packaging ideas.', work: 'Formulation development and samples for your review.', ownership: 'Ownership terms awaiting confirmation.', approval: 'Development sample, test requirements and pilot batch.' },
  { id: 'co-development', name: 'Co-development', code: 'Co-development', startingPoint: 'You have a starting point.', summary: 'We work with you on a concept or a formula in progress.', brings: 'A concept or starting formula, technical input and sample feedback.', work: 'Shared formulation, materials and process development.', ownership: 'Ownership terms awaiting confirmation.', approval: 'Development rounds, test requirements and pilot batch.' },
];
export const manufacturingScope = [
  { title: 'Formulation and R&D', text: 'Product briefs, formulation development and sample evaluation.' },
  { title: 'GMP production', text: 'Cosmetic manufacturing and filling under ISO 22716.' },
  { title: 'Regulatory support', text: 'Regulatory support is part of our offering. Specific deliverables are awaiting confirmation.' },
  { title: 'Fulfillment', text: 'Fulfillment is part of our offering. Shipping arrangements and service scope are awaiting confirmation.' },
];
export const labMethods = [
  { id: 'formulation', title: 'Formulation', text: 'Product development starts with intended use, target feel and product requirements. A bench sample gives you a formula to evaluate.' },
  { id: 'emulsion-science', title: 'Colloid & emulsion science', text: 'The way ingredients disperse and oil and water phases interact affects texture and physical stability.' },
  { id: 'materials-selection', title: 'Materials selection', text: 'Raw materials and packaging are reviewed for their function in the product, compatibility and supply requirements.' },
  { id: 'process-engineering', title: 'Process engineering', text: 'Manufacturing methods connect material handling, mixing, filling and documentation. Public descriptions cover methods, not proprietary settings.' },
  { id: 'scale-up', title: 'Scale-up', text: 'A pilot batch tests the move from a bench sample to production equipment. Product characteristics and acceptance criteria provide the reference.' },
  { id: 'quality-control', title: 'Quality control', text: 'Samples and batches are compared with product specifications. Checks and results form part of the production record.' },
];
export const testingTopics = [
  { name: 'Release QC', purpose: 'Compares a sample or batch with its product specification.' },
  { name: 'Microbial limits', purpose: 'Measures microbial levels against specified limits.' },
  { name: 'Stability', purpose: 'Assesses changes in a product under defined storage conditions over time.' },
  { name: 'Freeze-thaw', purpose: 'Assesses physical changes during cycles of freezing and thawing.' },
  { name: 'Packaging compatibility', purpose: 'Assesses how the formula and its intended packaging affect one another.' },
  { name: 'Preservative challenge', purpose: 'Evaluates a preservative system against a defined microbial challenge.' },
];
export const processStages = [
  { id: 'inquiry', title: 'Inquiry', text: 'Send an initial brief with the product idea, quantity estimate, packaging and target market.', checkpoint: 'Your initial project brief.' },
  { id: 'brief', title: 'Brief', text: 'The product specification, development work, testing requirements and commercial scope take shape in the brief.', checkpoint: 'Review the brief and project scope.' },
  { id: 'formulate-or-transfer', legacyId: 'formula', title: 'Formulate or transfer', text: 'We develop a formula from your brief or prepare an existing formula for manufacturing. Bench samples are the reference for your review.', checkpoint: 'Review and approve the sample.' },
  { id: 'samples-and-testing', legacyId: 'samples-testing', title: 'Samples and testing', text: 'Samples are evaluated against the product requirements. The test plan identifies the methods and results needed for the project.', checkpoint: 'Review the sample and required test results.' },
  { id: 'pilot-batch', legacyId: 'pilot-production', title: 'Pilot batch', text: 'A pilot run evaluates the move to production equipment and the intended packaging.', checkpoint: 'Review and approve the pilot units.' },
  { id: 'production-and-shipping', legacyId: 'ship-support', title: 'Production and shipping', text: 'Production follows the approved specification. Shipping arrangements and release documents are set out for the project.', checkpoint: 'Authorize production against the approved specification.' },
];
