import { lazy, Suspense } from 'react';
import { company } from '../content.js';
import { aboutContent } from '../aboutContent.js';
import { Link } from '../router.jsx';
import '../about.css';

// Vite replaces DEV at build time. Production never imports the review module,
// even when someone requests /about?review=1. Do not replace this with a URL-only gate.
const AboutReview = import.meta.env.DEV ? lazy(() => import('../review/AboutReview.jsx')) : null;

function Label({ number, children }) {
  return <div className="section-label"><span>{number} / {children}</span><i aria-hidden="true" /><span>YOUR VISION. OUR ELEMENT.</span></div>;
}

export default function AboutPage() {
  const showReview = AboutReview && new URLSearchParams(window.location.search).get('review') === '1';
  return <div className="about-page">
    <section className="page-intro content-width" aria-labelledby="about-page-title">
      <Label number="06">ABOUT BABYLON</Label>
      <div className="page-intro-grid">
        <h1 id="about-page-title">{aboutContent.title}</h1>
        <div className="page-intro-copy"><p>Cosmetic manufacturing.<br />A place to begin your next idea.</p><p>Established {company.founded} · San Jose, California</p></div>
      </div>
    </section>

    <div className="content-width about-page-body">
      <section aria-labelledby="our-story-heading">
        <div className="about-story">
          <figure><img src="/frames/frame_00000.jpg" alt="Illustrative cosmetic composition with amber bottles and cream jars" width="1280" height="720" loading="lazy" decoding="async" /><figcaption>CONCEPT IMAGERY · NOT A FACILITY PHOTOGRAPH</figcaption></figure>
          <div className="about-story-copy"><span className="kicker">01 / OUR BEGINNINGS</span><h2 id="our-story-heading">Our Story</h2><p>{aboutContent.story}</p><Link className="arrow-link" to="/services">Explore how we work <span aria-hidden="true">↗</span></Link></div>
        </div>
        <dl className="company-facts about-company-facts"><div><dt>FOUNDED</dt><dd>{company.founded}</dd></div><div><dt>FIND BABYLON</dt><dd><address>{company.address}</address></dd></div></dl>
      </section>

      <section className="about-mission" aria-labelledby="our-mission-heading">
        <div><span className="kicker">02 / OUR PURPOSE</span><h2 id="our-mission-heading">Our Mission</h2></div>
        <div><p className="about-mission-statement">{aboutContent.missionStatement}</p><p className="about-mission-copy">{aboutContent.mission}</p></div>
      </section>

      <section className="about-values" aria-labelledby="core-values-heading">
        <Label number="03">WHAT GUIDES THE CONVERSATION</Label>
        <div className="section-heading"><h2 id="core-values-heading">Core Values</h2><p>Considered ideas.<br />Clear questions. A shared brief.</p></div>
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
