import { useState } from 'react';
import { certification, certificationVisible, qualityChecks } from '../content.js';
import { Link } from '../router.jsx';
import PageReview from './PageReview.jsx';
import heroImage from '../assets/quality/quality-hero.webp';
import heroSmall from '../assets/quality/quality-hero-small.webp';
import samplesImage from '../assets/quality/sample-observation.webp';
import recordsImage from '../assets/quality/quality-records.webp';
import qcImage from '../assets/capabilities/quality-control.webp';
import compatibilityImage from '../assets/products/packaging-markets.webp';
import '../quality.css';

const number = index => String(index + 1).padStart(2, '0');
const testingImages = [
  { src: qcImage, alt: 'Illustrative quality review with gloved hands transferring a cosmetic sample into a glass dish.' },
  { src: samplesImage, alt: 'Illustrative observation study with unmarked cosmetic sample jars, a glass slide and a stainless steel spatula.' },
  { src: compatibilityImage, alt: 'Illustrative packaging study with a glass jar, dropper and pump bottle for discussing formula and packaging compatibility.' },
  { src: heroImage, alt: 'Illustrative laboratory sample handling with gloved hands observing an unmarked cosmetic sample vial.' },
];
function Label({ number: index, children, aside = 'YOUR VISION. OUR ELEMENT.' }) {
  return <div className="section-label"><span>{index} / {children}</span><i aria-hidden="true" /><span>{aside}</span></div>;
}

export default function QualityPage() {
  const showCertificate = certificationVisible();
  const [activeTest, setActiveTest] = useState(0);
  const testingImage = testingImages[activeTest];
  return <div className="qlt-page">
    <section className="qlt-hero content-width" aria-labelledby="quality-page-title">
      <Label number="04">QUALITY</Label>
      <div className="qlt-hero-grid"><div className="qlt-hero-copy"><span className="kicker">DEFINED. DOCUMENTED. REVIEWED.</span><h1 id="quality-page-title">Defined with care.<em>Checked with purpose.</em></h1><p className="qlt-hero-lead">A quality plan starts with agreed requirements.</p><p>Explore the testing and documentation topics to discuss for your product. The relevant methods, criteria, and scope are agreed for the project.</p><a className="qlt-text-link" href="#quality-topics">Explore the quality topics<span aria-hidden="true">↓</span></a></div>
        <figure className="qlt-hero-image"><img src={heroImage} srcSet={`${heroSmall} 600w, ${heroImage} 1000w`} sizes="(max-width: 700px) 88vw, (max-width: 1511px) 44vw, 620px" alt="Illustrative study of gloved hands observing a cosmetic sample vial beside a cream jar and sample dish." width="1000" height="1000" fetchPriority="high" /><figcaption><span>CARE IN THE DETAILS</span><span>ILLUSTRATIVE LAB IMAGERY</span></figcaption></figure>
      </div>
    </section>

    <section className={`qlt-standard content-width${showCertificate ? '' : ' qlt-standard-neutral'}`} aria-labelledby="quality-standard-title"><div className="qlt-standard-title"><span className="kicker">QUALITY INFORMATION</span><h2 id="quality-standard-title">A standard.<br /><em>A clear scope.</em></h2></div>
      {showCertificate && <div className="qlt-certification"><span className="kicker">COSMETICS · GOOD MANUFACTURING PRACTICES</span><strong>{certification.standard}</strong><p>Certification held through {certification.heldThroughYear}.</p>{certification.scope && <p>Scope: {certification.scope}</p>}{certification.confirmedExpiry && <p>Expiry: {certification.confirmedExpiry}</p>}</div>}
      <div className="qlt-standard-copy"><p>{showCertificate ? `ISO 22716 certification is held through ${certification.heldThroughYear}. Discuss the relevant documentation and project requirements with Babylon.` : 'Discuss current quality documentation and project requirements with Babylon.'}</p><Link className="qlt-text-link" to="/contact">Discuss your quality requirements<span aria-hidden="true">↗</span></Link></div>
    </section>

    <section className="qlt-testing content-width" id="quality-topics" aria-labelledby="quality-testing-title"><Label number="01" aside="SAMPLES. SPECIFICATIONS. REVIEW.">THE TESTING CONVERSATION</Label><div className="qlt-section-heading"><h2 id="quality-testing-title">The checks.<br /><em>The questions to agree.</em></h2><span className="qlt-section-index" aria-hidden="true">01 — 04</span></div>
      <div className="qlt-scope-note"><span className="kicker">PROJECT-SPECIFIC SCOPE</span><p>The methods below explain what each topic involves. They do not imply that a particular test or document is included in every project.</p></div>
      <div className="qlt-testing-grid"><figure className="qlt-sample-image" data-topic={qualityChecks[activeTest][0]}><img src={testingImage.src} alt={testingImage.alt} width="900" height="900" loading="lazy" decoding="async" /><figcaption><span>{qualityChecks[activeTest][0]}</span><span>ILLUSTRATIVE SAMPLE STUDY</span></figcaption></figure>
        <div className="qlt-accordion">{qualityChecks.slice(0, 4).map(([title, description], index) => <details className="qlt-test-topic" name="babylon-quality-testing" key={title} open={index === 0} onToggle={event => { if (event.currentTarget.open) setActiveTest(index); }}><summary><span className="qlt-topic-index" aria-hidden="true">{number(index)}</span><h3>{title}</h3><span className="qlt-topic-toggle" aria-hidden="true" /></summary><div className="qlt-topic-body"><p>{description}</p></div></details>)}</div>
      </div>
    </section>

    <section className="qlt-records content-width" aria-labelledby="quality-records-title"><Label number="02" aside="A REFERENCE FOR THE PROJECT">DOCUMENTATION &amp; TRACEABILITY</Label><div className="qlt-records-grid"><div><span className="kicker">THE DETAILS THAT CONNECT</span><h2 id="quality-records-title">The record.<br /><em>The reference.</em></h2><div className="qlt-record-entries">{qualityChecks.slice(4).map(([title, description], index) => <article key={title}><span className="qlt-topic-index" aria-hidden="true">{number(index + 4)}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div></div><figure className="qlt-record-image"><img src={recordsImage} alt="Illustrative documentation study with blank review paper, unmarked cosmetic samples and empty reference tags." width="900" height="900" loading="lazy" decoding="async" /><figcaption><span>DOCUMENT STUDY</span><span>ILLUSTRATIVE CONCEPT IMAGERY</span></figcaption></figure></div></section>

    <div className="qlt-next content-width"><Link className="qlt-process-link" to="/process" aria-labelledby="quality-process-title"><div><span className="kicker">THE NEXT CHAPTER / PROCESS</span><h2 id="quality-process-title">See where testing fits<br /><em>in your project.</em></h2></div><span className="qlt-process-arrow" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="M9 39 39 9M9 9h30v30" /></svg></span></Link></div>
    <PageReview page="quality" />
  </div>;
}
