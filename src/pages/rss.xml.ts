// /rss.xml: live notes, newest first, full summary per item. Readers and
// some AI crawlers follow feeds to find new pages fast.
import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { notes } from "../lib/content";
import { site } from "../data/site";

export const GET: APIRoute = async () => {
  const live = (await notes()).filter((n) => !n.data.draft);
  return rss({
    title: `${site.name}: Notes`,
    description: `Notes by ${site.name}, ${site.title}, on AI agents in production, evals and agent safety.`,
    site: site.url,
    trailingSlash: true,
    customData: `<language>en</language>`,
    items: live.map((n) => ({
      title: n.data.title,
      description: n.data.summary,
      pubDate: n.data.date,
      link: `/notes/${n.id}/`,
      categories: n.data.tags,
      author: `${site.email} (${site.name})`,
    })),
  });
};
