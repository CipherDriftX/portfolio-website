# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro 7.4.13 (pinned exact), static output. The only client JavaScript is Vercel Web Analytics (`@vercel/analytics/astro`, added at the owner's request 2026-11-21). Content collections (work, projects, reviews, notes, about) as one Markdown file per entry, core copy in `src/data/site.ts`. Drafts render in `npm run dev` only, and the production build fails if `[OWNER:` text reaches a live entry or the output. Hosted on Vercel; `main` deploys aryanhaghighi.com, other branches get preview URLs. `vercel.json` sets the framework, install, build and output. Photo, link preview and icons come from scripts kept in the repo (`_photo/`, `_og/`, `_icons/`).

Budgets: home page at most 250 KB including the photo, JavaScript only for analytics (about 3.3 KB gzipped, loaded after the page), at most 3 font files (2 used: Gloock, Hanken Grotesk). PageSpeed Insights mobile 95 or more in all four categories, LCP at most 2.0 s, CLS 0. The owner's laptop is weak, so no heavy tooling.

## Users

SaaS founders and AI agency owners who got a cold email or LinkedIn message from Aryan Haghighi and click through to check he is a real, serious engineer, plus hiring managers. They stay 5 to 10 seconds.

## Product Purpose

The portfolio for Aryan Haghighi. In 5 to 10 seconds the first screen must answer: who is this, what does he do, how do I reach him. Success = the visitor trusts the cold message enough to reply. Below the first screen, proof builds up as it exists: work, case studies, how he works, reviews, notes.

## Capabilities and Constraints

- First screen is Persuade mode: name (the largest element), "AI Engineer", the claim, the drone line, and the contact links (email written out, LinkedIn, GitHub). The first live section peeks above the fold. Case study and note pages are Read mode.
- Section order: Work, Case studies, How I work, Reviews, Notes, About, then Contact and footer. A section with no live entries does not render.
- Pages: `/`, `/work/<slug>`, `/notes/<slug>`, `/404`. Sitemap, robots.txt, canonical `https://www.aryanhaghighi.com/`, Person JSON-LD.
- Fixed copy:
  - Title tag: Aryan Haghighi, AI Engineer · production AI agents + evals
  - Claim: I ship AI agents into production, with evals that prove they work.
  - Drone line: Building autonomous drones.
  - How I work: I start with a two-week fixed-price build: one working agent in your stack, with the evals to prove it. If it works, we go month to month. (No price.)
  - Links: aryan@aryanhaghighi.com, https://www.linkedin.com/in/aryan-haghighi-24b779304/, https://github.com/CipherDriftX
- Photo: the owner's own phone photo, cropped and lightly graded, never AI edited, upscaled or smoothed. The beer glass, the ashtray and cigarette, and the woman in red stay out of every crop, the link preview included.
- Banned words and marks: passionate, leverage, cutting-edge, seamless, "let's build something amazing", emojis, exclamation marks, em dashes. Section labels are plain nouns.
- Works from 320 px wide with no horizontal scroll and tap targets of 44 px or more.

## Brand Commitments

- Always the full name "Aryan Haghighi". Never "Aryan" alone as a short name, and never the initials "AH" in any mark, monogram, favicon or logo (both can read as hate-group code in the US and EU). Favicon is a plain geometric mark, no letters.
- Voice: calm, sharp, quiet. A serious engineer's personal page, not a startup landing page.

## Evidence on Hand

LinkedIn and GitHub profiles only. The owner picks which projects appear; never add his GitHub repos to Work, case studies or notes on your own. No clients, reviews or eval metrics exist yet, and none may be invented; a case study leaves `evals` out until real results exist. Work, Case studies and Notes show one placeholder line until the owner adds entries. Every missing item is a draft placeholder with an `[OWNER: ...]` line until the owner writes it.

## Product Principles

- Answer who / what / how-to-reach in one eye path, top to bottom.
- Fewer elements beat more. Every element must earn its place in a 5-second scan.
- Trust comes from restraint and correctness (fast, accessible, valid), not decoration.
- Proof is added one Markdown file at a time; the page never shows an empty or fake section.

## Accessibility & Inclusion

WCAG 2.2 AA. Dark only (`color-scheme: dark`); text contrast checked over the photo at every layout. Semantic HTML, links look like links, visible amber focus ring, skip link. Motion is one opacity fade on load (700 ms max) and hover transitions (150 ms max), both off under reduced motion.
