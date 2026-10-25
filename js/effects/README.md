# Approved homepage visual effects

The homepage loads these optional modules independently through `js/main.js`.
Failed effect imports leave the CSS atmosphere and semantic home link intact.
No production file imports anything under `experiments/`.

## Background selection

Edit only `BACKGROUND_MODE` in `background-settings.js`:

```js
export const BACKGROUND_MODE = 'dithering'; // or 'grain-gradient'
```

Each entry in `backgrounds` preserves the approved experiment's own colors,
opacity, speed (`timeScale`), frame, sizing and shader uniforms. Dithering speed
is 0.17. Grain Gradient retains its fine-noise settings and higher pixel budget.
Changing modes requires no renderer changes. There is no public switcher.

The original `styles/site.css` radials always remain underneath. Desktop
background animation uses the approved rates (Dithering 24 updates/second;
Grain Gradient 10). Mobile/coarse pointers, reduced motion, Save-Data and hidden
documents keep the background still. Pixel budgets are 350,000 desktop / 150,000
mobile for Dithering, and 3,000,000 / 1,000,000 for Grain Gradient. Grain is more
GPU-intensive on desktop; its mobile rendering remains still. Forced colors and
failed initialization retain the CSS fallback.

## KC. logo

`logo-settings.js` preserves the final letterform-only Liquid Metal settings:
speed 0.7, opacity 0.95, pale silver-blue tint, restrained blue dispersion,
30 updates/second and a 12,000-pixel ceiling. The approved bold mask, processed
texture and generation metadata live under `assets/branding/kc-logo/`.

The real Inter 700 home-link text remains beneath the overlay. A 0.5px stroke
and 2px side bearings match the approved experiment. The overlay has no pointer
interaction and is hidden from assistive technology. Reduced motion, forced
colors, Save-Data, failed imports, failed image decoding or lost WebGL retain
static text. A reduced-motion start allocates no logo GPU context; changing the
preference can initialize it later without reloading the page.

Hide-on-scroll behavior stays in the existing `navigation.js`. Logo updates
pause while the navbar or document is hidden and resume when visible. No Lenis
or other scroll replacement is used. Back/forward-cache restoration resumes
existing effects; ordinary page departure disposes their mounts.

## Local dependencies

`js/vendor/paper/` contains the unmodified required subset of Paper Shaders
0.0.82, copied from the approved experiments, with Apache 2.0 LICENSE and NOTICE.
Source maps are retained for debugging. Grain's noise texture is a local data URI
and is loaded only when Grain Gradient is selected. No framework, package
manifest, build step, external CDN or runtime asset preprocessing is required.

The effects add two WebGL contexts when both are active. Software-browser checks
verify behavior and appearance; physical-device GPU/battery usage is not measured.
