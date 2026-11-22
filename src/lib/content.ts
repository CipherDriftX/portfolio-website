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

export async function projects() {
  return (await getCollection("projects", keep)).sort(featuredFirst);
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

// A section only renders when it has enough live entries.
// In dev it renders with drafts so the owner can see where they will go.
export const minimum = { projects: 1, caseStudies: 1, reviews: 1, notes: 1 } as const;
export const enough = (count: number, min: number) => (showDrafts ? count > 0 : count >= min);

// Everything the pages need to know about which sections are live.
// Order here is page order.
const labels = {
  work: "Work",
  "case-studies": "Case studies",
  how: "How I work",
  reviews: "Reviews",
  notes: "Notes",
  about: "About",
} as const;
export type SectionId = keyof typeof labels;

export async function siteContent() {
  const [studies, projectList, reviewList, noteList, aboutEntry] = await Promise.all([
    caseStudies(),
    projects(),
    reviews(),
    notes(),
    about(),
  ]);
  const live: Record<SectionId, boolean> = {
    work: enough(projectList.length, minimum.projects),
    "case-studies": enough(studies.length, minimum.caseStudies),
    how: true,
    reviews: enough(reviewList.length, minimum.reviews),
    notes: enough(noteList.length, minimum.notes),
    about: Boolean(aboutEntry),
  };
  const shown = (Object.keys(labels) as SectionId[]).filter((id) => live[id]);
  const sections = [...shown.map((id) => ({ id, label: labels[id] })), { id: "contact", label: "Contact" }];
  return {
    live,
    first: shown[0],
    sections,
    studies,
    projects: projectList,
    reviews: reviewList,
    notes: noteList,
    about: aboutEntry,
  };
}
