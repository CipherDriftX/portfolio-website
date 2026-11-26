// Stops the build when the CV PDFs in public/ do not match src/data/cv.ts.
//
// scripts/cv.mjs (npm run cv) prints the PDFs on the owner's laptop and
// saves a stamp: a hash of what they were made from, and a hash of each PDF.
// Here the build makes the same hash again. If cv.ts, the template, the
// photo or the fonts changed, or a PDF was swapped by hand, the build fails,
// so the site never serves a PDF that says something the /cv/ page does not.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
// A static import: Astro loads this file with Vite, which closes its module
// runner before the build hooks run, so a dynamic import() there fails.
import { stamp, sha256, variants } from "../cv/print.mjs";

export default function cvCheck() {
  let root;
  return {
    name: "cv-check",
    hooks: {
      "astro:config:done": ({ config }) => {
        root = fileURLToPath(config.root);
      },
      "astro:build:start": async ({ logger }) => {
        const saved = JSON.parse(await readFile(path.join(root, "src/data/cv.stamp.json"), "utf8"));
        const bad = [];
        if (saved.hash !== stamp()) bad.push("src/data/cv.ts, cv/print.mjs, the photo or the fonts changed after the last print");
        for (const v of Object.values(variants)) {
          const bytes = await readFile(path.join(root, "public", v.file)).catch(() => null);
          if (!bytes) bad.push(`public/${v.file} is missing`);
          else if (sha256(bytes) !== saved.pdfs?.[v.file]) bad.push(`public/${v.file} is not the PDF npm run cv printed`);
        }
        if (bad.length) {
          throw new Error(`The CV PDFs are out of date:\n  ${bad.join("\n  ")}\nRun npm run cv and commit the PDFs and src/data/cv.stamp.json.`);
        }
        logger.info("CV PDFs match src/data/cv.ts");
      },
    },
  };
}
