// Checks the live site the way a search engine or an AI crawler sees it.
// Runs from .github/workflows/seo-monitor.yml after each production deploy
// and every Monday; it also runs by hand:
//
//   node scripts/seo-check.mjs                    check the live site
//   node scripts/seo-check.mjs --site http://localhost:4321
//   node scripts/seo-check.mjs --lighthouse lh-mobile-1.json,lh-mobile-2.json,lh-desktop.json
//   add --out report.md to save the report as well as print it
//
// Errors fail the run (GitHub then emails the owner). Warnings do not.
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";

const argv = process.argv.slice(2);
const opt = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : undefined;
};
const SITE = (opt("site") ?? "https://www.aryanhaghighi.com").replace(/\/$/, "");
const LIVE = SITE === "https://www.aryanhaghighi.com";
const NAME = "Aryan Haghighi";
const KEY = "f34df0a3d4707497707d0c093543763a"; // IndexNow, see scripts/indexnow.mjs
const UA = "Mozilla/5.0 (compatible; aryanhaghighi-seo-check/1.0; +https://www.aryanhaghighi.com/)";

const errors = [];
const warnings = [];
const facts = [];
const err = (where, what) => errors.push(`\`${where}\`: ${what}`);
const warn = (where, what) => warnings.push(`\`${where}\`: ${what}`);
const short = (url) => url.replace(SITE, "") || "/";

async function get(url, init = {}) {
  for (let attempt = 1; ; attempt++) {
    try {
      const started = Date.now();
      const res = await fetch(url, { redirect: "manual", ...init, headers: { "user-agent": UA, ...init.headers } });
      const body = init.method === "HEAD" ? "" : await res.text();
      return { status: res.status, type: res.headers.get("content-type") ?? "", location: res.headers.get("location"), body, ms: Date.now() - started };
    } catch (e) {
      if (attempt === 3) return { status: 0, type: "", location: null, body: "", ms: 0, error: String(e) };
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
}

const meta = (html, attr, name) =>
  html.match(new RegExp(`<meta[^>]+${attr}="${name}"[^>]+content="([^"]*)"`, "i"))?.[1] ??
  html.match(new RegExp(`<meta[^>]+content="([^"]*)"[^>]+${attr}="${name}"`, "i"))?.[1];
const decode = (s) => s?.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");

// ---------------------------------------------------------------- sitemap

const robots = await get(`${SITE}/robots.txt`);
if (robots.status !== 200) err("/robots.txt", `status ${robots.status}`);
else {
  if (!/^Sitemap:\s*\S+/im.test(robots.body)) err("/robots.txt", "no Sitemap line");
  if (/^Disallow:\s*\/\s*$/im.test(robots.body)) err("/robots.txt", "blocks the whole site");
}

const index = await get(`${SITE}/sitemap-index.xml`);
const maps = [...index.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (index.status !== 200 || maps.length === 0) err("/sitemap-index.xml", `status ${index.status}, ${maps.length} sitemaps`);
const pages = [];
for (const map of maps) {
  const xml = (await get(LIVE ? map : map.replace("https://www.aryanhaghighi.com", SITE))).body;
  for (const m of xml.matchAll(/<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]+)<\/lastmod>)?/g)) {
    pages.push({ url: LIVE ? m[1] : m[1].replace("https://www.aryanhaghighi.com", SITE), lastmod: m[2] });
  }
}
facts.push(`${pages.length} pages in the sitemap`);
for (const p of pages) {
  if (!p.lastmod) warn(short(p.url), "no lastmod in the sitemap");
  else if (new Date(p.lastmod) > new Date(Date.now() + 864e5)) err(short(p.url), `lastmod ${p.lastmod} is in the future`);
}

// ---------------------------------------------------------------- pages

const linked = new Set();
const requiredFor = {
  Person: ["name", "url"],
  BlogPosting: ["headline", "datePublished", "image", "author"],
  Article: ["headline", "datePublished", "image", "author"],
  BreadcrumbList: ["itemListElement"],
  WebSite: ["name", "url"],
  ProfilePage: ["mainEntity"],
};
let ttfb = 0;

