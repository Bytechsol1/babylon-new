import { useRef, useState } from 'react';
import OriginalHero from './OriginalHero.jsx';
import AboutFilm from './Hero.jsx';
import ProcessStrip from './ProcessStrip.jsx';
import ProjectForm from './ProjectForm.jsx';
import PageReview from './PageReview.jsx';
import PartnershipModels from './PartnershipModels.jsx';
import CapabilitiesPage from './CapabilitiesPage.jsx';
import ProductsPage from './ProductsPage.jsx';
import QualityPage from './QualityPage.jsx';
import ProcessPage from './ProcessPage.jsx';
import { Link, useRouter } from '../router.jsx';
import { company, manufacturingSupport, certification, certificationVisible, capabilities, journey, faq, approvedFAQ, navigation } from '../content.js';
import ChemistryAnimation from './ChemistryAnimation.jsx';
import '../chemistry.css';

function ScienceOverview() {
  const sectionRef = useRef(null);
  return <div className="science-scroll" ref={sectionRef}>
    <section className="science-overview content-width"><SectionLabel number="02">A DIFFERENT KIND OF CHEMISTRY</SectionLabel>
      <div className="science-overview-grid">
        <div><h2>Serious science.<br /><em>Clear possibilities.</em></h2><p>Understand the methods behind the product, from formulation and materials to process engineering and scale-up.</p><ArrowLink to="/capabilities">Explore our capabilities</ArrowLink></div>
        <div className="science-visual"><ChemistryAnimation sectionRef={sectionRef} /><p className="science-caption">AN ILLUSTRATION OF COSMETIC SCIENCE</p></div>
        <ol className="capability-mini">{capabilities.map((item, index) => <li key={item.title}><span>0{index + 1}</span>{item.title}</li>)}</ol>
      </div>
    </section>
  </div>;
}

export function SectionLabel({ number, children, aside = 'YOUR VISION. OUR ELEMENT.' }) {
  return <div className="section-label"><span>{number} / {children}</span><i aria-hidden="true" /><span>{aside}</span></div>;
}
export function PageIntro({ number, label, title, emphasis, children }) {
  return <section className="page-intro content-width"><SectionLabel number={number}>{label}</SectionLabel><div className="page-intro-grid"><h1>{title}<em>{emphasis}</em></h1><div className="page-intro-copy">{children}</div></div></section>;
}
function ArrowLink({ to, children, className = '' }) { return <Link to={to} className={`arrow-link ${className}`}>{children}<span aria-hidden="true">↗</span></Link>; }
function Note({ children }) { return <p className="confirmation-note"><span aria-hidden="true">↳</span>{children}</p>; }
export function Certificate({ compact = false }) {
  if (!certificationVisible()) return null;
  return <div className={`certificate ${compact ? 'compact' : ''}`}>
    <span className="certificate-symbol" aria-hidden="true">✳</span>
    <div><span className="kicker">COSMETICS · GOOD MANUFACTURING PRACTICES</span><h3>{certification.standard}</h3><p>Certification held through {certification.heldThroughYear}.</p>
      {!compact && certification.scope && <p>Scope: {certification.scope}</p>}
      {!compact && certification.confirmedExpiry && <p>Expiry: {certification.confirmedExpiry}</p>}
    </div>
  </div>;
}

