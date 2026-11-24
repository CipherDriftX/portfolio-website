# SEO and GEO

Notes for search engines and AI answers. Not deployed (see `.vercelignore`).

## Fixed words

- Head phrase: **AI Engineer · production AI agents + evals**. It is in the title tag, and it should be the LinkedIn and GitHub headline. The schema says the same thing in two fields: `jobTitle` is "AI Engineer" and `description` is the claim. Keep all of it fixed: each change makes engines relearn who you are.
- Name: always **Aryan Haghighi** in full.
- Topic lanes (schema `knowsAbout`): AI agents, LLM evaluation, large language models, autonomous drones. Every case study and note fits one lane.

## What is built

| Piece | Where |
|---|---|
| ProfilePage + Person (one `@id`), WebSite, Article schema | `src/layouts/Base.astro` |
| Sitemap with real `lastmod` dates only: `date` on notes, `updated` on case studies, projects and reviews, `updated` in `src/data/site.ts` for the copy and About | `astro.config.mjs`, `src/lib/lastmod.ts` |
| IndexNow ping to Bing and others after each production deploy | `scripts/indexnow.mjs`, `.github/workflows/indexnow.yml`, key file in `public/` |
| `/llms.txt` map for AI answer engines | `src/pages/llms.txt.ts` |
| robots.txt open to all crawlers, AI ones included | `public/robots.txt` |
| BreadcrumbList on inner pages; `mainEntityOfPage` and `publisher` on every page | `src/layouts/Base.astro` |
| Notes as BlogPosting (`dateModified` from the optional `updated` field, `wordCount`, tags as `keywords`), all part of one Blog at `/notes/#blog` | `src/pages/notes/[slug].astro`, `src/pages/notes/index.astro` |
| `/notes/` index. It stays `noindex` and out of the sitemap until the first note is live, and the nav only links it once notes exist | `src/pages/notes/index.astro`, `astro.config.mjs` |
| `/rss.xml` with live notes, linked from every page head | `src/pages/rss.xml.ts` |
| One link-preview image per note and case study, drawn at build in the site's fonts (1200 by 630) | `src/lib/og.ts`, `src/pages/og/[...slug].png.ts` |
| `/llms-full.txt`: the whole site as one Markdown file, linked from `llms.txt` | `src/pages/llms-full.txt.ts` |
| `rel="me"` links to GitHub and LinkedIn, `meta author` | `src/layouts/Base.astro` |
| Live checker and monitor (see Monitoring) | `scripts/seo-check.mjs`, `.github/workflows/seo-monitor.yml` |

## Keyword map

Source: autocomplete from Google, Bing and DuckDuckGo, US English, 2026-11-22. Autocomplete shows what people type, not how many. No search volume data was used. Get volumes later from Search Console once pages get impressions.

The owner picks which topics to write about. These are the phrases people actually type for each lane.

**Evals (the strongest fit: few portfolios own it)**
- how to evaluate ai agents / how to evaluate an ai agent / how to evaluate agentic ai systems
- ai agent evaluation metrics / common ai agent evaluation metrics
- ai agent evaluation framework / open source ai agent evaluation framework
- how to create evals for ai agents / preparing evals for tool calls in ai agents
- llm evaluation in production / llm evaluation pipeline / llm offline evaluation / llm evaluation online
- llm evaluation vs agent evaluation / llm evaluation vs rag evaluation
- llm evaluation golden dataset / llm evaluation dataset generation
- llm as a judge evaluation example / llm evaluation rubric / llm evaluation human in the loop

**AI agents in production (what founders type)**
- why ai agents fail in production
- how to deploy ai agents in production / deploying ai agents in production
- production ready ai agents / production grade ai agents
- ai agent production architecture
- ai agents for small business / ai agent consulting services

**AI engineer (hiring side, crowded by job boards and courses)**
- ai engineer for hire / hire ai engineers / ai engineer freelance jobs
- ai engineer portfolio
- ai engineer vs ml engineer / ai engineer vs forward deployed engineer / ai engineer vs applied ai engineer

**Autonomous drones (research lane, long term)**
- autonomous drone navigation in gps denied environments / without gps
- autonomous drone navigation using reinforcement learning / computer vision
- how do autonomous drones work
- "drone detect and avoid" autocompletes to anti-drone questions, so search demand for see-and-avoid is small. Write it for research credibility, not traffic.

**Name**
- "aryan haghighi" has no autocomplete entry on any engine. Google offers "arian haghighat" instead. Nobody searches the name yet, so the job now is to own its first page when they do.

## Rules for every new page

1. One page, one target phrase. Put it in the title and the first sentence.
2. Answer the question in the first paragraph, then show the proof.
3. Real numbers only, with where they came from. Never estimate an eval result.
4. Link the page from LinkedIn the day it goes live. AI tools cite LinkedIn, YouTube and Reddit often, and mentions on other sites track with AI visibility more than links do.

## Monitoring

`.github/workflows/seo-monitor.yml` runs `scripts/seo-check.mjs` against the live site:

- after every production deploy of main (a failed run emails the owner),
- every Monday at 06:23 UTC, and by hand from the Actions tab.

Monday and hand runs also post the report as a comment on the **SEO monitor** issue, so the history sits in one place. Each run keeps its Lighthouse JSON for 90 days as a run artifact.

