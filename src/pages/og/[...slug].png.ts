// /og/notes/<slug>.png, /og/work/<slug>.png, /og/cv.png and /og/mcp-servers/...:
// one link preview per page.
// A project's card puts its name where the kind goes and its one line as
// the title.
import type { APIRoute } from "astro";
import { notes, workPages } from "../../lib/content";
import { ogPng } from "../../lib/og";
import { cv } from "../../data/cv";
import { launch } from "../../data/site";
import { servers, stats, hasPage, shortName, plural, fmt } from "../../lib/mcp";

export async function getStaticPaths() {
  const [noteList, { studies, projects }] = await Promise.all([notes(), workPages()]);
  return [
    { params: { slug: "cv" }, props: { title: cv.headline, kind: "CV" } },
    ...noteList.map((e) => ({ params: { slug: `notes/${e.id}` }, props: { title: e.data.title, kind: "Notes" } })),
    ...studies.map((e) => ({ params: { slug: `work/${e.id}` }, props: { title: e.data.title, kind: "Case study" } })),
    ...projects.map((e) => ({ params: { slug: `work/${e.id}` }, props: { title: e.data.line, kind: e.data.name } })),
    ...(launch.mcpServers || import.meta.env.DEV
      ? [
          {
            params: { slug: "mcp-servers" },
            props: { title: `Scorecards for ${stats.servers} popular MCP servers`, kind: "MCP servers" },
          },
          { params: { slug: "mcp-servers/method" }, props: { title: "How the MCP scorecards are made", kind: "MCP servers" } },
          ...servers
            .filter((s) => hasPage(s.id))
            .map((s) => ({
              params: { slug: `mcp-servers/${s.id}` },
              props: {
                title: `${plural(s.metrics.tools, "tool")}, ${fmt(s.tool_tax.total)} tokens on every request`,
                kind: `${shortName(s)} MCP`,
              },
            })),
        ]
      : []),
  ];
}

export const GET: APIRoute = async ({ props }) =>
  new Response(await ogPng(props.title as string, props.kind as string), { headers: { "Content-Type": "image/png" } });
