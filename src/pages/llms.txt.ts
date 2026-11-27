// /llms.txt: a plain-text map of the site for AI answer engines, built from
// the same content as the pages so it never goes stale.
import type { APIRoute } from "astro";
import { site, launch } from "../data/site";
import { caseStudies, projects, notes, about } from "../lib/content";
import { cv } from "../data/cv";
import { plain } from "../lib/cv-text";
import { getEntry } from "astro:content";
import { llmsLines } from "../lib/mcp";

export const GET: APIRoute = async () => {
  // The current jobs on the CV.
  const now = cv.experience
    .filter((e) => e.when.endsWith("Present"))
    .map((e) => `${plain(e.title)}, ${plain(e.org)}`)
    .join("; ");
  const [studies, repos, noteList, aboutEntry] = await Promise.all([caseStudies(), projects(), notes(), about()]);
  const live = <T extends { data: { draft: boolean } }>(list: T[]) => list.filter((e) => !e.data.draft);
  const mcpHub = launch.mcpServers ? await getEntry("hubs", "mcp-servers") : undefined;
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
    `Studies AI engineering at ${site.bio.school.name}, Istanbul. Founded ${site.bio.company.name} (${site.bio.company.url}), where he built the agent safety tools Wyatt and WyScan. Now: ${now}.`,
    "",
    "## Pages",
    "",
    `- [Home](${site.url}/): who I am, my work, how I work, how to reach me`,
    `- [About](${site.url}/about/): who I am, where I study and work, and my profiles`,
    `- [Work](${site.url}/work/): every project, each with its own page`,
    `- [CV](${site.url}/cv/): experience, open-source work, education and skills; PDF in US Letter (${site.url}/cv.pdf) and A4 (${site.url}/cv-a4.pdf)`,
    `- [Contact](${site.url}/contact/): how to reach me, and how a first project starts`,
    ...(mcpHub ? [`- [MCP servers](${site.url}/mcp-servers/): scorecards for popular MCP servers, and how I build and test them`] : []),
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
            return `- [${p.data.name}](${site.url}/work/${p.id}/): ${p.data.line}${figures ? ` (${figures})` : ""} Built with ${p.data.stack.join(", ")}. Code: ${p.data.repo}`;
          }),
          "",
        ]
      : []),
    ...(mcpHub ? llmsLines(mcpHub.data, site.url, false) : []),
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
