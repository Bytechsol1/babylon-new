import { approvedFAQ, getApprovedFAQ } from './content.js';

// Page-only presentation. Shared FAQ records and chatbot/API knowledge stay intact.
const shared = new Map(approvedFAQ.map(item => [item.id, {
  ...item,
  ...(item.id === 'certification-status' ? { answer: 'We hold ISO 22716 certification through 2027.' } : {}),
}]));

const categoryAnswer = {
  id: 'product-categories', category: 'Products', question: 'What product categories do you work with?',
  answer: 'We formulate, manufacture and fill cosmetics for skincare and personal-care brands.',
  status: 'approved', reviewedAt: '2026-11-10',
  source: 'Approved skincare/personal-care positioning in the supplied rewrite and existing What we make page; no specific product or packaging formats implied.',
};
const reviewAnswer = {
  id: 'sample-review', category: 'Quality', question: 'How are samples and batches reviewed?',
  answer: 'We compare samples and batches with product specifications. Checks and results form part of the production record.',
  status: 'approved', reviewedAt: '2026-11-10',
  source: 'Existing approved Quality and Capabilities method descriptions; no testing location, particular test or inclusion promise.',
};

export const publicFAQPage = getApprovedFAQ([
  shared.get('models'), shared.get('formula'), categoryAnswer, reviewAnswer,
  shared.get('certification-status'), shared.get('technology'), shared.get('location'), shared.get('founded'),
].filter(Boolean));
