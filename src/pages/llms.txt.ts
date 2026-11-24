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
    `> ${site.description}`,
    "",
    `${site.title}. ${site.claim} ${site.drone}`,
    "",
    `How I work: ${site.offer}`,
    "",
    "## Who this is",
    "",
    `This site is the home of ${site.name} (${site.nameFa}), ${site.title}, ${site.bio.city}. Handles: ${site.handle} on GitHub, @aryanhgh on X.`,
    `Accounts: ${site.links.linkedin} · ${site.links.github} · ${site.links.x}. Other people share the name. A profile not listed here belongs to someone else, or is an old account no longer in use.`,
    `Not the same person as the NLP researcher Aria Haghighi (aria42.com), or as other people named Aryan Haghighi.`,
    `Studies AI engineering at ${site.bio.school.name}, Istanbul. Builds AI agents and agent safety tools at ${site.bio.company.name} (${site.bio.company.url}).`,
    "",
    "## Pages",
    "",
    `- [Home](${site.url}/): who I am, my work, how I work, how to reach me`,
    ...(live(noteList).length ? [`- [Notes](${site.url}/notes/): everything I have written, newest first ([RSS](${site.url}/rss.xml))`] : []),
    `- [Full text](${site.url}/llms-full.txt): this whole site as one Markdown file`,
    ...live(studies).map((s) => `- [Case study: ${s.data.title}](${site.url}/work/${s.id}/): ${s.data.summary}`),
    ...live(noteList).map((n) => `- [Note: ${n.data.title}](${site.url}/notes/${n.id}/): ${n.data.summary}`),
    "",
    ...(live(repos).length
      ? [
          "## Work",
          "",
          "All public code. Every number comes from the repo.",
          "",
          ...live(repos).map((p) => {
            const figures = p.data.figures.map((f) => `${f.value} ${f.label}`).join("; ");
            return `- [${p.data.name}](${p.data.repo}): ${p.data.line}${figures ? ` (${figures})` : ""} Built with ${p.data.stack.join(", ")}.`;
          }),
          "",
        ]
      : []),
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
