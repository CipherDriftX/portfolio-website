// Tell IndexNow search engines (Bing, Yandex, Seznam, Naver, Yep) which pages
// changed, so they recrawl them now instead of days later. Google does not use
// IndexNow; it reads the sitemap.
//
// Runs from .github/workflows/indexnow.yml after Vercel finishes a production
// deploy, so every page it names is already live.
//
//   node scripts/indexnow.mjs            pages changed by the last commit
//   node scripts/indexnow.mjs --all      every page in the live sitemap
//   add --dry-run to print the list without sending it
import { execFileSync } from "node:child_process";

const SITE = "https://www.aryanhaghighi.com";
// Public by design: engines check it against public/<KEY>.txt on the site.
const KEY = "f34df0a3d4707497707d0c093543763a";
const args = new Set(process.argv.slice(2));

const status = async (url) => (await fetch(url, { method: "HEAD", redirect: "manual" })).status;

// A content file maps to its own page; any change under src/ or public/ can
// change the home page, which lists everything.
function pageFor(file) {
  const m = file.match(/^src\/content\/(work|notes)\/([^/]+)\.md$/);
  if (m) return `${SITE}/${m[1]}/${m[2]}/`;
}

function changedPages() {
  const diff = execFileSync("git", ["diff", "--name-status", "HEAD^1", "HEAD"], { encoding: "utf8" });
  const pages = new Map(); // url -> true when its file was deleted
  for (const line of diff.split("\n").filter(Boolean)) {
    const [kind, ...files] = line.split("\t");
    // A rename removes the old page and adds the new one.
    files.forEach((file, i) => {
      const gone = kind === "D" || (kind.startsWith("R") && i === 0);
      const page = pageFor(file);
      if (page) pages.set(page, gone);
      if (/^(src|public)\//.test(file)) pages.set(`${SITE}/`, false);
    });
  }
  return pages;
}

async function sitemapPages() {
  const xml = await (await fetch(`${SITE}/sitemap-0.xml`)).text();
  return new Map([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => [m[1], false]));
}

const candidates = args.has("--all") ? await sitemapPages() : changedPages();

// Send live pages, and deleted pages that now return 404 so engines drop them.
// Drafts return 404 without being deleted: skip those.
const urlList = [];
for (const [url, gone] of candidates) {
  const code = await status(url);
  if (code === 200 || (gone && (code === 404 || code === 410))) urlList.push(url);
  else console.log(`skip ${url} (${code})`);
}

if (urlList.length === 0) {
  console.log("Nothing to send.");
  process.exit(0);
}
console.log(urlList.join("\n"));
if (args.has("--dry-run")) process.exit(0);

const keyLocation = `${SITE}/${KEY}.txt`;
if ((await status(keyLocation)) !== 200) {
  console.error(`Key file not live at ${keyLocation}`);
  process.exit(1);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation, urlList }),
});
// 200 = received, 202 = received while the key is still being checked.
console.log(`IndexNow answered ${res.status} for ${urlList.length} URL(s).`);
if (!res.ok) {
  console.error(await res.text());
  process.exit(1);
}
