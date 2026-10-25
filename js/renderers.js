import { renderInteractionShowcase } from './interaction-showcase.js';

// DOM construction keeps content as text and layouts independent of project identity.
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function renderMedia(media) {
  if (!media) return null;
  if (media.type === 'interaction-showcase') return renderInteractionShowcase(media);
  if (media.type === 'system-atlas') return renderSystemAtlas(media);
  if (media.type === 'orchestration') {
    const figure = element('figure', 'work-media system-diagram');
    figure.append(element('p', 'metadata', media.label));
    const map = element('div', 'system-map');
    const node = (content, className) => {
      const group = element('div', className);
      group.append(element('p', 'system-node-title', content.label), element('p', 'system-node-detail', content.detail));
      if (content.output) group.append(element('p', 'system-return', content.output));
      if (content.actions) {
        const list = element('ul', 'system-actions');
        for (const action of content.actions) list.append(element('li', '', action));
        group.append(list);
      }
      return group;
    };
    map.append(element('p', 'metadata system-trigger', media.trigger));
    media.inputs.forEach((input, index) => map.append(node(input, `system-endpoint system-input system-input-${index + 1}`)));
    map.append(node(media.core, 'system-core'), node(media.state, 'system-state'));
    figure.append(map);
    figure.append(element('p', 'work-media-caption', media.description), element('figcaption', 'system-aside editorial', media.caption));
    return figure;
  }
  if (media.type === 'process') {
    const list = element('ol', 'work-process');
    list.setAttribute('aria-label', 'Coordination process');
    for (const step of media.steps) {
      const entry = element('li');
      entry.append(element('span', 'metadata', step.label), element('span', 'process-detail', step.detail));
      list.append(entry);
    }
    return list;
  }
  if (media.type === 'placeholder') {
    const figure = element('figure', 'work-media work-placeholder');
    figure.append(element('p', 'metadata', media.label),
      element('p', 'work-placeholder-title editorial', media.title),
      element('figcaption', 'work-media-caption', media.description));
    return figure;
  }
  if (media.type === 'workflow') {
    const figure = element('figure', 'work-media work-workflow');
    figure.append(element('p', 'metadata', media.label));
    if (media.core) {
      const core = element('div', 'workflow-core');
      core.append(element('p', 'workflow-core-title', media.core.label),
        element('p', 'metadata', media.core.detail));
      figure.append(core);
    }
    const paths = element('div', 'workflow-paths');
    for (const path of media.paths) {
      const group = element('div', 'workflow-path');
      group.append(element('p', 'workflow-path-title', path.title));
      if (path.detail) group.append(element('p', 'workflow-path-detail', path.detail));
      const steps = element('ol', 'workflow-steps');
      steps.setAttribute('aria-label', path.title);
      for (const step of path.steps) {
        const node = element('li', 'workflow-step');
        if (step.kind) node.dataset.stepKind = step.kind;
        node.append(element('span', '', step.label));
        if (step.detail) node.append(element('small', 'workflow-detail', step.detail));
        steps.append(node);
      }
      group.append(steps);
      paths.append(group);
    }
    figure.append(paths, element('figcaption', 'work-media-caption', media.description));
    return figure;
  }
  if (media.type === 'image') {
    const figure = element('figure', 'work-media');
    const image = element('img');
    image.src = media.src;
    image.alt = media.alt;
    image.loading = 'lazy';
    image.decoding = 'async';
    figure.append(image);
    if (media.caption) figure.append(element('figcaption', 'work-media-caption', media.caption));
    return figure;
  }
  if (media.type === 'evidence') {
    const evidence = element('div', 'work-evidence');
    if (media.metric) {
      const metric = element('p', 'work-metric');
      metric.setAttribute('aria-label', `${media.metric.label}: ${media.metric.from} to ${media.metric.to}`);
      const arrow = element('span', 'work-metric-arrow', '→');
      arrow.setAttribute('aria-hidden', 'true');
      metric.append(element('span', '', media.metric.from), arrow, element('span', '', media.metric.to));
      evidence.append(element('p', 'metadata', media.metric.label), metric);
    }
    if (media.label) evidence.append(element('p', 'metadata', media.label));
    return evidence;
  }
  throw new TypeError('Unsupported work media type');
}

