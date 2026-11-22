---
name: Aryan Haghighi
description: The Night Hall. An aviation hall after dark, one black jet hung under the ceiling, hard pools of light and a museum label.
colors:
  heat: "#f2a55a"
  hall: "#08090b"
  pool: "#16181d"
  bone: "#ece7dc"
  muted: "#8d9097"
  shade: "#24272d"
  steel: "#383c44"
typography:
  display:
    fontFamily: "Archivo Expanded, Arial Black, ui-sans-serif, sans-serif"
    fontSize: "clamp(2.5rem, min(5.6vw, 10.5svh), 6rem)"
    fontWeight: 600
    lineHeight: 0.94
    letterSpacing: "0em"
    fontVariation: "wdth 125"
  beat:
    fontFamily: "Archivo Expanded, Arial Black, ui-sans-serif, sans-serif"
    fontSize: "clamp(2rem, 0.75rem + 3.6vw, 4.25rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0em"
    fontVariation: "wdth 125"
  page-title:
    fontFamily: "Archivo Expanded, Arial Black, ui-sans-serif, sans-serif"
    fontSize: "clamp(2rem, 1.4rem + 2.6vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "0em"
    fontVariation: "wdth 125"
  wall:
    fontFamily: "Archivo Expanded, Arial Black, ui-sans-serif, sans-serif"
    fontSize: "clamp(1.625rem, 1.2rem + 1.6vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0em"
    fontVariation: "wdth 125"
  headline:
    fontFamily: "Archivo Expanded, Arial Black, ui-sans-serif, sans-serif"
    fontSize: "clamp(1.375rem, 1.2rem + 0.6vw, 1.75rem)"
    fontWeight: 600
    lineHeight: 1
    fontVariation: "wdth 125"
  offer:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.3125rem, 0.9rem + 1.6vw, 2.5rem)"
    fontWeight: 400
    lineHeight: 1.35
  lead:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.1875rem, 1.05rem + 0.6vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.35
  role:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1rem + 0.5vw, 1.375rem)"
    fontWeight: 600
  title:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 600
    lineHeight: 1.25
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
    fontWeight: 500
  display-phone:
    fontFamily: "Archivo Expanded, Arial Black, ui-sans-serif, sans-serif"
    fontSize: "clamp(2.25rem, 11.5vw, 4rem)"
    fontWeight: 600
    lineHeight: 0.94
    letterSpacing: "0em"
    fontVariation: "wdth 125"
  quote:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.1875rem, 1.05rem + 0.5vw, 1.4375rem)"
    fontWeight: 400
    lineHeight: 1.4
  table:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    fontFeature: "tnum, lnum"
  code:
    fontFamily: "ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "0.875em"
    fontWeight: 400
rounded:
  none: "0px"
  hairline: "2px"
spacing:
  gutter: "clamp(1rem, 7vw - 0.75rem, 6rem)"
  frame: "82rem"
  measure: "38rem"
  bar: "4rem"
  gap-hall: "clamp(4rem, 2.5rem + 6vw, 8rem)"
  pad-pool: "clamp(3rem, 2rem + 4vw, 6rem)"
  tap: "2.75rem"
  exhibit: "2.5rem"
  links: "1.75rem"
  wall: "1.5rem"
components:
  link:
    textColor: "{colors.bone}"
  link-hover:
    textColor: "{colors.heat}"
  nav-link:
    textColor: "{colors.bone}"
    typography: "{typography.label}"
    height: "{spacing.tap}"
  contact-link:
    textColor: "{colors.bone}"
    typography: "{typography.body}"
    height: "{spacing.tap}"
  pool:
    backgroundColor: "{colors.pool}"
    rounded: "{rounded.none}"
    padding: "{spacing.pad-pool} {spacing.gutter}"
  pool-unlit:
    backgroundColor: "{colors.hall}"
  wall-title:
    textColor: "{colors.bone}"
    typography: "{typography.wall}"
  beat-title:
    textColor: "{colors.bone}"
    typography: "{typography.beat}"
  exhibit:
    textColor: "{colors.bone}"
    typography: "{typography.body}"
    width: "{spacing.measure}"
  skip-link:
    backgroundColor: "{colors.heat}"
    textColor: "{colors.hall}"
    rounded: "{rounded.none}"
    padding: "0.625rem 1rem"
  hung-jet-lit:
    backgroundColor: "{colors.bone}"
  hung-jet-shade:
    backgroundColor: "{colors.shade}"
  site-mark:
    backgroundColor: "transparent"
    height: "32px"
    width: "20px"
