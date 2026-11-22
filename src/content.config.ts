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
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

// Selected projects: links out to the repo, no page of their own.
const projects = defineCollection({
  loader: md("projects"),
  schema: z.object({
    name: z.string(),
    repo: z.url(),
    line: z.string(), // one line: what it is
    why: z.string(), // one line: why it matters
    featured: z.boolean().default(false),
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
    summary: z.string(),
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

export const collections = { work, projects, reviews, notes, about };
