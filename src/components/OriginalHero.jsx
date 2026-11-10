import MaterialStudy from './MaterialStudy.jsx';

export default function OriginalHero({ onOpen }) {
  return (
    <section className="hero" aria-labelledby="original-hero-heading">
      <div className="hero-copy">
        <h1 id="original-hero-heading">Cosmetics, <br /><em>engineered.</em></h1>
        <div className="intro"><p>We formulate, manufacture and fill skincare and personal-care products for brands.</p><p className="hero-subline">We build production technology in house,<br />including a manufacturing execution system with lot traceability.</p></div>
        <div className="hero-actions"><button className="button primary-cta" data-panel="project" onClick={() => onOpen('project')}>Start a project <span aria-hidden="true">→</span></button></div>
      </div>
      <MaterialStudy />
    </section>
  );
}
