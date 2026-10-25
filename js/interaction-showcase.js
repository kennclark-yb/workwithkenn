import { enhanceDisclosure } from './disclosure-motion.js';

// Content-only scene records make genuine redacted exchanges a later data swap.
// This is a portfolio preview: it has no composer, network calls or live actions.
let showcaseCount = 0;

function node(tag, className, text) {
  const result = document.createElement(tag);
  if (className) result.className = className;
  if (text) result.textContent = text;
  return result;
}

function renderMessage(message) {
  const entry = node('li', `conversation-message conversation-message--${message.speaker}`);
  if (message.sections || message.event || message.blocks) entry.classList.add('conversation-message--structured');
  if (message.variant === 'command') entry.classList.add('conversation-message--command');
  entry.append(node('span', 'conversation-speaker', message.speaker === 'user' ? 'You' : 'Jihyo'));
  const bubble = node('div', 'conversation-bubble');
  if (message.title) bubble.append(node('p', 'conversation-message-title', message.title));
  if (message.blocks) {
    for (const block of message.blocks) {
      const paragraph = node('p', 'conversation-copy');
      if (block.label) paragraph.append(node('strong', '', block.label), document.createTextNode('\n'));
      paragraph.append(document.createTextNode(block.text));
      bubble.append(paragraph);
    }
  }
  if (message.sections) {
    const sections = node('dl', 'conversation-sections');
    for (const section of message.sections) {
      const group = node('div', 'conversation-section');
      const value = node('dd');
      if (section.value) value.append(node('p', 'conversation-value', section.value));
      if (section.detail) value.append(node('p', 'conversation-detail', section.detail));
      if (section.text) value.append(node('p', '', section.text));
      group.append(node('dt', '', section.label), value);
      sections.append(group);
    }
    bubble.append(sections);
  }
  if (message.event) {
    const event = node('div', 'conversation-event');
    event.append(node('p', 'conversation-event-title', message.event.title),
      node('p', '', message.event.when), node('p', 'conversation-detail', message.event.calendar));
    bubble.append(event);
  }
  if (message.text) bubble.append(node('p', 'conversation-message-text', message.text));
  entry.append(bubble);
  return entry;
}

