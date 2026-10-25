import { BACKGROUND_MODE, backgrounds } from './background-settings.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const small = matchMedia('(max-width: 899px)');
const coarse = matchMedia('(pointer: coarse)');
const forced = matchMedia('(forced-colors: active)');
const connection = navigator.connection;
const host = document.createElement('div');
host.className = 'site-atmosphere';
host.inert = true;
host.setAttribute('aria-hidden', 'true');
const variant = backgrounds[BACKGROUND_MODE];
let mount, timer, frame, lastTime;
let disposed = false;

function fallback(error) {
  disposed = true;
  clearInterval(timer);
  delete document.body.dataset.shaderBackground;
  host.remove();
  mount?.dispose();
  console.warn('Shader background unavailable; CSS atmosphere retained.', error);
}
function pixelBudget() {
  return small.matches || coarse.matches
    ? (variant.resolution?.mobilePixels || 150000)
    : (variant.resolution?.desktopPixels || 350000);
}
function policy() {
  clearInterval(timer);
  if (!mount || disposed) return;
  mount.setMaxPixelCount(pixelBudget());
  host.hidden = forced.matches;
  const still = !variant.timeScale || reduced.matches || small.matches || coarse.matches
    || forced.matches || connection?.saveData || document.hidden;
  host.dataset.motion = still ? 'still' : 'slow';
  if (still) return;
  lastTime = performance.now();
  timer = setInterval(() => {
    if (document.hidden || disposed) return;
    const now = performance.now();
    frame += Math.min(now - lastTime, 250) * variant.timeScale;
    lastTime = now;
    try { mount.setFrame(frame); } catch (error) { fallback(error); }
  }, 1000 / (variant.updatesPerSecond || 10));
}

try {
  if (!variant) throw new Error('Unknown background mode');
  if (forced.matches || !window.WebGL2RenderingContext) throw new Error('Shader background not supported');
  const [{ ShaderMount }, { fragment, uniforms }] = await Promise.all([
    import('../vendor/paper/shader-mount.js'), variant.load(),
  ]);
  frame = variant.frame;
  host.dataset.variant = BACKGROUND_MODE;
  host.style.setProperty('--atmosphere-opacity', variant.opacity);
  document.body.prepend(host);
  mount = new ShaderMount(host, fragment, {
    u_fit: 2, u_scale: 1, u_rotation: 0,
    u_originX: .5, u_originY: .5, u_offsetX: 0, u_offsetY: 0,
    u_worldWidth: 0, u_worldHeight: 0, ...variant.sizing, ...uniforms,
  }, { alpha: false, antialias: false, powerPreference: 'low-power' },
  0, frame, variant.resolution?.minPixelRatio || .65, pixelBudget());
  host.querySelector('canvas').addEventListener('webglcontextlost', event => {
    event.preventDefault();
    if (!disposed) fallback(new Error('Background WebGL context lost'));
  });
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  mount.setFrame(frame);
  host.dataset.ready = 'true';
  document.body.dataset.shaderBackground = 'ready';
  policy();
  for (const preference of [reduced, small, coarse, forced]) preference.addEventListener('change', policy);
  connection?.addEventListener('change', policy);
  document.addEventListener('visibilitychange', policy);
  window.addEventListener('pagehide', event => {
    clearInterval(timer);
    if (!event.persisted) { disposed = true; mount.dispose(); }
  });
  window.addEventListener('pageshow', event => { if (event.persisted) policy(); });
} catch (error) {
  fallback(error);
}
