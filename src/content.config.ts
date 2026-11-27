// One Markdown file per entry. Folders live in src/content/<collection>/.
// Every entry has `draft`. Drafts show in `npm run dev` and never in the
// production build.
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const md = (folder: string) => glob({ pattern: "**/*.md", base: `./src/content/${folder}` });

// Case studies: each one gets its own page at /work/<file name>.
const work = defineCollection({
  loader: md("work"),
  schema: z.object({
    title: z.string(),
    summary: z.string(), // one line
    role: z.string(),
    clientType: z.string(), // "Seed-stage SaaS", never a client name unless approved
    stack: z.array(z.string()).min(1),
    // Optional: leave it out until the eval results exist. Never estimate.
    evals: z
      .object({
        metric: z.string(), // what was measured
        value: z.string(), // the result, e.g. "94%"
        cases: z.number().int().positive(), // how many eval cases
      })
      .optional(),
    links: z
      .object({
        code: z.url().optional(),
        demo: z.url().optional(),
      })
      .default({}),
    year: z.number().int(),
    // The day this entry was added or last changed. Feeds the sitemap lastmod.
    updated: z.coerce.date(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

// Selected projects: links out to the repo, no page of their own. The
// Markdown body is the short paragraph under the line.
const projects = defineCollection({
  loader: md("projects"),
  schema: z.object({
    name: z.string(),
    repo: z.url(),
    // Which group on the home page: agents, or tools that keep agents safe.
    lane: z.enum(["agents", "safety"]),
    order: z.number().int(), // position inside its lane, 1 first
    context: z.string().optional(), // where it was built, e.g. "Plarix"
    year: z.number().int(),
    language: z.string(), // "Python", "TypeScript"
    line: z.string(), // one line: what it does
    // Up to two numbers, each one checkable in the repo. Never estimate.
    figures: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .max(2)
      .default([]),
    stack: z.array(z.string()).min(1),
    // Optional: a few lines of the tool's real output, shown as is.
    exhibit: z.object({ text: z.string(), caption: z.string() }).optional(),
    // The day this entry was added or last changed. Feeds the sitemap lastmod.
    updated: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

// Reviews: real quotes only, and only with the person's permission.
const reviews = defineCollection({
  loader: md("reviews"),
  schema: z
    .object({
      quote: z.string(),
      name: z.string(),
      role: z.string(),
      company: z.string(),
      link: z.url(),
      permission: z.boolean(),
      // The day this entry was added or last changed. Feeds the sitemap lastmod.
      updated: z.coerce.date(),
      draft: z.boolean().default(false),
    })
    .refine((r) => r.draft || r.permission, {
      message: "A live review needs `permission: true` from the person quoted.",
    }),
});

// Notes: writing. Each one gets a page at /notes/<file name>.
const notes = defineCollection({
  loader: md("notes"),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    // Set when the note changes after it went live. Feeds dateModified and
    // the sitemap lastmod; leave it out otherwise.
    updated: z.coerce.date().optional(),
    summary: z.string(),
    // A few plain topic words, e.g. ["evals", "agent safety"]. Optional.
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// About: one file, the text is the Markdown body.
const about = defineCollection({
  loader: md("about"),
  schema: z.object({
    draft: z.boolean().default(false),
  }),
});

// Hub pages (/mcp-servers/, later /agent-evals/ and /rl-environments/): the
// words around the data. One file per hub, named after its URL. A hub goes
// live only when its stage is on (src/data/site.ts) and its draft is false.
// Text may name live numbers in braces, e.g. {servers} (src/lib/mcp.ts).
const hubs = defineCollection({
  loader: md("hubs"),
  schema: z.object({
    title: z.string().max(60), // the <title>, 60 characters at most
    h1: z.string(),
    description: z.string().min(110).max(160), // the meta description
    answer: z.string(), // 40 to 60 words at the top: what it is, what I do
    steps: z.array(z.object({ title: z.string(), text: z.string() })).min(4).max(6),
    offer: z.object({
      lead: z.string(),
      includes: z.array(z.string()).min(1),
      time: z.string(),
      price: z.string(),
    }),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).min(4).max(6),
    updated: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { work, projects, reviews, notes, about, hubs };