// A reusable, content-driven system presentation; no project identity is inspected.
function renderSystemAtlas(media) {
  const figure = element('figure', 'work-media system-atlas');
  const head = element('div', 'atlas-heading');
  head.append(element('p', 'atlas-title', media.title));
  const controls = element('div', 'atlas-controls');
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', 'Highlight system connections');
  // Controls are an enhancement. The complete map remains readable without them.
  controls.hidden = true;
  const map = element('div', 'atlas-map');
  const entry = element('div', 'atlas-entry');
  entry.append(element('span', 'atlas-entry-mark', '↓'), element('p', '', media.entry.label), element('span', 'atlas-small', media.entry.detail));
  const sources = element('div', 'atlas-sources');
  for (const source of media.sources) {
    const block = element('section', 'atlas-source');
    const heading = element('h4', 'atlas-service', source.label);
    block.append(heading, element('p', 'atlas-small', source.detail));
    const exchange = element('div', 'atlas-exchange');
    exchange.append(element('p', '', `→ ${source.reads}`), element('p', '', `← ${source.writes}`));
    block.append(exchange);
    sources.append(block);
  }
  const core = element('section', 'atlas-core');
  core.append(element('p', 'atlas-core-name', media.core.name), element('h4', 'atlas-core-title', media.core.label), element('p', 'atlas-core-detail', media.core.detail));
  const actions = element('ul', 'atlas-actions');
  media.core.actions.forEach(action => actions.append(element('li', '', action)));
  core.append(actions, element('p', 'atlas-guard', media.core.guard));
  const delivery = element('div', 'atlas-delivery');
  delivery.append(element('p', 'atlas-outbound', `${media.conversation.outbound} →`), element('p', 'atlas-inbound', `← ${media.conversation.inbound}`));
  const conversation = element('section', 'atlas-conversation');
  conversation.append(element('h4', 'atlas-service', media.conversation.label), element('p', 'atlas-small', media.conversation.detail));
  const example = element('div', 'atlas-command');
  example.append(element('p', 'atlas-command-name', media.conversation.example), element('p', 'atlas-small', media.conversation.exampleDetail));
  conversation.append(example);
  const memory = element('section', 'atlas-memory');
  const memoryHead = element('div', 'atlas-memory-heading');
  memoryHead.append(element('h4', '', media.state.label), element('p', 'atlas-small', media.state.detail));
  const memoryBody = element('div', 'atlas-memory-body');
  memoryBody.append(element('p', '', media.state.memory), element('p', 'atlas-small', media.state.reason));
  memory.append(memoryHead, memoryBody);
  map.append(sources, entry, core, memory, delivery, conversation);
  const explanation = element('p', 'atlas-explanation', media.modes[0].detail);
  explanation.setAttribute('aria-live', 'polite');
  const safety = element('div', 'atlas-safety');
  const safetyTitle = element('p', 'atlas-safety-title', media.safeguard.label);
  const safetyCopy = element('div');
  safetyCopy.append(element('p', '', media.safeguard.detail), element('p', 'atlas-small', media.safeguard.note));
  safety.append(safetyTitle, safetyCopy);
  const scope = element('details', 'atlas-scope');
  scope.append(element('summary', '', media.scope.label));
  const scopeCopy = element('div', 'atlas-scope-copy');
  scopeCopy.append(element('p', '', media.scope.verified), element('p', '', media.scope.planned));
  scope.append(scopeCopy);
  head.append(controls);
  figure.append(head, map, explanation, safety, scope, element('p', 'atlas-verification atlas-small', media.scope.pending), element('figcaption', 'atlas-aside editorial', media.caption));
  for (const mode of media.modes) {
    const button = element('button', 'atlas-mode', mode.label);
    button.type = 'button';
    button.setAttribute('aria-pressed', String(mode.id === media.modes[0].id));
    button.addEventListener('click', () => {
      figure.dataset.mode = mode.id;
      explanation.textContent = mode.detail;
      for (const control of controls.children) control.setAttribute('aria-pressed', String(control === button));
    });
    controls.append(button);
  }
  figure.dataset.mode = media.modes[0].id;
  controls.hidden = false;
  return figure;
}

function renderDetails(item) {
  const details = element('div', 'work-details');
  if (item.status) details.append(element('p', 'metadata work-status', item.status));
  if (item.stackLabel) details.append(element('p', 'metadata work-stack-label', item.stackLabel));
  if (item.technologies?.length) {
    const list = element('ul', 'work-technologies');
    list.setAttribute('aria-label', 'Technologies and evidence');
    for (const technology of item.technologies) list.append(element('li', '', technology));
    details.append(list);
  }
  if (item.links?.length) {
    const links = element('div', 'work-links');
    for (const link of item.links) {
      const url = new URL(link.href, document.baseURI);
      if (!['https:', 'http:'].includes(url.protocol)) throw new TypeError('Unsupported work link protocol');
      const anchor = element('a', 'text-link', link.label);
      anchor.href = link.href;
      links.append(anchor);
    }
    details.append(links);
  }
  if (item.note) {
    const note = element('div', 'work-note');
    if (item.noteLabel) note.append(element('p', 'metadata', item.noteLabel));
    note.append(element('p', 'work-note-copy', item.note));
    details.append(note);
  }
  return details;
}

