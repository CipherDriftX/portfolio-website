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
export const minimum = { projects: 1, caseStudies: 1, reviews: 1, notes: 2 } as const;
export const enough = (count: number, min: number) => (showDrafts ? count > 0 : count >= min);
