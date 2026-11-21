// Fails the production build when an owner placeholder could go live.
//
// 1. Before the build: any Markdown entry under src/content that is not
//    `draft: true` and still contains "[OWNER:" stops the build, and so does
//    "[OWNER:" anywhere in src/data.
// 2. After the build: any built file that contains "[OWNER:" stops it too,
//    whatever put it there.
//
// `npm run dev` never runs these hooks, so drafts still show while writing.
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const MARK = "[OWNER:";

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

function isDraft(text) {
  const front = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return Boolean(front && /^draft:\s*true\s*(#.*)?$/m.test(front[1]));
}

export default function ownerCheck() {
  let root;
  return {
    name: "owner-check",
    hooks: {
      "astro:config:done": ({ config }) => {
        root = fileURLToPath(config.root);
      },
      "astro:build:start": async ({ logger }) => {
        const bad = [];
        for await (const file of walk(path.join(root, "src/content"))) {
          if (!file.endsWith(".md")) continue;
          const text = await readFile(file, "utf8");
          if (text.includes(MARK) && !isDraft(text)) bad.push(path.relative(root, file));
        }
        for await (const file of walk(path.join(root, "src/data"))) {
          if ((await readFile(file, "utf8")).includes(MARK)) bad.push(path.relative(root, file));
        }
        if (bad.length) {
          throw new Error(
            `These files still have ${MARK} ...] text and are not drafts:\n  ${bad.join("\n  ")}\n` +
              "Write the missing text, or set draft: true.",
          );
        }
        logger.info("no owner placeholders in live content");
      },
      "astro:build:done": async ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        const bad = [];
        for await (const file of walk(out)) {
          if (!/\.(html|xml|txt|json|webmanifest)$/.test(file)) continue;
          if ((await readFile(file, "utf8")).includes(MARK)) bad.push(path.relative(out, file));
        }
        if (bad.length) {
          throw new Error(`The build output contains ${MARK} ...] text:\n  ${bad.join("\n  ")}`);
        }
        logger.info("no owner placeholders in the build output");
      },
    },
  };
}
