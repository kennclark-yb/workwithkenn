import { logoSettings as settings } from './logo-settings.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const forced = matchMedia('(forced-colors: active)');
const connection = navigator.connection;
const header = document.querySelector('.site-header');
const link = header?.querySelector('.identity');
let mount, timer, observer, host, starting = false, disposed = false;

const useStatic = () => reduced.matches || forced.matches || connection?.saveData;
function stop() { clearInterval(timer); timer = undefined; }
function policy() {
  stop();
  if (disposed) return;
  if (!mount) { void initialize(); return; }
  const fallback = useStatic();
  host.hidden = Boolean(fallback);
  const paused = fallback || document.hidden || (header.classList.contains('is-hidden') && !header.matches(':focus-within'));
  host.dataset.motion = paused ? 'paused' : 'live';
  if (paused) return;
  let previous = performance.now();
  timer = setInterval(() => {
    const now = performance.now();
    try { mount.setFrame(mount.getCurrentFrame() + Math.min(now - previous, 200) * settings.speed); }
    catch (error) { fail(error); }
    previous = now;
  }, 1000 / settings.updatesPerSecond);
}
function fail(error) {
  if (disposed) return;
  stop();
  disposed = true;
  observer?.disconnect();
  mount?.dispose();
  host?.remove();
  if (link) link.dataset.material = 'fallback';
  console.warn('Metallic logo unavailable; static KC. retained.', error);
}
async function initialize() {
  if (starting || disposed || mount) return;
  if (useStatic()) { link.dataset.material = 'static'; return; }
  starting = true;
  try {
    await document.fonts.ready;
    const [{ ShaderMount }, shader, image] = await Promise.all([
      import('../vendor/paper/shader-mount.js'), import(settings.shader),
      (async () => { const image = new Image(); image.src = new URL(settings.image, import.meta.url).href; await image.decode(); return image; })(),
    ]);
    if (disposed) return;
    host = document.createElement('span');
    host.className = 'kc-material';
    host.setAttribute('aria-hidden', 'true');
    host.style.setProperty('--kc-opacity', settings.opacity);
    link.prepend(host);
    mount = new ShaderMount(host, shader[settings.exportName], {
      u_fit: 1, u_scale: settings.scale, u_rotation: 0,
      u_originX: .5, u_originY: .5, u_offsetX: 0, u_offsetY: 0,
      u_worldWidth: 0, u_worldHeight: 0, ...settings.uniforms, u_image: image,
    }, { alpha: true, antialias: false, powerPreference: 'low-power' },
    0, settings.frame, 2, settings.maxPixelCount);
    host.querySelector('canvas').addEventListener('webglcontextlost', event => {
      event.preventDefault(); fail(new Error('Logo WebGL context lost'));
    });
    link.dataset.material = 'ready';
    policy();
  } catch (error) { fail(error); }
  finally { starting = false; }
}

if (link) {
  observer = new MutationObserver(policy);
  observer.observe(header, { attributes: true, attributeFilter: ['class'] });
  for (const preference of [reduced, forced]) preference.addEventListener('change', policy);
  connection?.addEventListener('change', policy);
  document.addEventListener('visibilitychange', policy);
  header.addEventListener('focusin', policy);
  header.addEventListener('focusout', policy);
  window.addEventListener('pagehide', event => {
    stop();
    if (!event.persisted) { disposed = true; observer.disconnect(); mount?.dispose(); }
  });
  window.addEventListener('pageshow', event => { if (event.persisted) policy(); });
  policy();
}
