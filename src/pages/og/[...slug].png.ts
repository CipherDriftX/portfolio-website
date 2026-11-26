// /og/notes/<slug>.png, /og/work/<slug>.png and /og/cv.png: one link preview per page.
// A project's card puts its name where the kind goes and its one line as
// the title.
import type { APIRoute } from "astro";
import { notes, workPages } from "../../lib/content";
import { ogPng } from "../../lib/og";
import { cv } from "../../data/cv";

export async function getStaticPaths() {
  const [noteList, { studies, projects }] = await Promise.all([notes(), workPages()]);
  return [
    { params: { slug: "cv" }, props: { title: cv.headline, kind: "CV" } },
    ...noteList.map((e) => ({ params: { slug: `notes/${e.id}` }, props: { title: e.data.title, kind: "Notes" } })),
    ...studies.map((e) => ({ params: { slug: `work/${e.id}` }, props: { title: e.data.title, kind: "Case study" } })),
    ...projects.map((e) => ({ params: { slug: `work/${e.id}` }, props: { title: e.data.line, kind: e.data.name } })),
  ];
}

export const GET: APIRoute = async ({ props }) =>
  new Response(await ogPng(props.title as string, props.kind as string), { headers: { "Content-Type": "image/png" } });
