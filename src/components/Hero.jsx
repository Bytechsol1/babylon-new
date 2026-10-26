import { useEffect, useRef, useState } from 'react';
import { createFrameSequence } from '../frameSequence.js';

// Scroll progress at which each stage of the footage begins.
const stages = [
  { number: '01', name: 'Formulate', from: 0 },
  { number: '02', name: 'Refine', from: .42 },
  { number: '03', name: 'Scale', from: .66 },
];

// Push in towards the middle of the footage, then pull back out for the final line-up.
const MAX_ZOOM = .16;
const zoomAt = progress => 1 + MAX_ZOOM * Math.sin(Math.PI * progress) ** 2;

export default function Hero() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const [stage, setStage] = useState(0);
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    return createFrameSequence(canvasRef.current, {
      section,
      onProgress(progress) {
        section.style.setProperty('--progress', progress.toFixed(4));
        setStage(stages.findLastIndex(s => progress >= s.from));
      },
      onLoad: fraction => setLoaded(Math.round(fraction * 100)),
      zoom: zoomAt,
    });
  }, []);

  return (
    <section ref={sectionRef} className="frame-hero" aria-labelledby="hero-heading">
      <h1 id="hero-heading" className="visually-hidden">Babylon. Beauty, engineered.</h1>
      <div className="frame-hero-stage">
        <canvas
          ref={canvasRef}
          className="frame-hero-canvas"
          role="img"
          aria-label="A serum is formulated, whipped into a cream, filled into amber bottles and finished as a product line-up before a navy arch."
        />

        <div className="frame-hero-cue" aria-hidden="true">SCROLL TO EXPLORE <span>↓</span></div>

        <ol className="frame-hero-stages" aria-hidden="true">
          {stages.map((s, i) => (
            <li key={s.number} className={i === stage ? 'active' : undefined}>
              <span>{s.number}</span>{s.name.toUpperCase()}
            </li>
          ))}
        </ol>

        <div className="frame-hero-track" aria-hidden="true">
          <span className="frame-hero-loaded" style={{ transform: `scaleX(${loaded / 100})` }} hidden={loaded === 100} />
          <span className="frame-hero-progress" />
        </div>
      </div>
    </section>
  );
}