---

# Design System: Aryan Haghighi

## Overview

**Creative North Star: "The Night Hall"**

The site is a great aviation hall after dark. The floor is cool black. Light falls in pools with hard edges, and a pool is either lit or unlit; nothing sits between. Under the ceiling hangs one matte black jet, the site mark drawn large, with one facet catching the spot. His photo, in black and white, stands in the spot's light, cut out of the dark by the jet's own leading-edge curve. The name and section titles are set wide and upright like the lettering on a hall wall; everything else reads like a museum object label: a bold first line, plain lines under it, figures that line up.

It is a quiet, sparse page for a 5 to 10 second scan. Grouping is done by light alone: a bay of the hall is a full-width graphite pool on the black floor. There are no boxes, no rules, no dividers, no shadows, no gradients and no haze. One warm colour exists, engine heat, and it only marks what you can act on.

The jet is a theme, never a costume. The hall rejects HUD and cockpit symbols, insignia, blueprint lines, stencil lettering, technical callouts, neon edges and the photo-beside-name hero on a glowing dark gradient.

**Key Characteristics:**
- Dark only (`color-scheme: dark`), no light mode, no toggle.
- Two states of light: hall black or pool graphite, hard edges, no in-between.
- One governing curve: the jet's leading edge is the edge of the print.
- One accent, heat, for links, focus and selection only.
- Archivo Expanded capitals for the name and wall titles; Hanken Grotesk for every label line.
- Lights up as hard cuts on load and as bays scroll into view; under reduced motion everything is lit.

## Colors

A cool, nearly neutral black hall with graphite light, bone lettering and one warm engine-heat accent.

### Primary
- **Engine Heat** (`heat`): the only accent. Link underlines (1px, 2px on low-density screens), link text and contact icons on hover, the focus ring, text selection (hall text on heat) and the skip link fill. Never body text at rest, never a fill on a large area, never decoration.

### Neutral
- **Hall Black** (`hall`): the page, the unlit floor between bays, `theme-color`, every unlit state in the lights-up motion, text on heat.
- **Pool Graphite** (`pool`): the one lit surface. Every bay, the head of reading pages, the 404's single pool, zebra rows in prose tables, code blocks and inline code.
- **Bone** (`bone`): all primary text, titles and links at rest, and the hung jet's lit facet. 16.2:1 on hall, 14.4:1 on pool.
- **Label Grey** (`muted`): second label lines: the drone line, dates, kind and year, figcaptions, dt labels, back links, the footer year, contact icons at rest, prose list markers. Also the unlit start of the label in the lights-up motion and the shade facet of the small site mark and favicon. 6.2:1 on hall, 5.6:1 on pool.
- **Shade Facet** (`shade`): the hung jet's facet turned away from the light, and the unlit state of its lit facet before the spot snaps on. Decorative only, never text.
- **Steel** (`steel`): the scrollbar thumb only.

### Named Rules
**The Two-State Light Rule.** A surface is hall (unlit) or pool (lit). Edges between them are hard. No gradient, blur, bloom, glow, haze or grain ever stands between the two.

**The Heat Is For Action Rule.** Heat appears only on links, focus and selection (and the skip link, which is a link). If it is heat and you cannot act on it, it is wrong.

