// Last-changed dates for the sitemap and the home ProfilePage schema.
// Reads the Markdown files directly (not getCollection) so astro.config.mjs
// can use it too. Only live entries count: drafts never reach the site.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { site } from "../data/site";
import { cv } from "../data/cv";

// The front matter fields that hold each collection's dates; the newest one
// counts. The About text has none: change `updated` in src/data/site.ts when
// you edit it.
const dateField = {
  notes: ["date", "updated"],
  work: ["updated"],
  projects: ["updated"],
  reviews: ["updated"],
} as const;
type Collection = keyof typeof dateField;

function liveDates(collection: Collection): Record<string, string> {
  const dir = join(process.cwd(), "src/content", collection);
  const fields = dateField[collection].map((f) => new RegExp(`^${f}:\\s*["']?(\\d{4}-\\d{2}-\\d{2})`, "m"));
  const dates: Record<string, string> = {};
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".md")) continue;
    const text = readFileSync(join(dir, file), "utf8");
    if (/^draft:\s*true\s*$/m.test(text)) continue;
    const found = fields.map((f) => text.match(f)?.[1]).filter((d): d is string => Boolean(d)).sort();
    if (found.length) dates[file.replace(/\.md$/, "")] = found.at(-1)!;
  }
  return dates;
}

/** The newest live note's date, or undefined while there are none. */
export function notesLastmod(): string | undefined {
  return Object.values(liveDates("notes")).sort().at(-1);
}

/** The home page lists every entry, so it changes when any of them does. */
export function homeLastmod(): string {
  const entries = (Object.keys(dateField) as Collection[]).flatMap((c) => Object.values(liveDates(c)));
  return [site.updated, ...entries].sort().at(-1)!;
}

/** Sitemap lastmod for a page path, or undefined when no honest date exists. */
export function lastmodFor(path: string): string | undefined {
  const p = path.endsWith("/") ? path : `${path}/`;
  if (p === "/") return homeLastmod();
  if (p === "/notes/") return notesLastmod();
  // /work/ lists every project and case study.
  if (p === "/work/") return [...Object.values(liveDates("work")), ...Object.values(liveDates("projects"))].sort().at(-1);
  // The About text and the contact details live in site.ts and about.md,
  // which move site.updated.
  if (p === "/about/" || p === "/contact/") return site.updated;
  if (p === "/cv/") return cv.updated;
  const page = p.match(/^\/(work|notes)\/([^/]+)\/$/);
  if (!page) return undefined;
  if (page[1] === "notes") return liveDates("notes")[page[2]];
  // /work/<name>/ is a case study or a project.
  return liveDates("work")[page[2]] ?? liveDates("projects")[page[2]];
}
