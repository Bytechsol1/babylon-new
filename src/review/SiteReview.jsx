import { siteReview, proposedFormats } from './siteReview.js';
import { faq, approvedFAQ } from '../content.js';
import { Link } from '../router.jsx';
import './review.css';

export default function SiteReview({ page }) {
  const review = siteReview[page];
  if (!review) return null;
  return <aside className="site-review content-width" aria-labelledby={`review-${page}-heading`}>
    <span className="pending-label">DEVELOPMENT ONLY · CODY’S REVIEW</span>
    <h2 id={`review-${page}-heading`}>{review.title} · draft approvals</h2>
    <p className="site-review-intro">These are unconfirmed review items, separate from public copy. This panel and its draft text are excluded from production builds. No item below is approved by being listed here.</p>
    <dl className="site-review-list">{review.items.map(([title, placeholder]) => <div key={title}><dt>{title}</dt><dd><p className="placeholder">{placeholder}</p><span className="small-copy">Status: pending · Review date: not approved</span></dd></div>)}</dl>
    {page === 'products' && <div className="products-grid">{proposedFormats.map(([name, description, shape], index) => <article key={name} className="product-card"><div className={`format-study ${shape}`} aria-hidden="true"><div className="format-orbit" /><div className="format-container"><span>BABYLON<small>DRAFT FORMAT STUDY</small></span></div><span className="format-number">0{index + 1}</span></div><div className="product-card-copy"><span className="pending-label">UNCONFIRMED EXAMPLE</span><h3>{name}</h3><p>{description}</p><Link className="arrow-link" to={`/contact?product=${name}`}>Discuss this request <span aria-hidden="true">↗</span></Link></div></article>)}</div>}
    {page === 'faq' && <div className="site-review-faq"><h3>FAQ answer review</h3>{faq.map(item => <article key={item.id}><h4>{item.question}</h4>{approvedFAQ.some(entry => entry.id === item.id) ? <p>{item.answer}</p> : <p className="placeholder">[Cody to confirm answer]</p>}<p className="small-copy">Review date: {item.reviewedAt || '[confirm with Cody: answer review date]'}</p></article>)}</div>}
  </aside>;
}
