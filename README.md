# portfolio-website

Source for [aryanhaghighi.com](https://www.aryanhaghighi.com). Astro 7, built to static HTML, hosted on Vercel. The only JavaScript is Vercel Web Analytics (about 3 KB, cookieless). Every push to `main` deploys the live site. Other branches get a preview URL.

## Run it

Needs Node 26.

```sh
npm ci          # once
npm run dev     # http://localhost:4321, shows drafts
npm run build   # production build into dist/, drafts left out
```

The production build stops with an error if any live entry still has `[OWNER: ...]` text in it.

## Where things live

| Path | What it is |
|---|---|
| `src/data/site.ts` | Name, title, claim, drone line, offer, email, LinkedIn, GitHub, photo alt text |
| `src/content/projects/` | Repos for the Work section, one Markdown file each |
| `src/content/work/` | Case studies, one file each, each gets a page at `/work/<file name>` |
| `src/content/reviews/` | Reviews, one file each, only with the person's permission |
| `src/content/notes/` | Notes, one file each, each gets a page at `/notes/<file name>` |
| `src/content/about/about.md` | The About text |
| `src/pages/` | Home, case study page, note page, 404 |
| `src/styles/global.css` | Colours, fonts, links, focus |
| `public/photo/` | The photo, one black and white print, cut by `_photo/build.py` |
| `public/fonts/` | Archivo Expanded (name and section titles) and Hanken Grotesk (text), both SIL Open Font License 1.1 |
| `_photo/build.py`, `_og/build.py`, `_icons/build.py` | Scripts that make the photo files, the link preview and the icons |
| `CNAME`, `_config.yml` | Left over from GitHub Pages. Not deployed |
| `PRODUCT.md`, `DESIGN.md`, `.impeccable/` | Design notes. Not deployed (see `.vercelignore`) |

A section shows on the site only when it has live entries: one project, one case study, one review, or two notes. Drafts (`draft: true`) show in `npm run dev` with a Draft tag and never go live. How I work and Contact always show.

Link icons are from Bootstrap Icons 1.11.3 (MIT, The Bootstrap Authors).

## How to update

**Add a case study**

1. Copy `src/content/work/example-case-study.md` to `src/content/work/<short-name>.md`.
2. Replace every `[OWNER: ...]` line, then set `draft: false`.
3. `npm run build`, then push.

**Add a project to Work**

1. Copy `src/content/projects/example-project.md` to `src/content/projects/<repo-name>.md`.
2. Fill in the name, repo link and two lines, then set `draft: false`.
3. `npm run build`, then push.

**Add a review**

1. Get the person's written OK to quote them.
2. Copy `src/content/reviews/example-review.md`, paste their exact words, set `permission: true` and `draft: false`.
3. `npm run build`, then push.

**Add a note**

1. Copy `src/content/notes/example-note.md` to `src/content/notes/<short-name>.md`.
2. Write it and set `draft: false`. The Notes section appears once two notes are live.
3. `npm run build`, then push.

**Write the About text**

1. Open `src/content/about/about.md` and replace the `[OWNER: ...]` line with 3 sentences.
2. Set `draft: false`.
3. `npm run build`, then push.

**Change the claim, title, offer or links**

1. Edit the line in `src/data/site.ts`.
2. If you changed the name, title or claim, edit `_og/card.html` too and run `python3 _og/build.py`.
3. `npm run build`, then push.

**Swap the photo**

1. Check the crop boxes at the top of `_photo/build.py` against the new photo (nothing private in frame).
2. Run `python3 _photo/build.py <path to photo>`, then `python3 _og/build.py`.
3. Look at every file in `public/photo/` and `public/og.jpg`, then push. The home page cuts the print with the spot's curved edge, so check his face stays clear of it on a phone and on a wide screen.

**Change the icon**

1. The jet is drawn in six places with the same two paths: `_icons/j-favicon.svg` (browser tab, switches light/dark), `_icons/j.svg` (ICO, copper), `_icons/j-touch.svg` (phone icons), `src/components/Mark.astro` (top bar on every page but home), the jet hung in the hall in `src/pages/index.astro`, and `_og/card.html` (link preview). Change all six together.
2. Run `python3 _icons/build.py` and `python3 _og/build.py`, and look at `_icons/sheet.png` at real size and at `public/og.jpg`.
3. Push.

**Publish to the live site**

1. Push your branch and open the Vercel preview URL.
2. Merge the branch into `main`.
3. Vercel deploys `main` in about a minute.

The scripts need `magick` (ImageMagick 7), `rsvg-convert` and `chromium`.
