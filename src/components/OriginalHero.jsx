import MaterialStudy from './MaterialStudy.jsx';

export default function OriginalHero({ onOpen }) {
  return (
    <section className="hero" aria-labelledby="original-hero-heading">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-line" aria-hidden="true" />COSMETIC SCIENCE, REIMAGINED</div>
        <h1 id="original-hero-heading">Cosmetics,<br /><em>engineered.</em></h1>
        <div className="intro"><p>Cosmetic formulation and contract manufacturing for your brand.</p><p className="hero-subline">Bring a formula, a product brief, or an idea.<br />Find your starting point with OEM, ODM, or co-development.</p></div>
        <div className="hero-actions"><button className="button primary-cta" data-panel="project" onClick={() => onOpen('project')}>Start a project <span aria-hidden="true">↗</span></button><button className="text-button" data-panel="science" onClick={() => onOpen('science')}>Explore the science <span aria-hidden="true">↓</span></button></div>
      </div>


      <MaterialStudy onOpen={onOpen} />
    </section>
  );
}
