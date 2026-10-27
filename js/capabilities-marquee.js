/* Capabilities only. No manual or automatic pause mechanism; reduced motion stays static. */
(function () {
  'use strict';
  var preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  var profiles = [{ speed: 32, phase: .19 }, { speed: 21, phase: .57 }, { speed: 39, phase: .83 }];
  document.querySelectorAll('[data-sb-skills]').forEach(function (root) {
    if (root.dataset.sbReady) return;
    root.dataset.sbReady = 'true';
    var tracks = Array.from(root.querySelectorAll('[data-sb-track]'));
    tracks.forEach(function (track, index) {
      var original = track.querySelector('.sb-track-group');
      track.dataset.sbDirection = index === 1 ? 'right' : 'left';
      for (var i = 0; i < 2; i++) {
        var duplicate = original.cloneNode(true);
        duplicate.setAttribute('aria-hidden', 'true');
        duplicate.removeAttribute('aria-label');
        track.appendChild(duplicate);
      }
    });
    function measure() {
      if (preference.matches) return;
      tracks.forEach(function (track, index) {
        var width = track.firstElementChild.getBoundingClientRect().width;
        var duration = width / profiles[index].speed;
        track.style.setProperty('--sb-duration', duration + 's');
        track.style.setProperty('--sb-delay', -duration * profiles[index].phase + 's');
      });
    }
    function sync() {
      root.classList.toggle('sb-has-motion', !preference.matches);
      requestAnimationFrame(measure);
    }
    if (preference.addEventListener) preference.addEventListener('change', sync);
    else if (preference.addListener) preference.addListener(sync);
    if (window.ResizeObserver) {
      var observer = new ResizeObserver(measure);
      tracks.forEach(function (track) { observer.observe(track.firstElementChild); });
    } else window.addEventListener('resize', measure);
    document.fonts.ready.then(measure);
    sync();
  });
}());
