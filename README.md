# portfolio-website

Source for [aryanhaghighi.com](https://aryanhaghighi.com): a one-screen holding page served by GitHub Pages. One `index.html` with inline CSS and no JavaScript.

| Path | What it is |
|---|---|
| `index.html` | The page |
| `fonts/` | Hanken Grotesk, cut down to Latin and weights 400 to 600. SIL Open Font License 1.1, see `fonts/OFL.txt` |
| `og.png` | Link preview image (1200x630), rendered from `_og/card.html` |
| `CNAME` | Custom domain for GitHub Pages |
| `PRODUCT.md`, `DESIGN.md`, `.impeccable/` | Design notes. Not published (see `_config.yml`) |

Link icons are from Bootstrap Icons 1.11.3 (MIT, The Bootstrap Authors).

Rebuild the preview image after changing the copy:

```sh
chromium --headless=new --hide-scrollbars --window-size=1200,630 --screenshot=og-raw.png _og/card.html
magick og-raw.png -colorspace Gray -colors 24 -strip PNG8:og.png
```
