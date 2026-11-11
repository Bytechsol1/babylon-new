import { lazy, Suspense } from 'react';
import { company } from '../content.js';
import { aboutContent } from '../aboutContent.js';
import { Link } from '../router.jsx';
import { editorialImages } from '../editorialImages.js';
import '../about.css';

const aboutHeroImage = editorialImages['about-hero'];
// Vite replaces DEV at build time. Production never imports the review module,
// even when someone requests /about?review=1. Do not replace this with a URL-only gate.
const AboutReview = import.meta.env.DEV ? lazy(() => import('../review/AboutReview.jsx')) : null;

function Label({ number, children }) {
  return <div className="section-label"><span>{children}</span><i aria-hidden="true" /><span>SAN JOSE · SINCE 2016</span></div>;
}

export default function AboutPage() {
  const showReview = AboutReview && new URLSearchParams(window.location.search).get('review') === '1';
  return <div className="about-page">
    <section className="about-intro content-width" aria-labelledby="about-page-title">
      <Label number="06">ABOUT BABYLON</Label>
      <div className="about-hero-grid">
        <div className="about-hero-copy">
          <header className="about-hero-heading"><h1 id="about-page-title">{aboutContent.title}</h1><p>Cosmetics manufacturing in San Jose, California.</p></header>
          <div className="about-hero-story">
            <dl className="about-company-facts"><div><dt>FOUNDED</dt><dd>{company.founded}</dd></div></dl>
            <section className="about-story-copy" aria-labelledby="our-story-heading"><h2 className="kicker" id="our-story-heading">OUR STORY</h2><p>We were founded in {company.founded}<br className="about-story-break" /> in San Jose, California.</p></section>
          </div>
          <section className="about-hero-mission" aria-labelledby="our-mission-heading"><h2 className="kicker" id="our-mission-heading">OUR MISSION</h2><blockquote><p className="about-mission-statement">{aboutContent.missionStatement}</p></blockquote></section>
          <Link className="arrow-link about-hero-link" to="/services">Explore how we work<span aria-hidden="true">→</span></Link>
          <address className="about-hero-address"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.5" /></svg><span>{company.address}</span></address>
        </div>
        <figure className="about-hero-figure"><div className="about-hero-arch"><img src={aboutHeroImage.src} srcSet={`${aboutHeroImage.small} 600w, ${aboutHeroImage.src} 900w`} sizes="(max-width: 800px) 90vw, 42vw" alt={aboutHeroImage.alt} width="900" height="1200" fetchPriority="high" decoding="async" /></div></figure>
      </div>
    </section>

    <div className="content-width about-page-body">
      <section className="about-values" aria-labelledby="core-values-heading">
        <Label number="03">PRODUCTION AND STANDARDS</Label>
        <div className="section-heading"><h2 id="core-values-heading">Factory technology<br />and traceability</h2><p>In-house systems, camera inspection<br />and robotics tested in simulation.</p></div>
        <div className="about-values-grid">{aboutContent.values.map((value, index) => <article className="about-value" key={value.id}>
          <span className="card-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <h3>{value.title}{value.abbreviation && <span className="about-value-abbreviation">{value.abbreviation}</span>}</h3>
          <p>{value.text}</p>
        </article>)}</div>
      </section>

      {showReview && <Suspense fallback={<p role="status" className="small-copy">Loading Cody’s draft review…</p>}><AboutReview /></Suspense>}
    </div>
    {/* The shared footer supplies the closing invitation and Start a project CTA. */}
  </div>;
}
