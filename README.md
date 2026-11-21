# portfolio-website

Source for [aryanhaghighi.com](https://aryanhaghighi.com): a one-screen holding page served by GitHub Pages. One `index.html` with inline CSS and no JavaScript.

| Path | What it is |
|---|---|
| `index.html` | The page |
| `fonts/` | Hanken Grotesk, cut down to Latin and weights 400 to 600. SIL Open Font License 1.1, see `fonts/OFL.txt` |
| `og.png` | Link preview image (1200x630), rendered from `_og/card.html` |
| `favicon.ico`, `apple-touch-icon.png` | File copies of the favicon for Google Search, older Safari and iOS home screens, rendered from `_icons/` |
| `CNAME` | Custom domain for GitHub Pages |
| `PRODUCT.md`, `DESIGN.md`, `.impeccable/` | Design notes. Not published (see `_config.yml`) |

Link icons are from Bootstrap Icons 1.11.3 (MIT, The Bootstrap Authors).

Preview locally:

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

Rebuild the preview image after changing the copy:

```sh
chromium --headless=new --hide-scrollbars --window-size=1200,630 --screenshot=og-raw.png _og/card.html
magick og-raw.png -colorspace Gray -colors 24 -strip PNG8:og.png
```

Rebuild the icon files after changing the mark in `_icons/`:

```sh
python3 _icons/build.py
```
