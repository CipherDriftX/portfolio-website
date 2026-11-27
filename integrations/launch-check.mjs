// Fails the production build when a hub that is not launched leaks out.
//
// A hub (/mcp-servers/, later /agent-evals/ and /rl-environments/) goes live
// only when its flag in `launch` (src/data/site.ts) is on. After the build,
// any page, sitemap, feed, llms.txt or image under an unlaunched hub's path,
// or a link to it, stops the build. `npm run dev` never runs this.
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const PATHS = {
  mcpServers: "/mcp-servers",
  agentEvals: "/agent-evals",
  rlEnvironments: "/rl-environments",
};

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

/** @param {Record<keyof typeof PATHS, boolean>} launch */
export default function launchCheck(launch) {
  return {
    name: "launch-check",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        const hidden = Object.entries(PATHS)
          .filter(([key]) => !launch[/** @type {keyof typeof PATHS} */ (key)])
          .map(([, p]) => p);
        if (hidden.length === 0) return logger.info("every hub is launched");
        const bad = [];
        for await (const file of walk(out)) {
          const rel = "/" + path.relative(out, file).split(path.sep).join("/");
          if (hidden.some((p) => rel.startsWith(`${p}/`) || rel.startsWith(`/og${p}`))) {
            bad.push(rel);
            continue;
          }
          if (!/\.(html|xml|txt|json|webmanifest)$/.test(file)) continue;
          const text = await readFile(file, "utf8");
          const hit = hidden.find((p) => text.includes(`${p}/`) || text.includes(`${p}"`));
          if (hit) bad.push(`${rel} (links to ${hit}/)`);
        }
        if (bad.length) {
          throw new Error(
            `Hubs that are not launched (${hidden.join(", ")}) are in the build:\n  ${bad.join("\n  ")}\n` +
              "Turn the hub on in src/data/site.ts, or remove the link.",
          );
        }
        logger.info(`no unlaunched hub in the build output (${hidden.join(", ")})`);
      },
    },
  };
}
