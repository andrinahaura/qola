/* Hero: the first screen shows only the copy. Once the user scrolls, dashboard cards fade in around the
   headline and come together into one window. Each .piece has its final spot in CSS (--x, --y, --w in frame px)
   and a start in data-from="x y scale". Scroll progress p runs 0 to 1 while the sticky stage is pinned.
   Small screens and reduced motion get the assembled dashboard without the pin.
   Scroll progress comes from Motion's scroll() (motion.dev, the vanilla build of Framer Motion) when it loaded,
   otherwise from a plain scroll listener. */
(function () {
  var hero = document.querySelector('[data-build]');
  if (!hero) return;
  var stage = hero.querySelector('.hero-stage');
  var copy = hero.querySelector('.hero-copy');
  var build = hero.querySelector('.build');
  var frame = hero.querySelector('.build-frame');
  var win = hero.querySelector('.build-win');
  var FW = 1120, FH = 690, NAV = 96;

  var pieces = [].map.call(hero.querySelectorAll('.piece'), function (el, i) {
    var f = el.dataset.from.split(' ').map(Number);
    var cs = getComputedStyle(el);
    return {
      el: el,
      dx: f[0] - parseFloat(cs.getPropertyValue('--x')),
      dy: f[1] - parseFloat(cs.getPropertyValue('--y')),
      s: f[2],
      delay: (i % 4) * 0.04
    };
  });

  var wide = window.matchMedia('(min-width: 761px)');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var on = false, ticking = false;

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function layout() {
    on = wide.matches && !reduce.matches;
    hero.classList.toggle('is-building', on);
    var fit;
    if (on) {
      var vh = stage.clientHeight;
      fit = Math.min(1, (stage.clientWidth - 48) / FW, (vh - NAV - 32) / FH);
      frame.style.setProperty('--top', (NAV + (vh - NAV - FH * fit) / 2) + 'px');
    } else {
      fit = Math.min(1, build.clientWidth / FW);
      frame.style.setProperty('--top', '0px');
    }
    build.style.setProperty('--fit', fit);
    render();
  }

  function progress() {
    var r = hero.getBoundingClientRect();
    return clamp(-r.top / (hero.offsetHeight - stage.clientHeight));
  }

  function render(raw) {
    ticking = false;
    /* Finish at 85% of the pinned scroll so the assembled dashboard holds for a moment */
    var p = on ? clamp((typeof raw === 'number' ? raw : progress()) / 0.85) : 1;
    copy.style.opacity = on ? 1 - clamp((p - 0.05) / 0.3) : '';
    copy.style.transform = on ? 'translateY(' + (-p * 160) + 'px)' : '';
    var w = clamp((p - 0.3) / 0.4);
    win.style.opacity = on ? w : '';
    win.style.transform = on ? 'scale(' + (0.97 + 0.03 * w) + ')' : '';
    pieces.forEach(function (pc) {
      /* Hidden at the top of the page; fades in at its scattered spot, then travels to its slot */
      var e = ease(clamp((p - 0.08 - pc.delay) / 0.72)), k = 1 - e;
      pc.el.style.transform = on ? 'translate(' + pc.dx * k + 'px,' + pc.dy * k + 'px) scale(' + (pc.s + (1 - pc.s) * e) + ')' : '';
      pc.el.style.opacity = on ? clamp((p - 0.02 - pc.delay) / 0.16) : '';
    });
  }

  function onScroll() {
    if (on && !ticking) { ticking = true; requestAnimationFrame(function () { render(); }); }
  }

  if (window.Motion) {
    /* 0 when the hero's top meets the viewport top, 1 when its bottom meets the viewport bottom: the pinned stretch */
    Motion.scroll(function (p) { if (on) render(p); }, { target: hero, offset: ['start start', 'end end'] });
  } else {
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  window.addEventListener('resize', layout);
  wide.addEventListener('change', layout);
  reduce.addEventListener('change', layout);
  layout();
})();
