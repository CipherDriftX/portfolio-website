---
name: Aryan Haghighi
description: The room in the photo, at night. A dark personal page lit only by the photo's own lights.
colors:
  base: "#0b0807"
  surface: "#211413"
  wood: "#432d26"
  cream: "#f6e9ce"
  muted: "#a38f7d"
  amber: "#f7bc7c"
  violet: "#d273ad"
  blue: "#3021d7"
typography:
  display:
    fontFamily: "Gloock, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(3.5rem, 15vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  page-title:
    fontFamily: "Gloock, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(2.5rem, 1.75rem + 3.5vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 1.05
  headline:
    fontFamily: "Gloock, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(2rem, 1.5rem + 2vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.05
  title:
    fontFamily: "Gloock, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(1.375rem, 1.2rem + 0.6vw, 1.75rem)"
    fontWeight: 400
    lineHeight: 1.15
  lead:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.05rem + 0.7vw, 1.625rem)"
    fontWeight: 400
    lineHeight: 1.4
  role:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1rem + 0.5vw, 1.375rem)"
    fontWeight: 600
    letterSpacing: "0.005em"
  figure:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 600
    fontFeature: "tnum, lnum"
  prose:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.65
  body:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
rounded:
  none: "0px"
  hairline: "2px"
spacing:
  gutter: "clamp(1rem, 7vw - 0.75rem, 6rem)"
  section: "clamp(4.5rem, 3rem + 6vw, 9rem)"
  frame: "82rem"
  measure: "38rem"
  tap: "2.75rem"
  tight: "0.5rem"
  step: "1.25rem"
  links: "1.75rem"
  group: "2.5rem"
components:
  link:
    textColor: "{colors.cream}"
  link-hover:
    textColor: "{colors.amber}"
  nav-link:
    textColor: "{colors.cream}"
    typography: "{typography.label}"
    height: "{spacing.tap}"
  contact-link:
    textColor: "{colors.cream}"
    typography: "{typography.body}"
    height: "{spacing.tap}"
  study-panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.none}"
    padding: "clamp(1.25rem, 1rem + 1.5vw, 2.25rem)"
  skip-link:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.base}"
    rounded: "{rounded.none}"
    padding: "0.625rem 1rem"
  site-mark:
    backgroundColor: "transparent"
    height: "32px"
    width: "20px"
---

# Design System: Aryan Haghighi

## Overview

**Creative North Star: "The Night Window"**

The site is the room in the photo, at night. The page is a warm near-black, the colour of a table top after dark. Every colour on it was sampled from the owner's own phone photo: the table, the curtain, the bulb glass, the bulb base, the neon on his cheek, the blue chair. Light on the page comes only from where it comes from in the photo. The page never invents a new light source.

It is a quiet, sparse page for a 5 to 10 second scan. One photo, one name set large in a serif, a few lines of plain grotesk text, and links that look like links. Grouping is done by space and type size, not by boxes. The photo is always the brightest thing on screen; the blooms behind it are faint enough to feel like air, not decoration.

It rejects the dark-navy developer portfolio, the centered gradient hero with a button, bento grids, glass cards, cursor glows, animated blobs and skill-logo clouds. The old paper-and-ink title card with signal orange is gone and is not a reference.

**Key Characteristics:**
- Dark only. `color-scheme: dark`, no light mode, no toggle.
- One interactive accent: tungsten amber, on underlines, hover, focus and selection only.
- Violet and blue exist only as light: soft, dithered, static blooms.
- Gloock for the name and headings, Hanken Grotesk for everything else, tabular figures for every number.
- Flat. No shadows, no borders as decoration, square corners.
- One load fade, then stillness.

## Colors

A warm umber dark lit by tungsten, with two cold lights kept strictly as glow.