export function Home() {
  const { navigate } = useRouter();
  const onOpen = panel => navigate(({ project: '/contact', science: '/capabilities', process: '/process' })[panel] || '/services');
  return <>
    <div className="opening-section"><OriginalHero onOpen={onOpen} /><ProcessStrip onOpen={onOpen} /></div>
    <section className="content-width section-space partnership-overview" id="partnership" aria-labelledby="partnership-heading"><SectionLabel number="01">THREE WAYS TO WORK TOGETHER</SectionLabel><div className="section-heading"><h2 id="partnership-heading">Your vision.<br /><em>Our way forward.</em></h2><div><p>Three ways to work together, shaped around where you are starting.</p><p>Understand what you bring, what Babylon does, and where decisions are made.</p></div></div><PartnershipModels /></section>
    <ScienceOverview />
    <AboutFilm />
    <section className="quality-overview"><div className="content-width"><SectionLabel number="03" aside="DEFINED. DOCUMENTED. REVIEWED.">CARE IN THE DETAILS</SectionLabel><div className="quality-overview-grid"><div><h2>Good chemistry.<br /><em>Thoughtful checks.</em></h2><p>Know what is being checked, which records matter, and where your approval fits. Agree on the testing and documentation your product needs.</p><ArrowLink to="/quality">Understand the quality process</ArrowLink></div><Certificate compact /></div></div></section>
    <section className="content-width section-space home-journey"><SectionLabel number="04">FROM FIRST BRIEF TO FIRST BATCH</SectionLabel><div className="section-heading"><h2>A clearer path.<br /><em>At every step.</em></h2><ArrowLink to="/process">See the full process</ArrowLink></div><Journey compact /><Note>Discuss order quantities and schedules as part of agreeing your project brief.</Note></section><PageReview page="home" />
  </>;
}
export function ServiceModels() {
  return <PartnershipModels syncHash />;
}
export function Journey({ compact = false }) {
  return <ol className={compact ? 'journey-strip' : 'journey-list'}>{journey.map((step, index) => <li key={step.title}><span className="journey-number">0{index + 1}</span><div><h3>{step.title}</h3>{!compact && <><p>{step.text}</p><dl><div><dt>WHAT TO EXPECT</dt><dd>{step.output}</dd></div><div><dt>YOUR CHECKPOINT</dt><dd>{step.approval}</dd></div></dl></>}</div>{compact && index < journey.length - 1 && <span className="journey-arrow" aria-hidden="true">→</span>}</li>)}</ol>;
}
function ManufacturingOverview() {
  return <section className="content-width manufacturing-overview">
    <SectionLabel number="02">THE MANUFACTURING SCOPE</SectionLabel>
    <div className="section-heading"><h2>What gets made.<br /><em>What gets agreed.</em></h2><p>Alongside your development model, agree on the stages of manufacturing your project needs. The scope is confirmed in your project brief.</p></div>
    <div className="methods-grid">{manufacturingSupport.map((item, index) => <article className="method-card" key={item.title}>
      <span className="card-index">0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p>
    </article>)}</div>
  </section>;
}
export function Services() {
  return <>
    <PageIntro number="01" label="SERVICES" title="Your vision." emphasis="Our way forward."><p>Three ways to work together, shaped around where you are starting.</p><p>Understand what you bring, what Babylon does, and where decisions are made.</p></PageIntro>
    <section className="content-width page-body"><ServiceModels /><Note>Agree on scope, responsibilities, commercial terms, and formula ownership as part of your project brief.</Note></section>
    <ManufacturingOverview />
    <section className="content-width section-space"><SectionLabel number="03">A SHARED CUSTOMER JOURNEY</SectionLabel><div className="section-heading"><h2>Different models.<br /><em>A common path.</em></h2><ArrowLink to="/process">What to expect at each step</ArrowLink></div><Journey compact /></section>
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
  const categories = ['All questions', ...new Set(faq.map(item => item.category))];
  return <>
    <PageIntro number="07" label="QUESTIONS & ANSWERS" title="Good questions." emphasis="Clear beginnings."><p>Explore the questions you may want to discuss before starting a project.</p><p>For a project-specific conversation, contact Babylon with your product brief and the details you have so far.</p></PageIntro>
    <section className="content-width page-body faq-layout"><aside><span className="kicker">EXPLORE BY TOPIC</span><div className="faq-filters" role="group" aria-label="Filter questions">{categories.map(category => <button key={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}<span aria-hidden="true">↗</span></button>)}</div><p className="small-copy">Choose a topic and bring your questions to the conversation.</p><ArrowLink to="/contact">Talk with Babylon</ArrowLink></aside>
      <div className="faq-list">{faq.filter(item => filter === 'All questions' || item.category === filter).map((item, index) => {
        const approved = approvedFAQ.find(entry => entry.id === item.id);
        return <details key={item.id}><summary><span className="faq-number">{String(index + 1).padStart(2, '0')}</span><span>{item.question}</span><span className="faq-plus" aria-hidden="true">+</span></summary><div className="faq-answer">{approved && <><p>{approved.answer}</p><p className="faq-review">Reviewed: {approved.reviewedAt}</p></>}<ArrowLink to={`/contact?question=${encodeURIComponent(item.question)}`}>Ask Babylon about this</ArrowLink></div></details>;
      })}</div>
    </section>
    <PageReview page="faq" />
  </>;
}

