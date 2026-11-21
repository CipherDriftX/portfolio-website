# portfolio-website

Source for [aryanhaghighi.com](https://aryanhaghighi.com): a one-screen holding page hosted on Vercel. Every push to `main` deploys. One `index.html` with inline CSS and no JavaScript.

| Path | What it is |
|---|---|
| `index.html` | The page |
| `fonts/` | Hanken Grotesk, cut down to Latin and weights 400 to 600. SIL Open Font License 1.1, see `fonts/OFL.txt` |
| `og.png` | Link preview image (1200x630), rendered from `_og/card.html` |
| `favicon.ico`, `apple-touch-icon.png` | File copies of the favicon for Google Search, older Safari and iOS home screens, rendered from `_icons/` |
| `CNAME`, `_config.yml` | Leftovers from a GitHub Pages setup. Vercel ignores them |
| `PRODUCT.md`, `DESIGN.md`, `.impeccable/`, `_og/`, `_icons/` | Design notes and image sources. Not published (see `.vercelignore`) |

Link icons are from Bootstrap Icons 1.11.3 (MIT, The Bootstrap Authors).

Preview locally:

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

Rebuild the preview image after changing the copy:

```sh
chromium --headless=new --hide-scrollbars --virtual-time-budget=3000 --window-size=1200,630 --screenshot=og-raw.png "file://$PWD/_og/card.html"
magick og-raw.png -colorspace Gray -colors 16 -strip -define png:bit-depth=4 -define png:color-type=3 \
  -define png:compression-level=9 -define png:compression-filter=0 -define png:compression-strategy=0 og.png
```

Then put the `impeccable:prompt` origin note back into `og.png` (see `add_text` in `_icons/build.py`).

Rebuild the icon files after changing the mark in `_icons/`:

```sh
python3 _icons/build.py
```
