/* Renders articles from data/news.js (window.QOLA_NEWS) into every [data-news] grid.
     data-news-limit   max cards to show (omit for all)
     data-news-base    prefix that turns site-root paths into paths from this page ("" or "../")
     data-news-layout  "featured": one highlighted article on the left (the one marked popular: true,
                       else the newest), the next newest stacked small on the right
   Optional on the same page:
     [data-news-filter]  gets one button per category
     [data-news-note]    developer note, hidden once real articles exist
   With no articles, the grid shows labelled placeholder cards. */
(function () {
  var TZ = 'Asia/Jakarta';
  var arrow = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 6h8M6.5 2.5 10 6l-3.5 3.5"/></svg>';
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var isAbsolute = function (u) { return /^([a-z]+:)?\/\//i.test(u); };
  var fmtDate = function (d) {
    var t = new Date(d + 'T00:00:00+07:00');
    return isNaN(t) ? '' : t.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ });
  };

  var articles = (window.QOLA_NEWS || []).filter(function (a) { return a && a.title; }).slice()
    .sort(function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); });

  function card(a, base) {
    var url = a.url ? (isAbsolute(a.url) ? a.url : base + a.url) : '';
    var external = url && isAbsolute(url);
    var img = a.image ? (isAbsolute(a.image) ? a.image : base + a.image) : '';
    return '<article class="news">' +
      '<div class="news-thumb' + (img ? '' : ' no-img') + '">' +
        '<div class="orb" aria-hidden="true"></div>' +
        (img ? '<img src="' + esc(img) + '" alt="" loading="lazy">' : '') +
      '</div>' +
      '<div class="news-meta">' +
        (a.category ? '<span class="badge">' + esc(a.category) + '</span>' : '') +
        (a.date ? '<time datetime="' + esc(a.date) + '">' + fmtDate(a.date) + '</time>' : '') +
      '</div>' +
      '<h3>' + esc(a.title) + '</h3>' +
      (a.excerpt ? '<p class="news-excerpt">' + esc(a.excerpt) + '</p>' : '') +
      (url ? '<a class="news-link" href="' + esc(url) + '"' + (external ? ' target="_blank" rel="noopener"' : '') +
        ' aria-label="Baca selengkapnya: ' + esc(a.title) + '">Baca selengkapnya ' + arrow + '</a>' : '') +
    '</article>';
  }
  var book = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M8 4.5C6.6 3.4 4.6 3 2 3v9.5c2.6 0 4.6.4 6 1.5 1.4-1.1 3.4-1.5 6-1.5V3c-2.6 0-4.6.4-6 1.5zM8 4.5V14"/></svg>';
  /* Read time and date under the title: "4 menit baca · 2 Oktober 2026" */
  function foot(a) {
    var bits = [];
    if (a.readTime) bits.push(esc(a.readTime) + ' menit baca');
    if (a.date) bits.push('<time datetime="' + esc(a.date) + '">' + fmtDate(a.date) + '</time>');
    return bits.length ? '<p class="news-foot">' + (a.readTime ? book : '') + '<span>' + bits.join(' · ') + '</span></p>' : '';
  }
  function thumb(a, base) {
    var img = a.image ? (isAbsolute(a.image) ? a.image : base + a.image) : '';
    return '<div class="news-thumb' + (img ? '' : ' no-img') + '"><div class="orb" aria-hidden="true"></div>' +
      (img ? '<img src="' + esc(img) + '" alt="" loading="lazy">' : '') + '</div>';
  }
  /* Title is the link; its ::after covers the card, so the whole card is clickable and the link reads as the title */
  function title(a, base) {
    var url = a.url ? (isAbsolute(a.url) ? a.url : base + a.url) : '';
    if (!url) return esc(a.title);
    return '<a class="news-title-link" href="' + esc(url) + '"' + (isAbsolute(url) ? ' target="_blank" rel="noopener"' : '') + '>' + esc(a.title) + '</a>';
  }
  function lead(a, base, label) {
    return '<article class="news news-lead">' +
      '<div class="news-meta"><span class="badge sprout">' + label + '</span>' + (a.category ? '<span class="news-cat">' + esc(a.category) + '</span>' : '') + '</div>' +
      '<h3>' + title(a, base) + '</h3>' +
      (a.excerpt ? '<p class="news-excerpt">' + esc(a.excerpt) + '</p>' : '') +
      foot(a) + thumb(a, base) +
    '</article>';
  }
  function mini(a, base) {
    return '<article class="news news-mini">' + thumb(a, base) +
      (a.category ? '<div class="news-meta"><span class="news-cat">' + esc(a.category) + '</span></div>' : '') +
      '<h3>' + title(a, base) + '</h3>' + foot(a) +
    '</article>';
  }
  function featured(list, base, limit) {
    var top = list.filter(function (a) { return a.popular; })[0];
    var label = top ? 'Terpopuler' : 'Terbaru';
    top = top || list[0];
    var rest = list.filter(function (a) { return a !== top; }).slice(0, Math.max(0, Math.min(limit, list.length) - 1));
    return lead(top, base, label) +
      (rest.length ? '<div class="news-side">' + rest.map(function (a) { return mini(a, base); }).join('') + '</div>' : '');
  }
  function featuredPlaceholder(limit) {
    var ph = { title: 'Judul artikel terpopuler', category: 'Kategori', excerpt: 'Deskripsi singkat artikel, satu sampai dua kalimat.', readTime: 4, date: '' };
    var side = { title: 'Judul artikel', category: 'Kategori', readTime: 3 };
    return lead(ph, '', 'Terpopuler').replace('news news-lead', 'news news-lead ph') +
      '<div class="news-side">' + new Array(Math.max(1, Math.min(limit, 6) - 1) + 1).join(mini(side, '').replace('news news-mini', 'news news-mini ph')) + '</div>';
  }

  function placeholder() {
    return '<article class="news ph">' +
      '<div class="news-thumb">Thumbnail</div>' +
      '<div class="news-meta"><span class="badge line">Kategori</span><span>Tanggal terbit</span></div>' +
      '<h3>Judul artikel</h3>' +
      '<p class="news-excerpt">Deskripsi singkat artikel tampil di sini, satu sampai dua kalimat.</p>' +
      '<span class="news-link">Baca selengkapnya ' + arrow + '</span>' +
    '</article>';
  }

  document.querySelectorAll('[data-news]').forEach(function (grid) {
    var limit = parseInt(grid.dataset.newsLimit, 10) || Infinity;
    var base = grid.dataset.newsBase || '';
    var isFeatured = grid.dataset.newsLayout === 'featured';
    if (isFeatured) grid.classList.add('featured');

    if (!articles.length) {
      grid.setAttribute('aria-hidden', 'true'); // the note next to the grid explains the empty state
      grid.innerHTML = isFeatured ? featuredPlaceholder(limit) : new Array(Math.min(limit, 6) + 1).join(placeholder());
      return;
    }
    grid.removeAttribute('aria-hidden');

    function show(list) {
      grid.innerHTML = isFeatured ? featured(list, base, limit) : list.slice(0, limit).map(function (a) { return card(a, base); }).join('');
      // A thumbnail that fails to load falls back to the brand pattern
      grid.querySelectorAll('.news-thumb img').forEach(function (img) {
        img.addEventListener('error', function () { img.parentNode.classList.add('no-img'); });
      });
    }
    show(articles);

    var filter = document.querySelector('[data-news-filter]');
    if (!filter) return;
    var cats = articles.map(function (a) { return a.category; }).filter(function (c, i, all) { return c && all.indexOf(c) === i; });
    if (cats.length < 2) return;
    filter.hidden = false;
    filter.innerHTML = ['Semua'].concat(cats).map(function (c, i) {
      return '<button type="button" aria-pressed="' + (i === 0) + '" data-cat="' + (i === 0 ? '' : esc(c)) + '">' + esc(c) + '</button>';
    }).join('');
    filter.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      filter.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b === btn); });
      var cat = btn.dataset.cat;
      show(cat ? articles.filter(function (a) { return a.category === cat; }) : articles);
    });
  });

  if (articles.length) document.querySelectorAll('[data-news-note]').forEach(function (n) { n.hidden = true; });
})();
