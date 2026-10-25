// Keep native anchor navigation; only the header's visibility is enhanced.
const header = document.querySelector('.site-header');

if (header) {
  const scrollPosition = () => Math.max(0, Math.min(
    window.scrollY,
    document.documentElement.scrollHeight - window.innerHeight,
  ));
  let previousY = scrollPosition();
  let direction = 0;
  let distance = 0;
  let scheduled = false;

  const reveal = () => {
    header.classList.remove('is-hidden');
    direction = 0;
    distance = 0;
  };

  const update = () => {
    scheduled = false;
    const currentY = scrollPosition();
    const delta = currentY - previousY;
    previousY = currentY;

    if (currentY < 96 || header.matches(':focus-within, :hover')) {
      reveal();
      return;
    }
    if (!delta) return;

    const nextDirection = Math.sign(delta);
    if (nextDirection !== direction) distance = 0;
    direction = nextDirection;
    distance += Math.abs(delta);

    // Ignore small wheel/touch jitter; make returning to navigation easier.
    if (distance >= (direction > 0 ? 18 : 10)) {
      header.classList.toggle('is-hidden', direction > 0);
      distance = 0;
    }
  };

  window.addEventListener('scroll', () => {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(update);
    }
  }, { passive: true });
  header.addEventListener('focusin', reveal);
  window.addEventListener('pageshow', () => {
    previousY = scrollPosition();
    reveal();
  });
}