function renderItem(item, primary, position) {
  const splitMasthead = ['system', 'showcase'].includes(item.homepage.layout);
  const article = element('article', primary ? 'work-feature' : 'work-supporting-item');
  article.dataset.workId = item.id;
  article.dataset.mediaSide = item.homepage.mediaSide || 'right';
  article.dataset.kind = item.kind;
  if (item.homepage.layout) article.dataset.layout = item.homepage.layout;
  const titleId = `work-${item.id}-title`;
  article.setAttribute('aria-labelledby', titleId);
  const intro = element('div', 'work-intro');
  const title = element(primary ? 'h3' : 'h4', 'work-item-title', item.title);
  title.id = titleId;
  if (primary) {
    const masthead = element('header', 'work-masthead');
    const metadata = element('div', 'work-masthead-meta');
    if (splitMasthead) {
      metadata.append(element('p', 'metadata work-number', `${String(position).padStart(2, '0')} / FEATURED WORK — ${item.classification}`));
    } else {
      metadata.append(element('p', 'metadata work-number', `${String(position).padStart(2, '0')} / FEATURED WORK`), element('p', 'metadata evidence-label', item.classification));
    }
    masthead.append(metadata, title);
    if (item.subtitle) masthead.append(element('p', 'work-subtitle', item.subtitle));
    if (splitMasthead) masthead.append(element('p', 'work-summary', item.summary));
    if (item.runtimeHighlight) {
      const highlight = element('div', 'work-runtime-highlight');
      highlight.append(element('p', 'work-runtime-title', item.runtimeHighlight.title));
      for (const line of item.runtimeHighlight.lines) highlight.append(element('p', '', line));
      masthead.append(highlight);
    }
    if (item.technologyMarks?.length) {
      const marks = element('div', 'work-technology-marks');
      marks.setAttribute('role', 'img');
      marks.setAttribute('aria-label', item.technologyMarks.map(mark => mark.name).join(' + '));
      item.technologyMarks.forEach((mark, index) => {
        if (index) {
          const separator = element('span', '', '+');
          separator.setAttribute('aria-hidden', 'true');
          marks.append(separator);
        }
        const image = element('img');
        image.src = mark.src;
        image.alt = '';
        image.width = 32;
        image.height = 32;
        image.setAttribute('aria-hidden', 'true');
        marks.append(image);
      });
      masthead.append(marks);
    }
    article.append(masthead);
  } else {
    intro.append(element('p', 'metadata evidence-label', item.classification), title);
    if (item.subtitle) intro.append(element('p', 'work-subtitle', item.subtitle));
  }
  if (!primary || !splitMasthead) {
    intro.append(element('p', 'work-summary', item.summary));
    article.append(intro);
  }
  const media = renderMedia(item.media);
  if (media) article.append(media);
  article.append(renderDetails(item));
  return article;
}

export function renderFeaturedWork(items, target) {
  if (!Array.isArray(items) || !(target instanceof Element)) throw new TypeError('Invalid work collection or target');
  const visible = items.filter(item => item.homepage?.show === true)
    .sort((a, b) => a.homepage.order - b.homepage.order);
  if (!visible.length) return false; // Keep useful static content if the collection is empty.
  const ids = new Set();
  for (const item of visible) {
    if (!/^[a-z0-9-]+$/.test(item.id) || ids.has(item.id)
      || !item.title || !item.summary || !item.classification
      || !Number.isFinite(item.homepage.order)
      || !['primary', 'supporting'].includes(item.homepage.tier)) {
      throw new TypeError('Invalid visible work item');
    }
    ids.add(item.id);
  }
  const fragment = document.createDocumentFragment();
  const primary = element('div', 'work-primary');
  visible.filter(item => item.homepage.tier === 'primary').forEach((item, index) => primary.append(renderItem(item, true, index + 1)));
  if (primary.childElementCount) fragment.append(primary);
  const supportingItems = visible.filter(item => item.homepage.tier === 'supporting');
  if (supportingItems.length) {
    const section = element('section', 'work-supporting');
    section.setAttribute('aria-labelledby', 'work-supporting-title');
    const heading = element('h3', 'work-supporting-heading', 'Supporting Work');
    heading.id = 'work-supporting-title';
    const entries = element('div', 'work-supporting-grid');
    for (const item of supportingItems) entries.append(renderItem(item, false));
    section.append(heading, entries);
    fragment.append(section);
  }
  // No live DOM changes until the entire collection has successfully rendered.
  target.replaceChildren(fragment);
  target.dataset.enhanced = 'true';
  return true;
}
