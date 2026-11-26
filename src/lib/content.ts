// Drafts show in `npm run dev` and never in the production build.
import { getCollection } from "astro:content";

export const showDrafts = import.meta.env.DEV;

const keep = ({ data }: { data: { draft: boolean } }) => showDrafts || !data.draft;
const featuredFirst = <T extends { data: { featured: boolean } }>(a: T, b: T) =>
  Number(b.data.featured) - Number(a.data.featured);

export async function caseStudies() {
  const all = await getCollection("work", keep);
  return all.sort((a, b) => featuredFirst(a, b) || b.data.year - a.data.year);
}

// Work comes in two lanes: agents that do a job, and tools that keep agents
// safe. Same titles on the home page and on /work/.
export const lanes = [
  { id: "agents", title: "Agentic Systems", line: "Agents that take a whole job from start to finish." },
  { id: "safety", title: "Agent safety", line: "Tools that test an agent before it ships and guard it while it runs." },
] as const;

// Agents first, then the safety tools; inside a lane, by `order`.
const laneOrder = { agents: 0, safety: 1 } as const;
export async function projects() {
  return (await getCollection("projects", keep)).sort(
    (a, b) => laneOrder[a.data.lane] - laneOrder[b.data.lane] || a.data.order - b.data.order,
  );
}

export async function reviews() {
  return getCollection("reviews", keep);
}

export async function notes() {
  const all = await getCollection("notes", keep);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function about() {
  return (await getCollection("about", keep))[0];
}

// Work, Case studies and Notes always render; with no live entries they show
// one placeholder line until the owner adds files. Reviews render only with a
// real, permitted review. In dev, drafts show so the owner can see the spots.
export const minimum = { reviews: 1 } as const;
export const enough = (count: number, min: number) => (showDrafts ? count > 0 : count >= min);

// Everything the pages need to know about which home sections are live.
// The home page reads as a story: the problem, the work, deeper proof, then
// who I am and how we start. Order here is story order.
const labels = {
  work: "Work",
  "case-studies": "Case studies",
  reviews: "Reviews",
  notes: "Notes",
  about: "About",
  how: "How I work",
} as const;
export type SectionId = keyof typeof labels;

// How many entries each list shows before "View more".
export const shown = { projects: 3, studies: 4, reviews: 3, notes: 5 } as const;

/** Everything under /work/: case studies and projects share the folder, so
 *  one name may not be used twice. */
export async function workPages() {
  const [studies, projectList] = await Promise.all([caseStudies(), projects()]);
  const taken = new Set(studies.map((s) => s.id));
  const clash = projectList.find((p) => taken.has(p.id));
  if (clash) throw new Error(`/work/${clash.id}/ is both a case study and a project. Rename one of the two files.`);
  return { studies, projects: projectList };
}

export async function siteContent() {
  const [studies, projectList, reviewList, noteList, aboutEntry] = await Promise.all([
    caseStudies(),
    projects(),
    reviews(),
    notes(),
    about(),
  ]);
  const live: Record<SectionId, boolean> = {
    work: true,
    "case-studies": true,
    how: true,
    reviews: enough(reviewList.length, minimum.reviews),
    notes: true,
    about: Boolean(aboutEntry),
  };
  // A section with no entries yet keeps its place holder line, but in a
  // short strip near the end so it does not break the story.
  const waiting = (id: SectionId) =>
    (id === "case-studies" && studies.length === 0) || (id === "notes" && noteList.length === 0);
  const ids = (Object.keys(labels) as SectionId[]).filter((id) => live[id]);
  // The top bar and the footer link to pages, so search engines see the
  // site as a set of pages (sitelinks) and not one long page.
  const sections: { id: string; label: string; href: string }[] = [
    { id: "work", label: "Work", href: "/work/" },
    ...(live.reviews ? [{ id: "reviews", label: "Reviews", href: "/#reviews" }] : []),
    ...(!waiting("notes") ? [{ id: "notes", label: "Notes", href: "/notes/" }] : []),
    ...(live.about ? [{ id: "about", label: "About", href: "/about/" }] : []),
    { id: "cv", label: "CV", href: "/cv/" },
    { id: "contact", label: "Contact", href: "/contact/" },
  ];
  return {
    live,
    soon: ids.filter(waiting),
    sections,
    studies,
    projects: projectList,
    reviews: reviewList,
    notes: noteList,
    about: aboutEntry,
  };
}
