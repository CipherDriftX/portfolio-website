// Last-changed dates for the sitemap and the home ProfilePage schema.
// Reads the Markdown files directly (not getCollection) so astro.config.mjs
// can use it too. Only live entries count: drafts never reach the site.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { site } from "../data/site";

function liveNoteDates(): Record<string, string> {
  const dir = join(process.cwd(), "src/content/notes");
  const dates: Record<string, string> = {};
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".md")) continue;
    const text = readFileSync(join(dir, file), "utf8");
    if (/^draft:\s*true\s*$/m.test(text)) continue;
    const date = text.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})/m)?.[1];
    if (date) dates[file.replace(/\.md$/, "")] = date;
  }
  return dates;
}

/** The home page changes with the profile facts and with every new note. */
export function homeLastmod(): string {
  return [site.updated, ...Object.values(liveNoteDates())].sort().at(-1)!;
}

/** Sitemap lastmod for a page path, or undefined when no honest date exists. */
export function lastmodFor(path: string): string | undefined {
  if (path === "/") return homeLastmod();
  const note = path.match(/^\/notes\/([^/]+)\/?$/)?.[1];
  return note ? liveNoteDates()[note] : undefined;
}
