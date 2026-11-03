import { useEffect, useId, useRef, useState } from 'react';
import { journey } from '../content.js';
import { Link } from '../router.jsx';
import PageReview from './PageReview.jsx';
import inquiryImage from '../assets/process/project-inquiry.webp';
import briefImage from '../assets/process/product-brief.webp';
import formulationImage from '../assets/capabilities/formulation.webp';
import testingImage from '../assets/capabilities/quality-control.webp';
import productionImage from '../assets/capabilities/process-engineering.webp';
import shippingImage from '../assets/process/shipment-support.webp';
import '../process.css';

const stages = [
  { id: 'inquiry', label: 'START THE CONVERSATION', image: inquiryImage, alt: 'Illustrative project conversation with cosmetic samples and a blank notebook.' },
  { id: 'brief', label: 'DEFINE THE BRIEF', image: briefImage, alt: 'Illustrative project brief with a blank worksheet, cosmetic samples and a pen.' },
  { id: 'formula', label: 'FORMULATION & TRANSFER', image: formulationImage, alt: 'Illustrative formulation study with cream in a glass dish and a serum dropper.' },
  { id: 'samples-testing', label: 'EVALUATION & FEEDBACK', image: testingImage, alt: 'Illustrative sample review with gloved hands transferring a cosmetic sample into a dish.' },
  { id: 'pilot-production', label: 'PILOT & PRODUCTION', image: productionImage, alt: 'Illustrative laboratory mixing vessel with cosmetic cream and a stainless steel stirrer.' },
  { id: 'ship-support', label: 'SHIPMENT & SUPPORT', image: shippingImage, alt: 'Illustrative packing study with unbranded cosmetic containers, paper dividers and a blank document envelope.' },
];
const planning = [
  ['Order quantity', 'Discuss an appropriate range for the proposed product and manufacturing scope.'],
  ['Development & testing', 'Agree on the work, evaluation criteria, and approval steps your project needs.'],
  ['Production & shipping', 'Review the production plan, documents, and delivery requirements together.'],
];
const number = index => String(index + 1).padStart(2, '0');
const stageFromHash = () => Math.max(0, stages.findIndex(stage => `#${stage.id}` === window.location.hash));

function Label({ number: index, children, aside = 'YOUR VISION. OUR ELEMENT.' }) {
  return <div className="section-label"><span>{index} / {children}</span><i aria-hidden="true" /><span>{aside}</span></div>;
}

