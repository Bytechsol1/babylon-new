import { lazy, Suspense, useRef, useState } from 'react';
import OriginalHero from './OriginalHero.jsx';
import AboutFilm from './Hero.jsx';
import ProcessStrip from './ProcessStrip.jsx';
import ProjectForm from './ProjectForm.jsx';
import PageReview from './PageReview.jsx';
import PartnershipModels from './PartnershipModels.jsx';
import ServicesComparison, { serviceScope } from './ServicesComparison.jsx';
import ConceptImage from './ConceptImage.jsx';
import CapabilitiesPage from './CapabilitiesPage.jsx';
import ProductsPage from './ProductsPage.jsx';
import QualityPage from './QualityPage.jsx';
import ProcessPage from './ProcessPage.jsx';
import { Link, useRouter } from '../router.jsx';
import { company, manufacturingSupport, certification, certificationVisible, capabilities, journey, navigation } from '../content.js';
import ChemistryAnimation from './ChemistryAnimation.jsx';
import '../chemistry.css';
import { factoryTechnology } from '../editorialContent.js';
import { productBriefGuidance } from '../productContent.js';
import { publicFAQPage } from '../faqPageContent.js';

const FAQPageReview = import.meta.env.DEV ? lazy(() => import('../review/FAQPageReview.jsx')) : null;

function ScienceOverview() {
  const sectionRef = useRef(null);
  return <div className="science-scroll" ref={sectionRef}>
    <section className="science-overview content-width"><SectionLabel number="02" aside="MES · INSPECTION · ROBOTICS">IN-HOUSE PRODUCTION TECHNOLOGY</SectionLabel>
      <div className="science-overview-grid">
        <div><h2>How we run<br /><em>the factory</em></h2><p>We build our manufacturing execution system (MES) in house. It provides lot traceability across production.</p><ConceptImage name="home-technology" variant="wide" /><ArrowLink to="/about">About our production technology</ArrowLink></div>
        <div className="science-visual"><ChemistryAnimation sectionRef={sectionRef} /></div>
        <ol className="capability-mini">{factoryTechnology.map((item, index) => <li key={item.short}><span>0{index + 1}</span>{item.text}</li>)}</ol>
      </div>
    </section>
  </div>;
}

export function SectionLabel({ number, children, aside = '' }) {
  return <div className="section-label"><span>{children}</span><i aria-hidden="true" /><span>{aside}</span></div>;
}
export function PageIntro({ number, label, title, emphasis, children }) {
  return <section className="page-intro content-width"><SectionLabel number={number}>{label}</SectionLabel><div className="page-intro-grid"><h1>{title}<em>{emphasis}</em></h1><div className="page-intro-copy">{children}</div></div></section>;
}
function ArrowLink({ to, children, className = '' }) { return <Link to={to} className={`arrow-link ${className}`}>{children}<span aria-hidden="true">→</span></Link>; }
function Note({ children }) { return <p className="confirmation-note"><span aria-hidden="true">↳</span>{children}</p>; }
export function Certificate({ compact = false, showLink = true }) {
  if (!certificationVisible()) return null;
  return <div className={`certificate ${compact ? 'compact' : ''}`}>
    <span className="kicker">COSMETICS · GOOD MANUFACTURING PRACTICES</span>
    <h3>{certification.standard}</h3><p>Certification held through {certification.heldThroughYear}.</p>
      {!compact && certification.scope && <p>Scope: {certification.scope}</p>}
      {!compact && certification.confirmedExpiry && <p>Expiry: {certification.confirmedExpiry}</p>}
    {showLink && <Link className="certificate-link" to="/quality">See our quality approach<span aria-hidden="true">→</span></Link>}
  </div>;
}

