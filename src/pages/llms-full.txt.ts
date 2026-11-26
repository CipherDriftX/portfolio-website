// /llms-full.txt: the whole site as one plain Markdown file, for AI answer
// engines that read a site in one request. Built from the same content as
// the pages; drafts never reach it.
import type { APIRoute } from "astro";
import { site } from "../data/site";
import { about, caseStudies, notes, projects } from "../lib/content";
import { cv, type CvItem } from "../data/cv";
import { plain } from "../lib/cv-text";

export const GET: APIRoute = async () => {
  const [aboutEntry, studies, noteList, repos] = await Promise.all([about(), caseStudies(), notes(), projects()]);
  const live = <T extends { data: { draft: boolean } }>(list: T[]) => list.filter((e) => !e.data.draft);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const out = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `${site.name} is an ${site.title}. ${site.claim} ${site.drone}`,
    "",
    `How I work: ${site.offer}`,
    "",
    `Website: ${site.url}/ · Email: ${site.email} · LinkedIn: ${site.links.linkedin} · GitHub: ${site.links.github} · X: ${site.links.x}`,
    "",
    "## Who this is",
    "",
    `This site is the home of ${site.name} (${site.nameFa}), ${site.title}, ${site.bio.city}. Handles: ${site.handle} on GitHub, @aryanhgh on X.`,
    `Accounts: ${site.links.linkedin} · ${site.links.github} · ${site.links.x}. Other people share the name. A profile not listed here belongs to someone else, or is an old account no longer in use.`,
    `Not the same person as the NLP researcher Aria Haghighi (aria42.com), or as other people named Aryan Haghighi.`,
    `Studies AI engineering at ${site.bio.school.name}, Istanbul. Builds AI agents and agent safety tools at ${site.bio.company.name} (${site.bio.company.url}).`,
    "",
  ];
  if (aboutEntry && !aboutEntry.data.draft) out.push("## About", "", aboutEntry.body?.trim() ?? "", "");
  // The CV, the same words as /cv/ and the PDFs.
  const items = (list: CvItem[]) =>
    list.flatMap((it) => [
      `- ${plain(it.title)}, ${plain(it.org)} (${it.when})${it.blurb ? `. ${plain(it.blurb)}` : ""}${it.stack ? `. Built with ${it.stack}` : ""}`,
      ...it.bullets.map((b) => `  - ${plain(b)}`),
    ]);
  out.push(
    "## CV",
    "",
    `${site.url}/cv/ · PDF: ${site.url}/cv.pdf (US Letter) and ${site.url}/cv-a4.pdf (A4) · Updated ${cv.updated}`,
    "",
    plain(cv.summary),
    "",
    "### Experience",
    "",
    ...items(cv.experience),
    "",
    "### Open source",
    "",
    ...items(cv.projects),
    "",
    "### Education",
    "",
    ...items(cv.education),
    "",
    "### Robotics honors",
    "",
    ...cv.honors.map((h) => `- ${plain(h)}`),
    "",
    "### Skills",
    "",
    ...cv.skills.map(([label, value]) => `- ${label}: ${value}`),
    "",
  );
  if (live(repos).length) {
    out.push("## Work", "", "All public code. Every number comes from the repo it links to.", "");
    for (const p of live(repos)) {
      const d = p.data;
      out.push(`### ${d.name}`, "", `${d.line}`, "");
      out.push(`- Page: ${site.url}/work/${p.id}/`, `- Code: ${d.repo}`, `- Year: ${d.year}${d.context ? `, built at ${d.context}` : ""}`, `- Language: ${d.language}`);
      out.push(`- Built with: ${d.stack.join(", ")}`);
      for (const f of d.figures) out.push(`- ${f.value}: ${f.label}`);
      out.push("", p.body?.trim() ?? "", "");
    }
  }
  for (const s of live(studies)) {
    out.push(`## Case study: ${s.data.title}`, "", `${site.url}/work/${s.id}/`, "", s.data.summary, "", s.body?.trim() ?? "", "");
  }
  for (const n of live(noteList)) {
    out.push(`## Note: ${n.data.title}`, "", `${site.url}/notes/${n.id}/ · ${iso(n.data.date)}`, "", n.data.summary, "", n.body?.trim() ?? "", "");
  }
  return new Response(out.join("\n").replace(/\n{3,}/g, "\n\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
