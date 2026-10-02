/* Page animations with Motion (motion.dev), the vanilla JS build of Framer Motion, loaded from the CDN before this file.
   Without Motion, or with reduced motion, this file does nothing: site.js reveals sections with CSS and the
   page stays fully usable.
   - Hero copy and nav ease in on load
   - .reveal blocks and section headings rise in when they enter the viewport, siblings staggered
   - Lists inside product mock-ups stagger in; numbers with data-count count up; sentiment bars grow
   - Persona chat bubbles type their message out, one bubble after another
   - Copy stacks, card groups (logos, plans, FAQ, news, footer) and device mock-ups rise in on scroll
   - FAQ answers unfold; cards lift on hover, buttons give on press
   The price-toggle transition lives in the inline script on index.html (it calls QolaMotion). */
(function () {
  var M = window.Motion;
  if (!M || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var animate = M.animate, inView = M.inView, stagger = M.stagger, hover = M.hover, press = M.press;
  document.documentElement.classList.add('has-motion');

  var SPRING = { type: 'spring', stiffness: 260, damping: 30 };
  var EASE = [0.2, 0.7, 0.2, 1];
  /* One rhythm for the whole site: long enough to follow, short enough not to wait for.
     Blocks rise 24px over 0.7s; siblings follow 0.1s apart; nothing in a group waits more than 0.5s. */
  var DUR = 0.7, RISE = 24, STEP = 0.1, MAX_DELAY = 0.5;
  var stepDelay = function (i) { return Math.min(i * STEP, MAX_DELAY); };
  var $$ = function (sel, root) { return [].slice.call((root || document).querySelectorAll(sel)); };
  function hide(els, y) { els.forEach(function (el) { el.style.opacity = 0; if (y) el.style.transform = 'translateY(' + y + 'px)'; }); }

  /* Run fn once, when el scrolls into view. Safety net: a fast fling can carry an element past the viewport
     before the observer reports it, so anything whose top has passed the viewport top runs straight away. */
  var pending = [];
  function onceInView(el, fn, opts) {
    var entry = { el: el, fn: fn, done: false };
    var run = function () { if (entry.done) return; entry.done = true; stop(); fn(); };
    var stop = inView(el, function () { run(); }, opts);
    entry.run = run;
    pending.push(entry);
  }
  var checking = false;
  window.addEventListener('scroll', function () {
    if (checking) return;
    checking = true;
    requestAnimationFrame(function () {
      checking = false;
      pending = pending.filter(function (e) {
        if (!e.done && e.el.getBoundingClientRect().top < 0) e.run();
        return !e.done;
      });
    });
  }, { passive: true });

  /* Hero intro: nav drops in, copy rises line by line */
  var heroCopy = $$('.hero-copy > *');
  hide(heroCopy, 24);
  animate(heroCopy, { opacity: 1, y: [24, 0] }, { duration: 0.8, ease: EASE, delay: stagger(0.08, { startDelay: 0.1 }) });
  animate('#nav .nav-bar', { opacity: [0, 1], y: [-16, 0] }, { duration: 0.6, ease: EASE });

  /* Section headings: title then lede */
  $$('.section-head, .news-head > div').forEach(function (head) {
    var kids = $$(':scope > *', head);
    hide(kids, 20);
    onceInView(head, function () {
      animate(kids, { opacity: 1, y: [RISE, 0] }, { duration: DUR, ease: EASE, delay: stagger(STEP) });
    }, { amount: 0.4 });
  });

  /* .reveal blocks (site.js skips them when Motion is present): rise in, staggered by position among siblings */
  $$('.reveal').forEach(function (el) {
    var i = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.style.opacity = 0;
    onceInView(el, function () {
      el.classList.add('in');
      el.querySelectorAll('[data-w]').forEach(function (s) { s.style.width = s.dataset.w + '%'; });
      animate(el, { opacity: 1, y: [RISE, 0], scale: [0.98, 1] }, { duration: DUR, ease: EASE, delay: stepDelay(i) });
    }, { amount: 0.15, margin: '0px 0px -40px 0px' });
  });

  /* Rows inside product mock-ups arrive one after another */
  $$('.kw-list, .ui-feed ul, .ui-doc ul, .ui-steps, .chat-a ol').forEach(function (list) {
    var rows = $$(':scope > li', list);
    hide(rows, 12);
    onceInView(list, function () {
      animate(rows, { opacity: 1, y: [12, 0] }, { duration: 0.5, ease: EASE, delay: stagger(0.09, { startDelay: 0.25 }) });
    }, { amount: 0.3 });
  });

  /* Copy stacks that are not .section-head: their children rise one after another */
  $$('.convo-head, .more-list, .cta-inner, .pp-head, .sc-copy, .news-head').forEach(function (stack) {
    /* .news-head's title block is already a heading group; only its button joins here. The use-case list has its own entry. */
    var kids = stack.classList.contains('news-head') ? $$(':scope > .btn', stack) : $$(':scope > :not(.uc-list)', stack);
    hide(kids, RISE);
    onceInView(stack, function () {
      animate(kids, { opacity: 1, y: [RISE, 0] }, { duration: DUR, ease: EASE, delay: stagger(STEP) });
    }, { amount: 0.3 });
  });

  /* Groups of cards: each card rises after the one before it */
  [['.logo-strip', 'li', 12], ['.plans', '.plan', RISE], ['.qa-list', '.qa', 12], ['.news-grid', '.news', RISE],
   ['.footer-grid', ':scope > div', 12]].forEach(function (g) {
    $$(g[0]).forEach(function (group) {
      /* Direct children only, except news: the featured layout nests its side articles one level down */
      var items = $$(g[1], group).filter(function (el) { return g[1] === '.news' || el.parentNode === group; });
      hide(items, g[2]);
      onceInView(group, function () {
        animate(items, { opacity: 1, y: [g[2], 0] }, { duration: DUR, ease: EASE, delay: function (i) { return stepDelay(i); } });
      }, { amount: 0.2 });
    });
  });

  /* Use-case list: the cards fade in one by one (opacity only: their scale belongs to the active state),
     the laptop rises beside them */
  $$('.uc-list').forEach(function (list) {
    var cards = $$('.feat', list);
    cards.forEach(function (c) { c.style.opacity = 0; });
    onceInView(list, function () {
      animate(cards, { opacity: 1 }, { duration: DUR, ease: EASE, delay: stagger(STEP, { startDelay: 0.15 }) });
    }, { amount: 0.3 });
  });
  /* Device mock-ups rise from a little lower and settle */
  $$('.uc-device, .sc-shot').forEach(function (dev) {
    hide([dev], 48);
    onceInView(dev, function () {
      animate(dev, { opacity: 1, y: [48, 0] }, { duration: 0.9, ease: EASE, delay: 0.15 });
    }, { amount: 0.2 });
  });
  /* CTA collage: the devices rise one after another */
  $$('.cta-stage').forEach(function (stage) {
    var devs = $$('.dev', stage);
    hide(devs, 48);
    onceInView(stage, function () {
      animate(devs, { opacity: 1, y: [48, 0] }, { duration: 0.9, ease: EASE, delay: stagger(0.12, { startDelay: 0.1 }) });
    }, { amount: 0.15 });
  });

  /* Produk stack, matched to ventriloc.ca (measured at 1440x900, scroll-sampled every 100px):
     - the next card comes straight up from below, no gap
     - the covered card starts to tip when the next card's top reaches 70% of the screen height and is fully tipped
       (and gone) when that card arrives at the top: p = (0.7vh - nextTop) / 0.7vh
     - tip = perspective(400px) translate3d(20p px, 70p px, -50p px) rotate(2p deg), about its top-right corner
     - it fades from p = 0.63 to p = 1 */
  var pcards = $$('.pcard');
  if (pcards.length > 1) {
    var stackTick = false, drift = pcards.map(function () { return 0; });
    var updateStack = function () {
      stackTick = false;
      var vh = window.innerHeight;
      /* Layout tops: the on-screen top includes the drift we applied (the top-right corner is the origin, so it moves
         by exactly the drift), and the next card's own tip must not feed back into this card */
      var tops = pcards.map(function (c, i) { return c.getBoundingClientRect().top - drift[i]; });
      pcards.forEach(function (card, i) {
        var next = pcards[i + 1];
        if (!next || getComputedStyle(card).position !== 'sticky') { card.style.transform = card.style.opacity = ''; drift[i] = 0; return; }
        var p = Math.min(1, Math.max(0, (0.7 * vh - tops[i + 1]) / (0.7 * vh)));
        drift[i] = 70 * p;
        card.style.transform = p ? 'perspective(400px) translate3d(' + (20 * p).toFixed(2) + 'px, ' + drift[i].toFixed(2) + 'px, ' + (-50 * p).toFixed(2) + 'px) rotate(' + (2 * p).toFixed(3) + 'deg)' : '';
        card.style.opacity = p > 0.63 ? Math.max(0, (1 - p) / 0.37).toFixed(3) : '';
      });
    };
    window.addEventListener('scroll', function () { if (!stackTick) { stackTick = true; requestAnimationFrame(updateStack); } }, { passive: true });
    window.addEventListener('resize', updateStack);
    updateStack();
  }

  /* FAQ: answers unfold and fold instead of jumping */
  $$('.qa').forEach(function (qa) {
    var summary = qa.querySelector('summary'), body = qa.querySelector('summary + *');
    if (!summary || !body) return;
    /* Height and bottom padding move together, so the row closes all the way without a last-frame jump */
    var reset = function () { body.style.height = body.style.paddingBottom = body.style.opacity = body.style.overflow = ''; };
    summary.addEventListener('click', function (e) {
      e.preventDefault();
      var pad = getComputedStyle(body).paddingBottom;
      body.style.overflow = 'hidden';
      if (qa.open) {
        animate(body, { height: [body.offsetHeight + 'px', '0px'], paddingBottom: [pad, '0px'], opacity: [1, 0] }, { duration: 0.3, ease: EASE })
          .then(function () { qa.open = false; reset(); });
      } else {
        qa.open = true;
        var h = body.offsetHeight;
        animate(body, { height: ['0px', h + 'px'], paddingBottom: ['0px', pad], opacity: [0, 1] }, { duration: 0.4, ease: EASE }).then(reset);
      }
    });
  });

  /* Personas chat: bubbles play one after another, like a conversation. Each bubble: the sender appears,
     the message types itself out (about 90 characters a second, never longer than 1.1s), then Qola's
     feature chips pop in. The untyped rest of the text stays in place, transparent, so the bubble keeps
     its final size and nothing below it shifts. */
  var wait = function (s) { return new Promise(function (r) { setTimeout(r, s * 1000); }); };
  var chat = Promise.resolve();
  $$('.bubble').forEach(function (bubble) {
    var who = bubble.querySelector('.bubble-who');
    var msg = bubble.querySelector('.bubble-msg');
    var q = bubble.querySelector('.bubble-q');
    var chips = $$('.bubble-reply li', bubble);
    var text = msg.textContent.trim();
    var typed = document.createElement('span'), rest = document.createElement('span');
    typed.className = 'typed'; rest.className = 'untyped';
    rest.textContent = text;
    msg.textContent = '';
    msg.append(typed, rest);
    hide([who, msg, q].concat(chips), 0);
    function play() {
      var dur = Math.min(1.1, text.length / 90);
      animate(who, { opacity: 1, x: [-8, 0] }, { duration: 0.35, ease: EASE });
      animate(msg, { opacity: 1, scale: [0.94, 1] }, { duration: 0.35, ease: EASE, delay: 0.1 });
      msg.classList.add('is-typing');
      animate(0, text.length, { duration: dur, ease: 'linear', delay: 0.2, onUpdate: function (v) {
        var n = Math.round(v);
        typed.textContent = text.slice(0, n);
        rest.textContent = text.slice(n);
      } });
      return wait(0.2 + dur).then(function () {
        msg.classList.remove('is-typing');
        animate(q, { opacity: 1, scale: [0.6, 1] }, { type: 'spring', stiffness: 500, damping: 24 });
        animate(chips, { opacity: 1, scale: [0.85, 1], x: [10, 0] }, { duration: 0.3, ease: EASE, delay: stagger(0.06, { startDelay: 0.1, from: 'last' }) });
        /* The next bubble starts while these chips are still landing */
        return wait(0.25);
      });
    }
    /* Reading order: bubble N waits for bubble N-1 to finish, then for itself to be on screen */
    var seen = new Promise(function (r) { onceInView(bubble, r, { amount: 0.5 }); });
    chat = chat.then(function () { return seen; }).then(play);
  });

  /* Conversation: messages arrive in order, persona questions pop in around the window, the input types itself */
  $$('[data-chat]').forEach(function (convo) {
    var steps = $$('[data-step]', convo), asks = $$('[data-ask]', convo);
    var typed = convo.querySelector('[data-type]');
    hide(steps, 14); hide(asks, 0);
    if (typed) typed.textContent = '';
    onceInView(convo, function () {
      animate(steps, { opacity: 1, y: [14, 0] }, { duration: 0.5, ease: EASE, delay: stagger(0.35, { startDelay: 0.2 }) });
      animate(asks, { opacity: 1, scale: [0.9, 1], y: [10, 0] }, { type: 'spring', stiffness: 220, damping: 20, delay: stagger(0.25, { startDelay: 0.5 }) });
      if (typed) {
        var text = typed.dataset.type;
        animate(0, text.length, { duration: text.length * 0.035, ease: 'linear', delay: 0.2 + steps.length * 0.35,
          onUpdate: function (v) { typed.textContent = text.slice(0, Math.round(v)); } });
      }
    }, { amount: 0.3 });
  });

  /* Numbers count up: data-count="566.2" data-decimals="1" data-prefix="" data-suffix=" jt" */
  $$('[data-count]').forEach(function (el) {
    var to = parseFloat(el.dataset.count), d = +el.dataset.decimals || 0;
    var pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    var fmt = function (v) { return pre + v.toLocaleString('id-ID', { minimumFractionDigits: d, maximumFractionDigits: d }) + suf; };
    el.textContent = fmt(0);
    onceInView(el, function () {
      animate(0, to, { duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2, onUpdate: function (v) { el.textContent = fmt(v); } });
    }, { amount: 0.6 });
  });

  /* Sentiment bars grow from the left */
  $$('.ui-sent').forEach(function (bar) {
    var parts = $$(':scope > span', bar);
    parts.forEach(function (s) { s.style.transformOrigin = 'left'; s.style.transform = 'scaleX(0)'; });
    onceInView(bar, function () {
      animate(parts, { scaleX: [0, 1] }, { duration: 0.9, ease: EASE, delay: stagger(0.12, { startDelay: 0.3 }) });
    }, { amount: 0.6 });
  });

  /* Cards lift on hover (pointer devices only); buttons press in */
  if (window.matchMedia('(hover: hover)').matches) {
    hover('.why, .tile, .plan, .news, .convo-points li, .bubble-msg', function (el) {
      animate(el, { y: -6 }, SPRING);
      return function () { animate(el, { y: 0 }, SPRING); };
    });
  }
  press('.btn', function (el) {
    animate(el, { scale: 0.96 }, { type: 'spring', stiffness: 600, damping: 30 });
    return function () { animate(el, { scale: 1 }, { type: 'spring', stiffness: 500, damping: 22 }); };
  });

  /* Helpers for the inline page script */
  window.QolaMotion = {
    /* Price toggle: new figures slide up into place */
    prices: function (nodes) {
      animate(nodes, { opacity: [0, 1], y: [10, 0] }, { duration: 0.35, ease: EASE, delay: stagger(0.04) });
    }
  };
})();