export function renderInteractionShowcase(media) {
  if (!media.scenes?.length) throw new TypeError('An interaction showcase needs scenes');
  const ids = new Set();
  for (const scene of media.scenes) {
    if (!/^[a-z0-9-]+$/.test(scene.id) || ids.has(scene.id) || !scene.messages?.length) {
      throw new TypeError('Invalid interaction scene');
    }
    ids.add(scene.id);
  }
  const prefix = `interaction-${++showcaseCount}`;
  const initial = media.scenes.find(scene => scene.id === media.defaultScene) || media.scenes[0];
  const figure = node('figure', 'work-media interaction-showcase');
  const layout = node('div', 'interaction-layout');
  const story = node('div', 'interaction-story');
  const title = node('p', 'interaction-headline');
  const description = node('p', 'interaction-description');
  const tabs = node('div', 'interaction-tabs');
  tabs.setAttribute('role', 'tablist');
  tabs.setAttribute('aria-label', 'Explore Jihyo interactions');
  const panel = node('div', 'interaction-panel');
  panel.id = `${prefix}-panel`;
  panel.setAttribute('role', 'tabpanel');
  panel.tabIndex = 0;
  const canvas = node('div', 'conversation-canvas');
  canvas.dataset.ui = '';
  const header = node('div', 'conversation-header');
  const avatar = node('span', 'conversation-avatar', 'J');
  avatar.setAttribute('aria-hidden', 'true');
  const identity = node('div');
  identity.append(node('p', 'conversation-name', media.name), node('p', 'conversation-channel', media.channel));
  header.append(avatar, identity);
  const body = node('div', 'conversation-body');
  const context = node('p', 'conversation-context');
  const thread = node('ol', 'conversation-thread');
  thread.setAttribute('aria-label', 'Illustrative conversation');
  body.append(context, thread);
  canvas.append(header, body);
  const takeaway = node('p', 'interaction-takeaway');
  panel.append(canvas, takeaway);
  const status = node('span', 'interaction-status');
  status.setAttribute('role', 'status');
  const buttons = [];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 700px)');
  const orientTabs = () => tabs.setAttribute('aria-orientation', mobile.matches ? 'horizontal' : 'vertical');
  orientTabs();
  mobile.addEventListener('change', orientTabs);

  const indicator = node('span', 'interaction-tab-indicator');
  indicator.setAttribute('aria-hidden', 'true');
  tabs.append(indicator);
  const heightTargets = [title, description, canvas, takeaway];
  const movingText = [title, description, thread];
  const animations = new Set();
  let selectedScene, sceneVersion = 0, indicatorAnimation;

  function clearSceneMotion() {
    for (const animation of animations) animation.cancel();
    animations.clear();
    for (const element of heightTargets) element.style.removeProperty('height');
    delete figure.dataset.sceneMotion;
  }

  function play(element, frames, options) {
    const animation = element.animate(frames, { easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both', ...options });
    animations.add(animation);
    return animation;
  }

  function positionHighlight(animate = true) {
    const button = buttons[media.scenes.indexOf(selectedScene)];
    if (!figure.isConnected || !button || !button.offsetWidth || typeof indicator.animate !== 'function') return;
    const style = getComputedStyle(indicator);
    const from = { transform: style.transform, width: style.width, height: style.height };
    const target = { transform: 'translate(' + button.offsetLeft + 'px,' + button.offsetTop + 'px)',
      width: button.offsetWidth + 'px', height: button.offsetHeight + 'px' };
    indicatorAnimation?.cancel();
    Object.assign(indicator.style, target);
    if (animate && tabs.dataset.slidingHighlight && !reducedMotion.matches) {
      indicatorAnimation = indicator.animate([from, target], { duration: 300, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
    tabs.dataset.slidingHighlight = 'true';
  }

  function writeScene(scene) {
    figure.dataset.scene = scene.id;
    title.textContent = scene.title;
    description.textContent = scene.description;
    context.textContent = scene.context;
    takeaway.textContent = scene.takeaway;
    thread.replaceChildren(...scene.messages.map(renderMessage));
    status.textContent = 'Showing ' + scene.label + ': ' + scene.title;
  }

  function select(scene, animate = true) {
    if (animate && scene === selectedScene) return;
    selectedScene = scene;
    const version = ++sceneVersion;
    panel.setAttribute('aria-labelledby', prefix + '-' + scene.id);
    for (const [index, button] of buttons.entries()) {
      const active = media.scenes[index] === scene;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    }
    positionHighlight(animate);
    if (!animate || reducedMotion.matches || typeof thread.animate !== 'function' || !figure.isConnected) {
      clearSceneMotion();
      writeScene(scene);
      return;
    }

    // Capture an interrupted run before cancelling it; no stale content can commit.
    const heights = heightTargets.map(element => element.getBoundingClientRect().height);
    const outgoing = movingText.map(element => {
      const style = getComputedStyle(element);
      return { opacity: style.opacity, transform: style.transform };
    });
    clearSceneMotion();
    heightTargets.forEach((element, index) => { element.style.height = heights[index] + 'px'; });
    figure.dataset.sceneMotion = 'outgoing';
    const exits = movingText.map((element, index) => play(element,
      [outgoing[index], { opacity: 0, transform: 'translateY(-6px)' }],
      { duration: 100, easing: 'ease-in' }));
    Promise.allSettled(exits.map(animation => animation.finished)).then(() => {
      if (version !== sceneVersion) return;
      clearSceneMotion();
      writeScene(scene);
      const naturalHeights = heightTargets.map(element => element.getBoundingClientRect().height);
      figure.dataset.sceneMotion = 'incoming';
      const entries = movingText.map((element, index) => play(element,
        [{ opacity: 0, transform: 'translateY(' + (element === thread ? 8 : 6) + 'px)' },
          { opacity: 1, transform: 'translateY(0)' }],
        { duration: 220, delay: index === 1 ? 20 : 0 }));
      const reflow = heightTargets.map((element, index) => {
        element.style.height = heights[index] + 'px';
        return play(element, [{ height: heights[index] + 'px' }, { height: naturalHeights[index] + 'px' }], { duration: 220 });
      });
      Promise.allSettled([...entries, ...reflow].map(animation => animation.finished)).then(() => {
        if (version === sceneVersion) clearSceneMotion();
      });
    });
  }

  media.scenes.forEach((scene, index) => {
    const button = node('button', 'interaction-tab');
    button.type = 'button';
    button.id = `${prefix}-${scene.id}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', panel.id);
    button.append(node('span', 'interaction-tab-label', scene.label), node('span', 'interaction-tab-hint', scene.hint));
    button.addEventListener('click', () => select(scene));
    button.addEventListener('keydown', event => {
      let next;
      if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (index + 1) % media.scenes.length;
      if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (index - 1 + media.scenes.length) % media.scenes.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = media.scenes.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      select(media.scenes[next]);
      buttons[next].focus();
    });
    buttons.push(button);
    tabs.append(button);
  });
  story.append(title, description, tabs);
  layout.append(story, panel);
  const footer = node('div', 'interaction-footer');
  footer.append(node('figcaption', 'interaction-illustration-label', media.illustrationLabel),
    node('p', 'interaction-signature editorial', media.caption));
  const evidence = node('details', 'interaction-evidence');
  evidence.append(node('summary', '', media.evidence.label));
  const evidenceCopy = node('div', 'interaction-evidence-copy');
  for (const group of media.evidence.groups) {
    const section = node('div');
    section.append(node('p', 'interaction-evidence-title', group.title), node('p', '', group.text));
    evidenceCopy.append(section);
  }
  evidence.append(evidenceCopy);
  enhanceDisclosure(evidence);
  figure.append(layout, footer);
  figure.append(evidence, status);
  select(initial, false);
  requestAnimationFrame(() => positionHighlight(false));
  if (typeof ResizeObserver === 'function') {
    new ResizeObserver(() => positionHighlight(false)).observe(tabs);
    let width = 0;
    new ResizeObserver(([entry]) => {
      const changed = width && Math.abs(entry.contentRect.width - width) > 1;
      width = entry.contentRect.width;
      if (changed && animations.size) select(selectedScene, false);
    }).observe(layout);
  }
  document.fonts?.ready.then(() => {
    if (animations.size) select(selectedScene, false);
    positionHighlight(false);
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      select(selectedScene, false);
      positionHighlight(false);
    }
  });
  return figure;
}
