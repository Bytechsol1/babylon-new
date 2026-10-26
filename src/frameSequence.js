export const FRAME_COUNT = 240;

const frameUrl = index => `${import.meta.env.BASE_URL}frames/frame_${String(index).padStart(5, '0')}.jpg`;

// Coarse passes first so any scroll position has a nearby frame early, then fill the gaps.
function loadOrder() {
  const order = [0, FRAME_COUNT - 1];
  const seen = new Set(order);
  for (const step of [24, 8, 2, 1]) {
    for (let i = 0; i < FRAME_COUNT; i += step) {
      if (!seen.has(i)) { seen.add(i); order.push(i); }
    }
  }
  return order;
}

/** Scrubs the frame sequence on a canvas as the pinned section scrolls past. */
export function createFrameSequence(canvas, { section, onProgress, onLoad, zoom = () => 1, concurrency = 6 }) {
  const ctx = canvas.getContext('2d', { alpha: false });
  const frames = new Array(FRAME_COUNT);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let target = 0, current = 0, drawn = -1, drawnZoom = 1, loaded = 0, raf = 0, disposed = false, stickyTop = 0;

  function nearestLoaded(index) {
    for (let d = 0; d < FRAME_COUNT; d++) {
      if (frames[index - d]) return index - d;
      if (frames[index + d]) return index + d;
    }
    return -1;
  }

  function draw() {
    const index = nearestLoaded(Math.round(current * (FRAME_COUNT - 1)));
    const scaleBy = reducedMotion.matches ? 1 : zoom(current);
    if (index < 0 || (index === drawn && scaleBy === drawnZoom)) return;
    const image = frames[index];
    const { width, height } = canvas;
    // Cover the stage like object-fit: cover, cropping from the centre, then apply the scroll zoom.
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight) * scaleBy;
    const w = image.naturalWidth * scale, h = image.naturalHeight * scale;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(image, (width - w) / 2, (height - h) / 2, w, h);
    drawn = index;
    drawnZoom = scaleBy;
    canvas.dataset.ready = 'true';
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
    onProgress?.(current);
    draw();
    if (current !== target) schedule();
  }

  function schedule() {
    if (!raf && !disposed) raf = requestAnimationFrame(tick);
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    // The stage pins below the sticky header, so scrubbing starts at that offset.
    stickyTop = parseFloat(getComputedStyle(canvas.parentElement).top) || 0;
    drawn = -1;
    measure();
    draw();
    schedule();
  }

  function onScroll() {
    measure();
    schedule();
  }

  const queue = loadOrder();
  async function worker() {
    while (queue.length && !disposed) {
      const index = queue.shift();
      const image = new Image();
      image.decoding = 'async';
      image.src = frameUrl(index);
      try {
        await image.decode();
      } catch {
        continue;
      }
      if (disposed) return;
      frames[index] = image;
      loaded++;
      onLoad?.(loaded / FRAME_COUNT);
      draw();
    }
  }
  for (let i = 0; i < concurrency; i++) worker();

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  window.addEventListener('scroll', onScroll, { passive: true });
  measure();
  current = target;

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    observer.disconnect();
    window.removeEventListener('scroll', onScroll);
    frames.length = 0;
  };
}