for (const { url } of pages) {
  const where = short(url);
  const res = await get(url);
  if (where === "/") ttfb = res.ms;
  if (res.status !== 200) {
    err(where, `status ${res.status}`);
    continue;
  }
  const html = res.body;
  const title = decode(html.match(/<title>([^<]*)<\/title>/i)?.[1]);
  const desc = decode(meta(html, "name", "description"));
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1];
  const robotsMeta = meta(html, "name", "robots") ?? "";
  const h1s = (html.match(/<h1[\s>]/gi) ?? []).length;

  if (!title) err(where, "no title");
  else if (title.length > 65) warn(where, `title is ${title.length} characters; engines cut it near 60`);
  if (!desc) err(where, "no meta description");
  else if (desc.length < 70 || desc.length > 170) warn(where, `description is ${desc.length} characters (aim for 70 to 160)`);
  if (canonical !== url.replace(SITE, "https://www.aryanhaghighi.com")) err(where, `canonical is ${canonical}`);
  if (/noindex/i.test(robotsMeta)) err(where, "in the sitemap but marked noindex");
  if (h1s !== 1) err(where, `${h1s} h1 elements`);
  if (!/<html[^>]+lang="/i.test(html)) err(where, "no lang on <html>");
  for (const img of html.match(/<img\b[^>]*>/gi) ?? []) if (!/\balt=/i.test(img)) err(where, `image without alt: ${img.slice(0, 80)}`);

  for (const key of ["og:title", "og:description", "og:image", "og:url"]) if (!meta(html, "property", key)) err(where, `no ${key}`);
  const ogImage = meta(html, "property", "og:image");
  if (ogImage) {
    const img = await get(LIVE ? ogImage : ogImage.replace("https://www.aryanhaghighi.com", SITE), { method: "HEAD" });
    if (img.status !== 200 || !img.type.startsWith("image/")) err(where, `og:image ${short(ogImage)} answers ${img.status} ${img.type}`);
  }

  const types = [];
  for (const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let data;
    try {
      data = JSON.parse(block[1]);
    } catch {
      err(where, "JSON-LD that does not parse");
      continue;
    }
    const nodes = [data, data.mainEntity].filter(Boolean);
    for (const node of nodes) {
      const type = node["@type"];
      if (!type) continue;
      types.push(type);
      for (const field of requiredFor[type] ?? []) if (node[field] === undefined) err(where, `${type} has no ${field}`);
    }
  }
  if (types.length === 0) err(where, "no structured data");
  facts.push(`\`${where}\`: ${types.join(", ")}`);

  for (const m of html.matchAll(/<a\b[^>]+href="([^"#]+)/gi)) {
    const href = m[1];
    if (href.startsWith("/") && !href.startsWith("//")) linked.add(SITE + href);
    else if (href.startsWith("https://www.aryanhaghighi.com")) linked.add(href.replace("https://www.aryanhaghighi.com", SITE));
  }
}

for (const url of linked) {
  const res = await get(url, { method: "HEAD" });
  if (res.status >= 400 || res.status === 0) err(short(url), `linked from the site but answers ${res.status}`);
}

// ---------------------------------------------------------------- files for machines

const files = [
  ["/llms.txt", "text/plain", NAME],
  ["/llms-full.txt", "text/plain", NAME],
  ["/rss.xml", "xml", "<rss"],
  [`/${KEY}.txt`, "text/plain", KEY],
  ["/site.webmanifest", "", NAME],
];
for (const [path, type, text] of files) {
  const res = await get(SITE + path);
  if (res.status !== 200) err(path, `status ${res.status}`);
  else if (type && !res.type.includes(type)) err(path, `content type ${res.type}`);
  else if (!res.body.includes(text)) err(path, `does not contain ${text}`);
}

// vercel.json adds the trailing slash first (308), so ask for the final form.
const missing = await get(`${SITE}/this-page-does-not-exist-${Date.now()}/`);
if (missing.status !== 404) err("/404", `a missing page answers ${missing.status}, not 404`);

if (LIVE) {
  const apex = await get("https://aryanhaghighi.com/");
  if (![301, 308].includes(apex.status) || !apex.location?.startsWith("https://www.aryanhaghighi.com"))
    err("aryanhaghighi.com", `apex answers ${apex.status} ${apex.location ?? ""}, not a permanent redirect to www`);
  const plain = await get("http://www.aryanhaghighi.com/");
  if (![301, 308].includes(plain.status)) err("http://", `answers ${plain.status}, not a permanent redirect to https`);
}

// Search and AI crawlers must get the page, not a challenge.
for (const bot of ["Googlebot/2.1", "bingbot/2.0", "GPTBot/1.1", "OAI-SearchBot/1.0", "ChatGPT-User/1.0", "ClaudeBot/1.0", "Claude-SearchBot/1.0", "PerplexityBot/1.0", "Applebot/0.1"]) {
  const res = await get(`${SITE}/`, { headers: { "user-agent": `Mozilla/5.0 (compatible; ${bot})` } });
  if (res.status !== 200 || !res.body.includes(NAME)) err(bot, `home answers ${res.status} to this crawler`);
}

// schema.org's own validator reads the live page the way Google's parser
// does (same engine family). It only sees public URLs.
if (LIVE) {
  for (const { url } of pages) {
    const res = await get("https://validator.schema.org/validate", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ url }),
    });
    let report;
    try {
      report = JSON.parse(res.body.replace(/^\)\]\}'\n?/, ""));
    } catch {
      warn(short(url), `schema.org validator did not answer (status ${res.status})`);
      continue;
    }
    if (report.totalNumErrors) err(short(url), `schema.org validator: ${report.totalNumErrors} errors`);
    if (report.totalNumWarnings) warn(short(url), `schema.org validator: ${report.totalNumWarnings} warnings`);
    facts.push(`\`${short(url)}\`: validator found ${report.numObjects} top-level objects, ${report.totalNumErrors} errors`);
  }
}