export function Home() {
  const { navigate } = useRouter();
  const onOpen = panel => navigate(({ project: '/contact', science: '/capabilities', process: '/process', products: '/products', about: '/about', quality: '/quality' })[panel] || '/services');
  return <>
    <div className="opening-section"><OriginalHero onOpen={onOpen} /><ProcessStrip onOpen={onOpen} /></div>
    <section className="content-width section-space partnership-overview" id="partnership" aria-labelledby="partnership-heading"><SectionLabel number="01" aside="OEM · ODM · CO-DEVELOPMENT">THREE WAYS TO WORK TOGETHER</SectionLabel><div className="section-heading"><h2 id="partnership-heading">Three ways to<br /><em>work with us</em></h2><div><p>OEM starts from your formula. ODM starts from your brief. Co-development builds on a concept or formula in progress.</p></div></div><PartnershipModels homepage /></section>
    <ScienceOverview />
    <AboutFilm />
    <section className="quality-overview"><div className="content-width"><SectionLabel number="03" aside="ISO 22716">QUALITY AND TRACEABILITY</SectionLabel><div className="quality-overview-grid"><div><h2>Cosmetics GMP<br /><em>and quality checks</em></h2><p>Quality checks compare samples and batches with product specifications. Production records and lot traceability support that work.</p><ConceptImage name="home-quality" variant="wide" /><ArrowLink to="/quality">See the quality checks</ArrowLink></div><Certificate compact showLink={false} /></div></div></section>
    <section className="content-width section-space home-journey"><SectionLabel number="04" aside="SIX PROJECT STAGES">THE PRODUCTION PROCESS</SectionLabel><div className="section-heading"><h2>From inquiry<br /><em>to shipping</em></h2><ArrowLink to="/process">See the full process</ArrowLink></div><ConceptImage name="home-process" variant="banner" /><Journey compact /></section><PageReview page="home" />
  </>;
}
export function ServiceModels() {
  return <ServicesComparison />;
}
export function Journey({ compact = false }) {
  return <ol className={compact ? 'journey-strip' : 'journey-list'}>{journey.map((step, index) => <li key={step.title}><span className="journey-number">0{index + 1}</span><div><h3>{step.title}</h3>{!compact && <><p>{step.text}</p><dl><div><dt>WHAT TO EXPECT</dt><dd>{step.output}</dd></div><div><dt>YOUR CHECKPOINT</dt><dd>{step.approval}</dd></div></dl></>}</div>{compact && index < journey.length - 1 && <span className="journey-arrow" aria-hidden="true">→</span>}</li>)}</ol>;
}
function ManufacturingOverview() {
  return <section className="content-width manufacturing-overview">
    <SectionLabel number="02">THE MANUFACTURING SCOPE</SectionLabel>
    <div className="section-heading"><h2>What we<br /><em>can take on</em></h2><p>We offer formulation and R&amp;D, cosmetic manufacturing and filling, regulatory support and fulfillment.</p></div>
    <div className="methods-grid">{serviceScope.map((item, index) => <article className="method-card" key={item.title}>
      <ConceptImage name={item.image} />
      <span className="card-index">0{index + 1}</span><h3>{item.title}</h3>{item.items.map(part => <p key={part.label}><strong>{part.label}.</strong> {part.text}</p>)}
    </article>)}</div>
  </section>;
}
export function Services() {
  return <>
    <PageIntro number="01" label="SERVICES" title="How we work" emphasis="with brands"><p>Compare what you bring, what we do and the approval steps for OEM, ODM and co-development.</p></PageIntro>
    <section className="content-width page-body"><ServiceModels /><Note>Formula ownership, quote terms, included tests, minimum quantities and timelines are pending confirmation. Approval steps do not imply that particular tests are included in a quote.</Note></section>
    <ManufacturingOverview />
    <section className="content-width section-space"><SectionLabel number="03">THE PRODUCTION PROCESS</SectionLabel><div className="section-heading"><h2>From brief<br /><em>to production</em></h2><ArrowLink to="/process">What to expect at each step</ArrowLink></div><ConceptImage name="services-process" variant="banner" /><Journey compact /></section>
    <PageReview page="services" />
  </>;
}

export function Capabilities() {
  return <CapabilitiesPage />;
}
export function Products() {
  return <ProductsPage />;
}

export function Quality() {
  return <QualityPage />;
}

export function Process() {
  return <ProcessPage />;
}

