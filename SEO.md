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
