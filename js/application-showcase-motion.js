// Two decoded windows coexist during the reveal. The outgoing image never changes src.
export function enhanceApplicationShowcase(root, media) {
  const states = media.states;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const smallScreen = matchMedia('(max-width: 700px)');
  const tabs = root.querySelector('.yoink-tabs');
  const buttons = [...tabs.querySelectorAll('button')];
  const panel = root.querySelector('.yoink-panel');
  const canvas = root.querySelector('.yoink-canvas');
  const image = root.querySelector('.yoink-selected-image');
  const fullsize = root.querySelector('.yoink-fullsize');
  const back = root.querySelector('.yoink-back');
  const small = root.querySelector('.yoink-small');
  const status = root.querySelector('.yoink-gallery-status');
  let current = Math.max(0, states.findIndex(state => state.id === media.defaultState));
  let requested = current;
  let generation = 0;
  let active = [];
  let outgoing;

  const sources = new Map();
  function preload(src) {
    if (!sources.has(src)) {
      const img = new Image();
      img.src = src;
      const ready = img.decode().then(() => img);
      // A failed preload is handled when that state is requested, not globally.
      ready.catch(() => {});
      sources.set(src, { img, ready });
    }
    return sources.get(src);
  }
  states.forEach(state => preload(state.src));

  function settle() {
    active.forEach(animation => animation.cancel());
    active = [];
    outgoing?.remove();
    outgoing = null;
    delete root.dataset.windowTransition;
  }

  function write(index) {
    const state = states[index];
    buttons.forEach((button, i) => {
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', panel.id);
      button.setAttribute('aria-selected', String(i === index));
      button.tabIndex = i === index ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', buttons[index].id);
    canvas.dataset.view = state.id;
    image.src = state.src;
    image.alt = state.alt;
    image.width = state.width;
    image.height = state.height;
    fullsize.href = state.src;
    fullsize.setAttribute('aria-label', `Open full-resolution ${state.label} screenshot of Y.O.I.N.K. with synthetic sample content`);
    root.querySelector('.yoink-view-title').textContent = state.title;
    root.querySelector('.yoink-view-copy').textContent = state.copy;
    back.querySelector('img').src = states.find(s => s.id === (state.id === 'preview' ? 'results' : 'preview')).src;
    small.querySelector('img').src = states.find(s => s.id === (['input', 'setup'].includes(state.id) ? 'scratchpad' : 'setup')).src;
    current = index;
    panel.removeAttribute('aria-busy');
    status.textContent = '';
  }

  function play(element, frames, duration) {
    const animation = element.animate(frames, { duration, easing: 'cubic-bezier(.22,1,.36,1)' });
    active.push(animation);
    return animation;
  }

  function commit(index, animate, token) {
    if (token !== generation) return;
    const direction = index >= current ? 1 : -1;
    settle();
    const moving = animate && !reduced.matches && index !== current && root.isConnected;
    const canvasRect = canvas.getBoundingClientRect();
    const rect = image.getBoundingClientRect();
    if (moving) {
      outgoing = image.cloneNode(false);
      outgoing.className = 'yoink-window-outgoing';
      outgoing.alt = '';
      outgoing.setAttribute('aria-hidden', 'true');
      Object.assign(outgoing.style, { left: `${rect.left - canvasRect.left}px`, top: `${rect.top - canvasRect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
      canvas.append(outgoing);
    }
    write(index);
    if (!moving) return;
    root.dataset.windowTransition = 'revealing';
    const mobile = smallScreen.matches;
    const duration = mobile ? 360 : 420;
    const distance = mobile ? 18 : 36;
    const clip = direction > 0 ? 'inset(0 0 0 20%)' : 'inset(0 20% 0 0)';
    play(outgoing, [
      { transform: 'translateX(0)', opacity: 1, clipPath: 'inset(0)' },
      { transform: `translateX(${-direction * distance}px)`, opacity: 0, clipPath: direction > 0 ? 'inset(0 18% 0 0)' : 'inset(0 0 0 18%)' },
    ], duration);
    play(image, [
      { transform: `translateX(${direction * distance}px)`, clipPath: clip },
      { transform: 'translateX(0)', clipPath: 'inset(0)' },
    ], duration);
    if (!mobile) {
      for (const [element, distance] of [[back, -6], [small, 4]]) {
        const original = getComputedStyle(element).transform;
        const base = original === 'none' ? '' : original;
        play(element, [{ transform: original }, { transform: `${base} translateX(${direction * distance}px)`, offset: .45 }, { transform: original }], duration);
      }
    }
    Promise.allSettled(active.map(animation => animation.finished)).then(() => {
      if (token === generation) settle();
    });
  }

  function select(index, animate = true) {
    requested = index;
    const token = ++generation;
    const loaded = preload(states[index].src);
    // Keep the previous complete state until the requested image has decoded.
    panel.setAttribute('aria-busy', 'true');
    loaded.ready.then(() => commit(index, animate, token)).catch(() => {
      if (token !== generation) return;
      panel.removeAttribute('aria-busy');
      status.textContent = 'This screenshot could not load. The current view is retained.';
    });
  }

  tabs.setAttribute('role', 'tablist');
  panel.setAttribute('role', 'tabpanel');
  panel.tabIndex = 0;
  write(current);
  tabs.hidden = false;
  root.dataset.enhanced = 'true';
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(index));
    button.addEventListener('keydown', event => {
      let next;
      if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (index + 1) % states.length;
      if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (index + states.length - 1) % states.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = states.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      buttons[next].focus();
      select(next);
    });
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      settle();
      select(requested, false);
    }
  });
  window.addEventListener('resize', settle, { passive: true });
}
