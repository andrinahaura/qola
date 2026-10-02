/* "Hari ini di Qola" panel (#hari-ini).
   Fetches today's numbers from the section's data-live-endpoint every data-live-interval seconds
   (minimum 15) and renders them. With no endpoint, or before the first successful request,
   the panel shows labelled placeholders: this file never makes up numbers.

   Expected JSON (every field optional; missing lists render as empty):
   {
     "updatedAt": "2026-09-30T10:42:00+07:00",                     // when the numbers were computed
     "mentions":  { "total": 0, "changePct": 0 },                   // changePct: vs yesterday at the same hour
     "sentiment": { "positive": 0, "neutral": 0, "negative": 0 },   // percentages
     "spike":     { "topic": "", "changePct": 0, "window": "1 jam terakhir" },  // null when there is no spike
     "hourly":    [0, 0],                                           // mentions per hour, index = hour (WIB), up to now
     "topTopics": [{ "label": "", "mentions": 0 }],
     "keywords":  [{ "term": "", "changePct": 0 }],
     "sources":   [{ "name": "", "mentions": 0 }],
     "insights":  [{ "time": "10:40", "text": "" }]
   }

   For development, QolaLive.render(data) in the console renders a payload without an endpoint. */
(function () {
  var sec = document.getElementById('hari-ini');
  if (!sec) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TZ = 'Asia/Jakarta';
  var $ = function (id) { return document.getElementById(id); };
  var fmt = function (n, d) { return Number(n || 0).toLocaleString('id-ID', { maximumFractionDigits: d || 0 }); };
  var pct = function (n) { return (n > 0 ? '+' : n < 0 ? '−' : '') + fmt(Math.abs(n), 1) + '%'; };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var clock = function (d) { return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: TZ }) + ' WIB'; };
  var badge = sec.querySelector('.lv-ph-badge');
  var lastUpdated = null;

  function setState(state, status) {
    sec.dataset.state = state;
    $('lv-status').textContent = status;
  }
  function showDate() {
    $('lv-date').textContent = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ });
  }
  function setSentiment(s) {
    [['pos', s && s.positive], ['neu', s && s.neutral], ['neg', s && s.negative]].forEach(function (p) {
      var has = typeof p[1] === 'number';
      $('lv-' + p[0]).textContent = has ? fmt(p[1], 1) + '%' : '—';
      $('lv-' + p[0] + '-bar').style.width = has ? p[1] + '%' : '0';
    });
  }
  function renderBars(hourly) {
    hourly = (hourly || []).slice(0, 24);
    var max = Math.max.apply(null, hourly.concat(1));
    var html = '';
    for (var h = 0; h < 24; h++) {
      var v = hourly[h];
      var has = typeof v === 'number';
      var tip = String(h).padStart(2, '0') + ':00 · ' + (has ? fmt(v) + ' mentions' : 'belum ada data');
      html += '<div class="lv-slot' + (has && h === hourly.length - 1 ? ' now' : '') + '" title="' + tip + '">' +
        '<span data-h="' + (has ? v / max * 100 : 0) + '"></span></div>';
    }
    var bars = $('lv-bars');
    bars.innerHTML = html;
    // Set heights on the next frame so the bars grow in
    requestAnimationFrame(function () {
      bars.querySelectorAll('span').forEach(function (s) { s.style.height = s.dataset.h + '%'; });
    });
  }
  function renderTicker(items, placeholderText) {
    var run = $('lv-ticker');
    run.classList.remove('moving');
    if (!items || !items.length) {
      run.innerHTML = '<span class="lv-ticker-group">' + esc(placeholderText) + '</span>';
      return;
    }
    var group = items.map(function (i) { return '<span><time>' + esc(i.time) + '</time>' + esc(i.text) + '</span>'; }).join('');
    // Two copies side by side; the animation moves one copy's width, so the loop is seamless
    run.innerHTML = '<span class="lv-ticker-group">' + group + '</span><span class="lv-ticker-group" aria-hidden="true">' + group + '</span>';
    run.style.setProperty('--lv-dur', Math.max(20, items.length * 8) + 's');
    if (!reduced) run.classList.add('moving');
  }
  function skeletons(n, tag, widths) {
    var html = '';
    for (var i = 0; i < n; i++) html += '<' + tag + ' aria-hidden="true"><span class="lv-skel" style="width:' + widths[i % widths.length] + '%"></span></' + tag + '>';
    return html;
  }

  function renderPlaceholder() {
    $('lv-total').textContent = '—';
    $('lv-total-note').textContent = 'Menunggu data';
    $('lv-spike').textContent = '—';
    $('lv-spike-note').textContent = 'Menunggu data';
    setSentiment(null);
    renderBars([]);
    $('lv-topics').innerHTML = skeletons(5, 'li', [80, 64, 72, 56, 68]);
    $('lv-keys').innerHTML = '<li aria-hidden="true" class="lv-skel"></li>'.repeat(5);
    $('lv-sources').innerHTML = skeletons(4, 'li', [90, 76, 84, 70]);
    renderTicker(null, 'Insight terbaru tampil di sini setelah data real-time terhubung.');
  }

  function render(d) {
    d = d || {};
    var m = d.mentions || {};
    $('lv-total').textContent = typeof m.total === 'number' ? fmt(m.total) : '—';
    $('lv-total-note').innerHTML = typeof m.changePct === 'number'
      ? '<span class="' + (m.changePct > 0 ? 'up' : '') + '">' + (m.changePct >= 0 ? '↑ ' : '↓ ') + fmt(Math.abs(m.changePct), 1) + '%</span> vs kemarin di jam yang sama'
      : '';

    setSentiment(d.sentiment);

    if (d.spike && typeof d.spike.changePct === 'number') {
      $('lv-spike').textContent = pct(d.spike.changePct);
      $('lv-spike-note').innerHTML = 'Topik <b>“' + esc(d.spike.topic) + '”</b>' + (d.spike.window ? ' · ' + esc(d.spike.window) : '');
    } else {
      $('lv-spike').textContent = '—';
      $('lv-spike-note').textContent = 'Tidak ada lonjakan terdeteksi';
    }

    renderBars(d.hourly);

    var topics = (d.topTopics || []).slice(0, 5);
    $('lv-topics').innerHTML = topics.length ? topics.map(function (t, i) {
      return '<li><span class="n">' + (i + 1) + '</span><span>' + esc(t.label) + '</span><span class="v">' + fmt(t.mentions) + '</span></li>';
    }).join('') : '<li class="lv-empty">Belum ada topik hari ini.</li>';

    var keys = (d.keywords || []).slice(0, 8);
    $('lv-keys').innerHTML = keys.length ? keys.map(function (k) {
      var change = typeof k.changePct === 'number' ? ' <span class="' + (k.changePct > 0 ? 'up' : '') + '">' + pct(k.changePct) + '</span>' : '';
      return '<li class="badge line">' + esc(k.term) + change + '</li>';
    }).join('') : '<li class="lv-empty">Belum ada keyword yang naik.</li>';

    var sources = (d.sources || []).slice(0, 5);
    var maxS = Math.max.apply(null, sources.map(function (s) { return s.mentions || 0; }).concat(1));
    $('lv-sources').innerHTML = sources.length ? sources.map(function (s) {
      return '<li><span>' + esc(s.name) + '</span><span class="track"><span style="width:' + ((s.mentions || 0) / maxS * 100) + '%"></span></span><span class="v">' + fmt(s.mentions) + '</span></li>';
    }).join('') : '<li class="lv-empty">Belum ada data sumber.</li>';

    renderTicker(d.insights, 'Belum ada insight baru hari ini.');

    lastUpdated = d.updatedAt ? new Date(d.updatedAt) : new Date();
    setState('live', 'Live · diperbarui ' + clock(lastUpdated));
  }

  window.QolaLive = { render: render };

  showDate();
  renderPlaceholder();
  var endpoint = sec.dataset.liveEndpoint;
  if (!endpoint) return; // stays hidden on the landing page, in placeholder state
  sec.hidden = false;

  function load() {
    showDate();
    fetch(endpoint, { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(render)
      .catch(function () {
        badge.textContent = 'Data real-time tidak tersedia';
        setState('error', lastUpdated ? 'Koneksi terputus · data terakhir ' + clock(lastUpdated) : 'Gagal memuat data');
      });
  }
  load();
  setInterval(function () { if (!document.hidden) load(); }, Math.max(15, +sec.dataset.liveInterval || 60) * 1000);
})();
