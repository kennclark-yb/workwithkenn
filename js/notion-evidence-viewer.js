// Optional enlargement only: the inline evidence and direct image links work without JS.
let initialized = false;

function node(tag, className, text) {
  const result = document.createElement(tag);
  if (className) result.className = className;
  if (text) result.textContent = text;
  return result;
}

function approvedImageURL(value) {
  const url = new URL(value, document.baseURI);
  const approved = new URL('assets/projects/executive/command-center-dashboard.webp', document.baseURI);
  return url.origin === location.origin && url.origin === approved.origin && url.pathname === approved.pathname
    && !url.search && !url.hash && !url.username && !url.password ? url.href : null;
}

export function initializeNotionEvidenceViewer() {
  if (initialized || typeof HTMLDialogElement === 'undefined'
    || typeof HTMLDialogElement.prototype.showModal !== 'function') return;
  initialized = true;
  let dialog;
  let initiator;
  let motionTimer;
  let motionVersion = 0;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  function finishMotion(phase, version) {
    if (version !== motionVersion || !dialog?.open) return;
    clearTimeout(motionTimer);
    if (phase === 'closing') dialog.close();
    else delete dialog.dataset.motion;
  }

  function startMotion(phase) {
    const version = ++motionVersion;
    clearTimeout(motionTimer);
    if (phase === 'closing') {
      // Exit from the currently painted frame, including an interrupted entrance.
      const current = getComputedStyle(dialog);
      dialog.style.setProperty('--nv-exit-opacity', current.opacity);
      dialog.style.setProperty('--nv-exit-transform', current.transform);
      dialog.style.setProperty('--nv-backdrop-opacity', getComputedStyle(dialog, '::backdrop').opacity);
    }
    dialog.dataset.motion = phase;
    if (reducedMotion.matches || getComputedStyle(dialog).animationName === 'none') {
      finishMotion(phase, version);
      return;
    }
    // A bounded fallback also covers canceled animations or missing completion events.
    motionTimer = setTimeout(() => finishMotion(phase, version), phase === 'opening' ? 320 : 290);
  }

  function requestClose() {
    if (!dialog?.open || dialog.dataset.motion === 'closing') return;
    startMotion('closing');
  }

  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches && dialog?.dataset.motion) {
      finishMotion(dialog.dataset.motion, motionVersion);
    }
  });

  document.addEventListener('click', event => {
    const link = event.target instanceof Element && event.target.closest('a[data-notion-viewer]');
    if (!link || event.defaultPrevented || event.button !== 0
      || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const source = approvedImageURL(link.href);
    if (!source) return;
    event.preventDefault();
    if (dialog?.open) return;
    initiator = link;

    if (!dialog) {
      dialog = node('dialog', 'notion-viewer');
      dialog.setAttribute('aria-labelledby', 'notion-viewer-title');
      dialog.setAttribute('aria-describedby', 'notion-viewer-description');
      dialog.addEventListener('cancel', event => {
        event.preventDefault();
        requestClose();
      });
      dialog.addEventListener('animationend', event => {
        const phase = dialog.dataset.motion;
        if (event.target === dialog && event.animationName ===
          (phase === 'closing' ? 'nv-window-out' : 'nv-window-in')) {
          finishMotion(phase, motionVersion);
        }
      });
      dialog.addEventListener('keydown', keyboardEvent => {
        if (keyboardEvent.key !== 'Tab') return;
        const controls = [...dialog.querySelectorAll('button:not(:disabled),a[href],[tabindex="0"]')];
        const first = controls[0];
        const last = controls.at(-1);
        if (keyboardEvent.shiftKey && document.activeElement === first) {
          keyboardEvent.preventDefault();
          last.focus();
        } else if (!keyboardEvent.shiftKey && document.activeElement === last) {
          keyboardEvent.preventDefault();
          first.focus();
        }
      });
      dialog.addEventListener('close', () => {
        ++motionVersion;
        clearTimeout(motionTimer);
        delete dialog.dataset.motion;
        for (const property of ['--nv-exit-opacity', '--nv-exit-transform', '--nv-backdrop-opacity']) {
          dialog.style.removeProperty(property);
        }
        document.documentElement.classList.remove('notion-viewer-open');
        const returnTarget = initiator?.isConnected ? initiator : document.querySelector('[data-notion-viewer]');
        returnTarget?.focus({ preventScroll: true });
      });
      dialog.addEventListener('click', backdropEvent => {
        const bounds = dialog.getBoundingClientRect();
        if (backdropEvent.target === dialog && (backdropEvent.clientX < bounds.left
          || backdropEvent.clientX > bounds.right || backdropEvent.clientY < bounds.top
          || backdropEvent.clientY > bounds.bottom)) requestClose();
      });
      document.body.append(dialog);
    }

    const header = node('header', 'nv-window-bar');
    const title = node('h2', 'nv-title', link.dataset.viewerTitle);
    title.id = 'notion-viewer-title';
    const zoom = node('div', 'nv-zoom');
    zoom.setAttribute('role', 'group');
    zoom.setAttribute('aria-label', 'Screenshot display size');
    const fit = node('button', '', 'Fit');
    const actual = node('button', '', '100%');
    for (const control of [fit, actual]) control.type = 'button';
    fit.setAttribute('aria-label', 'Fit screenshot to window width');
    actual.setAttribute('aria-label', 'Show screenshot at original pixel size');
    zoom.append(fit, actual);
    const close = node('button', 'nv-close');
    const cross = node('span', '', '×');
    cross.setAttribute('aria-hidden', 'true');
    close.append(cross);
    close.type = 'button';
    close.autofocus = true;
    close.setAttribute('aria-label', 'Close Notion workspace viewer');
    close.addEventListener('click', requestClose);
    header.append(title, zoom, close);

    const description = node('p', 'nv-description', 'Static workspace screenshot · scroll vertically and horizontally to explore. Use Fit for an overview or 100% for detail.');
    description.id = 'notion-viewer-description';
    const viewport = node('div', 'nv-image-scroll');
    viewport.tabIndex = 0;
    viewport.setAttribute('role', 'region');
    viewport.setAttribute('aria-label', 'Full Command Center screenshot. Scroll vertically; at 100% also scroll horizontally.');
    const image = node('img');
    Object.assign(image, { src: source, alt: link.dataset.viewerAlt,
      width: Number(link.dataset.viewerWidth), height: Number(link.dataset.viewerHeight), decoding: 'async' });
    viewport.dataset.zoom = 'actual';
    fit.setAttribute('aria-pressed', 'false');
    actual.setAttribute('aria-pressed', 'true');
    viewport.append(image);
    function setZoom(mode) {
      const previousWidth = image.getBoundingClientRect().width;
      const previousTop = viewport.scrollTop;
      viewport.dataset.zoom = mode;
      fit.setAttribute('aria-pressed', String(mode === 'fit'));
      actual.setAttribute('aria-pressed', String(mode === 'actual'));
      const width = image.getBoundingClientRect().width;
      viewport.scrollTop = previousWidth ? previousTop * width / previousWidth : 0;
      viewport.scrollLeft = mode === 'actual' ? Math.max(0, (width - viewport.clientWidth) / 2) : 0;
    }
    fit.addEventListener('click', () => setZoom('fit'));
    actual.addEventListener('click', () => setZoom('actual'));
    dialog.replaceChildren(header, description, viewport);
    dialog.showModal();
    // Initialize at original size before showing; center the captured workspace horizontally.
    setZoom('actual');
    viewport.scrollTop = 0;
    document.documentElement.classList.add('notion-viewer-open');
    close.focus({ preventScroll: true });
    startMotion('opening');
  });
}
