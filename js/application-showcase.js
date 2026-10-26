import { enhanceApplicationShowcase } from './application-showcase-motion.js';

const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

function screenshot(state, className = '', decorative = false) {
  return `<img class="${className}" src="${escape(state.src)}" alt="${decorative ? '' : escape(state.alt)}" width="${state.width}" height="${state.height}" decoding="async">`;
}

// The same escaped, data-driven markup supplies the enhanced view and static fallback.
export function applicationShowcaseMarkup(item) {
  const p = item.presentation;
  const states = item.media.states;
  const current = states.find(state => state.id === item.media.defaultState) || states[0];
  const byId = id => states.find(state => state.id === id);
  const icon = '<svg class="yoink-summary-icon" aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M3 4h14M3 10h10M3 16h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  const fullsizeName = state => `Open full-resolution ${state.label} screenshot of Y.O.I.N.K. with synthetic sample content`;
  return `<article id="${escape(item.id)}" class="yoink-feature" data-work-id="${escape(item.id)}" data-kind="${escape(item.kind)}" data-classification="${escape(item.classification)}" aria-labelledby="work-${escape(item.id)}-title">
  <header class="yoink-heading">
    <div class="yoink-identity"><h3 id="work-${escape(item.id)}-title">${escape(item.title)}</h3><p class="yoink-subtitle editorial">${escape(item.subtitle)}</p><p class="yoink-project-type">${escape(p.projectType)}</p></div>
    <div class="yoink-intro"><p>${escape(p.intro.before)} <span class="yoink-wishlist">${escape(p.intro.aside)}</span> ${escape(p.intro.after)}</p><div class="yoink-links">${item.links.map(link => `<a href="${escape(link.href)}">${escape(link.displayLabel || link.label)}</a>`).join('')}</div></div>
  </header>
  <div class="yoink-story"><p>${p.problem.lines.map(escape).join('<br>')}</p><p>${escape(p.problem.copy)}</p></div>
  <div class="yoink-explorer">
    <div class="yoink-panel" id="${escape(item.id)}-panel">
      <div class="yoink-canvas" data-view="${escape(current.id)}">
        <div class="yoink-colour-field" aria-hidden="true"></div>
        <div class="yoink-back" aria-hidden="true">${screenshot(byId('preview'), '', true)}</div>
        <div class="yoink-front"><a class="yoink-fullsize" href="${escape(current.src)}" target="_blank" rel="noopener" aria-label="${escape(fullsizeName(current))}">${screenshot(current, 'yoink-selected-image')}</a></div>
        <div class="yoink-small" aria-hidden="true">${screenshot(byId('setup'), '', true)}</div>
      </div>
      <div class="yoink-view-description"><h4 class="yoink-view-title">${escape(current.title)}</h4><p class="yoink-view-copy">${escape(current.copy)}</p></div>
    </div>
    <div class="yoink-tabs" hidden aria-label="Explore Y.O.I.N.K. application views">${states.map(state => `<button type="button" id="${escape(item.id)}-tab-${escape(state.id)}" data-state="${escape(state.id)}">${escape(state.label)}</button>`).join('')}</div>
    <span class="yoink-gallery-status" role="status" aria-live="polite"></span>
    <div class="yoink-fallback"><p>Explore more application views:</p>${states.filter(state => state !== current).map(state => `<details><summary>${escape(state.label)}</summary><figure><a href="${escape(state.src)}" target="_blank" rel="noopener" aria-label="${escape(fullsizeName(state))}">${screenshot(state)}</a><figcaption>${escape(state.copy)}</figcaption></figure></details>`).join('')}</div>
  </div>
  <div class="yoink-continuation">
    <div><p class="yoink-workflow-title">${escape(p.workflow.title)}</p><p>${escape(p.workflow.copy)}</p><p class="yoink-stack">${item.technologies.slice(0, 3).map(escape).join(' · ')}<span>${escape(p.distribution)}</span></p></div>
    <aside class="yoink-roadmap" aria-labelledby="${escape(item.id)}-roadmap-title"><h4 id="${escape(item.id)}-roadmap-title">${escape(p.roadmap.title)}</h4><p class="yoink-roadmap-status">${escape(p.roadmap.status)}</p><dl>${p.roadmap.items.map(entry => `<div><dt>${escape(entry.title)}${entry.summaryIcon ? ` ${icon}` : ''}</dt><dd>${escape(entry.copy)}</dd></div>`).join('')}</dl><a href="${escape(p.roadmap.href)}">${escape(p.roadmap.linkLabel)}</a>${p.roadmap.notes.map(note => `<p class="yoink-roadmap-scope">${escape(note)}</p>`).join('')}</aside>
  </div>
</article>`;
}

export function renderApplicationShowcase(item) {
  const template = document.createElement('template');
  template.innerHTML = applicationShowcaseMarkup(item);
  const article = template.content.firstElementChild;
  enhanceApplicationShowcase(article, item.media);
  return article;
}
