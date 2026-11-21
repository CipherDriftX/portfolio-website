---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/work/[slug].astro","src/pages/404.astro"]
---

## Scope and mode

The whole site: home (`src/pages/index.astro`), case study pages (`src/pages/work/[slug].astro`), note pages, 404. Home first screen is Persuade; case study and note pages are Read.

## Audience and job

Founders and agency owners who got a cold email or LinkedIn message, plus hiring managers for AI engineer roles. 5 to 10 seconds on the first screen: who, what, how to reach. Action = reply, or click email or LinkedIn. Proof on hand: the photo, LinkedIn, GitHub. No clients, metrics or reviews exist; drafts hold their places and never ship.

## Direction contract

THESIS: The site is the room in the photo, at night: near-black and umber, lit only by the photo's own lights. Refuses the navy developer portfolio, the centered gradient hero with a button, bento and glass cards, cursor glows, skill clouds.
OWN-WORLD: Base #0B0807, flat surface #211413, cream text #F6E9CE, muted #A38F7D, one accent tungsten amber #F7BC7C on links, underlines, focus and hover only. Violet #D273AD, blue #3021D7 and street #3F537C are light, never ink: three faint static blooms (amber from the top, violet left of the face, blue low on the photo side), dithered inside the gradient. Gloock for the name and section heads, Hanken Grotesk for the rest, tabular figures. No cards, borders, pills or nav lines; grouping by space.
STORY: The visitor meets his face and the name, reads AI Engineer and the claim, notices the drone line, and clicks the written-out email or LinkedIn; below, How I work states the offer without a price.
FIRST VIEWPORT: 1440x900. Photo right, full viewport height, about 51 to 55% wide, left, top and bottom edges masked into the base, his gaze pointing at the text. Text left on the page frame (82rem centered, x 153 at 1440) on the dark side: name in Gloock up to 96px on two lines, sized to the dark side and capped by screen height, AI Engineer, claim, drone line, then the links row (email in full, LinkedIn, GitHub). Small top bar over a soft base fade: mark left, live section links right (phones: first two sections and Contact). The How I work heading peeks at the fold. Phones: photo on top (4:5 crop with headroom), bottom dissolving; the name starts on the dissolved edge; the first section's heading peeks from about 720px tall up. Motion: one opacity fade on photo and text, 700 ms max, none under reduced motion. Cited adaptations: (1) photo width is min(55vw, 82svh), so 16:9 screens like 1920x1080 get about 46%: a 55% box at full height would crop the 0.74 portrait to near-square and cut the bulbs or the arms. (2) Phones carry two blooms, violet and blue: the phone crop already holds the real bulbs at its top under the bar fade, and an amber bloom there washes them. (3) Under about 720px tall the photo keeps 44% of the height so the name never crosses his face; the peek gives way there (brief section 1: who, what and contact outrank the peek), the links never do. (4) The 404 is one line and a link home: top bar, no Contact block.
FORM: seed: none (pinned) "the site is the room in the photo, at night" and "Photo on the right, about 55% of the width, full viewport height, edges dissolving into the base ... Text block on the left, on the dark side" (owner brief, 2026-11-21, confirmed in session).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
