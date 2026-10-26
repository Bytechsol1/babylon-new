import chemistryReference from '../assets/chemistry-reference.png';

export default function ChemistrySection({ onOpen }) {
  return (
    <section className="chemistry-section" aria-labelledby="chemistry-title">
      <div className="chemistry-section-top">
        <span>01 / A DIFFERENT KIND OF CHEMISTRY</span>
        <span className="chemistry-rule" aria-hidden="true" />
        <span>YOUR VISION. OUR ELEMENT.</span>
      </div>

      <div className="chemistry-grid">
        <h2 className="chemistry-title" id="chemistry-title">
          <span>Serious</span>
          <span>science.</span>
          <em>Unexpected<br />possibilities.</em>
        </h2>

        <figure className="chemistry-art">
          <img
            src={chemistryReference}
            alt="A glass dish of cream, a golden serum droplet, and a glass sphere surrounded by a fine gold orbit, illustrating precision and intuition."
            width="1590"
            height="690"
            loading="lazy"
            decoding="async"
          />
        </figure>

        <div className="chemistry-copy">
          <p className="chemistry-lead">For the founders who see things differently. The formulators who ask better questions. The brands ready to make their mark.</p>
          <p className="chemistry-description">We connect advanced cosmetic chemistry with an instinct for what feels extraordinary. From first bench sample to full-scale production, we’re your formulation partner.</p>
          <button className="chemistry-cta" data-panel="project" onClick={() => onOpen('project')}>
            <span className="chemistry-cta-circle" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></span>
            <span className="chemistry-cta-label">Find your starting point</span>
          </button>
        </div>
      </div>

      <div className="chemistry-section-bottom">
        <span>WHERE SCIENCE MEETS POSSIBILITY.</span>
        <span>From first idea to full-scale production.</span>
      </div>
    </section>
  );
}
