import { useEffect, useRef, useState } from 'react';

export default function MaterialStudy({ onOpen }) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const [study, setStudy] = useState(0);
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const stateRef = useRef({ study, paused });
  stateRef.current = { study, paused };

  useEffect(() => {
    let cancelled = false;
    import('../scene.js').then(({ createMaterialScene }) => {
      if (cancelled) return;
      sceneRef.current = createMaterialScene(canvasRef.current, {
        initialPaused: stateRef.current.paused,
        onReady: () => { if (!cancelled) setReady(true); },
        onContextLost: () => { if (!cancelled) { setReady(false); setUnavailable(true); } },
      });
      sceneRef.current.setStudy(stateRef.current.study);
    }).catch(() => { if (!cancelled) setUnavailable(true); });
    return () => {
      cancelled = true;
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => { sceneRef.current?.setStudy(study); }, [study]);
  useEffect(() => { sceneRef.current?.setPaused(paused); }, [paused]);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = event => setPaused(event.matches);
    preference.addEventListener('change', onChange);
    return () => preference.removeEventListener('change', onChange);
  }, []);

  return (
    <div className="visual-wrap">
      <div className="material-study" aria-label="Interactive 3D cosmetic material study">
        <div className="scene-fallback" aria-hidden="true" style={{ visibility: ready ? 'hidden' : 'visible' }}>
          <div className="fallback-arch" />
          <div className="fallback-podium" />
          <div className="fallback-bottle" style={{ filter: study ? 'saturate(.2) brightness(1.5)' : undefined }}>
            <i /><span>BABYLON<br /><small>THE DAILY FORMULA</small></span>
          </div>
          <div className="fallback-orb" />
        </div>
        <canvas ref={canvasRef} id="scene" className={ready ? 'ready' : ''} aria-label={`A 3D ${study ? 'cream jar' : 'amber serum bottle'}, navy architectural arch, and reflective silver sphere`} />
        <div className="visual-top">
          <span className="micro-label">BABYLON MATERIAL STUDIES</span>
          <span className="micro-label" id="study-number">{study ? 'NO. 002' : 'NO. 001'}</span>
        </div>
        <span className="visual-star" aria-hidden="true">✳</span>
        <div className="scene-caption">
          <span className="micro-label" id="study-title">{study ? 'A DAILY RITUAL, REIMAGINED.' : 'THE ART OF WHAT’S NEXT.'}</span>
          {!unavailable && <button id="motion-toggle" aria-label={paused ? 'Play 3D animation' : 'Pause 3D animation'} aria-pressed={paused} onClick={() => setPaused(value => !value)}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d={paused ? 'm5 3 7 5-7 5Z' : 'M6 4v8M10 4v8'} /></svg>
          </button>}
        </div>
        <span className="scene-hint" id="scene-hint">{unavailable ? 'MATERIAL STUDY' : <>MOVE TO EXPLORE <span>↗</span></>}</span>
      </div>
      <button className="science-seal" data-panel="science" onClick={() => onOpen('science')} aria-label="Discover science with a sensory soul">
        <span>SCIENCE WITH</span><span className="seal-star" aria-hidden="true">✳</span><span>A SENSORY SOUL</span>
      </button>
      <div className="study-controls">
        <span><i /> A NEW DIMENSION OF BEAUTY</span>
        <div>
          <button className={`study-dot${study === 0 ? ' active' : ''}`} data-study="0" aria-label="View amber serum study" aria-pressed={study === 0} onClick={() => setStudy(0)}>01</button>
          <span>/</span>
          <button className={`study-dot${study === 1 ? ' active' : ''}`} data-study="1" aria-label="View cream formulation study" aria-pressed={study === 1} onClick={() => setStudy(1)}>02</button>
        </div>
      </div>
    </div>
  );
}
