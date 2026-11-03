import { useEffect, useId, useRef, useState } from 'react';
import { capabilities } from '../content.js';
import { Link } from '../router.jsx';
import PageReview from './PageReview.jsx';
import labImage from '../assets/capabilities-lab.webp';
import formulationImage from '../assets/capabilities/formulation.webp';
import emulsionImage from '../assets/capabilities/emulsion-science.webp';
import materialsImage from '../assets/capabilities/materials-selection.webp';
import processImage from '../assets/capabilities/process-engineering.webp';
import scaleImage from '../assets/capabilities/scale-up.webp';
import qualityImage from '../assets/capabilities/quality-control.webp';
import '../capabilities.css';

const methods = [
  { id: 'formulation', label: 'BRIEF → FORMULA', symbol: 'M12 3h8M14 3v9L7 26h18l-7-14V3M10 21h12' },
  { id: 'emulsion-science', label: 'PHASES & TEXTURE', symbol: 'M19 16a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM29 16a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z' },
  { id: 'materials-selection', label: 'MATERIALS & PACKAGING', symbol: 'm16 3 13 7-13 7L3 10Zm-13 14 13 7 13-7M3 23l13 7 13-7' },
  { id: 'process-engineering', label: 'METHOD & REPEATABILITY', symbol: 'M4 4h8v8H4zM20 20h8v8h-8zM12 8h12v12M8 12v12h12' },
  { id: 'scale-up', label: 'SAMPLE → PRODUCTION', symbol: 'M3 27V17h6v10Zm10 0V10h6v17Zm10 0V3h6v24Z' },
  { id: 'quality-control', label: 'SPECIFICATIONS & REVIEW', symbol: 'M8 5h16v24H8zM12 5V2h8v3M12 13l2 2 5-5M12 22h8' },
];
const number = index => String(index + 1).padStart(2, '0');
const methodImages = [
  { src: formulationImage, alt: 'Illustrative study of an amber serum droplet above ivory cream in a glass dish.' },
  { src: emulsionImage, alt: 'Illustrative macro study of golden and clear droplets suspended in laboratory glassware.' },
  { src: materialsImage, alt: 'Illustrative materials study with cream, powder, golden liquid, glass slides and a steel spatula.' },
  { src: processImage, alt: 'Illustrative laboratory mixing vessel and stainless steel stirrer with cosmetic cream.' },
  { src: scaleImage, alt: 'Illustrative scale-up study with three glass vessels of increasing size containing ivory cream.' },
  { src: qualityImage, alt: 'Illustrative quality review with gloved hands transferring a cosmetic sample into a glass dish.' },
];
const selectedFromHash = () => Math.max(0, methods.findIndex(method => `#${method.id}` === window.location.hash));

function Label({ number: index, children, aside = 'YOUR VISION. OUR ELEMENT.' }) {
  return <div className="section-label"><span>{index} / {children}</span><i aria-hidden="true" /><span>{aside}</span></div>;
}

function MethodStudy({ index }) {
  const image = methodImages[index];
  return <figure className={`cap-method-study cap-study-${index}`}>
    <img className="cap-study-photo" src={image.src} alt={image.alt} width="900" height="900" loading="lazy" decoding="async" />
    <div className="cap-study-top"><span>METHOD STUDY</span><span>{number(index)} / 06</span></div>
    <figcaption><span>{methods[index].label}</span><span>ILLUSTRATIVE STUDY</span></figcaption>
  </figure>;
}

