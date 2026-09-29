# Qola

Marketing website for **Qola**, a media intelligence platform built for Indonesia. Qola helps organizations monitor conversations across online news, social media, and other digital sources, detect emerging issues early, track sentiment, and turn the data into executive-ready reports.

## Repository Contents

| File | Description |
|------|-------------|
| `Qola.html` | Main landing page (Bahasa Indonesia). Self-contained HTML, CSS, and JavaScript. |
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
- Keep `logo_qola.png` in the same directory as `Qola.html`.

## Contact

For product inquiries or demo requests, email [info@qola.id](mailto:info@qola.id).
