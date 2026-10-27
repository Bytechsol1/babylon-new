import { useEffect, useRef, useState } from 'react';
import { createFrameSequence } from '../frameSequence.js';

const chapters = [
  {
    label: 'Our story',
    title: 'A little curiosity.',
    emphasis: 'A new kind of beauty.',
    description: 'Since 2016, Babylon has brought bold ideas to clean beauty. We combine cosmetic innovation with care for safety, quality and affordability.',
    detail: 'EST. 2016 · BUILT ON CURIOSITY',
  },
  {
    label: 'Our mission',
    title: 'Beautiful results.',
    emphasis: 'Thoughtful beginnings.',
    description: 'Clean, ethical and effective cosmetics, made with your well-being in mind. Because the beauty you create should reflect the things you believe in.',
    detail: 'CLEAN BEAUTY · CLEAR PURPOSE',
  },
  {
    label: 'Our standards',
    title: 'Care in every detail.',
    emphasis: 'Science in every drop.',
    description: 'Innovation drives us. Rigorous testing, carefully chosen ingredients and Good Manufacturing Practices guide every step, from formulation to packaging.',
    detail: 'INNOVATION · SAFETY · GMP',
  },
  {
    label: 'Your possibilities',
    title: 'Your next big idea.',
    emphasis: 'Room to begin.',
    description: 'High-quality clean beauty, within reach. With affordable pricing, low minimum orders and swift lead times, we help brands of every size bring their vision to life.',
    detail: 'LOW MOQ · SHORT LEAD TIMES · FAIR PRICING',
  },
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
    let dispose;
    // Start fetching the footage as this third section approaches the viewport.
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting) || dispose) return;
      dispose = createFrameSequence(canvasRef.current, {
        section,
        onProgress(progress) {
          section.style.setProperty('--progress', progress.toFixed(4));
          setStage(Math.min(chapters.length - 1, Math.floor(progress * chapters.length)));
        },
        onLoad: fraction => setLoaded(Math.round(fraction * 100)),
        zoom: zoomAt,
      });
      observer.disconnect();
    }, { rootMargin: '100% 0px' });
    observer.observe(section);
    return () => { observer.disconnect(); dispose?.(); };
  }, []);

  function goToChapter(index) {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const top = parseFloat(getComputedStyle(canvas.parentElement).top) || 0;
    const progress = index === 0 ? 0 : (index + .12) / chapters.length;
    window.scrollTo({
      top: section.getBoundingClientRect().top + window.scrollY - top + (section.offsetHeight - canvas.clientHeight) * progress,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }

  return (
    <section ref={sectionRef} className="frame-hero about-film" id="about" aria-labelledby="about-heading">
      <h2 id="about-heading" className="visually-hidden">About Babylon</h2>
      <div className="frame-hero-stage">
        <img className="about-film-poster" src={`${import.meta.env.BASE_URL}frames/frame_00000.jpg`} alt="" aria-hidden="true" loading="lazy" />
        <canvas
          ref={canvasRef}
          className="frame-hero-canvas"
          role="img"
          aria-label="A serum is formulated, whipped into a cream, filled into amber bottles and finished as a product line-up before a navy arch."
        />

        <div className="about-film-shade" aria-hidden="true" />
        <div className="about-film-edition" aria-hidden="true">BABYLON <span>EST. 2016</span></div>
        <div className="about-film-copy">
          {chapters.map((chapter, index) => (
            <article key={chapter.label} className={`about-chapter${index === stage ? ' is-active' : ''}`} aria-hidden={index !== stage}>
              <div className="about-chapter-index"><span aria-hidden="true" />{String(index + 1).padStart(2, '0')} / 04 <span aria-hidden="true" /></div>
              <p className="about-chapter-label">{chapter.label}</p>
              <h3>{chapter.title}<em>{chapter.emphasis}</em></h3>
              <p className="about-chapter-description">{chapter.description}</p>
              <p className="about-chapter-detail">{chapter.detail}</p>
            </article>
          ))}
        </div>

        <div className="about-film-footer">
          <div className="about-film-caption"><span />ABOUT BABYLON<span /></div>
          <nav className="about-film-chapters" aria-label="About Babylon chapters">
            {chapters.map((chapter, index) => <button key={chapter.label} type="button" aria-label={chapter.label} aria-current={index === stage ? 'step' : undefined} onClick={() => goToChapter(index)}><span className={index === stage ? 'is-active' : ''} /></button>)}
          </nav>
        </div>

        <div className="frame-hero-track" aria-hidden="true">
          <span className="frame-hero-loaded" style={{ transform: `scaleX(${loaded / 100})` }} hidden={loaded === 100} />
          <span className="frame-hero-progress" />
        </div>
      </div>
    </section>
  );
}
