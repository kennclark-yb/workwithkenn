import './navigation.js';
import { initializeMotionPreference } from './motion.js';

// Module scripts run after HTML parsing; no DOMContentLoaded wrapper is needed.
initializeMotionPreference();

// Independent optional effects retain their CSS/text fallbacks if loading fails.
for (const effect of ['./effects/background.js', './effects/logo.js']) {
  import(effect).catch(error => console.warn('Visual effect unavailable; static appearance retained.', error));
}

const workTarget = document.querySelector('[data-featured-work]');
if (workTarget) {
  // Isolate loading/rendering failures so static content and other modules remain usable.
  Promise.all([import('../data/work.js'), import('./renderers.js')])
    .then(([{ work, supportingWorkSection }, { renderFeaturedWork }]) => renderFeaturedWork(work, workTarget, supportingWorkSection))
    .catch(error => console.warn('Featured Work enhancement unavailable; static content retained.', error));
}

// Independent optional enlargement also enhances the static fallback if work rendering fails.
import('./notion-evidence-viewer.js')
  .then(({ initializeNotionEvidenceViewer }) => initializeNotionEvidenceViewer())
  .catch(error => console.warn('Workspace viewer unavailable; direct image link retained.', error));
