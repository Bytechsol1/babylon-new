import { useEffect } from 'react';
import { capabilities } from '../content.js';
import { Link } from '../router.jsx';
import PageReview from './PageReview.jsx';
import { editorialImages } from '../editorialImages.js';
import '../capabilities.css';
import styles from './CapabilitiesSections.module.css';

const methods = [
  { id: 'formulation', label: 'BRIEF → FORMULA', symbol: 'M12 3h8M14 3v9L7 26h18l-7-14V3M10 21h12' },
  { id: 'emulsion-science', title: 'Colloid and emulsion science', label: 'PHASES & TEXTURE', symbol: 'M19 16a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM29 16a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z' },
  { id: 'materials-selection', label: 'MATERIALS & PACKAGING', symbol: 'm16 3 13 7-13 7L3 10Zm-13 14 13 7 13-7M3 23l13 7 13-7' },
  { id: 'process-engineering', label: 'METHOD & REPEATABILITY', symbol: 'M4 4h8v8H4zM20 20h8v8h-8zM12 8h12v12M8 12v12h12' },
  { id: 'scale-up', label: 'SAMPLE → PRODUCTION', symbol: 'M3 27V17h6v10Zm10 0V10h6v17Zm10 0V3h6v24Z' },
  { id: 'quality-control', label: 'SPECIFICATIONS & REVIEW', symbol: 'M8 5h16v24H8zM12 5V2h8v3M12 13l2 2 5-5M12 22h8' },
];
const number = index => String(index + 1).padStart(2, '0');
const heroImage = editorialImages['capabilities-hero'];
const methodImages = ['cap-formulation', 'cap-emulsion', 'cap-materials', 'cap-process', 'cap-scale', 'cap-qc'].map(id => editorialImages[id]);

function Label({ number: index, children, aside = '' }) {
  return <div className="section-label"><span>{children}</span><i aria-hidden="true" /><span>{aside}</span></div>;
}

function MethodStudy({ index }) {
  const image = methodImages[index];
  return <figure className={`cap-method-study cap-study-${index} ${styles.study}`}>
    <img className="cap-study-photo" src={image.src} srcSet={`${image.small} 600w, ${image.src} 900w`} sizes="(max-width: 900px) 90vw, 32vw" alt={image.alt} width="900" height="900" loading="lazy" decoding="async" />
    <div className="cap-study-top"><span>METHOD STUDY</span></div>
    <figcaption><span>{methods[index].label}</span><span>AI-GENERATED CONCEPT</span></figcaption>
  </figure>;
}

export default function CapabilitiesPage() {
  useEffect(() => {
    const scrollToMethod = () => {
      const method = methods.find(item => `#${item.id}` === window.location.hash);
      if (method) document.getElementById(method.id)?.scrollIntoView({ block: 'start' });
    };
    const frame = requestAnimationFrame(scrollToMethod);
    window.addEventListener('hashchange', scrollToMethod);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('hashchange', scrollToMethod);
    };
  }, []);

  return <div className="cap-page">
    <section className="cap-hero content-width" aria-labelledby="cap-page-title">
      <Label number="02">CAPABILITIES</Label>
      <div className="cap-hero-grid">
        <div className="cap-hero-copy"><span className="kicker">FORMULATION AND MANUFACTURING METHODS</span><h1 id="cap-page-title">What our<em>lab does</em></h1><p>Formulation, materials and manufacturing methods connect a product brief to a production specification.</p><p>Read how each method supports development, from the first sample to quality review.</p><a className="cap-text-link" href="#capability-methods">See the lab methods<span aria-hidden="true">→</span></a></div>
        <figure className="cap-hero-image"><img src={heroImage.src} srcSet={`${heroImage.small} 600w, ${heroImage.src} 1200w`} sizes="(max-width: 800px) 90vw, 45vw" alt={heroImage.alt} width="1200" height="800" fetchPriority="high" decoding="async" /><figcaption><span>FORMULATION &amp; SAMPLE REVIEW</span><span>AI-GENERATED CONCEPT</span></figcaption></figure>
      </div>
    </section>

    <section className="cap-methods content-width" id="capability-methods" aria-labelledby="cap-methods-heading">
      <header className={styles.heading}>
        <div><span className={styles.eyebrow}>SIX CONNECTED AREAS</span><h2 id="cap-methods-heading">Six connected<br /><em>lab methods</em></h2></div>
        <div className={styles.introAside}><p>Read the method and development focus for each area below.</p></div>
      </header>
      <nav className={styles.navigation} aria-label="Capability sections">{capabilities.map((item, index) => <a key={methods[index].id} href={`#${methods[index].id}`}>
          <span className={styles.navNumber}>{number(index)}</span><span>{methods[index].title || item.title}<span aria-hidden="true"> →</span></span>
        </a>)}</nav>
      <div className={styles.sections}>
          {capabilities.map((capability, index) => <section className={styles.method} id={methods[index].id} key={methods[index].id} aria-labelledby={`${methods[index].id}-heading`} data-method={methods[index].id}>
            <div className={styles.methodIndex} aria-hidden="true"><span>{number(index)}</span><i /></div>
            <div className={styles.copy}><span className={styles.eyebrow}>{methods[index].label}</span><h3 id={`${methods[index].id}-heading`}>{methods[index].title || capability.title}</h3><p className={`cap-panel-description ${styles.description}`}>{capability.text}</p><div className={styles.focus}><span className={styles.eyebrow}>DEVELOPMENT FOCUS</span><p>{capability.question}</p></div></div>
            <MethodStudy index={index} />
          </section>)}
      </div>
    </section>

    <div className="cap-closing content-width" id="methods-with-discretion">
      <aside className="cap-discretion" aria-labelledby="cap-discretion-title">
        <div className="cap-discretion-seal" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="M15 23v-8a9 9 0 0 1 18 0v8M11 23h26v20H11zM24 31v5" /><circle cx="24" cy="30" r="1.5" /></svg></div>
        <span className="kicker">METHODS, WITH DISCRETION</span>
        <h2 id="cap-discretion-title">Methods without<br /><em>proprietary details</em></h2>
        <p>This page describes methods only. Customer formulas, ingredient percentages and proprietary process settings are not published here.</p>
        <div className="cap-discretion-foot" aria-hidden="true"><span>BABYLON</span><i /><span>CAPABILITIES</span></div>
      </aside>
      <section className="cap-quality" aria-labelledby="cap-quality-title">
        <Link className="cap-quality-link" to="/quality" aria-labelledby="cap-quality-title cap-quality-link-label">
          <span className="cap-quality-emblem" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="19" /><path d="m15 24 6 6 13-14M24 1v7M24 40v7M1 24h7M40 24h7" /></svg></span>
          <span className="kicker">THE NEXT QUESTION / QUALITY</span>
          <h2 id="cap-quality-title">Quality checks<br /><em>and traceability</em></h2>
          <span id="cap-quality-link-label">See the quality checks</span>
          <span className="cap-quality-arrow" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><path d="M5 16h22M18 7l9 9-9 9" /></svg></span>
        </Link>
      </section>
    </div>
    <PageReview page="capabilities" />
  </div>;
}
