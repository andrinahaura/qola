/* Renders articles from data/news.js (window.QOLA_NEWS) into every [data-news] grid.
     data-news-limit   max cards to show (omit for all)
     data-news-base    prefix that turns site-root paths into paths from this page ("" or "../")
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
        ' aria-label="Read More: ' + esc(a.title) + '">Read More ' + arrow + '</a>' : '') +
    '</article>';
  }
  function placeholder() {
    return '<article class="news ph">' +
      '<div class="news-thumb">Thumbnail</div>' +
      '<div class="news-meta"><span class="badge line">Kategori</span><span>Tanggal terbit</span></div>' +
      '<h3>Judul artikel</h3>' +
      '<p class="news-excerpt">Deskripsi singkat artikel tampil di sini, satu sampai dua kalimat.</p>' +
      '<span class="news-link">Read More ' + arrow + '</span>' +
    '</article>';
  }

  document.querySelectorAll('[data-news]').forEach(function (grid) {
    var limit = parseInt(grid.dataset.newsLimit, 10) || Infinity;
    var base = grid.dataset.newsBase || '';

    if (!articles.length) {
      grid.setAttribute('aria-hidden', 'true'); // the note next to the grid explains the empty state
      grid.innerHTML = new Array(Math.min(limit, 6) + 1).join(placeholder());
      return;
    }
    grid.removeAttribute('aria-hidden');

    function show(list) {
      grid.innerHTML = list.slice(0, limit).map(function (a) { return card(a, base); }).join('');
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
