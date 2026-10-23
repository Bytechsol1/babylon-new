import MaterialStudy from './MaterialStudy.jsx';

export default function Hero({ onOpen }) {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-copy">
        <div className="eyebrow"><span aria-hidden="true">+</span> COSMETIC SCIENCE, REIMAGINED</div>
        <h1 id="hero-heading">Beauty,<br /><em>engineered.</em><span className="heading-star" aria-hidden="true">✳</span></h1>
        <div className="intro"><span className="index" aria-hidden="true">(01—↗)</span><p>Bold ideas. Beautiful chemistry.<br />We turn your vision into high-performance formulations,<br className="desktop-break" /> made to feel different. And built to scale.</p></div>
        <div className="hero-actions"><button className="button primary-cta" data-panel="project" onClick={() => onOpen("project")}>Let’s make something remarkable <span aria-hidden="true">↗</span></button><button className="text-button" data-panel="science" onClick={() => onOpen("science")}>Explore the science <span aria-hidden="true">↓</span></button></div>
        <div className="copy-footer"><span>FROM MOLECULE TO MARKET.</span><span>FORMULATE / REFINE / SCALE</span></div>
      </div>


      <MaterialStudy onOpen={onOpen} />
    </section>
  );
}