**The Bone And Shade Rule.** The hung jet has exactly two flat facets: lit in bone, shade in the shade colour. No outline, no gradient, no third tone.

## Typography

**Display Font:** Archivo Expanded, width 125, weights 500 to 700 (with Arial Black, ui-sans-serif, sans-serif)
**Body Font:** Hanken Grotesk, variable 400 to 600 (with ui-sans-serif, system-ui, sans-serif)

**Character:** Wide upright capitals set like the names on a hall wall, against a plain, even grotesk that reads like a Smithsonian object label. Two self-hosted, preloaded files; no third.

### Hierarchy
- **Display** (Archivo Expanded 600, `display`, line-height 0.94, uppercase): the name only, "Aryan Haghighi" on two lines, one word per line, the largest element on the site. Phones use clamp(2.25rem, 11.5vw, 4rem). On wide screens it may run past the spot's floor line because the curve leans away higher up.
- **Beat** (Archivo Expanded 600, `beat`, uppercase): How I work's title, the one title larger than every other wall title. See the Components section.
- **Page title** (Archivo Expanded 600, `page-title`, line-height 1.08, sentence case): the h1 on case studies and the 404, max 18 to 22ch. Notes step down to clamp(1.875rem, 1.35rem + 2.2vw, 3.25rem).
- **Wall** (Archivo Expanded 600, `wall`, uppercase, line-height 1): every section title, one size for every bay. Plain nouns.
- **Headline** (Archivo Expanded 600, `headline`): h2 inside long-form prose.
- **Offer** (Hanken 400, `offer`, max 32ch): the How I work offer, the largest running text.
- **Lead** (Hanken 400, `lead`, line-height 1.35): the claim, max 26 to 28ch, balanced. Case study leads use clamp(1.25rem, 1.05rem + 0.7vw, 1.625rem), note leads clamp(1.1875rem, 1.05rem + 0.5vw, 1.375rem); review quotes sit on the same step.
- **Role** (Hanken 600, `role`): "AI Engineer" under the name.
- **Title** (Hanken 600, `title`, line-height 1.25): the bold first line of every exhibit label; h3 in prose at 1.125rem.
- **Figure** (Hanken 600, `figure`, tabular lining figures): eval results; 2rem on a case study page.
- **Prose** (Hanken 400, `prose`, max 38rem): long-form reading.
- **Body** (Hanken 400, `body`, line-height 1.55, `text-wrap: pretty`): default text.
- **Label** (Hanken 500, `label`): top bar links; at weight 400 for back links, dt labels and the footer year, usually in label grey.

### Named Rules
**The Hall Lettering Rule.** Archivo Expanded sets the name, wall titles, page titles and prose h2 only, always width 125, weight 600, letter-spacing 0. Every sentence, link, label line and number is Hanken Grotesk.

**The Tabular Rule.** Every number (eval results, dates, years) uses tabular lining figures.

**The Plain Noun Rule.** Section titles are plain nouns on the wall. No small uppercase captions, kickers or eyebrows above titles, no stencil or military lettering, no technical labels.

## Layout

One centered frame, max 82rem, with a fluid gutter (`gutter`, 1rem at 320px up to 6rem). The top bar (`bar`, 4rem) lines up with the frame. Reading text holds to a 38rem measure.

**Bays.** Each section is a full-width pool, padded `pad-pool` top and bottom, with `gap-hall` of dark floor before the next pool. Inside a bay: the wall title, then 1.5rem, then the content. Contact is the last bay and closes the hall; the footer year sits on the dark floor below it.

**Exhibits.** Entries stand in one ordered column, max 38rem, 2.5rem apart, read in sequence. Every label has the same lines in the same order: title, then kind and year (or date), then text, then the eval figure where one exists.