### Primary
- **Tungsten Amber** (`amber`): the bulb base. The only interactive colour. Link underlines (1px, 2px on low-density screens), link and icon hover, the focus ring, text selection and the skip link. It is never body text colour at rest and never a fill on a large area. Also the warm bloom from the top of the first screen and the reading-page glow, at 12 to 13% opacity.

### Secondary
- **Neon Violet** (`violet`): the neon on his cheek. Light only. A bloom left of his face on desktop, below the photo on phones, peak alpha 0.16.

### Tertiary
- **Chair Blue** (`blue`): the blue chair. Light only. A low bloom on the photo side, peak alpha 0.26. It fails text contrast on the base, which is one reason it is never ink.

### Neutral
- **Table Top** (`base`): page background, `theme-color`, the top bar's fade, text on amber fills.
- **Table** (`surface`): the one flat container colour. Case study panels, code blocks, inline code, the favicon tile.
- **Curtain** (`wood`): hairlines only. Table row rules in long-form prose and the scrollbar thumb.
- **Bulb Glass** (`cream`): all primary text, headings and links at rest.
- **Ash Umber** (`muted`): secondary text. The drone line, dates, figcaptions, dt labels, back links, contact icons at rest. 6.4:1 on base, 5.8:1 on surface.

### Named Rules
**The Light, Never Ink Rule.** Violet and blue appear only inside radial blooms. Never as text, icon, border, button or fill. If you can point at it and name its edge, it is ink and it is wrong.

**The One Accent Rule.** Amber marks what you can act on: underlines, hover, focus, selection. Nothing decorative is amber except the light blooms.

**The Real Source Rule.** Every bloom is tied to a light in the photo: amber from above (the bulbs), violet beside the face (the neon), blue low on the photo side (the chair). At most three per screen. No bloom without a source.

## Typography

**Display Font:** Gloock (with Iowan Old Style, Georgia, serif)
**Body Font:** Hanken Grotesk, variable 400 to 600 (with ui-sans-serif, system-ui, sans-serif)

**Character:** A high-contrast serif with the warmth of a film poster carries the name and headings; a plain, even grotesk carries every working line. Two files, self-hosted and preloaded, no third.

### Hierarchy
- **Display** (Gloock 400, `display`, line-height 0.95): the name only, on two lines, one word per line. On desktop the size is fitted to the dark side and capped by screen height: `clamp(2.5rem, min((100vw - photo width) / 5.2, 13svh), 6rem)`. The largest element on the site.
- **Page title** (Gloock 400, `page-title`): the h1 on case studies and the 404, max 16 to 18ch. Notes use a slightly smaller step, clamp(2.25rem, 1.6rem + 3vw, 4rem), max 20ch.
- **Headline** (Gloock 400, `headline`): section heads on the home page and Contact. Plain nouns.
- **Title** (Gloock 400, `title`): entry titles inside sections. In long-form prose, h2 steps down to clamp(1.625rem, 1.4rem + 0.8vw, 2rem) and h3 switches to Hanken 600 at 1.125rem.
- **Lead** (Hanken 400, `lead`): the claim (max 28 to 30ch, line-height 1.35), the offer (34ch), article leads and review quotes.
- **Role** (Hanken 600, `role`): "AI Engineer" under the name.
- **Figure** (Hanken 600, `figure`, tabular lining figures): eval results. 2rem on a case study page.
- **Body** (Hanken 400, `body`): default text, line-height 1.55, `text-wrap: pretty`.
- **Prose** (Hanken 400, `prose`): long-form reading, max 38rem.
- **Label** (Hanken 400, `label`): nav links, dates, dt labels, back links, the footer year. Usually muted.

### Named Rules
**The Serif Is For Names Rule.** Gloock sets names and headings only (h1 to h3, weight 400, balanced wrap). Every sentence, link, label and number is Hanken Grotesk.

**The Tabular Rule.** Every number (eval results, dates, years) uses tabular lining figures.

**The No Labels Rule.** Section heads are plain nouns in Gloock. No small uppercase labels above headings, no letter-spaced captions.