export default function CapabilitiesPage() {
  const [selected, setSelected] = useState(selectedFromHash);
  const [vertical, setVertical] = useState(() => window.matchMedia('(min-width: 701px)').matches);
  const refs = useRef([]);
  const id = useId();
  const panelId = `${id}-capability-panel`;

  useEffect(() => {
    const media = window.matchMedia('(min-width: 701px)');
    const updateOrientation = () => setVertical(media.matches);
    const updateHash = () => setSelected(selectedFromHash());
    media.addEventListener('change', updateOrientation);
    window.addEventListener('hashchange', updateHash);
    window.addEventListener('popstate', updateHash);
    return () => {
      media.removeEventListener('change', updateOrientation);
      window.removeEventListener('hashchange', updateHash);
      window.removeEventListener('popstate', updateHash);
    };
  }, []);

  function select(index) {
    setSelected(index);
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}#${methods[index].id}`);
  }
  function keyDown(event, index) {
    let next;
    if (event.key === (vertical ? 'ArrowDown' : 'ArrowRight')) next = (index + 1) % capabilities.length;
    else if (event.key === (vertical ? 'ArrowUp' : 'ArrowLeft')) next = (index + capabilities.length - 1) % capabilities.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = capabilities.length - 1;
    else return;
    event.preventDefault(); select(next); refs.current[next]?.focus();
  }
  const capability = capabilities[selected];

  return <div className="cap-page">
    <section className="cap-hero content-width" aria-labelledby="cap-page-title">
      <Label number="02">CAPABILITIES</Label>
      <div className="cap-hero-grid">
        <div className="cap-hero-copy"><span className="kicker">A DIFFERENT KIND OF CHEMISTRY</span><h1 id="cap-page-title">The science behind<em>your next product.</em></h1><p>From the way a formula feels to the way a batch is made, every development question has a method behind it.</p><p>Explore the methods. Discuss the project-specific scope with Babylon.</p><a className="cap-text-link" href="#capability-methods">Explore the capabilities<span aria-hidden="true">↓</span></a></div>
        <figure className="cap-hero-image"><img src={labImage} alt="Gloved hands dispensing serum into a glass bottle beside formulation samples and laboratory glassware." width="1200" height="800" fetchPriority="high" /><figcaption><span>PRECISION. CURIOSITY. POSSIBILITY.</span><span>ILLUSTRATIVE LAB IMAGERY</span></figcaption></figure>
      </div>
    </section>

    <section className="cap-methods content-width" id="capability-methods" aria-labelledby="cap-methods-heading">
      <Label number="01" aside="EXPLORE THE METHODS">SIX CONNECTED AREAS</Label>
      <div className="cap-methods-heading"><h2 id="cap-methods-heading">Different questions.<br /><em>A closer look.</em></h2><p>Select a capability to explore the method<br className="cap-desktop-break" /> and the question behind it.</p></div>
      <div className="cap-explorer">
        <div className="cap-tabs" role="tablist" aria-label="Capabilities" aria-orientation={vertical ? 'vertical' : 'horizontal'}>{capabilities.map((item, index) => <button key={methods[index].id} ref={node => { refs.current[index] = node; }} type="button" role="tab" id={`${id}-tab-${index}`} aria-controls={panelId} aria-selected={selected === index} tabIndex={selected === index ? 0 : -1} onClick={() => select(index)} onKeyDown={event => keyDown(event, index)}>
          <span className="cap-tab-number">{number(index)}</span><span className="cap-tab-name">{item.title}</span><svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false"><path d={methods[index].symbol} /></svg>
        </button>)}</div>
        <div className="cap-panel" role="tabpanel" id={panelId} aria-labelledby={`${id}-tab-${selected}`} tabIndex={0} data-method={methods[selected].id}>
          <MethodStudy index={selected} />
          <div className="cap-panel-copy"><span className="kicker">{number(selected)} / {methods[selected].label}</span><h3>{capability.title}</h3><p className="cap-panel-description">{capability.text}</p><div className="cap-question"><span className="kicker">THE QUESTION BEHIND THE METHOD</span><p>{capability.question}</p></div><div className="cap-panel-footer"><span>EXPLORE. EVALUATE. DISCUSS.</span><span>{number(selected)} <i aria-hidden="true" /> 06</span></div></div>
        </div>
      </div>
    </section>

    <div className="cap-closing content-width" id="methods-with-discretion">
      <aside className="cap-discretion" aria-labelledby="cap-discretion-title">
        <div className="cap-discretion-seal" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="M15 23v-8a9 9 0 0 1 18 0v8M11 23h26v20H11zM24 31v5" /><circle cx="24" cy="30" r="1.5" /></svg></div>
        <span className="kicker">METHODS, WITH DISCRETION</span>
        <h2 id="cap-discretion-title">Some details<br /><em>belong in the lab.</em></h2>
        <p>This overview explains methods only. Customer formulas, ingredient percentages, and proprietary process settings are never published here.</p>
        <div className="cap-discretion-foot" aria-hidden="true"><span>BABYLON</span><i /><span>CAPABILITIES</span></div>
      </aside>
      <section className="cap-quality" aria-labelledby="cap-quality-title">
        <Link className="cap-quality-link" to="/quality" aria-labelledby="cap-quality-title cap-quality-link-label">
          <span className="cap-quality-emblem" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="19" /><path d="m15 24 6 6 13-14M24 1v7M24 40v7M1 24h7M40 24h7" /></svg></span>
          <span className="kicker">THE NEXT QUESTION / QUALITY</span>
          <h2 id="cap-quality-title">From the method<br /><em>to the checks.</em></h2>
          <span id="cap-quality-link-label">See how quality is evaluated</span>
          <span className="cap-quality-arrow" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><path d="M8 24 24 8M8 8h16v16" /></svg></span>
        </Link>
      </section>
    </div>
    <PageReview page="capabilities" />
  </div>;
}
