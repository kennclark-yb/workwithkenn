# ASCII Reveal core

Author: Quan Hoang. MIT License; the full upstream notice is retained in `LICENSE` beside the module.

Source: https://github.com/quanhoangindex/ascii-reveal  
Pinned commit: `f602e204232d2d31de2b67c66a166bcdbde51602`  
Upstream distribution: https://raw.githubusercontent.com/quanhoangindex/ascii-reveal/f602e204232d2d31de2b67c66a166bcdbde51602/dist/core.js

`core.js` is a byte-for-byte copy of the author's committed, standalone browser ESM distribution. It is not a local recreation or a React wrapper. No build step is required. Source reviewed: README, LICENSE, src/core/index.ts, engine.ts, presets.ts, skeleton.ts, skeleton-anim.ts, util.ts, dist/core.js and dist/core.d.ts.

Integration follows the documented four steps: install locally; use the existing Hero figure as the root wrapper; mark its existing image `data-ascii="media"`; use `asciiSkeletonHTML()` and `animateSkeletons()` for genuinely pending media, followed by `createAsciiReveal().reveal()` for the image. Cached images also reveal.

Treatment: `decode`, `duration: 'cinematic'`, `speed: 1.15`, scoped to the one image, with lazy section splitting disabled. The original `dither` preset was also examined: it uses source-coloured block glyphs; decode's monochrome character grid fits this portfolio's dark editorial treatment more closely. Cinematic's 1150ms media phase becomes approximately 1000ms at the selected speed. The controller is destroyed after completion, stopping canvases/observers; reduced motion skips it entirely.

The author's adaptive slow-device auto-finish is disabled for this single-media showcase so the requested character-grid transition is not silently reduced to a fade. The implementation still respects reduced motion and runs only once; no ongoing canvas work remains after the reveal.
