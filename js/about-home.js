/* About's once-on-entry joke. No dependency on the global GSAP entrance layer. */
(() => {
  'use strict';
  const line = document.querySelector('#about [data-sp-lazy]');
  if (!line) return;
  const strike = line.querySelector('.sp-lazy-strike');
  const efficient = line.querySelector('.sp-efficient');
  line.classList.remove('sp-lazy-play');
  line.dataset.jokeState = 'static';
  if (!strike || !efficient || typeof window.matchMedia !== 'function' ||
      !('IntersectionObserver' in window) || typeof strike.animate !== 'function') return;
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  if (media.matches) return;
  let observer, animations = [], timer, played = false;
  function finish() {
    clearTimeout(timer);
    animations.forEach(animation => { try { animation.cancel(); } catch (_) {} });
    animations = [];
    line.dataset.jokeState = 'complete';
    observer?.disconnect();
    document.removeEventListener('visibilitychange', onHidden);
  }
  function onHidden() { if (document.hidden && played) finish(); }
  function start() {
    if (played || media.matches || document.hidden || !line.isConnected) return;
    played = true;
    line.dataset.jokeState = 'playing';
    try {
      animations.push(strike.animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}],
        {duration:450,delay:350,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'}));
      animations.push(efficient.animate([{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],
        {duration:350,delay:800,easing:'ease-out',fill:'backwards'}));
      Promise.all(animations.map(animation => animation.finished)).then(finish, finish);
      timer = setTimeout(finish, 1400);
      document.addEventListener('visibilitychange', onHidden);
    } catch (_) { finish(); }
  }
  try {
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (played) { if (!entry.isIntersecting) finish(); continue; }
        if (entry.isIntersecting && entry.intersectionRatio >= .7) start();
      }
    }, {threshold:[0,.7],rootMargin:'0px 0px -12% 0px'});
    line.dataset.jokeState = 'armed';
    observer.observe(line);
    const onPreference = event => {
      if (event.matches) { played = true; finish(); }
    };
    if (typeof media.addEventListener === 'function') media.addEventListener('change', onPreference);
    else if (typeof media.addListener === 'function') media.addListener(onPreference);
    window.addEventListener('pagehide', () => { if (played) finish(); });
  } catch (_) { played = true; finish(); }
})();