// ---------------------------------------------------------------- Lighthouse

// Several runs per form factor are allowed (lh-mobile-1.json, -2, -3):
// shared CI machines swing 10 points between runs, so the report uses the
// run with the median performance score.
const lighthouse = [];
const runs = {};
for (const file of (opt("lighthouse") ?? "").split(",").filter(Boolean)) {
  let lh;
  try {
    lh = JSON.parse(readFileSync(file, "utf8"));
  } catch {
    warn(file, "no Lighthouse result to read");
    continue;
  }
  const form = lh.configSettings?.formFactor ?? file;
  const score = (id) => Math.round((lh.categories?.[id]?.score ?? 0) * 100);
  (runs[form] ??= []).push({
    form,
    performance: score("performance"),
    accessibility: score("accessibility"),
    bestPractices: score("best-practices"),
    seo: score("seo"),
    lcp: lh.audits?.["largest-contentful-paint"]?.numericValue,
    tbt: lh.audits?.["total-blocking-time"]?.numericValue,
    cls: lh.audits?.["cumulative-layout-shift"]?.numericValue,
  });
}
for (const list of Object.values(runs)) {
  list.sort((a, b) => a.performance - b.performance);
  const row = { ...list[Math.floor(list.length / 2)], n: list.length, spread: `${list[0].performance} to ${list.at(-1).performance}` };
  lighthouse.push(row);
  const form = row.form;
  if (row.seo < 100) err(`lighthouse ${form}`, `SEO ${row.seo}`);
  if (row.accessibility < 95) err(`lighthouse ${form}`, `accessibility ${row.accessibility}`);
  if (row.bestPractices < 95) warn(`lighthouse ${form}`, `best practices ${row.bestPractices}`);
  // Shared CI machines are slower than a phone on a good day; warn, do not fail.
  if (row.performance < 90) warn(`lighthouse ${form}`, `performance ${row.performance} (median of ${row.n})`);
  if (row.cls > 0.1) err(`lighthouse ${form}`, `CLS ${row.cls.toFixed(3)}`);
}

// ---------------------------------------------------------------- report

const day = new Date().toISOString().slice(0, 10);
const lines = [
  `## SEO check, ${day}, ${SITE}`,
  "",
  errors.length ? `**${errors.length} errors**, ${warnings.length} warnings` : `**No errors**, ${warnings.length} warnings`,
  "",
  `Home answered in ${ttfb} ms. ${facts[0]}.`,
  "",
];
if (lighthouse.length) {
  lines.push("| Lighthouse | Runs | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |", "|---|---|---|---|---|---|---|---|---|");
  for (const r of lighthouse)
    lines.push(
      `| ${r.form} | ${r.n} (${r.spread}) | ${r.performance} | ${r.accessibility} | ${r.bestPractices} | ${r.seo} | ${((r.lcp ?? 0) / 1000).toFixed(2)} s | ${Math.round(r.tbt ?? 0)} ms | ${(r.cls ?? 0).toFixed(3)} |`,
    );
  lines.push("");
}
if (errors.length) lines.push("### Errors", "", ...errors.map((e) => `- ${e}`), "");
if (warnings.length) lines.push("### Warnings", "", ...warnings.map((w) => `- ${w}`), "");
lines.push("<details><summary>Structured data per page</summary>", "", ...facts.slice(1).map((f) => `- ${f}`), "", "</details>", "");
const report = lines.join("\n");

console.log(report);
if (opt("out")) writeFileSync(opt("out"), report);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, report + "\n");
process.exit(errors.length ? 1 : 0);
