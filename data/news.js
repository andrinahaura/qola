/* News and articles shown on the landing page (latest 4) and on berita/index.html (all).
   Loaded as a plain script, so it also works when the pages are opened straight from disk.

   Add one object per article. Order does not matter: the pages sort by date, newest first.
     id        unique slug, e.g. "tren-media-q3-2026"
     title     article title
     category  short label, e.g. "Insight", "Tren Media", "Isu Terkini", "Kabar Qola"
     date      publish date, "YYYY-MM-DD"
     excerpt   short description, 1–2 sentences
     image     thumbnail path from the site root, e.g. "assets/news/tren-media-q3-2026.jpg" (optional)
     url       where "Read More" goes: a path from the site root or a full https:// URL

   While this list is empty, both pages show labelled placeholder cards instead of articles. */
window.QOLA_NEWS = [];
