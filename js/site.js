/* Shared by every page: floating nav, Produk dropdown, scroll spy, reveal on scroll */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav = document.getElementById('nav');
  var menuBtn = document.getElementById('menu-btn');
  var drop = nav.querySelector('.nav-drop');
  var dropBtn = drop.querySelector('.nav-drop-btn');
  var lastY = window.scrollY;

  /* Produk dropdown */
  var hoverMode = window.matchMedia('(hover: hover) and (min-width: 901px)');
  function setDrop(open) {
    drop.classList.toggle('open', open);
    dropBtn.setAttribute('aria-expanded', open);
  }
  dropBtn.addEventListener('click', function (e) {
    // A mouse click after hovering keeps the menu open; keyboard and touch toggle it
    if (hoverMode.matches && e.detail > 0) setDrop(true);
    else setDrop(!drop.classList.contains('open'));
  });
  drop.addEventListener('mouseenter', function () { if (hoverMode.matches) setDrop(true); });
  drop.addEventListener('mouseleave', function () { if (hoverMode.matches) setDrop(false); });
  drop.addEventListener('focusout', function (e) { if (!drop.contains(e.relatedTarget)) setDrop(false); });
  document.addEventListener('click', function (e) { if (!drop.contains(e.target)) setDrop(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !drop.classList.contains('open')) return;
    setDrop(false);
    dropBtn.focus();
  });

  /* Scroll spy: a nav item stays active across every section of its chapter (sections share data-nav="<id>").
     Links point at "#<id>"; the Produk button names its chapter in data-spy. */
  var spyLinks = [].slice.call(nav.querySelectorAll('#nav-links > a[href^="#"], #nav-links [data-spy]')).map(function (a) {
    var id = a.dataset.spy || a.getAttribute('href').slice(1);
    return { link: a, sections: [].slice.call(document.querySelectorAll('[data-nav="' + id + '"]')) };
  }).filter(function (s) { return s.sections.length; });
  function updateActive() {
    var line = Math.max(120, window.innerHeight * 0.3);
    spyLinks.forEach(function (s) {
      var on = s.sections.some(function (sec) {
        var r = sec.getBoundingClientRect();
        return r.top <= line && r.bottom > line;
      });
      s.link.classList.toggle('active', on);
      if (on) s.link.setAttribute('aria-current', 'location');
      else s.link.removeAttribute('aria-current');
    });
  }

  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('scrolled', y > 16);
    updateActive();
    // Hide on scroll down, show again on a small scroll up
    if (Math.abs(y - lastY) < 8) return;
    var hide = y > lastY && y > 120 && !nav.classList.contains('open') && !nav.querySelector(':focus-visible');
    nav.classList.toggle('nav-hidden', hide);
    if (hide) setDrop(false);
    lastY = y;
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });
  nav.addEventListener('focusin', function () { nav.classList.remove('nav-hidden'); });
  window.addEventListener('resize', updateActive);
  onScroll();

  /* Mobile menu */
  function closeMenu() {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', false);
    setDrop(false);
  }
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
    if (!open) setDrop(false);
  });
  nav.querySelectorAll('#nav-links a').forEach(function (a) { a.addEventListener('click', closeMenu); });

  /* Reveal on scroll */
  var reveals = document.querySelectorAll('.reveal');
  function show(node) {
    node.classList.add('in');
    node.querySelectorAll('[data-w]').forEach(function (s) { s.style.width = s.dataset.w + '%'; });
  }
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var siblings = Array.prototype.indexOf.call(entry.target.parentNode.children, entry.target);
        setTimeout(function () { show(entry.target); }, Math.min(siblings, 5) * 70);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(show);
  }
})();