## Layout

One centered frame, max 82rem, with a fluid side gutter (1rem at 320px, 6rem at its widest). The top bar lines up with the same frame. Sections stack vertically with a large fluid gap (`section`, 4.5rem to 9rem); within a section, steps are 0.5rem, 1.25rem, 1.75rem and 2.5rem. Reading text holds to a 38rem measure.

**First screen, desktop** (min-width 40rem and aspect ratio at least 5:4): the photo sits on the right at full viewport height, min(55vw, 82svh) wide, so 16:9 screens get about 46% and the portrait is never cropped to a square. Its left, top and bottom edges are masked into the base with stepped gradients. Text sits left on the dark side, vertically centered: name, role, claim, drone line, contact links. The first live section's heading peeks at the fold (1.5rem top padding).

**First screen, phones**: the photo goes on top in a 4:5 crop with headroom, its bottom dissolving. The name starts on the dissolved edge, pulled up by clamp(3.5rem, 16vw, 6rem). The photo gives way so the links always fit; under about 720px tall it keeps 44% of the height so the name never crosses his face. Landscape phones (under 32rem tall) tighten the steps so everything through the links fits.

**Reading pages and the 404**: same frame, one amber glow from the top right, content starting about 6 to 9rem down. The 404 is one line and a link home, no Contact block.

**Lists**: Work comes in two lanes, Agents and Agent safety. From 64rem up each lane has a 13rem sticky rail on the left (lane name in Gloock title size, one muted line) and its projects stacked on the right, 4 to 6.5rem apart, no boxes and no rules. Case studies, reviews and notes are single columns with 1.5 to 3rem gaps. Notes put the date in a 7rem column from 40rem up.

Works from 320px with no sideways scroll. Every link has a 44px (2.75rem) tap height.

## Elevation & Depth

