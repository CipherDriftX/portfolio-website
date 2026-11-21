---
name: Aryan Haghighi
description: One-screen holding page set like a film title card.
colors:
  paper: "#fafaf9"
  ink: "#141414"
  graphite: "#64645f"
  signal-orange: "#e64600"
  night: "#0f0f0f"
  bone: "#ececea"
  ash: "#9c9c98"
  signal-orange-night: "#ff4f00"
typography:
  display:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1rem + 5vw, 5rem)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  lead:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1rem + 0.55vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.35
  body:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  focus: "2px"
spacing:
  gutter: "clamp(1rem, 5vw - 0.5rem, 6rem)"
  tight: "0.75rem"
  link-gap: "1.75rem"
  section: "clamp(1.75rem, 1rem + 2vw, 3rem)"
  links-top: "clamp(2rem, 1.25rem + 2vw, 3rem)"
components:
  contact-link:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "0.375rem 0"
  contact-link-mobile:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "0.625rem 0"
---

# Design System: Aryan Haghighi

## Overview

North star: "The Title Card". The page sets a name, a role, one claim and three links the way a film title card sets its credits. Everything sits in one block on the left, a little above the vertical center, and the right side of the screen stays empty. Visitors stay 5 to 10 seconds, so the block reads top to bottom in one pass: who, what, how to reach.

The system is type and space only. There are no boxes, rules, shadows, images or motion. One face in two weights does all the work, and space alone groups the content. Color is near-monochrome, with one orange accent that marks what you can click.

Rejected on purpose, from the brief: gradients, glass, glow, particles, 3D, emoji, icon-only rows, stock or drone imagery, typing or scroll animation, and the centered startup hero.

## Colors

Ink on paper in light mode, bone on night in dark mode, with one aerospace safety orange.

### Primary
- Signal orange (#e64600 light, #ff4f00 dark): International orange, the color of aircraft safety markings. Used only on link underlines and the keyboard focus ring. The favicon uses #ff4f00. The light value is darker so the focus ring keeps 3.8:1 against paper.

### Neutral
- Paper (#fafaf9) and Night (#0f0f0f): page background per theme. Also the theme-color.
- Ink (#141414) and Bone (#ececea): name, claim and link labels. 17.6:1 and 16.2:1.
- Graphite (#64645f) and Ash (#9c9c98): the role line, the drone line and the link icons. 5.7:1 and 7.0:1, so they pass AA as body text.

The Two Uses Rule. Orange appears on underlines and the focus ring and nowhere else on the page. A third use dilutes the only signal that says "click here".

## Typography

Font: Hanken Grotesk, self-hosted, Latin subset, variable weight 400 to 600 (12.6 KB woff2, SIL OFL). It was picked over Public Sans, Schibsted Grotesk, Archivo, B612 and the system stack in a side-by-side render. It was the calmest at display size and renders the same on every OS.

### Hierarchy
- Display (600, clamp 36 to 80px, line-height 1.04, -0.03em): the name in ink and the role in graphite, the same size, stacked as one two-tone heading.
- Lead (400, clamp 20 to 24px, line-height 1.35, max 36rem, `text-wrap: balance`): the claim. A no-break space keeps "into production" together, so it breaks before "and prove they work".
- Body (400, 16px, line-height 1.5): the drone line (graphite) and the link labels (ink).

The Two Weights Rule. 400 and 600 only. Hierarchy comes from size and color, never from a third weight.

## Layout

- One block in a 72rem frame. The left margin is `max(gutter, min(10vw, (100% - 72rem) / 2))`, giving 16px at 320 and 375, 64px at 1280, 144px at 1440 and 256px at 2560.
- The block is vertically centered in `100svh`, with more padding below than above, so it sits slightly high.
- Rhythm: heading, section gap (28 to 48px), claim, 12px, drone line, 32 to 48px, links.
- Links sit in a row with a 1.75rem gap. Below 30rem they stack, with 44px tap targets.
- No scroll from 1280x720 up. At 320 the page has a 16px margin and no horizontal scroll.

## Elevation & Depth

Flat. There are no shadows or layers, and grouping comes from space alone.

## Shapes

No containers. The only radius is 2px on the focus ring.

## Components

- Contact link: a 1em icon (Bootstrap Icons 1.11.3: envelope-fill, linkedin, github) in graphite, then the label in ink with a signal-orange underline (0.09em thick, 0.3em offset). On hover the underline thickens to 0.18em and the icon turns ink. On focus there is a 2px signal-orange outline, 3px offset. The email shows the address itself, because a mailto link does nothing on desktops with no mail app.
- Favicon: a head-up-display flight-path marker (circle, two wings, tail) in #ff4f00 on a transparent background. No letters.
- Link preview (og.png, 1200x630): the night theme, with name, role and claim left-aligned. It is rendered from `_og/card.html`.

## Do's and Don'ts

- Do keep the full name "Aryan Haghighi" everywhere.
- Do keep new copy out unless the owner writes it.
- Don't use "Aryan" alone as a short name, and don't use the initials "AH" in any mark, monogram or favicon.
- Don't add a third weight, a second typeface, a second accent or any motion.
- Don't center the block or add boxes, rules or cards around it.