export function Contact() {
  return <>
    <PageIntro number="08" label="START A PROJECT" title="Your next idea." emphasis="Let’s begin."><p>Tell us where you are starting and what you would like to make.</p><p>You do not need every answer yet. A clear outline is a useful first step.</p></PageIntro>
    <section className="content-width page-body contact-layout"><aside><span className="kicker">A GOOD PLACE TO START</span><h2>A brief.<br /><em>A conversation.<br />A next step.</em></h2><p>Share your product goals, desired format, and any questions. Keep confidential formulas and proprietary process details out of this initial inquiry.</p><address>{company.address}</address><a className="arrow-link" href={`mailto:${company.email}`}>Email Babylon <span aria-hidden="true">↗</span></a><p className="small-copy">General inquiries: {company.email}</p><div className="contact-expect"><span className="kicker">YOUR INQUIRY</span><p>Use the form to outline your brief, or email Babylon directly. Keep a copy of your project details for your own records.</p></div></aside><ProjectForm /></section>
    <PageReview page="contact" />
  </>;
}

export function NotFound() { return <PageIntro number="404" label="PAGE NOT FOUND" title="A different path." emphasis="The same curiosity."><p>This page could not be found.</p><ArrowLink to="/">Return to Babylon home</ArrowLink></PageIntro>; }
export function Footer() {
  return <footer className="site-footer"><div className="content-width"><div className="footer-invitation"><div className="footer-invitation-label"><span>LET’S MAKE A BEGINNING.</span><span>YOUR VISION. OUR ELEMENT.</span></div><div className="footer-invitation-grid"><h2>Good chemistry.<br /><em>Great beginnings.</em></h2><div className="footer-invitation-action"><p>From an idea on your mind<br />to a conversation about what’s possible.</p><Link to="/contact">Start a project<span aria-hidden="true">↗</span></Link></div></div><div className="footer-invitation-line"><span>FROM MOLECULE</span><i aria-hidden="true" /><span>TO MARKET.</span></div></div><div className="footer-information"><div className="footer-identity"><Link to="/" aria-label="Babylon home"><img src="/babylon-favicon.png" alt="Babylon" width="100" height="100" loading="lazy" /></Link><p>Cosmetic science, thoughtfully made.<br />Founded {company.founded}.</p></div><nav className="footer-link-group" aria-label="Explore Babylon"><span>EXPLORE BABYLON</span>{navigation.filter(([path]) => ['/', '/services', '/capabilities', '/products'].includes(path)).map(([path, label]) => <Link key={path} to={path}>{label}</Link>)}</nav><nav className="footer-link-group" aria-label="Plan your project"><span>YOUR NEXT STEP</span>{navigation.filter(([path]) => ['/quality', '/process', '/about', '/faq', '/contact'].includes(path)).map(([path, label]) => <Link key={path} to={path}>{label}</Link>)}</nav><div className="footer-location"><span className="kicker">SAN JOSE, CALIFORNIA</span><address>{company.address}</address><p>OEM · ODM · Co-development</p></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Babylon. All rights reserved.</span><span>PRECISION SCIENCE. UNCONVENTIONAL THINKING.</span><a href="#main-content">Back to top <span aria-hidden="true">↑</span></a></div></div></footer>;
}