Flat. There are no box shadows anywhere. Depth comes from light: three large, faint radial blooms behind the first screen and one glow on reading pages, each grain-dithered inside its own gradient (an SVG noise tinted to the bloom's colour, only its alpha moves) so dark gradients do not band. There is no full-page grain. The top bar has no visible edge; a soft fade of the base (86% to 0% over 6.5rem) keeps its links readable over the photo's ceiling bulbs. The only raised surface is the flat `surface` panel.

### Named Rules
**The Photo Is Brightest Rule.** Blooms stay at or below 0.13 alpha for amber, 0.16 for violet, 0.26 for blue. If a bloom competes with the bulbs in the photo, it is too strong.

**The No Shadow Rule.** No box-shadow, text-shadow or drop shadow. Separation is space, then tone.

## Shapes

Square corners. Panels, code blocks, the skip link and the photo have no radius. The only rounding is a 2px radius on the focus ring and inline code, The mark has no tile anywhere a background shows through; phone icons are full-bleed squares that the OS rounds. Borders are not used to group or decorate; the one hairline is a 1px `wood` rule under table rows in long-form prose. The photo never has a hard edge: every side that meets the page is masked into the base.

## Components

### Links
Quiet and unmistakable.
- **Default:** cream text with a 1px amber underline (2px on screens at 1.5x density or less), offset 0.28em.
- **Hover:** text turns amber over 120ms ease-out.
- **Focus:** 2px amber outline, 4px offset, 2px radius. Same everywhere.
- **Title links** (entry headings): no underline at rest; the amber underline appears on hover and focus.

### Navigation
- **Top bar:** absolute over the first screen, no background edge, just the base fade. The site mark on the left in a 44px hit area; section links on the right in `label` size, no underline at rest, amber underline on hover.
- **Live sections only:** it links only to sections that render in production, plus Contact.
- **Phones:** the first two sections and Contact; the rest appear from 48rem up.

### Contact links
The email address written out in full, then LinkedIn and GitHub, each with a 1em Bootstrap Icons SVG in muted that turns amber on hover. The underline sits on the text only. In a narrow container the email takes its own row; from 28.5rem of container width all three sit on one row. Used in the hero and in the Contact footer.

### Case study panel
The one container: a flat `surface` block, no border, no radius, no shadow, fluid padding. Inside: Gloock title link, one-line summary, the eval result (large Hanken 600 figure, then metric and case count) and a muted client and year line.

### Project entry
One project in Work. From 48rem: text on the left (Gloock name at 1.875 to 2.75rem, a muted line with place, year and language, the one-line lead, a short paragraph, the stack joined by middots in muted, then a "Code" link with the GitHub icon), and a right column of 11 to 15rem with up to two figures: Hanken 600 at 2.25 to 3.25rem, tabular, cream, each with a muted label of at most 24ch. On phones the figures move up under the lead, two side by side. Every figure must be checkable in the repo it links to. An optional exhibit shows a few lines of the tool's real output in a flat `surface` panel, system monospace, `white-space: pre`; a narrow screen scrolls the panel, never the page.

### Skip link
Amber block with base text, Hanken 600, hidden above the viewport until focused, then a cream focus ring.

### Site mark
A hypersonic jet seen from above, nose up: an original planform whose leading edge is one blended curve from needle nose to wingtip, with a forward-swept W trailing edge ending in two pointed engine tails. Two flat facets split on the centreline, lit from the right: tan `#cf9a63` on the left, `cream` on the right. No gradients, no outlines, no glow; it must hold as a solid silhouette at 16px. On the page it stands alone at 32px tall, its wingtip on the text edge. The favicon is transparent: `favicon.svg` uses the same facets on dark tabs and near-black `#140b09` / `#3b2822` on light tabs (prefers-color-scheme inside the SVG); the ICO frames, which cannot switch, are copper `#a65c2b` / `#c97a40`, about 3:1 on both. Phone and manifest icons put it on a flat `#120b09` square at 64% of the height. It carries the theme (dark, fast jets) without aerospace job-seeker cues: no HUD symbols, insignia, blueprint lines or technical labels. No letters. Decorative; the link around it carries the full name.

### Draft tag (dev only)
A small muted label with a dashed muted border, shown only in `npm run dev` next to draft entries. It never ships and is not a pattern for production UI.

## Do's and Don'ts

### Do:
- **Do** use cream for text and amber only for underlines, hover, focus, selection and the skip link.
- **Do** keep violet and blue inside radial blooms, dithered with their tinted grain, at their recorded alphas.
- **Do** set every name and heading in Gloock 400 and everything else in Hanken Grotesk.
- **Do** use tabular lining figures for every number.
- **Do** group by space: the `section` step between sections, 0.5rem to 2.5rem inside them.
- **Do** mask every edge of the photo into the base.
- **Do** keep a 44px tap height on every link and the same amber focus ring everywhere.
- **Do** use the flat `surface` panel when content truly needs a container, with no border or shadow.
- **Do** keep motion to one opacity fade on load (700ms photo, 600ms text after 80ms, cubic-bezier(0.16, 1, 0.3, 1)) and 120ms hover transitions, all off under reduced motion.
- **Do** write the name in full, "Aryan Haghighi", in every mark, title and alt text.

### Don't:
- **Don't** use violet, blue or any other cool light from the photo (the street through the window included) as text, icons, borders, buttons or fills.
- **Don't** add a light mode or theme toggle.
- **Don't** add a light source that is not in the photo, or more than three blooms on one screen.
- **Don't** use box shadows, glass, blur panels, glowing borders, bento grids, pills or chips.
- **Don't** add small uppercase labels or eyebrows above headings.
- **Don't** put text on the bright part of the photo; text may overlap only its dissolved dark edge.
- **Don't** use initials "AH" or any letter in the mark or favicon.
- **Don't** add a third font file.
- **Don't** add cursor-follow effects, animated gradients, scroll animations or counters.
- **Don't** mirror, AI-edit, upscale or smooth the photo.
