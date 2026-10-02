/* Produk page: the dashboard screens inside the product cards are small working demos (example data only).
   Each .qui[data-demo] is rendered here; without JS the static markup in the HTML stays as a picture.
   - mentions: pick a source in "Sumber Data" to filter the feed; "Lihat Detail" opens a mention
   - analysis: pick a KPI card; the 7-day chart under it follows, as in the dashboard
   - insight:  pick an anomaly; the Strategi card shows what to do about it
   - report:   switch PDF / Excel / Infografis, toggle components; the download button counts them
   Each screen also plays a "just filled in" entrance when it comes on screen, see fill() below. */
(function () {
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---------- Penyebutan ---------- */
  var MENTIONS = [
    { src: 'News', av: 'P', c: '#7c3aed', who: 'Portal berita nasional', ago: '1 jam lalu', head: 'Brand Anda resmikan layanan pelanggan 24 jam di lima kota', reach: '7.082', score: '9/10', at: '09.12', sent: 'pos', kw: 'brand anda', body: 'Layanan dibuka di Jakarta, Bandung, Surabaya, Medan, dan Makassar mulai pekan ini.' },
    { src: 'X', av: 'X', c: '#111827', who: '@akunwarga', ago: '3 jam lalu', head: 'Sudah dua hari pesanan belum sampai, CS belum membalas', reach: '1.240', score: '3/10', at: '07.40', sent: 'neg', kw: 'pengiriman', body: 'Dibagikan ulang 214 kali, sebagian besar oleh akun di Medan.' },
    { src: 'Instagram', av: 'K', c: '#db2777', who: '@kulinerjkt', ago: '4 jam lalu', head: 'Unboxing produk baru, packaging-nya rapi', reach: '18.400', score: '7/10', at: '06.15', sent: 'pos', kw: 'produk baru', body: 'Video pendek dengan 2,1 rb suka dan 140 komentar.' },
    { src: 'TikTok', av: 'R', c: '#0f172a', who: '@reviewharian', ago: '5 jam lalu', head: 'Review jujur setelah seminggu pakai', reach: '42.900', score: '8/10', at: '05.02', sent: 'neu', kw: 'brand anda', body: 'Membandingkan harga dan fitur dengan dua merek lain.' },
    { src: 'YouTube', av: 'T', c: '#dc2626', who: 'Kanal Teknologi ID', ago: '8 jam lalu', head: 'Bandingkan tiga layanan pengiriman paling cepat', reach: '9.310', score: '6/10', at: '01.30', sent: 'neu', kw: 'pengiriman', body: 'Brand Anda muncul di urutan kedua untuk kecepatan.' },
    { src: 'Facebook', av: 'G', c: '#2563eb', who: 'Grup Konsumen Cerdas', ago: '9 jam lalu', head: 'Ada yang pernah komplain soal refund?', reach: '3.120', score: '4/10', at: '00.48', sent: 'neg', kw: 'refund', body: '37 komentar, sebagian menyarankan menghubungi CS lewat email.' },
    { src: 'News', av: 'M', c: '#0891b2', who: 'Media daerah', ago: '10 jam lalu', head: 'Gerai baru dibuka di Bandung, antrean mengular', reach: '2.480', score: '6/10', at: '23.10', sent: 'neu', kw: 'gerai baru', body: 'Diberitakan oleh tiga portal di Jawa Barat.' },
    { src: 'Threads', av: 'C', c: '#111827', who: '@ceritapagi', ago: '11 jam lalu', head: 'Promo akhir pekan cukup menarik', reach: '860', score: '5/10', at: '22.04', sent: 'pos', kw: 'promo', body: 'Diskusi santai, 12 balasan.' }
  ];
  var SOURCES = [['X', '1.204'], ['Instagram', '860'], ['YouTube', '96'], ['TikTok', '412'], ['Facebook', '230'], ['News', '2.318'], ['Threads', '74']];
  var SENT = { pos: 'Positif', neu: 'Netral', neg: 'Negatif' };

  function mentions(root) {
    var state = { src: '', open: -1 };
    function render() {
      var list = MENTIONS.map(function (m, i) { return [m, i]; }).filter(function (x) { return !state.src || x[0].src === state.src; }).slice(0, 2);
      root.innerHTML =
        '<div class="qui-head"><b>Penyebutan</b><small>Pantau percakapan media untuk proyek <em>Brand Anda</em></small></div>' +
        '<div class="qui-split"><div class="qui-feed">' + list.map(function (x) {
          var m = x[0], i = x[1], open = state.open === i;
          return '<div class="qm' + (open ? ' is-open' : '') + '"><div class="qm-src"><i style="--c: ' + m.c + '">' + m.av + '</i><span><b>' + esc(m.who) + '</b><small>' + m.src + ' · ' + m.ago + '</small></span></div>' +
            '<b class="qm-head">' + esc(m.head) + '</b>' +
            (open ? '<p class="qm-body">' + esc(m.body) + '</p>' : '') +
            '<div class="qm-stats"><span><small>Jangkauan</small>' + m.reach + '</span><span><small>Skor</small>' + m.score + '</span><span><small>Tayang</small>' + m.at + '</span></div>' +
            '<div class="qm-tags"><em class="pill ' + m.sent + '">' + SENT[m.sent] + '</em><em class="qm-kw">' + esc(m.kw) + '</em>' +
            '<button type="button" data-open="' + i + '" aria-expanded="' + open + '">' + (open ? 'Tutup' : 'Lihat Detail') + '</button></div></div>';
        }).join('') + '</div>' +
        '<div class="qui-filter"><b>Sumber Data</b><ul>' +
          '<li><button type="button" data-src=""' + (state.src ? '' : ' aria-pressed="true"') + '><span>Semua</span></button></li>' +
          SOURCES.map(function (s) { return '<li><button type="button" data-src="' + s[0] + '" aria-pressed="' + (state.src === s[0]) + '"><span>' + s[0] + '</span><em>' + s[1] + '</em></button></li>'; }).join('') +
        '</ul></div></div>';
    }
    root.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.hasAttribute('data-src')) { state.src = b.dataset.src; state.open = -1; render(); fill(root, true); return; }
      if (b.hasAttribute('data-open')) { var i = +b.dataset.open; state.open = state.open === i ? -1 : i; }
      render();
    });
    render();
  }

  /* ---------- Analisis ---------- */
  var KPI = {
    mentions: { label: 'Total penyebutan', value: '4.7K', unit: 'penyebutan', days: [520, 610, 580, 760, 690, 840, 700] },
    reach: { label: 'Total jangkauan', value: '11.6M', unit: 'jangkauan (juta)', days: [1.2, 1.5, 1.4, 1.9, 1.7, 2.3, 1.6] }
  };
  var DAYS = ['25 Sep', '26', '27', '28', '29', '30', '1 Okt'];
  function chart(days) {
    var w = 300, h = 80, max = Math.max.apply(null, days) * 1.15;
    var pts = days.map(function (v, i) { return [i * w / (days.length - 1), h - v / max * h]; });
    var line = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true">' +
      '<path class="qc-area" d="' + line + ' L' + w + ' ' + h + ' L0 ' + h + ' Z" fill="rgba(54,148,119,0.12)"/>' +
      '<path class="qc-line" d="' + line + '" fill="none" stroke="#369477" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>';
  }
  function analysis(root) {
    var state = { kpi: 'mentions' };
    var sentiment = function (title, rows) {
      return '<div class="qk"><small>' + title + '</small><ul class="qk-rows">' + rows.map(function (r) { return '<li><b>' + r[0] + '</b><em class="pill ' + r[1] + '">' + SENT[r[1]] + '</em></li>'; }).join('') + '</ul></div>';
    };
    function render() {
      var k = KPI[state.kpi];
      root.innerHTML =
        '<div class="qui-head"><b>Analisis</b><small>Gambaran umum, 25 Sep – 1 Okt 2026</small></div>' +
        '<div class="qui-grid">' + Object.keys(KPI).map(function (key) {
          return '<button type="button" class="qk' + (key === state.kpi ? ' on' : '') + '" data-kpi="' + key + '" aria-pressed="' + (key === state.kpi) + '"><small>' + KPI[key].label + '</small><b>' + KPI[key].value + '</b></button>';
        }).join('') + '</div>' +
        '<div class="qc"><p class="qc-title">Pantau performa <span>' + k.label + '</span></p>' + chart(k.days) +
        '<div class="qc-axis">' + DAYS.map(function (d) { return '<span>' + d + '</span>'; }).join('') + '</div></div>' +
        '<div class="qui-grid">' + sentiment('Sentimen sosial media', [['1.2K', 'pos'], ['486', 'neu'], ['142', 'neg']]) + sentiment('Sentimen berita', [['1.1K', 'pos'], ['520', 'neu'], ['98', 'neg']]) + '</div>';
    }
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-kpi]');
      if (!b) return;
      state.kpi = b.dataset.kpi;
      render(); fill(root, true);
    });
    render();
  }

  /* ---------- Wawasan ---------- */
  var ANOMALIES = [
    { title: 'Lonjakan penyebutan negatif', text: 'Topik pengiriman naik 214% dalam 24 jam, terbanyak dari X.',
      steps: [['Unggah estimasi pengiriman', 'Per wilayah, di kanal resmi.'], ['Balas keluhan teratas', 'Sertakan nomor pelacakan.']] },
    { title: 'Wilayah baru', text: 'Keluhan mulai muncul di Sumatera Utara.',
      steps: [['Siapkan jawaban untuk media daerah', 'Fokus pada portal di Medan.'], ['Tambah kata kunci lokal', 'Masukkan nama kota ke proyek.']] },
    { title: 'Sentimen positif naik', text: 'Layanan pelanggan 24 jam banyak diapresiasi.',
      steps: [['Bagikan cerita pelanggan', 'Unggah ulang testimoni terbaik.'], ['Perluas ke kota lain', 'Manfaatkan liputan yang sedang ramai.']] }
  ];
  function insight(root) {
    var state = { i: 0 };
    function render() {
      var a = ANOMALIES[state.i];
      root.innerHTML =
        '<div class="qui-head"><b>Wawasan</b><small>Harian · 2 Okt 2026</small></div>' +
        '<div class="qi-card"><h4>Anomali</h4>' + ANOMALIES.map(function (x, i) {
          return '<button type="button" class="qi-row' + (i === state.i ? ' on' : '') + '" data-a="' + i + '" aria-pressed="' + (i === state.i) + '"><b>' + x.title + '</b>' + x.text + '</button>';
        }).join('') + '</div>' +
        '<div class="qi-card qi-dark"><h4>Strategi <small>· ' + a.title + '</small></h4>' + a.steps.map(function (s) {
          return '<p class="qi-row"><b>' + s[0] + '</b>' + s[1] + '</p>';
        }).join('') + '</div>';
    }
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-a]');
      if (!b) return;
      state.i = +b.dataset.a;
      render(); fill(root, true);
    });
    render();
  }

  /* ---------- Konfigurasi Laporan ---------- */
  var REPORTS = {
    pdf: { tab: 'Laporan PDF', group: 'Ringkasan & Statistik', cta: 'Unduh Laporan PDF',
      items: [['Rangkuman & Wawasan', 'Ringkasan otomatis', '#ebe6fe'], ['Statistik Umum', 'Metrik performa media', '#e0ecfb'], ['Grafik Sentimen', 'Analisis sentimen', '#fde7ea'], ['Per Kata Kunci', 'Analisis per kata kunci', '#eef0f3']] },
    excel: { tab: 'Laporan Excel', group: 'Data', cta: 'Unduh Laporan Excel',
      items: [['Data Penyebutan', 'Semua penyebutan', '#e6f6ee'], ['Sumber Berita', 'Kontribusi terbanyak', '#e0ecfb'], ['Sumber Medsos', 'Influencer dan akun', '#ebe6fe'], ['Per Kata Kunci', 'Rekap per kata kunci', '#eef0f3']] },
    infographic: { tab: 'Laporan Infografis', group: 'Komponen visual', cta: 'Unduh Infografis',
      items: [['Ringkasan Visual', 'Angka utama', '#fde7ea'], ['Grafik Sentimen', 'Porsi per sentimen', '#e6f6ee'], ['Topik Teratas', 'Lima topik', '#fff1e6'], ['Wilayah', 'Daerah paling ramai', '#e0ecfb']] }
  };
  function report(root) {
    var state = { tab: 'pdf', on: {}, busy: false };
    Object.keys(REPORTS).forEach(function (k) { state.on[k] = REPORTS[k].items.map(function () { return true; }); });
    function render() {
      var r = REPORTS[state.tab], on = state.on[state.tab], n = on.filter(Boolean).length;
      root.innerHTML =
        '<div class="qui-head"><b>Konfigurasi Laporan</b><small>Pilih komponen data yang akan disertakan dalam dokumen</small></div>' +
        '<div class="qr-tabs" role="tablist">' + Object.keys(REPORTS).map(function (k) {
          return '<button type="button" role="tab" class="' + (k === state.tab ? 'on' : '') + '" data-tab="' + k + '" aria-selected="' + (k === state.tab) + '">' + REPORTS[k].tab + '</button>';
        }).join('') + '</div>' +
        '<p class="qr-label">' + esc(r.group) + '</p>' +
        '<ul class="qr-items">' + r.items.map(function (it, i) {
          return '<li><i style="--c: ' + it[2] + '"></i><span><b>' + esc(it[0]) + '</b><small>' + esc(it[1]) + '</small></span>' +
            '<button type="button" role="switch" class="qr-switch" data-item="' + i + '" aria-checked="' + on[i] + '" aria-label="' + esc(it[0]) + '"></button></li>';
        }).join('') + '</ul>' +
        '<div class="qr-foot"><button type="button" class="qr-go" data-go' + (n ? '' : ' disabled') + '>' +
          (state.busy ? 'Menyiapkan…' : r.cta + ' · ' + n + ' komponen') + '</button></div>';
    }
    root.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b || state.busy) return;
      if (b.dataset.tab) { state.tab = b.dataset.tab; render(); fill(root, true); return; }
      if (b.hasAttribute('data-item')) { var i = +b.dataset.item; state.on[state.tab][i] = !state.on[state.tab][i]; }
      else if (b.hasAttribute('data-go')) { state.busy = true; setTimeout(function () { state.busy = false; render(); }, 1400); }
      render();
    });
    render();
  }

  /* ---------- "Just filled in" entrance (no loading state) ----------
     Until the card is on screen its blocks wait hidden (.is-waiting). fill() then brings them in one after another,
     counts the numbers up from zero, draws the chart left to right and turns the report switches on one by one.
     After a click the new data comes in the same way, faster. */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var BLOCKS = '.qui-head, .qm, .qui-filter li, .qk, .qc, .qi-card > h4, .qi-card > .qi-row, .qr-tabs, .qr-label, .qr-items li, .qr-foot';
  var NUMBERS = '.qk > b, .qk-rows b, .qui-filter em, .qm-stats span';

  /* Count the number in an element's last text node up from 0, keeping its format:
     "4.7K" / "11.6M" (decimal point), "1.204" (thousands dot), "9/10" (counts the 9). Times like "09.12" are left alone. */
  function countUp(el) {
    var node = el.lastChild;
    if (!node || node.nodeType !== 3) return;
    if (el.querySelector('small') && /tayang/i.test(el.querySelector('small').textContent)) return;
    var m = node.textContent.match(/^(\s*)([\d.,]+)(\s*[KM]?)(.*)$/);
    if (!m) return;
    var suffix = m[3].trim(), decimals = suffix ? (m[2].split('.')[1] || '').length : 0;
    var target = suffix ? parseFloat(m[2]) : parseInt(m[2].replace(/\./g, ''), 10);
    if (isNaN(target)) return;
    var fmt = function (v) {
      return m[1] + (suffix ? v.toFixed(decimals) : Math.round(v).toLocaleString('id-ID')) + m[3] + m[4];
    };
    var t0 = performance.now(), dur = 900;
    (function step(now) {
      var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      node.textContent = fmt(target * e);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  function fill(root, quick) {
    root.classList.remove('is-waiting');
    if (reduce) return;
    var blocks = [].slice.call(root.querySelectorAll(BLOCKS)).filter(function (el) {
      return !(quick && (el.classList.contains('qui-head') || el.closest('.qui-filter, .qr-tabs')));
    });
    blocks.forEach(function (el, i) {
      el.style.animation = 'none';
      void el.offsetWidth; // restart the animation on re-fill
      el.style.animation = 'q-in 480ms cubic-bezier(0.2, 0.7, 0.2, 1) both';
      el.style.animationDelay = Math.min(i * (quick ? 45 : 70), 900) + 'ms';
    });
    root.querySelectorAll(NUMBERS).forEach(countUp);
    var chartSvg = root.querySelector('.qc svg');
    if (chartSvg) { root.classList.remove('is-drawn'); void chartSvg.getBoundingClientRect(); requestAnimationFrame(function () { root.classList.add('is-drawn'); }); }
    /* Report switches come on one after another (visual only: the state is already on) */
    root.querySelectorAll('.qr-switch[aria-checked="true"]').forEach(function (sw, i) {
      sw.setAttribute('aria-checked', 'false');
      setTimeout(function () { sw.setAttribute('aria-checked', 'true'); }, 250 + i * 160);
    });
  }

  var DEMOS = { mentions: mentions, analysis: analysis, insight: insight, report: report };
  var io = 'IntersectionObserver' in window && !reduce ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { io.unobserve(en.target); fill(en.target, false); } });
  }, { threshold: 0.35 }) : null;
  document.querySelectorAll('.qui[data-demo]').forEach(function (root) {
    var fn = DEMOS[root.dataset.demo];
    if (!fn) return;
    fn(root);
    if (io) { root.classList.add('is-waiting'); io.observe(root); }
  });
})();
