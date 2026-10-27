const hero = document.querySelector('.hero');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const animations = new Set();
let releaseEntrance = () => {};
const animate = (element, frames, options) => {
  if (!element || reduced.matches || typeof element.animate !== 'function') return null;
  const animation = element.animate(frames, { easing: 'cubic-bezier(.22,1,.36,1)', ...options });
  animations.add(animation);
  animation.finished.catch(() => {}).finally(() => {
    animations.delete(animation);
    if (!animations.size) releaseEntrance();
  });
  return animation;
};
reduced.addEventListener('change', () => {
  if (reduced.matches) for (const animation of animations) animation.cancel();
});

// Static HTML is visible until this optional enhancement runs. No startup deadline.
if (hero && !document.hidden && scrollY < 80 && ['', '#top', '#home'].includes(location.hash) && !reduced.matches) {
  const firstPaint = performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint');
  // A late module must not hide text the visitor may already be reading.
  const fromOpacity = firstPaint && performance.now() - firstPaint.startTime > 800 ? 1 : 0;
  const horizontalTravel = (element, direction) => {
    const box = element.getBoundingClientRect();
    const room = direction < 0 ? box.left : innerWidth - box.right;
    return direction * Math.min(40, Math.max(0, room - 2));
  };
  const given = hero.querySelector('.hero-given');
  const surname = hero.querySelector('.hero-surname');
  const entrances = [
    [document.querySelector('.site-nav'), 0, 520, 'translateY(-12px)'],
    [hero.querySelector('.hero-kicker'), 80, 400, 'translateY(0)'],
    [given, 180, 620, 'translateX(' + horizontalTravel(given, -1) + 'px)'],
    [surname, 260, 620, 'translateX(' + horizontalTravel(surname, 1) + 'px)'],
    [hero.querySelector('.hero-role-zone'), 620, 420, 'translateY(8px)'],
    [hero.querySelector('.hero-copy-zone'), 700, 420, 'translateY(8px)'],
  ];
  for (const [element, delay, duration, transform] of entrances) {
    animate(element, [{ opacity: fromOpacity, transform }, { opacity: 1, transform: 'translate(0)' }],
      { delay, duration, fill: 'backwards' });
  }
  const cancelEntrance = () => {
    for (const animation of animations) animation.cancel();
    releaseEntrance();
  };
  const events = [[window, 'scroll'], [window, 'hashchange'], [window, 'pagehide'],
    [document, 'keydown'], [document, 'pointerdown']];
  releaseEntrance = () => {
    for (const [target, type] of events) target.removeEventListener(type, cancelEntrance);
  };
  for (const [target, type] of events) target.addEventListener(type, cancelEntrance, { passive: true });
}

async function enhancePortrait(image) {
  if (!image || reduced.matches || document.hidden || !['', '#top', '#home'].includes(location.hash)) return;
  const figure = image.closest('.hero-portrait');
  const box = figure.getBoundingClientRect();
  if (box.bottom < 0 || box.top > innerHeight) return;
  let reveal, loading, stopSkeleton;
  let disposed = false;
  const cleanup = () => {
    disposed = true;
    stopSkeleton?.();
    loading?.remove();
    reveal?.destroy();
    image.style.removeProperty('--ar-o');
    reduced.removeEventListener('change', preferenceChanged);
    window.removeEventListener('pagehide', cleanup);
  };
  const preferenceChanged = () => { if (reduced.matches) cleanup(); };
  try {
    // Original, unmodified MIT core: see vendor/ascii-reveal/PROVENANCE.md.
    const core = await import('./vendor/ascii-reveal/core.js');
    if (reduced.matches) return;
    reveal = core.createAsciiReveal(figure, {
      preset: 'decode', duration: 'cinematic', speed: 1.15,
      selector: '[data-ascii="media"]', media: '[data-ascii="media"]',
      lazy: false, fallback: false,
    });
    reduced.addEventListener('change', preferenceChanged);
    window.addEventListener('pagehide', cleanup, { once: true });
    if (!image.complete) {
      // AsciiSkeleton is the pending state; AsciiReveal is the later media decode.
      if (!document.querySelector('[data-portrait-skeleton-css]')) {
        const style = document.createElement('style');
        style.dataset.portraitSkeletonCss = '';
        style.textContent = core.SKELETON_CSS;
        document.head.append(style);
      }
      loading = document.createElement('div');
      loading.className = 'portrait-loading';
      loading.setAttribute('aria-hidden', 'true');
      loading.style.fontSize = `${figure.clientHeight / 44}px`;
      const template = document.createElement('template');
      // Trusted markup returned by the local author's core, never user content.
      template.innerHTML = core.asciiSkeletonHTML({ variant: 'dither', rows: 44, css: false });
      loading.append(template.content);
      figure.append(loading);
      stopSkeleton = core.animateSkeletons(loading);
      figure.dataset.asciiState = 'loading';
      await new Promise(resolve => {
        const settled = () => {
          image.removeEventListener('load', settled);
          image.removeEventListener('error', settled);
          resolve();
        };
        image.addEventListener('load', settled, { once: true });
        image.addEventListener('error', settled, { once: true });
        if (image.complete) settled();
      });
    }
    if (disposed || !image.naturalWidth) return;
    await image.decode();
    if (disposed) return;
    stopSkeleton?.(); loading?.remove();
    figure.dataset.asciiState = 'revealing';
    // Cached/fast images also execute the real coarse-to-fine character-grid run.
    await reveal.reveal();
    figure.dataset.asciiState = 'complete';
  } catch (error) {
    figure.dataset.asciiState = 'fallback';
    console.warn('Portrait reveal unavailable; native image retained.', error);
  } finally {
    cleanup();
  }
}
enhancePortrait(hero?.querySelector('.hero-portrait img'));
