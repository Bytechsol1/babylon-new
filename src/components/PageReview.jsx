import { lazy, Suspense } from 'react';

// Build-time gate: production cannot import review material, including via ?review=1.
const SiteReview = import.meta.env.DEV ? lazy(() => import('../review/SiteReview.jsx')) : null;
const AboutReview = import.meta.env.DEV ? lazy(() => import('../review/AboutReview.jsx')) : null;
export default function PageReview({ page }) {
  if (!SiteReview || new URLSearchParams(window.location.search).get('review') !== '1') return null;
  return <Suspense fallback={<p className="content-width small-copy" role="status">Loading draft review…</p>}>{page === 'about' ? <AboutReview /> : <SiteReview page={page} />}</Suspense>;
}
