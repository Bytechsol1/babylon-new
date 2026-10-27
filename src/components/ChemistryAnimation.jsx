import { useEffect, useId, useRef } from 'react';
import chemistryReference from '../assets/chemistry-reference.png';
import cleanPlate from '../assets/chemistry-clean-plate.png';
import starFreeReference from '../assets/chemistry-no-star.png';

const clamp = value => Math.min(1, Math.max(0, value));
const smooth = (start, end, value) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};

export default function ChemistryAnimation({ sectionRef }) {
  const id = useId();
  const trackRef = useRef(null);
  const artRef = useRef(null);
  const dropRef = useRef(null);
  const beadsRef = useRef(null);
  const rippleRef = useRef(null);
  const waveRef = useRef(null);
  const waveMapRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const art = artRef.current;
    const track = trackRef.current;
    const section = sectionRef.current;
    const desktop = window.matchMedia('(min-width: 1001px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;
    let current = 0;
    let target = 0;
    const waveCanvas = document.createElement('canvas');
    waveCanvas.width = 192;
    waveCanvas.height = 112;
    const waveContext = waveCanvas.getContext('2d');
    const wavePixels = waveContext.createImageData(192, 112);
    let previousWaveFrame = -1;

    function renderSurface(impact) {
      const frame = Math.round(impact * 180);
      if (frame === previousWaveFrame) return;
      previousWaveFrame = frame;
      const strength = Math.sin(impact * Math.PI) ** .8;
      waveRef.current.style.opacity = String(Math.min(1, strength * 2));
      const front = 10 + impact * 120;
      // A radial displacement map bends the photographed cream itself.
      // Flatten the circle to match the dish's perspective and lighting.
      const cos = Math.cos(-Math.PI / 18);
      const sin = Math.sin(-Math.PI / 18);
      for (let y = 0; y < 112; y++) {
        for (let x = 0; x < 192; x++) {
          const dx = 75 + x / 191 * 325 - 232;
          const dy = 170 + y / 111 * 170 - 248;
          const u = dx * cos + dy * sin;
          const v = (-dx * sin + dy * cos) / .34;
          const radius = Math.hypot(u, v);
          const offset = radius - front;
          const wave = Math.sin(offset / 8) * Math.exp(-((offset / 37) ** 2)) * strength;
          const nx = radius > 0 ? u / radius : 0;
          const ny = radius > 0 ? v / radius * .34 : 0;
          const i = (y * 192 + x) * 4;
          wavePixels.data[i] = 128 + Math.round((nx * cos - ny * sin) * wave * 105);
          wavePixels.data[i + 1] = 128 + Math.round((nx * sin + ny * cos) * wave * 105);
          wavePixels.data[i + 2] = 128;
          wavePixels.data[i + 3] = 255;
        }
      }
      waveContext.putImageData(wavePixels, 0, 0);
      waveMapRef.current.setAttribute('href', waveCanvas.toDataURL());
    }

    function render(progress) {
      const fall = smooth(.08, .77, progress);
      const absorb = smooth(.57, .86, progress);
      const scaleX = 1 + Math.sin(absorb * Math.PI) * .22 - absorb * .22;
      const scaleY = 1 - absorb * .72;
      // Scale around the droplet centre, then lower it into the cream.
      dropRef.current.setAttribute('transform', `translate(230 ${100 + fall * 142}) scale(${scaleX} ${scaleY}) translate(-230 -100)`);
      dropRef.current.style.opacity = String(1 - smooth(.69, .88, progress));
      beadsRef.current.setAttribute('transform', `translate(0 ${smooth(.2, .85, progress) * 210})`);
      beadsRef.current.style.opacity = String(1 - smooth(.65, .88, progress));
      const impact = clamp((progress - .53) / .47);
      renderSurface(impact);
      [...rippleRef.current.children].forEach((ring, index) => {
        const phase = clamp((impact - index * .16) / (1 - index * .16));
        const radius = 10 + phase * (112 - index * 12);
        ring.style.opacity = String(Math.sin(phase * Math.PI) * (1 - index * .18));
        ring.querySelectorAll('ellipse').forEach(ellipse => {
          ellipse.setAttribute('rx', String(radius));
          ellipse.setAttribute('ry', String(radius * .32));
        });
      });
      glowRef.current.style.opacity = String(smooth(.57, .9, progress) * .25);
      art.dataset.progress = progress.toFixed(3);
    }

    function measure() {
      const element = desktop.matches ? section : track;
      const rect = element.getBoundingClientRect();
      const pinned = desktop.matches ? section.firstElementChild : art;
      const top = parseFloat(getComputedStyle(pinned).top) || 96;
      // A short final page still needs enough reachable scroll to finish the drop.
      const start = rect.top + window.scrollY - top;
      const available = document.documentElement.scrollHeight - window.innerHeight - start;
      const distance = Math.max(1, Math.min(rect.height - pinned.offsetHeight, available));
      target = reduced.matches ? 0 : clamp((top - rect.top) / distance);
    }

    function tick() {
      raf = 0;
      const delta = target - current;
      current = Math.abs(delta) < .0005 ? target : current + delta * .18;
      render(current);
      if (current !== target) raf = requestAnimationFrame(tick);
    }

    function update() {
      measure();
      if (!raf) raf = requestAnimationFrame(tick);
    }

    const observer = new ResizeObserver(update);
    observer.observe(section);
    observer.observe(art);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    reduced.addEventListener('change', update);
    desktop.addEventListener('change', update);
    measure();
    current = target;
    render(current);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      reduced.removeEventListener('change', update);
      desktop.removeEventListener('change', update);
    };
  }, [sectionRef]);

  const photo = src => <image href={src} x="-565" y="-80" width="1590" height="690" preserveAspectRatio="none" />;

  return <div className="chemistry-art-track" ref={trackRef}>
    <figure className="chemistry-art chemistry-art-animated" ref={artRef}>
      <svg className="chemistry-scene" viewBox="0 0 510 545" role="img" aria-labelledby={`${id}-title`}>
        <title id={`${id}-title`}>Golden serum drops into a glass dish of cream as you scroll, combining precision and intuition.</title>
        <defs>
          <clipPath id={`${id}-drop`}>
            <path d="M230 54 C229 61 212 61 202 74 C190 88 191 111 200 125 C208 139 226 144 240 138 C259 132 268 116 267 99 C266 81 256 65 237 60 Z" />
          </clipPath>
          <clipPath id={`${id}-beads`}>
            <ellipse cx="230.5" cy="21" rx="8.2" ry="10.1" />
            <path d="M230 38 Q223 48 232 49 Q237 46 230 38Z" />
          </clipPath>
          <filter id={`${id}-soft`}><feGaussianBlur stdDeviation="2" /></filter>
          <mask id={`${id}-star-free`} maskUnits="userSpaceOnUse" x="378" y="30" width="106" height="122">
            <rect x="382" y="35" width="98" height="112" rx="5" fill="white" filter={`url(#${id}-soft)`} />
          </mask>
          <mask id={`${id}-photo-labels`} maskUnits="userSpaceOnUse" x="0" y="0" width="510" height="545">
            <rect width="510" height="545" fill="white" />
            <rect x="30" y="68" width="90" height="23" rx="4" fill="black" />
            <rect x="377" y="402" width="94" height="24" rx="4" fill="black" />
          </mask>
          <mask id={`${id}-erase`} maskUnits="userSpaceOnUse" x="175" y="0" width="110" height="155">
            <g fill="white" filter={`url(#${id}-soft)`}>
              <ellipse cx="231" cy="100" rx="45" ry="49" />
              <ellipse cx="230.5" cy="21" rx="13" ry="15" />
              <ellipse cx="231" cy="47" rx="11" ry="13" />
            </g>
          </mask>
          <linearGradient id={`${id}-absorb`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="white" />
            <stop offset=".78" stopColor="white" />
            <stop offset="1" stopColor="black" />
          </linearGradient>
          <mask id={`${id}-surface`} maskUnits="userSpaceOnUse" x="150" y="0" width="170" height="257">
            <rect x="150" width="170" height="257" fill={`url(#${id}-absorb)`} />
          </mask>
          <radialGradient id={`${id}-gold`}>
            <stop stopColor="#dfac42" stopOpacity=".8" />
            <stop offset="1" stopColor="#e9be62" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-wave-blend`}>
            <stop offset="0" stopColor="white" />
            <stop offset=".7" stopColor="white" />
            <stop offset="1" stopColor="black" />
          </radialGradient>
          <mask id={`${id}-wave-area`} maskUnits="userSpaceOnUse" x="75" y="170" width="325" height="170">
            <ellipse cx="232" cy="248" rx="145" ry="53" transform="rotate(-10 232 248)" fill={`url(#${id}-wave-blend)`} />
          </mask>
          <filter id={`${id}-cream-wave`} filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" x="75" y="170" width="325" height="170" colorInterpolationFilters="sRGB">
            <feImage ref={waveMapRef} x="75" y="170" width="325" height="170" preserveAspectRatio="none" result="wave-map" />
            <feDisplacementMap in="SourceGraphic" in2="wave-map" scale="15" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id={`${id}-ripple-soft`} x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation=".9" /></filter>
        </defs>
        <rect x="28" y="66" width="94" height="27" fill="#faf7f1" />
        <rect x="375" y="400" width="98" height="28" fill="#faf7f1" />
        <g mask={`url(#${id}-photo-labels)`}>{photo(chemistryReference)}</g>
        <g mask={`url(#${id}-star-free)`}>{photo(starFreeReference)}</g>
        <g mask={`url(#${id}-erase)`}>{photo(cleanPlate)}</g>
        <g ref={waveRef} mask={`url(#${id}-wave-area)`} opacity="0" aria-hidden="true">
          <g filter={`url(#${id}-cream-wave)`}>{photo(chemistryReference)}</g>
        </g>
        <ellipse ref={glowRef} cx="232" cy="248" rx="86" ry="32" fill={`url(#${id}-gold)`} opacity="0" />
        <g ref={rippleRef} transform="rotate(-10 232 248)" fill="none" aria-hidden="true">
          {[0, 1, 2].map(index => <g key={index} opacity="0">
            <ellipse cx="232" cy="249.5" rx="10" ry="3.2" stroke="#a98a55" strokeWidth="2.4" strokeOpacity=".18" filter={`url(#${id}-ripple-soft)`} />
            <ellipse cx="232" cy="247" rx="10" ry="3.2" stroke="#fffbee" strokeWidth="2.4" strokeOpacity=".45" filter={`url(#${id}-ripple-soft)`} />
          </g>)}
        </g>
        <g mask={`url(#${id}-surface)`}>
          <g ref={dropRef}><g clipPath={`url(#${id}-drop)`}>{photo(chemistryReference)}</g></g>
          <g ref={beadsRef}><g clipPath={`url(#${id}-beads)`}>{photo(chemistryReference)}</g></g>
        </g>
      </svg>
      <span className="chemistry-callout chemistry-callout-precision" aria-hidden="true">Precision</span>
      <span className="chemistry-callout chemistry-callout-intuition" aria-hidden="true">Intuition</span>
    </figure>
  </div>;
}
