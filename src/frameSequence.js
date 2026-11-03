export const FRAME_COUNT = 240;
const frameUrl = index => `${import.meta.env.BASE_URL}frames/frame_${String(index).padStart(5, '0')}.jpg`;
const anchors = [0, 60, 120, 180, FRAME_COUNT - 1];

/** Scrub the original footage, loading nearby frames instead of all 240 at once. */
export function createFrameSequence(canvas, { section, onProgress, onLoad, zoom = () => 1, concurrency = 6 }) {
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return () => {};
  const frames = new Map();
  const inFlight = new Set();
  const failed = new Set();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compact = window.matchMedia('(max-width: 800px)');
  let queue = [], workers = 0, target = 0, current = 0, drawn = -1, drawnZoom = 1, raf = 0, disposed = false, stickyTop = 0;

  function nearestLoaded(index) {
    let nearest = -1, distance = Infinity;
    for (const key of frames.keys()) if (Math.abs(key - index) < distance) { nearest = key; distance = Math.abs(key - index); }
    return nearest;
  }
  function draw() {
    const index = nearestLoaded(reducedMotion.matches ? 0 : Math.round(current * (FRAME_COUNT - 1)));
    const scaleBy = reducedMotion.matches ? 1 : zoom(current);
    if (index < 0 || (index === drawn && scaleBy === drawnZoom)) return;
    const image = frames.get(index);
    const { width, height } = canvas;
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight) * scaleBy;
    const w = image.naturalWidth * scale, h = image.naturalHeight * scale;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(image, (width - w) / 2, (height - h) / 2, w, h);
    drawn = index; drawnZoom = scaleBy;
    canvas.dataset.ready = 'true'; canvas.dataset.frame = String(index);
  }
  function trimCache() {
    const limit = compact.matches ? 12 : 24;
    const desired = Math.round(target * (FRAME_COUNT - 1));
    const removable = [...frames.keys()].filter(index => !anchors.includes(index)).sort((a, b) => Math.abs(b - desired) - Math.abs(a - desired));
    while (frames.size > limit && removable.length) frames.delete(removable.shift());
  }
  async function load(index) {
    workers++; inFlight.add(index);
    try {
      const image = new Image(); image.decoding = 'async'; image.src = frameUrl(index);
      await image.decode();
      if (disposed) return;
      frames.set(index, image); trimCache();
      onLoad?.(reducedMotion.matches ? 1 : anchors.filter(key => frames.has(key)).length / anchors.length);
      draw();
    } catch { failed.add(index); }
    finally { workers--; inFlight.delete(index); if (!disposed) pump(); }
  }
  function pump() {
    const limit = compact.matches ? Math.min(3, concurrency) : concurrency;
    while (queue.length && workers < limit && !disposed) {
      const index = queue.shift();
      if (!frames.has(index) && !inFlight.has(index) && !failed.has(index)) load(index);
    }
  }
  function requestFrames() {
    const index = Math.round(target * (FRAME_COUNT - 1));
    const wanted = reducedMotion.matches ? [0] : [index, index + 1, index - 1, ...anchors, index + 2, index - 2, index + 3, index - 3];
    queue = [...new Set(wanted)].filter(key => key >= 0 && key < FRAME_COUNT && !frames.has(key) && !inFlight.has(key) && !failed.has(key));
    pump();
  }
  function measure() {
    const rect = section.getBoundingClientRect();
    const distance = rect.height - canvas.clientHeight;
    target = distance > 0 ? Math.min(Math.max((stickyTop - rect.top) / distance, 0), 1) : 0;
  }
  function tick() {
    raf = 0;
    const delta = target - current;
    current = reducedMotion.matches || Math.abs(delta) < .0004 ? target : current + delta * .14;
    onProgress?.(current); draw();
    if (current !== target) schedule();
  }
  function schedule() { if (!raf && !disposed) raf = requestAnimationFrame(tick); }
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    stickyTop = parseFloat(getComputedStyle(canvas.parentElement).top) || 0;
    drawn = -1; measure(); trimCache(); requestFrames(); draw(); schedule();
  }
  function onScroll() { measure(); requestFrames(); schedule(); }
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  window.addEventListener('scroll', onScroll, { passive: true });
  reducedMotion.addEventListener('change', onScroll);
  measure(); current = target; requestFrames();
  return () => {
    disposed = true; cancelAnimationFrame(raf); observer.disconnect();
    window.removeEventListener('scroll', onScroll);
    reducedMotion.removeEventListener('change', onScroll);
    queue = []; frames.clear();
  };
}
