# Qola

Marketing website for **Qola**, a media intelligence platform built for Indonesia. Qola helps organizations monitor conversations across online news, social media, and other digital sources, detect emerging issues early, track sentiment, and turn the data into executive-ready reports.

## Repository Contents

| File | Description |
|------|-------------|
| `Qola.html` | Main landing page (Bahasa Indonesia). Shows each product as a quick view card whose "Learn More" link opens the product page at that product. |
| `produk/index.html` | Product page with the full content of all four products. Each product has an anchor (`#monitoring-360`, `#analisis-sentimen`, `#peringatan-dini`, `#brief-laporan`) that the sticky anchor bar, the Produk dropdown, and the quick view cards link to. |
| `css/qola.css` | Shared stylesheet for the landing page and product pages. |
| `js/site.js` | Shared script: floating nav, Produk dropdown, scroll spy, reveal on scroll. |
| `berita/index.html` | News page listing every article, with a category filter. The landing page's "View All News" button links here. |
| `data/news.js` | Article list for the news section and news page. Field descriptions are at the top of the file. |
| `js/news.js` | Renders articles from `data/news.js`. Shows labelled placeholders while the list is empty. |
| `js/live.js` | Fills the "Hari ini di Qola" live panel on the landing page from a JSON endpoint. The expected JSON schema is documented at the top of the file. |
| `Qola Standalone (1).html` | Bundled standalone build of an earlier landing page version, with all assets inlined. |
| `design.md` | Design style reference: color tokens, typography, and component guidelines. |
| `logo_qola.png` | Qola logo used by the landing page. |

## Getting Started

No build step or dependencies are required.

1. Clone the repository:

   ```bash
   git clone https://github.com/andrinahaura/qola.git
   cd qola
   ```

2. Open `Qola.html` in a web browser.

To serve the page locally over HTTP instead:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/Qola.html>.

## Notes

- `Qola.html` loads the Inter font from Google Fonts, so an internet connection is needed for correct typography.
- Keep `logo_qola.png`, `css/`, `js/`, and `produk/` next to `Qola.html`. The pages use relative paths to reach each other.
- The "Hari ini di Qola" panel is not connected to real data yet, so it shows labelled placeholders. To connect it, set `data-live-endpoint` on `<section id="hari-ini">` in `Qola.html` to a URL that returns the JSON described in `js/live.js`. `data-live-interval` sets the refresh interval in seconds (default 60). The endpoint must allow cross-origin requests if it is on another domain.

## Contact

For product inquiries or demo requests, email [info@qola.id](mailto:info@qola.id).
