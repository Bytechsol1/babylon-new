import { useEffect, useRef, useState } from 'react';
import { createFrameSequence } from '../frameSequence.js';
import '../frame-hero.css';
import { Link } from '../router.jsx';

const chapters = [
  { label: 'Our story', title: 'Making cosmetics', emphasis: 'since 2016.', description: 'We work in cosmetic formulation, manufacturing and filling. We are based in San Jose, California.', detail: 'SAN JOSE · CALIFORNIA' },
];

// Push in towards the middle of the footage, then pull back out for the final line-up.
const MAX_ZOOM = .16;
const zoomAt = progress => 1 + MAX_ZOOM * Math.sin(Math.PI * progress) ** 2;

export default function Hero() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    let dispose;
    // Start fetching the footage as this third section approaches the viewport.
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting) || dispose) return;
      dispose = createFrameSequence(canvasRef.current, {
        section,
        onProgress(progress) {
          section.style.setProperty('--progress', progress.toFixed(4));
        },
        onLoad: fraction => setLoaded(Math.round(fraction * 100)),
        zoom: zoomAt,
      });
      observer.disconnect();
    }, { rootMargin: '100% 0px' });
    observer.observe(section);
    return () => { observer.disconnect(); dispose?.(); };
  }, []);

  return (
    <section ref={sectionRef} className="frame-hero about-film" id="about" aria-labelledby="about-heading">
      <h2 id="about-heading" className="visually-hidden">About Babylon</h2>
      <div className="frame-hero-stage">
        <img className="about-film-poster" src={`${import.meta.env.BASE_URL}frames/frame_00000.jpg`} alt="" aria-hidden="true" loading="lazy" />
        <canvas
          ref={canvasRef}
          className="frame-hero-canvas"
          role="img"
          aria-label="Illustrative cosmetic sequence: a serum is formulated, whipped into a cream, filled into amber bottles and finished as a product line-up before a navy arch."
        />

        <div className="about-film-shade" aria-hidden="true" />
        <div className="about-film-edition" aria-hidden="true">BABYLON <span>EST. 2016</span></div>
        <div className="about-film-copy">
          {chapters.map(chapter => (
            <article key={chapter.label} className="about-chapter is-active">
              <p className="about-chapter-label">{chapter.label}</p>
              <h3>{chapter.title}<em>{chapter.emphasis}</em></h3>
              <p className="about-chapter-description">{chapter.description}</p>
              <p className="about-chapter-detail">{chapter.detail}</p>
            </article>
          ))}
        </div>

        <div className="about-film-footer">
          <Link className="about-film-caption" to="/about">About us<span aria-hidden="true">→</span></Link>
        </div>

        <div className="frame-hero-track" aria-hidden="true">
          <span className="frame-hero-loaded" style={{ transform: `scaleX(${loaded / 100})` }} hidden={loaded === 100} />
          <span className="frame-hero-progress" />
        </div>
      </div>
    </section>
  );
}
