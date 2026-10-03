// CSS independently handles reduced motion, including when JavaScript fails.
export function initializeMotionPreference() {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const update = () => {
    document.documentElement.dataset.reducedMotion = String(preference.matches);
  };
  update();
  preference.addEventListener('change', update);
}
