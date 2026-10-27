import { useRef } from 'react';
import ChemistryAnimation from './ChemistryAnimation.jsx';

export default function ChemistrySection({ onOpen }) {
  const sectionRef = useRef(null);
  return (
    <div className="chemistry-scroll" ref={sectionRef}>
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

        <ChemistryAnimation sectionRef={sectionRef} />

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
    </div>
  );
}
