# Qola

Marketing website for **Qola**, a media intelligence platform built for Indonesia. Qola helps organizations monitor conversations across online news, social media, and other digital sources, detect emerging issues early, track sentiment, and turn the data into executive-ready reports.

## Repository Contents

```
index.html                 Landing page (Bahasa Indonesia)
produk/index.html          Product page: four products as stacked sticky cards
berita/index.html          News page with a category filter
css/qola.css               Shared stylesheet for every page
js/
  site.js                  Nav, Produk dropdown, mobile menu, scroll spy, reveal on scroll
  animations.js            Motion (motion.dev) animations: reveals, chat bubbles, FAQ, product-card stack
  hero.js                  Landing hero: dashboard cards assemble on scroll
  live.js                  "Hari ini di Qola" live panel, filled from a JSON endpoint (schema at the top)
  news.js                  Renders articles from data/news.js
  produk.js                Interactive dashboard demos inside the product cards
data/news.js               Article list (field descriptions at the top of the file)
assets/
  brand/logo-qola.png      Qola logo
  img/og-qola.jpg          Social share image
  img/hero/                Screenshots used on the landing page
  img/dashboard/           Dashboard pieces (KPI cards, chart) used in the hero and the CTA collage
docs/design.md             Design reference: colour tokens, typography, components
```

All dashboard content shown on the site is example data, never client data.

## Getting Started

No build step or dependencies are required.

1. Clone the repository:

   ```bash
   git clone https://github.com/andrinahaura/qola.git
   cd qola
   ```

2. Open `index.html` in a web browser.

To serve the page locally over HTTP instead:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/index.html>.

## Notes

- `index.html` loads the Inter font from Google Fonts, so an internet connection is needed for correct typography.
- Keep `assets/brand/logo-qola.png`, `css/`, `js/`, and `produk/` next to `index.html`. The pages use relative paths to reach each other.
- The "Hari ini di Qola" panel is not connected to real data yet, so it shows labelled placeholders. To connect it, set `data-live-endpoint` on `<section id="hari-ini">` in `index.html` to a URL that returns the JSON described in `js/live.js`. `data-live-interval` sets the refresh interval in seconds (default 60). The endpoint must allow cross-origin requests if it is on another domain.

## Contact

For product inquiries or demo requests, email [info@qola.id](mailto:info@qola.id).
