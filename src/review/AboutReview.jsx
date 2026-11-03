import { aboutReviewItems } from './aboutReview.js';

export default function AboutReview() {
  return <aside className="about-review" aria-labelledby="about-review-heading">
    <span className="pending-label">DRAFT REVIEW · NOT PUBLIC CONTENT</span>
    <h2 id="about-review-heading">Cody’s About page review</h2>
    <p>This review panel is available in local development only. It is excluded from production builds, including when the review URL is requested. All items below remain pending; the public wording does not approve the original claims.</p>
    <dl>{aboutReviewItems.map(item => <div key={item.id}><dt>{item.title}<span>Approval pending</span></dt><dd><p className="placeholder">{item.placeholder}</p><p>{item.detail}</p><span className="small-copy">Review date: not yet approved</span></dd></div>)}</dl>
  </aside>;
}
