import MaterialStudy from './MaterialStudy.jsx';

export default function Hero({ onOpen }) {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-line" aria-hidden="true" />COSMETIC SCIENCE, REIMAGINED</div>
        <h1 id="hero-heading">Beauty,<br /><em>engineered.</em></h1>
        <div className="intro"><p>Bold ideas. Beautiful chemistry.<br />High-performance formulations, made to feel different.<br />Built to scale.</p></div>
        <div className="hero-actions"><button className="button primary-cta" data-panel="project" onClick={() => onOpen('project')}>Let’s create your formula <span aria-hidden="true">↗</span></button><button className="text-button" data-panel="science" onClick={() => onOpen('science')}>Explore the science <span aria-hidden="true">↓</span></button></div>
      </div>


      <MaterialStudy onOpen={onOpen} />
    </section>
  );
}
