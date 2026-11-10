import { faq } from '../content.js';
import { publicFAQPage } from '../faqPageContent.js';
import './review.css';

// This module is loaded only by the DEV-gated FAQ review view.
const pending = [
  ...faq.filter(item => item.status !== 'approved').map(item => ({ id: item.id, question: item.question, reason: item.source })),
  { id: 'packaging-sourcing', question: 'Do you source packaging, or do I supply it?', reason: 'Packaging sourcing responsibilities and supported packaging formats require confirmation.' },
  { id: 'inci-label-review', question: 'Do you check INCI lists and labels?', reason: 'The approved broad regulatory-support offering does not confirm these specific deliverables.' },
  { id: 'amazon-3pl-shipping', question: 'Can you ship to Amazon or my 3PL?', reason: 'Fulfillment is broadly approved; these shipping destinations and service arrangements are not confirmed.' },
  { id: 'mocra-support', question: 'Do you help with MoCRA registration and product listing?', reason: 'Specific MoCRA support, responsibilities and deliverables require confirmation.' },
];

export default function FAQPageReview() {
  return <aside className="site-review content-width" aria-labelledby="faq-page-review-heading">
    <span className="pending-label">DEVELOPMENT ONLY · FAQ REVIEW</span>
    <h2 id="faq-page-review-heading">FAQ · content review</h2>
    <p className="site-review-intro">Review metadata and unanswered questions are excluded from production. No pending item is approved by appearing here. The chatbot knowledge source and API are unchanged.</p>
    <div className="site-review-faq"><h3>Published, source-backed answers</h3>{publicFAQPage.map(item => <article key={item.id}><h4>{item.question}</h4><p>{item.answer}</p><p className="small-copy">Source: {item.source} Reviewed: {item.reviewedAt}.</p></article>)}</div>
    <div className="site-review-faq"><h3>Questions awaiting confirmation</h3>{pending.map(item => <article key={item.id}><h4>{item.question}</h4><p className="pending-label">Awaiting confirmation · not public</p><p>{item.reason}</p></article>)}</div>
  </aside>;
}
