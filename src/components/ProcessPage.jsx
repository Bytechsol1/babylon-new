import { useEffect } from 'react';
import { journey } from '../content.js';
import { Link } from '../router.jsx';
import PageReview from './PageReview.jsx';
import { editorialImages } from '../editorialImages.js';
import '../process.css';
import styles from './ProcessTimeline.module.css';

const stages = [
  { id: 'inquiry', label: 'START THE CONVERSATION', image: editorialImages['process-inquiry'] },
  { id: 'brief', label: 'DEFINE THE BRIEF', image: editorialImages['process-brief'] },
  { id: 'formula', label: 'FORMULATION & TRANSFER', image: editorialImages['process-formula'] },
  { id: 'samples-testing', label: 'EVALUATION & FEEDBACK', image: editorialImages['process-samples'] },
  { id: 'pilot-production', label: 'PILOT BATCH', image: editorialImages['process-pilot'] },
  { id: 'ship-support', label: 'PRODUCTION & SHIPPING', image: editorialImages['process-shipping'] },
];
const planning = [
  ['Quantity estimate', 'Include your quantity estimate.'],
  ['Development & testing', 'Include the product requirements and sample feedback.'],
  ['Production & shipping', 'Include packaging and delivery requirements.'],
];
const number = index => String(index + 1).padStart(2, '0');
const stageTitles = ['Inquiry', 'Brief and quote', 'Formulate or transfer formula', 'Samples and testing', 'Pilot batch', 'Production and shipping'];
// Reuse approved stage/checkpoint wording without changing shared Home/Services data.
const visibleStages = stages.map((stage, index) => ({ ...journey[index], ...stage, title: stageTitles[index],
  ...(index === 0 ? { approval: 'Send your initial project brief.' } : {}),
  ...(index === 1 ? { text: 'The product specification, development work and project scope are outlined for a quote.' } : {}),
  ...(index === 5 ? { text: 'Production follows the approved specification, with packaging and delivery requirements identified for the project.' } : {}),
}));
const stageAliases = { 'brief-and-quote': 'brief', 'formulate-or-transfer': 'formula', 'formulate-or-transfer-formula': 'formula', 'samples-and-testing': 'samples-testing', 'pilot-batch': 'pilot-production', 'production-and-shipping': 'ship-support' };

function Label({ number: index, children, aside = '' }) {
  return <div className="section-label"><span>{children}</span><i aria-hidden="true" /><span>{aside}</span></div>;
}

export default function ProcessPage() {
  useEffect(() => {
    const scrollToStage = () => {
      const hash = window.location.hash.slice(1);
      const target = stageAliases[hash] || hash;
      if (stages.some(stage => stage.id === target)) document.getElementById(target)?.scrollIntoView({ block: 'start' });
    };
    const frame = requestAnimationFrame(scrollToStage);
    window.addEventListener('hashchange', scrollToStage);
    window.addEventListener('popstate', scrollToStage);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('hashchange', scrollToStage);
      window.removeEventListener('popstate', scrollToStage);
    };
  }, []);

  return <div className="prc-page">
    <section className="prc-hero content-width" aria-labelledby="process-page-title"><Label number="05">THE PROCESS</Label><div className="prc-hero-grid"><h1 id="process-page-title">From first email <em>to first shipment</em></h1><div className="prc-hero-copy"><p className="prc-hero-lead">Six stages connect the initial brief<br />to production and shipping.</p><p>Samples, testing and a pilot run provide review points along the way.</p><Link className="prc-text-link" to="/contact">Start with your brief<span aria-hidden="true">→</span></Link></div></div></section>

    <section className="prc-journey content-width" id="project-journey" aria-labelledby="process-journey-title"><div className="prc-journey-heading"><h2 id="process-journey-title">From brief <em>to production</em></h2><p>Read the work and your checkpoint<br className="prc-desktop-break" /> at each stage.</p></div>
      <nav className={`prc-tabs ${styles.navigation}`} aria-label="Project stages">{visibleStages.map((stage, index) => <a key={stage.id} href={`#${stage.id}`}><span className="prc-stage-marker">{number(index)}</span><span className="prc-tab-name">{stage.title}<span aria-hidden="true"> →</span></span></a>)}</nav>
      <ol className={styles.timeline} role="list" aria-label="Six-step project timeline">{visibleStages.map((step, index) => <li className={styles.stage} id={step.id} key={step.id} data-stage={step.id}>
        <article className="prc-stage-panel" aria-labelledby={`${step.id}-title`}>
          <figure className="prc-stage-image"><img src={step.image.src} srcSet={`${step.image.small} 600w, ${step.image.src} 900w`} sizes="(max-width: 800px) 90vw, 40vw" alt={step.image.alt} width="900" height="900" decoding="async" loading={index === 0 ? 'eager' : 'lazy'} /><figcaption><span>{number(index)} / {step.title}</span><span>AI-GENERATED CONCEPT</span></figcaption></figure>
          <div className="prc-stage-copy"><span className="kicker">{number(index)} / {step.label}</span><h3 id={`${step.id}-title`}>{step.title}</h3><p className="prc-stage-description">{step.text}</p><dl className="prc-checkpoints"><div className="prc-output"><dt>WHAT TO EXPECT</dt><dd>{step.output}</dd></div><div className="prc-approval"><dt>YOUR CHECKPOINT</dt><dd>{step.approval}</dd></div></dl><Link className="prc-text-link" to={`/contact?question=${encodeURIComponent(`I'd like to discuss the ${step.title} stage of a project.`)}`}>Ask about this stage<span aria-hidden="true">→</span></Link></div>
        </article>
      </li>)}</ol>
    </section>

    <section className="prc-planning content-width" aria-labelledby="process-planning-title"><div className="prc-planning-intro"><span className="kicker">BEFORE YOU BEGIN</span><h2 id="process-planning-title">Prepare your<br /><em>product brief</em></h2><p>Your brief is the reference for the product and project requirements.</p></div><dl>{planning.map(([title, text], index) => <div key={title}><dt><span aria-hidden="true">{number(index)}</span>{title}</dt><dd>{text}</dd></div>)}</dl></section>

    <section className="prc-reorder content-width" aria-labelledby="process-reorder-title"><Label number="07">READY FOR YOUR NEXT BATCH?</Label><div className="prc-reorder-grid"><h2 id="process-reorder-title">Start with the<br /><em>existing specification</em></h2><div><p>Identify the previous specification and any changes to the formula, packaging or target market.</p><p>Use the contact form to send a reorder inquiry with those details.</p><Link className="prc-text-link" to={`/contact?question=${encodeURIComponent("I'd like to discuss a reorder and any changes to a previous product specification.")}`}>Send a reorder question<span aria-hidden="true">→</span></Link></div></div></section>
    <PageReview page="process" />
  </div>;
}
