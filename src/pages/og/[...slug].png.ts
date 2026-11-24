// /og/notes/<slug>.png and /og/work/<slug>.png: one link preview per page.
import type { APIRoute } from "astro";
import { caseStudies, notes } from "../../lib/content";
import { ogPng } from "../../lib/og";

export async function getStaticPaths() {
  const [noteList, studies] = await Promise.all([notes(), caseStudies()]);
  return [
    ...noteList.map((e) => ({ params: { slug: `notes/${e.id}` }, props: { title: e.data.title, kind: "Notes" } })),
    ...studies.map((e) => ({ params: { slug: `work/${e.id}` }, props: { title: e.data.title, kind: "Case study" } })),
  ];
}

export const GET: APIRoute = async ({ props }) =>
  new Response(await ogPng(props.title as string, props.kind as string), { headers: { "Content-Type": "image/png" } });
