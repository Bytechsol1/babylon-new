import { useEffect, useId, useRef, useState } from 'react';
import { services } from '../content.js';
import { Link } from '../router.jsx';
import serumImage from '../assets/partnership-serum.png';
import oemImage from '../assets/partnership-oem.png';
import coDevelopmentImage from '../assets/partnership-co-development.png';
import '../partnership.css';

const startingPoints = ['An existing formula', 'A product brief', 'A shared concept'];
const modelImages = {
  oem: { src: oemImage, alt: 'Gloved hands reviewing cream samples beside a clipboard and laboratory glassware.' },
  odm: { src: serumImage, alt: 'Gloved hands dispensing serum into a glass bottle at a cosmetics laboratory bench.' },
  'co-development': { src: coDevelopmentImage, alt: 'Two people discussing cream and gel samples beside serum bottles and a notebook.' },
};

function modelFromHash() {
  return Math.max(0, services.findIndex(service => window.location.hash === `#${service.id}`));
}

function ModelSymbol({ model }) {
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
    {model === 'oem' && <><path d="M5 5h9v9H5zM18 18h9v9h-9zM19 9h8v8M27 9l-9 9M5 20v7h7" /></>}
    {model === 'odm' && <><path d="M12 4h8M14 4v9L6 26a1.5 1.5 0 0 0 1.3 2.2h17.4A1.5 1.5 0 0 0 26 26l-8-13V4M10 21c4-3 8 3 12 0" /><circle cx="16" cy="18" r="1" /></>}
    {model === 'co-development' && <><circle cx="12" cy="16" r="9" /><circle cx="21" cy="16" r="9" /><path d="M16.5 9v14" /></>}
  </svg>;
}

export default function PartnershipModels({ syncHash = false }) {
  const [selected, setSelected] = useState(() => syncHash ? modelFromHash() : 0);
  const [vertical, setVertical] = useState(() => window.matchMedia('(min-width: 701px)').matches);
  const refs = useRef([]);
  const id = useId();
  const panelId = `${id}-model-panel`;
  const service = services[selected];
  const modelImage = modelImages[service.id];

  useEffect(() => {
    const media = window.matchMedia('(min-width: 701px)');
    const update = () => setVertical(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!syncHash) return;
    const update = () => setSelected(modelFromHash());
    window.addEventListener('hashchange', update);
    window.addEventListener('popstate', update);
    return () => {
      window.removeEventListener('hashchange', update);
      window.removeEventListener('popstate', update);
    };
  }, [syncHash]);

  function selectModel(index) {
    setSelected(index);
    if (syncHash) window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}#${services[index].id}`);
  }

  function keyDown(event, index) {
    let next;
    if (event.key === (vertical ? 'ArrowDown' : 'ArrowRight')) next = (index + 1) % services.length;
    else if (event.key === (vertical ? 'ArrowUp' : 'ArrowLeft')) next = (index + services.length - 1) % services.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = services.length - 1;
    else return;
    event.preventDefault();
    selectModel(next);
    refs.current[next]?.focus();
  }

  return <div className="partnership-models" data-model={service.id}>
    <figure className="partnership-image">
      <img src={serumImage} alt="Gloved hands preparing serum, with cosmetic samples and glassware on a sunlit laboratory bench." width="1536" height="1024" loading="lazy" />
      <figcaption><span>A PARTNERSHIP THAT FITS</span><span aria-hidden="true">01 — 03</span></figcaption>
    </figure>

    <div className="partnership-selector">
      <p className="kicker">YOUR STARTING POINT</p>
      <div className="partnership-tabs" role="tablist" aria-label="Three ways to work together" aria-orientation={vertical ? 'vertical' : 'horizontal'}>
        {services.map((item, index) => <button key={item.id} ref={node => { refs.current[index] = node; }} type="button" role="tab" id={`${id}-tab-${item.id}`} aria-controls={panelId} aria-selected={selected === index} tabIndex={selected === index ? 0 : -1} onClick={() => selectModel(index)} onKeyDown={event => keyDown(event, index)}>
          <span className="partnership-tab-number">0{index + 1}</span>
          <span className="partnership-tab-copy"><span>{item.name}</span><small>{startingPoints[index]}</small></span>
          <span className="partnership-tab-arrow" aria-hidden="true">→</span>
        </button>)}
      </div>
    </div>

    <div className="partnership-panel" role="tabpanel" id={panelId} aria-labelledby={`${id}-tab-${service.id}`} tabIndex={0}>
      <div className="partnership-panel-top"><span className="kicker">{service.name}</span><ModelSymbol model={service.id} /></div>
      <h2>{service.label}</h2>
      <p className="partnership-description">{service.description}</p>
      <div className="partnership-starting-point"><h3 className="kicker">YOU BRING</h3><p>{service.provides}</p></div>
      <img className="partnership-model-image" src={modelImage.src} alt={modelImage.alt} width="1536" height="1024" loading="lazy" />
      <details className="partnership-scope" key={service.id}>
        <summary>Babylon’s role &amp; project steps<span aria-hidden="true" /></summary>
        <div><h3 className="kicker">BABYLON’S ROLE</h3><p>{service.does}</p><h3 className="kicker">THE PROJECT STEPS</h3><ol>{service.steps.map(step => <li key={step}>{step}</li>)}</ol></div>
      </details>
      <div className="partnership-actions"><Link className="partnership-cta" to={`/contact?model=${encodeURIComponent(service.name)}`}>Start with {service.name}<span aria-hidden="true">↗</span></Link>
        {!syncHash && <Link className="partnership-more" to={`/services#${service.id}`}>Explore this model<span aria-hidden="true">→</span></Link>}
      </div>
    </div>
  </div>;
}
