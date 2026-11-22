// /llms.txt: a plain-text map of the site for AI answer engines, built from
// the same content as the pages so it never goes stale.
import type { APIRoute } from "astro";
import { site } from "../data/site";
import { caseStudies, projects, notes, about } from "../lib/content";

export const GET: APIRoute = async () => {
  const [studies, repos, noteList, aboutEntry] = await Promise.all([caseStudies(), projects(), notes(), about()]);
  const live = <T extends { data: { draft: boolean } }>(list: T[]) => list.filter((e) => !e.data.draft);
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.title}. ${site.claim} ${site.drone}`,
    "",
    `How I work: ${site.offer}`,
    "",
    "## Pages",
    "",
    `- [Home](${site.url}/): who I am, how I work, how to reach me`,
    ...live(studies).map((s) => `- [Case study: ${s.data.title}](${site.url}/work/${s.id}/): ${s.data.summary}`),
    ...live(noteList).map((n) => `- [Note: ${n.data.title}](${site.url}/notes/${n.id}/): ${n.data.summary}`),
    "",
    "## Work",
    "",
    ...live(repos).map((p) => `- [${p.data.name}](${p.data.repo}): ${p.data.line}`),
    "",
    ...(aboutEntry && !aboutEntry.data.draft ? ["## About", "", aboutEntry.body?.trim() ?? "", ""] : []),
    "## Contact",
    "",
    `- Email: ${site.email}`,
    `- LinkedIn: ${site.links.linkedin}`,
    `- GitHub: ${site.links.github}`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