**First screen, wide** (min-width 40rem and aspect ratio at least 5:4): the print fills the right side, its left edge the jet's curve, landing on the floor at 44vw. The jet hangs from the ceiling on the left, rising into the top bar's empty left end, flexing between 7rem and 28rem tall to fill the dark above the label. The label sits left of the curve: name, role, claim, drone line, contact links. The first bay shows its lit edge at the fold.

**First screen, phones**: the print on top, max(12.5rem, min(44svh, 100svh minus 30rem)) tall, clipped by the tall curve whose edge starts at 32% of the width, zoomed 1.1 from its left so his face clears the curve. The jet hangs small at the upper left (5rem to 7.5rem tall). The label follows, links on the first screen.

**Landscape phones** (wide layout under 32rem tall): the jet is left out, the curve lands at 56vw, steps tighten, and only the first bay's lit edge shows at the fold.

**Reading pages**: a lit head pool (back link, title, lead, facts), then the prose on the dark floor below it. The 404 is one lit pool vertically centered in an empty hall, one line and a link home, with no Contact bay.

Works from 320px with no horizontal scroll (`overflow-x: clip` on body). Every link has a 44px (`tap`, 2.75rem) hit height.

### Named Rules
**The One Ordered Row Rule.** Exhibits are one column read top to bottom. Never a grid of cards, never side-by-side tiles.

**The Identical Label Rule.** Every exhibit in a section carries the same lines in the same order. A missing line is left out; it is never replaced by a different kind of line.

## Elevation & Depth

Flat. No box-shadow, text-shadow or drop shadow anywhere. Depth comes only from light: hall black versus pool graphite, with hard edges, and the hung jet's two flat facets. The top bar has no edge, fade or fill; it is part of the ceiling.

### Named Rules
**The No Haze Rule.** No gradients, blooms, glows, blur or grain. If an edge between light and dark is soft, it is wrong.

**The Light Groups Rule.** Grouping is done by pools of light and space. No boxes, borders, rules, dividers or hairlines. Prose tables read by alternate pool rows, not by lines.

## Shapes

Square. Pools, the print and every surface have 0 corners. The only radius is a 2px hairline on the focus ring and inline code; the site mark's 44px hit area rounds its focus ring at 0.5rem.

One curve governs the whole world: the jet's blended leading edge, from nose to wingtip. Drawn at the size of the room as an SVG clip path, it is the edge of the photo print (a wide version lit on the right, a tall version for phones and landscape). The same drawing is the hung jet, the site mark, the favicon and the link preview. No other curve, diagonal or decorative shape is introduced.

The mark itself: a hypersonic jet seen from above, nose up, the leading edge one blended curve, the trailing edge a W ending in two pointed engine tails, split into two flat facets lit from the right. In the hall it hangs nose up with a 15 degree lean toward the spot.

### Named Rules
**The One Curve Rule.** The jet's leading edge is the only curve in the system, and the print's edge is that curve. Any new cut, crop or silhouette reuses it or stays square.

## Components

### Links
- **Style:** bone text, heat underline (1px, 2px at 1.5dppx or lower), offset 0.28em.
- **Hover:** text turns heat, 120ms ease-out.
- **Focus:** 2px solid heat outline, offset 4px, 2px radius, on every focusable element.
- **Exhibit titles and top bar links** keep a transparent underline at rest and show the heat underline on hover and focus.

### Navigation (top bar)
- The hall's ceiling: no fill, no edge. Section links right, Hanken 500 at 0.9375rem, 44px tall, 1rem apart on phones and 1.75rem from 48rem up. Phones keep the first two sections and Contact.
- On inner pages the site mark sits left as the home link (20 by 32px inside a 44px hit area, pulled left so the wingtip meets the text edge). On the home page the mark is left out: the hung jet is the one jet in the room.

### Contact links
- Email written out in full, then LinkedIn, then GitHub. Each is a 44px row: a 1em icon in label grey (heat on hover) and the text with a heat underline on the text only. One row once the container is 28.5rem wide; below that, email alone, then LinkedIn and GitHub together. Same block in the hero label and the Contact bay.

