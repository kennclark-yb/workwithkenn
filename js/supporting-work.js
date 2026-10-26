// One escaped, data-driven template is used by both the renderer and static fallback.
const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));

function evidenceMarkup(media) {
  if (media?.type !== 'image-composition') throw new TypeError('Unsupported supporting media');
  return `<figure class="sw-evidence sw-notion-media sw-authentic-evidence" aria-label="Authentic Notion workspace evidence">
${media.regions.map(region => `  <div class="${escape(region.className)}"><picture><source media="(max-width:1000px)" srcset="${escape(region.compactSrc)}" width="${region.compactWidth}" height="${region.compactHeight}"><img src="${escape(region.src)}" width="${region.width}" height="${region.height}" alt="${escape(region.alt)}" loading="lazy" decoding="async"></picture><p class="ne-caption"><span>${escape(region.label)}</span><span>${escape(region.description)}</span></p></div>`).join('\n')}
  <figcaption>${escape(media.caption)}</figcaption>
  <a class="sw-view-workspace" href="${escape(media.viewer.src)}" target="_blank" rel="noopener" data-notion-viewer data-viewer-title="${escape(media.viewer.title)}" data-viewer-alt="${escape(media.viewer.alt)}" data-viewer-width="${media.viewer.width}" data-viewer-height="${media.viewer.height}"><span class="sw-view-copy"><span class="sw-view-label">${escape(media.viewer.ctaLabel)}</span><span class="sw-view-hint">${escape(media.viewer.ctaHint)}</span></span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M3 3l6 6m12-6-6 6M3 21l6-6m12 6-6-6"/></svg><span class="sw-sr-only"> — open authentic screenshot; opens an image in a new tab without JavaScript</span></a>
</figure>`;
}

function itemMarkup(item) {
  const presentation = item.presentation;
  if (!['operations', 'notion'].includes(presentation?.variant)) throw new TypeError('Unsupported supporting layout');
  const titleId = `work-${item.id}-title`;
  const heading = `<header class="sw-entry-heading"><p class="sw-classification">${escape(item.classification)}</p><h4 id="${escape(titleId)}">${escape(item.title)}</h4><p class="sw-summary">${escape(item.summary)}</p></header>`;
  let body;
  if (presentation.variant === 'operations') {
    const outcome = presentation.outcome;
    body = `<aside class="sw-evidence sw-outcome" aria-label="Required submission completion outcome"><p class="sw-evidence-label">${escape(outcome.label)}</p><p class="sw-result"><span>${escape(outcome.from)}</span><span class="sw-arrow" aria-hidden="true">→</span><span class="sw-sr-only">to</span><span>${escape(outcome.to)}</span></p><p class="sw-unit">${escape(outcome.unit)}</p><p class="sw-attribution">${escape(outcome.attribution)}</p></aside>
<div class="sw-process"><p class="sw-detail-heading">${escape(presentation.processTitle)}</p><ol aria-label="Conceptual operations process">${presentation.steps.map(step => `<li><strong>${escape(step.label)}</strong><span>${escape(step.detail)}</span></li>`).join('')}</ol></div>`;
  } else {
    body = `<div class="sw-workflows"><p class="sw-detail-heading">${escape(presentation.workflowTitle)}</p><dl>${presentation.workflows.map(workflow => `<div><dt>${escape(workflow.label)}</dt><dd>${escape(workflow.detail)}</dd></div>`).join('')}</dl></div>
${evidenceMarkup(item.media)}`;
  }
  return `<article class="sw-panel sw-${presentation.variant}" data-work-id="${escape(item.id)}" data-kind="${escape(item.kind)}" aria-labelledby="${escape(titleId)}">${heading}\n${body}</article>`;
}

export function supportingWorkMarkup(items, section) {
  return `<section class="sw-section" id="supporting" aria-labelledby="work-supporting-title"><div class="sw-section-heading"><h3 id="work-supporting-title">${escape(section.title)}</h3><p>${escape(section.intro)}</p></div><div class="sw-panels">${items.map(itemMarkup).join('\n')}</div></section>`;
}

export function renderSupportingWork(items, section) {
  const template = document.createElement('template');
  template.innerHTML = supportingWorkMarkup(items, section);
  return template.content.firstElementChild;
}