export default function ProcessPage() {
  const [selected, setSelected] = useState(stageFromHash);
  const refs = useRef([]);
  const id = useId();
  const panelId = `${id}-process-panel`;
  const step = journey[selected];
  const stage = stages[selected];

  useEffect(() => {
    const update = () => setSelected(stageFromHash());
    window.addEventListener('hashchange', update);
    window.addEventListener('popstate', update);
    return () => {
      window.removeEventListener('hashchange', update);
      window.removeEventListener('popstate', update);
    };
  }, []);

  function select(index) {
    setSelected(index);
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}#${stages[index].id}`);
  }
  function keyDown(event, index) {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % journey.length;
    else if (event.key === 'ArrowLeft') next = (index + journey.length - 1) % journey.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = journey.length - 1;
    else return;
    event.preventDefault(); select(next); refs.current[next]?.focus();
  }

  return <div className="prc-page">
    <section className="prc-hero content-width" aria-labelledby="process-page-title"><Label number="05">THE PROCESS</Label><div className="prc-hero-grid"><h1 id="process-page-title">From first hello<em>to first shipment.</em></h1><div className="prc-hero-copy"><p className="prc-hero-lead">A shared brief. Clear approvals.<br />A plan for what comes next.</p><p>Use this guide to understand the conversations, samples, documents, and decisions along the way.</p><Link className="prc-text-link" to="/contact">Start with your brief<span aria-hidden="true">↗</span></Link></div></div></section>

    <section className="prc-journey content-width" id="project-journey" aria-labelledby="process-journey-title"><div className="prc-journey-heading"><h2 id="process-journey-title">Your project, <em>step by step.</em></h2><p>Select a stage to explore the work<br className="prc-desktop-break" /> and the decisions along the way.</p></div>
      <div className="prc-tabs" role="tablist" aria-label="Explore the six project stages" aria-orientation="horizontal">{journey.map((item, index) => <button ref={node => { refs.current[index] = node; }} type="button" role="tab" key={stages[index].id} id={`${id}-stage-${index}`} aria-controls={panelId} aria-selected={selected === index} tabIndex={selected === index ? 0 : -1} onClick={() => select(index)} onKeyDown={event => keyDown(event, index)}><span className="prc-stage-marker">{number(index)}</span><span className="prc-tab-name">{item.title}</span></button>)}</div>

      <div className="prc-stage-panel" id={panelId} role="tabpanel" aria-labelledby={`${id}-stage-${selected}`} tabIndex={0} data-stage={stage.id}>
        <figure className="prc-stage-image"><img src={stage.image} alt={stage.alt} width="900" height="900" decoding="async" loading={selected === 0 ? 'eager' : 'lazy'} /><figcaption><span>{number(selected)} / {step.title}</span><span>ILLUSTRATIVE PROJECT STUDY</span></figcaption></figure>
        <div className="prc-stage-copy"><span className="kicker">{number(selected)} / {stage.label}</span><h3>{step.title}</h3><p className="prc-stage-description">{step.text}</p><dl className="prc-checkpoints"><div className="prc-output"><dt>WHAT TO EXPECT</dt><dd>{step.output}</dd></div><div className="prc-approval"><dt>YOUR CHECKPOINT</dt><dd>{step.approval}</dd></div></dl><Link className="prc-text-link" to={`/contact?question=${encodeURIComponent(`I'd like to discuss the ${step.title} stage of a project.`)}`}>Discuss this stage<span aria-hidden="true">↗</span></Link>
          <div className="prc-stage-controls"><button type="button" disabled={selected === 0} onClick={() => select(selected - 1)} aria-label={selected > 0 ? `Previous stage: ${journey[selected - 1].title}` : 'Previous stage'}><span aria-hidden="true">←</span>Previous</button><span>{number(selected)} / 06</span><button type="button" disabled={selected === journey.length - 1} onClick={() => select(selected + 1)} aria-label={selected < journey.length - 1 ? `Next stage: ${journey[selected + 1].title}` : 'Next stage'}>Next<span aria-hidden="true">→</span></button></div>
        </div>
      </div><p className="visually-hidden" role="status">Viewing stage {selected + 1} of {journey.length}: {step.title}</p>
    </section>

    <section className="prc-planning content-width" aria-labelledby="process-planning-title"><div className="prc-planning-intro"><span className="kicker">BEFORE YOU BEGIN</span><h2 id="process-planning-title">Agree the details.<br /><em>Shape the brief.</em></h2><p>Every project starts from a different place. Discuss the scope, costs, order quantities, and schedule with Babylon before committing.</p></div><dl>{planning.map(([title, text], index) => <div key={title}><dt><span aria-hidden="true">{number(index)}</span>{title}</dt><dd>{text}</dd></div>)}</dl></section>

    <section className="prc-reorder content-width" aria-labelledby="process-reorder-title"><Label number="07">READY FOR YOUR NEXT BATCH?</Label><div className="prc-reorder-grid"><h2 id="process-reorder-title">Keep the learning.<br /><em>Plan the reorder.</em></h2><div><p>Reference the approved product specification and prior lot. Discuss any changes to the formula, packaging, quantities, or markets before a new order.</p><p>Agree on reorder terms and the review of requested changes with Babylon.</p><Link className="prc-text-link" to={`/contact?question=${encodeURIComponent("I'd like to discuss a reorder and any changes to a previous product specification.")}`}>Discuss a reorder<span aria-hidden="true">↗</span></Link></div></div></section>
    <PageReview page="process" />
  </div>;
}