### Pools (bays)
- **Background:** pool graphite; full bleed; square; `pad-pool` inside; `gap-hall` of hall black between pools.
- **Wall title:** Archivo Expanded capitals at the `wall` size.
- **Lighting:** the first bay snaps on at 560ms; each later bay snaps from hall to pool at the midpoint of its entry into view (CSS scroll timeline, a step at 50%, no fade). Without scroll timelines, bays are simply lit.

### How I work (signature beat)
The hall's one decisive beat. Its title is set at the `beat` size, larger than every other wall title, and raised 0.46em out of its bay so the bay's hard top edge cuts through the middle of the capitals: upper half on the dark floor, lower half in the light. The hero reserves dark floor under the links for the raised half. On short and landscape phones, when How I work is the first bay, the title stays inside the bay so the fold never slices it. Only this one title breaks its bay.

### Museum label (hero)
Left on the page frame: the name in display capitals, "AI Engineer" in the role style, the claim as lead, the drone line in label grey, then the contact links. On wide screens every line but the name stays left of the curve.

### Hung jet
The mark drawn large, aria-hidden, two flat facets: lit in bone, shade in the shade colour, rotated 15 degrees. About 16% of the width at 1440 by 900. Left out on landscape phones.

### Lights up (load motion)
Hard cuts only, each a 1ms step: the jet's lit facet goes from shade to bone at 100ms, the print from 30% brightness to full at 280ms, the label from label grey to bone at 460ms, the first bay from hall to pool at 560ms. Everything is on by 600ms and every intermediate state is readable. Under `prefers-reduced-motion`, all animation and transition is off and everything is lit from the start; smooth scrolling is off too.

### Skip link
Heat fill, hall text, 600 weight, 0.625rem by 1rem, square; hidden above the bar until focused, then a bone focus ring.

### Reading page head
A lit pool holding the back link (label grey, heat on hover), the page title, the lead, the eval figure and a facts list (dt in label grey) in auto-fit columns of at least 11rem. The prose follows on the dark floor.

## Do's and Don'ts

### Do:
- **Do** write the full name "Aryan Haghighi" wherever the name appears, in the display capitals on two lines on the home page.
- **Do** group by light: a new section is a full-width pool on the hall floor with `gap-hall` before it.
- **Do** keep every lit and unlit edge hard, and every light change a step (1ms, `steps(1, end)`), never a fade.
- **Do** light later bays on scroll with the same hard cut, and leave everything lit under reduced motion.
- **Do** keep heat to links, focus, selection and the skip link.
- **Do** reuse the jet's leading-edge curve for any new silhouette or crop, or stay square.
- **Do** give every exhibit the identical label lines and stand exhibits in one ordered column.
- **Do** set every number in tabular lining figures.
- **Do** keep 44px hit heights, AA contrast (bone and label grey both pass on hall and pool) and no horizontal scroll from 320px.
- **Do** show the owner's photo in black and white, cropped and lightly graded only.

### Don't:
- **Don't** use initials or an "AH" monogram in any mark, favicon or logo; the mark is the jet, with no letters.
- **Don't** add HUD or cockpit symbols, insignia, roundels, blueprint or grid lines, stencil lettering, coordinates, part numbers or technical callouts. The jet is a theme only.
- **Don't** draw boxes, cards, borders, rules, dividers or hairlines.
- **Don't** use gradients, glows, blooms, blur, haze, grain or shadows.
- **Don't** add a second accent colour or use heat as decoration or large fills.
- **Don't** put exhibits in a grid or side-by-side tiles.
- **Don't** break a second title out of its bay; How I work is the only one.
- **Don't** add kickers, eyebrows or small captions above titles.
- **Don't** AI-edit, upscale or smooth the photo, or let the crop include the beer glass, the ashtray and cigarette, or the woman in red.
- **Don't** hang a second jet in the same view; the home page's bar leaves the mark out for that reason.
