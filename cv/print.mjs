// The print template for the two CV PDFs. Pure: src/data/cv.ts and
// src/data/site.ts in, one HTML page out. scripts/cv.mjs prints it with
// Chromium; integrations/cv-check.mjs hashes it so the build stops when the
// PDFs in public/ are out of date.
//
// The fonts here are static TrueType cuts of the site fonts. The site's
// variable Hanken Grotesk prints as Type 3, which hiring software reads
// badly, so it never comes near the PDFs. Nothing in cv/ is served.
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { cv } from "../src/data/cv.ts";
import { site } from "../src/data/site.ts";
import { inline } from "../src/lib/cv-text.ts";

/** us: US Letter without the photo (US hiring norm). a4: A4 with the photo. */
export const variants = {
  us: { file: "cv.pdf", name: "Aryan-Haghighi-Resume.pdf", desktop: "Aryan-Haghighi-Resume-US.pdf", page: "letter", photo: false },
  a4: { file: "cv-a4.pdf", name: "Aryan-Haghighi-CV.pdf", desktop: "Aryan-Haghighi-CV.pdf", page: "A4", photo: true },
};

const assetFiles = [
  "photo.jpg",
  "fonts/HankenGrotesk-Regular.ttf",
  "fonts/HankenGrotesk-Medium.ttf",
  "fonts/HankenGrotesk-SemiBold.ttf",
  "fonts/HankenGrotesk-Bold.ttf",
  "fonts/gloock-400-latin.woff2",
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const bare = (url) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const line = (text) => inline(text, site.url);

function item(it) {
  return `<div class="item">
    <div class="head"><h3>${line(it.title)}<span class="org">${line(it.org)}</span></h3><span class="when">${esc(it.when)}</span></div>
    ${it.blurb ? `<div class="blurb">${line(it.blurb)}</div>` : ""}
    ${it.stack ? `<div class="stack">${esc(it.stack)}</div>` : ""}
    ${it.bullets.length ? `<ul>${it.bullets.map((b) => `<li>${line(b)}</li>`).join("")}</ul>` : ""}
  </div>`;
}

/**
 * The page for one variant. `assets` is where cv/ is (a file URL when
 * printing). `phone` only for the private Desktop copies.
 */
export function printHtml(variant, { assets = new URL("./", import.meta.url).href, phone } = {}) {
  const v = variants[variant];
  const font = (file, weight, format) =>
    `@font-face { font-family: "${format === "woff2" ? "Gloock" : "Hanken Grotesk"}"; src: url("${assets}fonts/${file}") format("${format === "woff2" ? "woff2" : "truetype"}"); font-weight: ${weight}; }`;
  return `<!doctype html>
<html lang="en"${v.photo ? "" : ' class="no-photo"'}>
<head>
<meta charset="utf-8">
<title>${esc(site.name)}, ${esc(site.title)}</title>
<meta name="author" content="${esc(site.name)}">
<style>
${font("HankenGrotesk-Regular.ttf", 400)}
${font("HankenGrotesk-Medium.ttf", 500)}
${font("HankenGrotesk-SemiBold.ttf", 600)}
${font("HankenGrotesk-Bold.ttf", 700)}
${font("gloock-400-latin.woff2", 400, "woff2")}

:root {
  --fs: 9.7pt; --lh: 1.42; --sec: 0.19in; --gap: 0.12in;
  --ink: #1c1614;
  --body: #2f2724;
  --muted: #6e5f55;
  --accent: #96592c;
  --rule: #e4d9cd;
  --display: "Gloock", Georgia, serif;
  --text: "Hanken Grotesk", system-ui, sans-serif;
}
@page { size: ${v.page}; margin: 0; }
.no-photo { --fs: 9.5pt; --lh: 1.4; --sec: 0.17in; --gap: 0.105in; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { background: #fff; color: var(--body); font: 400 var(--fs)/var(--lh) var(--text); font-feature-settings: "tnum" 0; }
a { color: inherit; text-decoration: none; }
b { font-weight: 600; color: var(--ink); }
.page { padding: 0.48in 0.58in 0.36in; }
.no-photo .page { padding: 0.4in 0.55in 0.3in; }

header { display: flex; align-items: center; gap: 0.24in; padding-bottom: 0.13in; border-bottom: 1px solid var(--rule); }
.photo { width: 0.98in; height: 0.98in; border-radius: 50%; object-fit: cover; flex: none; box-shadow: 0 0 0 2.5px #fff, 0 0 0 3.3px var(--accent); }
h1 { font: 400 25pt/1 var(--display); color: var(--ink); letter-spacing: 0.002em; }
.role { margin-top: 5px; font-size: 10.6pt; font-weight: 600; color: var(--accent); letter-spacing: 0.01em; }
.contact { font-size: 8.6pt; color: var(--muted); display: flex; flex-wrap: wrap; }
.contact:first-of-type { margin-top: 6px; }
.contact + .contact { margin-top: 1px; }
.contact span + span::before { content: "·"; margin: 0 0.55em; color: #b8a796; }
.contact a { color: var(--body); }

.summary { margin-top: 0.11in; font-size: calc(var(--fs) + 0.25pt); line-height: 1.4; color: var(--body); }

section { margin-top: var(--sec); }
h2 { display: flex; align-items: center; gap: 0.11in; font: 600 7.9pt/1 var(--text); letter-spacing: 0.13em; font-kerning: none; text-transform: uppercase; color: var(--accent); margin-bottom: 0.075in; }
h2::after { content: ""; flex: 1; height: 1px; background: var(--rule); }

.item + .item { margin-top: var(--gap); }
.head { display: flex; justify-content: space-between; align-items: baseline; gap: 0.2in; }
.head h3 { font-size: calc(var(--fs) + 0.5pt); font-weight: 600; color: var(--ink); }
.head h3 .org { font-weight: 500; color: var(--body); }
.head h3 .org::before { content: "·"; margin: 0 0.4em; color: var(--accent); font-weight: 700; }
.when { font-size: calc(var(--fs) - 0.6pt); color: var(--muted); white-space: nowrap; font-variant-numeric: tabular-nums; }
.blurb { font-size: calc(var(--fs) - 0.4pt); color: var(--muted); margin-top: 1px; }
.blurb a { color: var(--accent); }
.stack { font-size: calc(var(--fs) - 0.8pt); color: var(--muted); margin-top: 1px; }

ul { list-style: none; margin-top: 3px; }
li { position: relative; padding-left: 0.15in; }
li + li { margin-top: 2.2px; }
li::before { content: ""; position: absolute; left: 0.035in; top: 0.62em; width: 3.6px; height: 3.6px; border-radius: 50%; background: var(--accent); }

.skills { display: grid; grid-template-columns: 1.08in 1fr; row-gap: 2.5px; font-size: calc(var(--fs) - 0.3pt); }
.skills dt { font-weight: 600; color: var(--ink); }
.honors li + li { margin-top: 3px; }
.edu .head h3 { font-size: calc(var(--fs) + 0.3pt); }
</style>
</head>
<body>
<div class="page">

<header>
  ${v.photo ? `<img class="photo" src="${assets}photo.jpg" alt="${esc(site.name)}">` : ""}
  <div>
    <h1>${esc(site.name)}</h1>
    <div class="role">${esc(site.title)} · ${esc(cv.headline)}</div>
    <div class="contact">
      <span>${esc(site.bio.city)}</span>
      <span><a href="mailto:${site.email}">${esc(site.email)}</a></span>
      ${phone ? `<span>${esc(phone)}</span>` : ""}
      <span><a href="${site.url}">${bare(site.url)}</a></span>
    </div>
    <div class="contact">
      <span><a href="${site.links.github}">${bare(site.links.github)}</a></span>
      <span><a href="${site.links.linkedin}">${bare(site.links.linkedin)}</a></span>
    </div>
  </div>
</header>

<p class="summary">${line(cv.summary)}</p>

<section>
  <h2>Experience</h2>
  ${cv.experience.map(item).join("\n")}
</section>

<section>
  <h2>Open-Source Projects</h2>
  ${cv.projects.map(item).join("\n")}
</section>

<section class="edu">
  <h2>Education</h2>
  ${cv.education.map(item).join("\n")}
</section>

<section class="honors">
  <h2>Robotics Honors</h2>
  <ul>${cv.honors.map((h) => `<li>${line(h)}</li>`).join("")}</ul>
</section>

<section>
  <h2>Skills</h2>
  <dl class="skills">
    ${cv.skills.map(([k, val]) => `<dt>${esc(k)}</dt><dd>${esc(val)}</dd>`).join("\n    ")}
  </dl>
</section>

</div>
</body>
</html>
`;
}

/** What the PDFs are made from: both pages (paths left out) and the files they load. */
export function stamp() {
  const h = createHash("sha256");
  for (const v of Object.keys(variants)) h.update(printHtml(v, { assets: "./" }));
  for (const f of assetFiles) h.update(readFileSync(new URL(f, import.meta.url)));
  return h.digest("hex");
}

export const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