export { default as About } from './AboutPage.jsx';
export function FAQ() {
  const [filter, setFilter] = useState('All questions');
  const categories = ['All questions', ...new Set(publicFAQPage.map(item => item.category))];
  const showReview = FAQPageReview && new URLSearchParams(window.location.search).get('review') === '1';
  return <>
    <PageIntro number="07" label="QUESTIONS & ANSWERS" title="Questions we" emphasis="get asked"><p>Answers based on our confirmed company and service information.</p><p>For project-specific questions, contact {company.email}.</p></PageIntro>
    <section className="content-width page-body faq-layout"><aside><span className="kicker">FIND YOUR TOPIC</span><div className="faq-filters" role="group" aria-label="Filter questions">{categories.map(category => <button key={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}<span aria-hidden="true">→</span></button>)}</div><ArrowLink to="/contact">Send a question</ArrowLink></aside>
      <div className="faq-list">{publicFAQPage.filter(item => filter === 'All questions' || item.category === filter).map(item => <details key={item.id}><summary><span>{item.question}</span><span className="faq-plus" aria-hidden="true">+</span></summary><div className="faq-answer"><p>{item.answer}</p><ArrowLink to={'/contact?question=' + encodeURIComponent(item.question)}>Send a follow-up question</ArrowLink></div></details>)}</div>
    </section>{showReview && <Suspense fallback={<p className="content-width small-copy" role="status">Loading draft review…</p>}><FAQPageReview /></Suspense>}
  </>;
}

export function Contact() {
  const briefGuidance = productBriefGuidance.map(tip => tip.id === 'intended-use' ? {
    ...tip, title: 'Product & intended use',
    text: 'Describe the product, who it is for, where it will be used and what you want it to do.',
  } : tip);
  return <>
    <div><PageIntro number="08" label="Contact" title="Start a project"><p>Tell us what you want to make. A few lines about the product are enough to start.</p></PageIntro></div>
    <section className="content-width page-body contact-layout"><aside className="contact-brief-copy" id="product-brief-guidance" aria-labelledby="contact-brief-heading"><span className="kicker">Your project brief</span><h2 id="contact-brief-heading">What to include in your brief</h2><ul>{briefGuidance.map(tip => <li id={tip.id} key={tip.id}><strong>{tip.title}.</strong> {tip.text}</li>)}<li>Your first-order quantity estimate</li><li>Your target launch date</li></ul><p className="small-copy">Keep confidential formulas and proprietary process details out of this first inquiry.</p><address>{company.address}</address><p>{company.email}</p></aside><ProjectForm /></section>
    <PageReview page="contact" />
  </>;
}

export function NotFound() { return <PageIntro number="404" label="PAGE NOT FOUND" title="Page not found"><p>This page could not be found.</p><ArrowLink to="/">Return to home</ArrowLink></PageIntro>; }
export function Footer() {
  const { location } = useRouter();
  const showInvitation = !['/contact', '/products', '/process'].includes(location);
  return <footer className="site-footer"><div className="content-width">{showInvitation && <div className="footer-invitation"><div className="footer-invitation-label"><span>START A PROJECT</span><span>SAN JOSE · SINCE 2016</span></div><div className="footer-invitation-grid"><h2>Tell us what<br /><em>you want to make.</em></h2><div className="footer-invitation-action"><p>Start with the product, packaging,<br />quantity estimate and target market.</p><Link to="/contact">Start a project<span aria-hidden="true">→</span></Link></div></div></div>}<div className="footer-information"><div className="footer-identity"><Link to="/" aria-label="Babylon home"><img src="/babylon-favicon.png" alt="Babylon" width="100" height="100" loading="lazy" /></Link><p>Contract manufacturing for skincare and personal care.<br />Founded {company.founded}.</p></div><nav className="footer-link-group" aria-label="Explore Babylon"><span>EXPLORE BABYLON</span>{navigation.filter(([path]) => ['/', '/services', '/capabilities', '/products'].includes(path)).map(([path, label]) => <Link key={path} to={path}>{label}<span aria-hidden="true">→</span></Link>)}</nav><nav className="footer-link-group" aria-label="Plan your project"><span>YOUR NEXT STEP</span>{navigation.filter(([path]) => ['/quality', '/process', '/about', '/faq', '/contact'].includes(path)).map(([path, label]) => <Link key={path} to={path}>{label}<span aria-hidden="true">→</span></Link>)}</nav><div className="footer-location"><span className="kicker">SAN JOSE, CALIFORNIA</span><address>{company.address}</address><p>{company.email}</p></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Babylon. All rights reserved.</span><span>FORMULATION · MANUFACTURING · FILLING</span><a href="#main-content">Back to top <span aria-hidden="true">→</span></a></div></div></footer>;
}
