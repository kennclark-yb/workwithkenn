// Progressive enhancement: native details remains usable without this module or WAAPI.
export function enhanceDisclosure(details) {
  const summary = details.querySelector('summary');
  const copy = details.querySelector('.interaction-evidence-copy');
  if (!summary || !copy || typeof details.animate !== 'function') return;

  // Clip only the animated content, keeping the native summary's focus ring intact.
  const content = document.createElement('div');
  content.className = 'disclosure-motion-content';
  copy.before(content);
  content.append(copy);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const paragraphs = [...copy.querySelectorAll('p')].map(node => ({ node, text: node.textContent }));
  let lines = [], measuredWidth = 0, expanded = details.open, heightAnimation;
  let lineAnimations = [], run = 0;

  function measureLines() {
    lines = [];
    for (const [groupIndex, group] of [...copy.children].entries()) {
      let localIndex = 0;
      for (const paragraph of paragraphs.filter(p => group.contains(p.node))) {
        const words = (paragraph.text.match(/\S+\s*/g) || []).map(word => {
          const span = document.createElement('span');
          span.textContent = word;
          return span;
        });
        paragraph.node.replaceChildren(...words);
        const rows = [];
        for (const word of words) {
          const top = word.getBoundingClientRect().top;
          if (!rows.length || Math.abs(rows.at(-1).top - top) > 2) rows.push({ top, text: '' });
          rows.at(-1).text += word.textContent;
        }
        paragraph.node.replaceChildren(...rows.map(row => {
          const mask = document.createElement('span');
          mask.className = 'disclosure-line';
          const text = document.createElement('span');
          text.className = 'disclosure-line-text';
          text.textContent = row.text;
          mask.append(text);
          lines.push({ node: text, delay: 45 + groupIndex * 100 + localIndex++ * 35 });
          return mask;
        }));
      }
    }
    measuredWidth = copy.clientWidth;
  }

  function settle() {
    run++;
    details.open = expanded;
    heightAnimation?.cancel();
    heightAnimation = null;
    for (const animation of lineAnimations) animation.cancel();
    lineAnimations = [];
    content.style.removeProperty('height');
    content.style.removeProperty('overflow');
    delete details.dataset.disclosureState;
  }

  function transition(opening) {
    const wasOpen = details.open;
    const currentHeight = wasOpen ? content.getBoundingClientRect().height : 0;
    const currentLines = new Map(lines.map(({ node }) => {
      const style = getComputedStyle(node);
      return [node, { opacity: style.opacity, transform: style.transform }];
    }));
    const reversing = Boolean(heightAnimation);
    expanded = opening;
    const thisRun = ++run;
    heightAnimation?.cancel();
    for (const animation of lineAnimations) animation.cancel();
    lineAnimations = [];
    content.style.height = `${currentHeight}px`;
    content.style.overflow = 'hidden';
    // Keep the native content laid out until the closing motion is complete.
    details.open = true;
    if (!lines.length || Math.abs(copy.clientWidth - measuredWidth) > 1) measureLines();
    details.dataset.disclosureState = opening ? 'opening' : 'closing';
    const targetHeight = opening ? copy.getBoundingClientRect().height : 0;
    const duration = opening ? Math.max(650, ...lines.map(line => line.delay + 320)) : 460;
    for (const [index, line] of lines.entries()) {
      const from = wasOpen ? (currentLines.get(line.node) || { opacity: 1, transform: 'translateY(0)' })
        : { opacity: 0, transform: 'translateY(105%)' };
      lineAnimations.push(line.node.animate([from, {
        opacity: opening ? 1 : 0,
        transform: opening ? 'translateY(0)' : 'translateY(105%)',
      }], {
        duration: opening ? 320 : 200,
        delay: opening ? (reversing ? index * 12 : line.delay) : (lines.length - index - 1) * 12,
        easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both',
      }));
    }
    heightAnimation = content.animate([{ height: `${currentHeight}px` }, { height: `${targetHeight}px` }], {
      duration, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both',
    });
    heightAnimation.finished.then(() => { if (thisRun === run) settle(); }).catch(() => {});
  }

  // Native summary activation dispatches click for pointer, Enter and Space.
  summary.addEventListener('click', event => {
    if (reduced.matches) { if (heightAnimation) settle(); return; }
    event.preventDefault();
    try { transition(heightAnimation ? !expanded : !details.open); }
    catch { settle(); } // Any optional animation failure leaves readable native content.
  });
  details.addEventListener('toggle', () => {
    if (!heightAnimation) expanded = details.open;
  });
  const preferenceChanged = () => { if (reduced.matches) settle(); };
  if (reduced.addEventListener) reduced.addEventListener('change', preferenceChanged);
  else reduced.addListener(preferenceChanged);

  function remeasure() {
    if (!details.open) return;
    if (heightAnimation) settle();
    if (details.open) measureLines();
  }
  if (typeof ResizeObserver === 'function') new ResizeObserver(() => {
    if (lines.length && Math.abs(details.clientWidth - measuredWidth) > 1) remeasure();
  }).observe(details);
  document.fonts?.ready.then(remeasure);
}
