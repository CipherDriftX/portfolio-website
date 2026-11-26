// npm run cv: prints the CV PDFs from src/data/cv.ts with headless Chromium
// into public/ (cv.pdf: US Letter, no photo; cv-a4.pdf: A4 with photo),
// checks each is one page with real fonts (no Type 3), and writes
// src/data/cv.stamp.json so the build can tell the PDFs are current.
// Runs on the owner's laptop, not on Vercel. Commit the PDFs and the stamp
// with cv.ts.
//
//   npm run cv                  print, only if something changed
//   npm run cv -- --force       print anyway
//   npm run cv -- --desktop     also put copies on ~/Desktop; with CV_PHONE
//                               set, those copies carry the phone number
//                               (they never go in this public repo)
//   CHROME=/path/to/chrome      use another Chromium-based browser
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { printHtml, sha256, stamp, variants } from "../cv/print.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const at = (...p) => join(root, ...p);
const args = new Set(process.argv.slice(2));
const stampFile = at("src/data/cv.stamp.json");

const chrome = [process.env.CHROME, "chromium", "chromium-browser", "google-chrome-stable", "google-chrome"]
  .filter(Boolean)
  .find((bin) => spawnSync(bin, ["--version"], { stdio: "ignore" }).status === 0);
if (!chrome) fail("No Chromium found. Install chromium or set CHROME=/path/to/browser.");

function fail(message) {
  console.error(`cv: ${message}`);
  process.exit(1);
}

function print(html, pdf) {
  const tmp = at("cv/.build");
  mkdirSync(tmp, { recursive: true });
  const page = join(tmp, "page.html");
  writeFileSync(page, html);
  const run = spawnSync(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-pdf-header-footer",
      "--run-all-compositor-stages-before-draw",
      "--virtual-time-budget=4000",
      `--print-to-pdf=${pdf}`,
      `file://${page}`,
    ],
    { stdio: "ignore", timeout: 120_000 },
  );
  rmSync(tmp, { recursive: true, force: true });
  if (run.status !== 0 || !existsSync(pdf)) fail(`Chromium could not print ${pdf}`);
  // Chromium writes plain page and font objects, so a text search is enough.
  const text = readFileSync(pdf).toString("latin1");
  const pages = text.match(/\/Type\s*\/Page(?![a-zA-Z])/g)?.length ?? 0;
  if (pages !== 1) fail(`${pdf} has ${pages} pages. Cut words in src/data/cv.ts until it fits on one.`);
  if (/\/Subtype\s*\/Type3/.test(text)) fail(`${pdf} has a Type 3 font, which hiring software reads badly.`);
}

const source = stamp();
const saved = existsSync(stampFile) ? JSON.parse(readFileSync(stampFile, "utf8")) : {};
const current =
  saved.hash === source && Object.values(variants).every((v) => existsSync(at("public", v.file)));

if (current && !args.has("--force")) {
  console.log("cv: no change since the last print, PDFs kept (--force prints anyway)");
} else {
  const pdfs = {};
  for (const [key, v] of Object.entries(variants)) {
    const out = at("public", v.file);
    print(printHtml(key), out);
    pdfs[v.file] = sha256(readFileSync(out));
    console.log(`cv: public/${v.file} (${v.page}${v.photo ? ", photo" : ""}), 1 page`);
  }
  writeFileSync(stampFile, `${JSON.stringify({ hash: source, pdfs }, null, 2)}\n`);
  console.log("cv: src/data/cv.stamp.json updated. Commit it with the PDFs and src/data/cv.ts.");
}

if (args.has("--desktop")) {
  const phone = process.env.CV_PHONE?.trim();
  for (const [key, v] of Object.entries(variants)) {
    const out = join(homedir(), "Desktop", v.desktop);
    if (phone) print(printHtml(key, { phone }), out);
    else writeFileSync(out, readFileSync(at("public", v.file)));
    console.log(`cv: ${out}${phone ? " (with phone)" : ""}`);
  }
}