What it checks, on every page in the sitemap: status 200, title and description length, canonical, a single h1, `lang`, alt text, Open Graph tags, the preview image answering as an image, JSON-LD that parses and has its required fields, and schema.org's own validator. It also checks every internal link, `llms.txt`, `llms-full.txt`, `rss.xml`, the IndexNow key, the web manifest, robots.txt, sitemap dates, the 404 page, the apex and http redirects, and that Googlebot, bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot and Applebot all get the page.

Errors fail the run: anything broken, SEO or accessibility under 100 or 95, CLS over 0.1. Warnings do not: performance under 90, since GitHub's machines are slower than a phone and score mobile 10 to 15 points lower than this laptop.

Run it locally: `node scripts/seo-check.mjs` (live) or `node scripts/seo-check.mjs --site http://localhost:4321`.

What it cannot see: whether the pages are indexed and what people search to find them. Only Search Console and Bing Webmaster Tools have that, and both need the owner's login (see Owner setup).

## Owner setup (once, about 10 minutes, unlocks real data)

1. **Google Search Console** at search.google.com/search-console, signed in with the Google account that runs the aryanhaghighi.com email. Add a **Domain** property for `aryanhaghighi.com`. DNS already has a `google-site-verification` TXT record from the email setup, so it should verify at once with no DNS change. If Google asks for a new TXT record, the record was made by another Google account: sign in with that one instead. Then Sitemaps: submit `https://www.aryanhaghighi.com/sitemap-index.xml`. Then URL Inspection on `https://www.aryanhaghighi.com/` and "Request indexing".
2. **Bing Webmaster Tools** at bing.com/webmasters: "Import from Google Search Console". That copies the site and its sitemap. Bing's index feeds ChatGPT search, Copilot and DuckDuckGo.
3. **LinkedIn**: website field `https://www.aryanhaghighi.com`, headline "AI Engineer · production AI agents + evals".

## Baseline, 2026-11-24

| Check | Result |
|---|---|
| Bing directly, `site:aryanhaghighi.com` | "There are no results": not in Bing yet, though IndexNow has sent the home URL since 2026-11-22. Bing does not promise to index what IndexNow sends; Webmaster Tools is the fix |
| Claude web search (Brave index) | Not indexed (same as 2026-11-22) |
| schema.org validator, live home | 0 errors, 0 warnings. ProfilePage, WebSite and Person in one graph, plus an ItemList of 6 SoftwareSourceCode |
| seo-check on live | 0 errors, 0 warnings |
| Lighthouse 13.6.0, this laptop, live home, mobile | Performance 100: FCP 1.2 s, LCP 1.5 s, TBT 10 ms, CLS 0 |
| Lighthouse 13.6.0, GitHub runner | Mobile 86 / 100 / 100 / 100 (performance, accessibility, best practices, SEO), LCP 1.67 s. Desktop 100 on all four, LCP 0.35 s |
| Pages in the sitemap | 1 (the home page). Notes and case studies add pages as they go live |

## Baseline, 2026-11-22

Re-check monthly with the same queries, and add a dated row.

| Check | Result |
|---|---|
| Claude web search (Brave index), `site:aryanhaghighi.com` | 0 pages: the site is not in this index yet |
| Claude web search, "Aryan Haghighi" | None of the owner's profiles |
| DuckDuckGo (mostly Bing results), "Aryan Haghighi" | Top 5: x.com/aryanhgh, tr.linkedin.com/in/aryan-haghighi, facebook.com/aryan.haghighi, facebook.com/61577572026045, x.com/aryanhgh/reposts. github.com/CipherDriftX is in the top 10. The site and linkedin.com/in/aryan-haghighi-24b779304 are not |
| Bing and Google directly | Unknown: both block automated checks. Owner checks by hand |
| Autocomplete for the name | No entry on Google, Bing or DuckDuckGo |
| Lighthouse 13.6.0, live home, this laptop | Mobile performance 94, 100, 99 over 3 runs (the 94 was the laptop under load), LCP 1.3 s, CLS 0. Desktop 100. Accessibility, Best practices, SEO 100 on both |
| PageSpeed Insights API | Daily quota used up. Run it by hand at pagespeed.web.dev |

**Open question for the owner:** are x.com/aryanhgh, tr.linkedin.com/in/aryan-haghighi and the two Facebook pages yours? If yes, link them to the site and add them to `sameAs`. If a second LinkedIn is an old account of yours, close it: two profiles split the signal. If they are someone else, that person shares your name in Turkey, and consistent headlines and the same photo everywhere are how engines tell you apart.

### Owner checklist (by hand, monthly)

1. Google, logged out or in a private window: `"Aryan Haghighi"`. Note the positions of the site, LinkedIn and GitHub in the top 10.
2. Search Console: Pages indexed, and the queries the site shows for.
3. Bing: the same search. Bing Webmaster Tools: Pages indexed.
4. Ask ChatGPT, Perplexity, Gemini, Copilot and Claude, each with web search on: "Who is Aryan Haghighi, the AI engineer?" Save each answer word for word with the date.
5. Vercel Analytics: referrers from chatgpt.com (ChatGPT adds `utm_source=chatgpt.com`), perplexity.ai, bing.com and google.com.
