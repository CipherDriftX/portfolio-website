# SEO and GEO

Notes for search engines and AI answers. Not deployed (see `.vercelignore`).

## Fixed words

- Name: always **Aryan Haghighi** in full.
- The 3 keywords, from 2026-11-27: **MCP servers**, **agent evals**, **RL environments** (always "for LLM agents", never bare: "rl environment" alone is a services company in Bakersfield). Every new page, note, repo and post is about one of them. Agent safety is parked: no new pages for it.
- The head phrase moves only after its proof is live, and LinkedIn, GitHub and the title tag move together:

| Step | Trigger | Home title | `knowsAbout` |
|---|---|---|---|
| Now | | Aryan Haghighi, AI Engineer · production AI agents + evals | AI agents, agentic systems, LLM evaluation, AI agent safety, LLMs, autonomous drones |
| 1 | mcp-server-evals public + 10 MCP scorecards live | Aryan Haghighi · Agent evals and MCP servers | unchanged |
| 2 | the RL environment is live on the Prime Intellect Hub or Hugging Face | Aryan Haghighi · RL environments, agent evals, MCP servers | MCP servers, agent evals, RL environments for LLM agents, AI agents, large language models |

- Each change makes engines relearn who you are, so nothing moves between the steps.
- New pages wait behind `STAGE` and `launch` in `src/data/site.ts`: a hub that is off builds in `npm run dev` only, never in production, the sitemap, `llms.txt`, the OG images or the menus. `integrations/launch-check.mjs` fails the build if one leaks. Stage 1 also needs `draft: false` in `src/content/hubs/mcp-servers.md` and a real price there (the build stops otherwise), and builds a card only for the servers in `mcpCards`.

## Keyword map

Source: Google, DuckDuckGo and Bing autocomplete, US English, 2026-11-27. Autocomplete shows what people type, not how often. Search Console shows volumes once the pages are live. The 2026-11-22 and 2026-11-24 maps (agents in production, AI engineer, agent safety, drones) are retired.

**MCP servers** (the only lane with clear buyer phrases)
- Hire: mcp server development services / mcp server development company / custom mcp server development services → `/mcp-servers/`
- Price: mcp server development cost / mcp server cost → the "What it costs" part of `/mcp-servers/`
- Testing: mcp server testing tool / mcp server tester / mcp server testing framework / test mcp server locally → a note + the repo
- Tool: mcp evals github / mcp evals python / mcp server evals → the repo (its name matches)
- Practice: mcp tool description best practices / mcp server best practices anthropic → a data note on tool descriptions
- Product: "custom mcp server salesforce", "mcp server servicenow" and the like → one scorecard page per server
- Skip: mcp server meaning / explained / vs api. The protocol site owns those. One FAQ line, no page.

**Agent evals**
- Hire: ai evals consultant / ai evaluation consultant / agent evaluation consultant → `/agent-evals/`
- How-to: how to write evals for ai agents / for llm / for claude → a note
- Developer: tool calling evals / tool calling evaluation metrics / agent evaluation framework github / eval harness github → the method page + the repo
- Data: agent eval leaderboard / agent eval benchmark → the scorecard leaderboard
- Skip: "demystifying evals for ai agents" (Anthropic's post). Link to it, don't compete.

**RL environments for LLM agents**
- Developer: rl environments for llms github / rl environment for llm agents python / agentic rl environment github → the env repo, Prime Intellect Hub, Hugging Face
- How-to: how to build an rl environment for llm training → a note
- Buyers and jobs: rl environments companies / rl environment as a service / rl environment jobs → `/rl-environments/` + LinkedIn
- Tools: verifiers rl library / openenv github / openenv vs harbor → env READMEs + a note
- Rewards: reward function for llm agent / llm verifier → a note on graders and reward hacking

**Name**
- "aryan haghighi" has no autocomplete entry on any engine. Nobody searches the name yet, so the job is to own its first page when they do.

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

Errors fail the run: anything broken, SEO or accessibility under 100 or 95, CLS over 0.1. Warnings do not: performance under 90. GitHub's machines vary from run to run (mobile scored 86, 80 and 84 on the same page on 2026-11-24), so mobile runs three times and the report uses the median run, with the spread next to it.

Run it locally: `node scripts/seo-check.mjs` (live) or `node scripts/seo-check.mjs --site http://localhost:4321`.

What it cannot see: whether the pages are indexed and what people search to find them. Only Search Console and Bing Webmaster Tools have that, and both need the owner's login (see Owner setup).

## Owner setup (once, about 10 minutes, unlocks real data)

1. **Google Search Console** at search.google.com/search-console, signed in with the Google account that runs the aryanhaghighi.com email. Add a **Domain** property for `aryanhaghighi.com`. DNS already has a `google-site-verification` TXT record from the email setup, so it should verify at once with no DNS change. If Google asks for a new TXT record, the record was made by another Google account: sign in with that one instead. Then Sitemaps: submit `https://www.aryanhaghighi.com/sitemap-index.xml`. Then URL Inspection on `https://www.aryanhaghighi.com/` and "Request indexing".
2. **Bing Webmaster Tools** at bing.com/webmasters: "Import from Google Search Console". That copies the site and its sitemap. Bing's index feeds ChatGPT search, Copilot and DuckDuckGo.
3. **LinkedIn**: website field `https://www.aryanhaghighi.com`, headline "AI Engineer · production AI agents + evals".
4. **Search data in the weekly report** (optional, about 15 minutes). `scripts/search-data.mjs` adds the real Google and Bing queries to each Monday report once these two repo secrets exist (Settings > Secrets and variables > Actions):
   - `GSC_SERVICE_ACCOUNT`: at console.cloud.google.com make a project, enable the "Google Search Console API", then IAM > Service accounts > create one (no roles) > Keys > Add key > JSON. Paste the whole JSON file as the secret. In Search Console > Settings > Users and permissions, add the service account's email as a **Restricted** user on the `aryanhaghighi.com` property (if the report says HTTP 403, make it Full). The script asks only for the read-only scope.
   - `BING_API_KEY`: Bing Webmaster Tools > Settings > API access > generate the key.
   The same Google key also works for a Search Console MCP server, so Claude can read the queries in a session (`AminForou/mcp-gsc`, MIT, 2.3k stars, read-only by default: env `GSC_CREDENTIALS_PATH` = the JSON file kept outside the repo, `GSC_SKIP_OAUTH=true`).

## SEOptimer audit, 2026-11-27

Owner ran SEOptimer on the live site (PDF on the Desktop). Overall A-: on-page, GEO, usability and performance all A+, links F.

| Finding | What it means here |
|---|---|
| Links F: 0 backlinks | The real gap. The fix is the MCP plan: scorecards maintainers want to link, fix pull requests, launch posts. Not link buying |
| Keyword consistency: top words agent, works, run, python; no "MCP" or "evals" in headings | Fixed at stage 1: the home title becomes "Aryan Haghighi · Agent evals and MCP servers" and the home links to `/mcp-servers/` |
| Analytics "not found" | False: Vercel Web Analytics loads deferred, which the tool does not see |
| Local business schema, phone, address, Facebook page and pixel, Instagram | Do not fit a person's site that sells remote work. Skip |
| Word count | Not a ranking factor. Skip |
| Inline styles | Astro inlines the CSS on purpose (`inlineStylesheets: "always"`): one request paints the first screen. PageSpeed 95 mobile, 100 desktop. Skip |
| Email in clear text | On purpose: people must be able to copy it |
| Redirect chain http to https to www, 1.08 s on mobile | Real, but it lives in DNS and Vercel settings, which this repo does not touch. Owner's call |

## Baseline, 2026-11-24

| Check | Result |
|---|---|
| Bing directly, `site:aryanhaghighi.com` | "There are no results": not in Bing yet, though IndexNow has sent the home URL since 2026-11-22. Bing does not promise to index what IndexNow sends; Webmaster Tools is the fix |
| Claude web search (Brave index) | Not indexed (same as 2026-11-22) |
| schema.org validator, live home | 0 errors, 0 warnings. ProfilePage, WebSite and Person in one graph, plus an ItemList of 6 SoftwareSourceCode |
| seo-check on live | 0 errors, 0 warnings |
| Lighthouse 13.6.0, this laptop, live home, mobile | Performance 100: FCP 1.2 s, LCP 1.5 s, TBT 10 ms, CLS 0 |
| Lighthouse 13.6.0, GitHub runner | Mobile 86 / 100 / 100 / 100 (performance, accessibility, best practices, SEO), LCP 1.67 s. Desktop 100 on all four, LCP 0.35 s |
| Pages in the sitemap | 10 since 2026-11-24: home, `/work/`, one page per project (6), `/about/`, `/contact/`. Notes and case studies add pages as they go live. Separate pages give Google something to show as sitelinks under the home page for a name search |
| Main thread at load | Traces put most of the mobile blocking time in style and layout, and most of that in the ~140 text labels of the six project drawings. Fix (4e1092a): drawings keep their 1200 by 520 box and skip layout until they near the screen. Layout objects at load 1,097 to 650; at 4x CPU slowdown the largest layout went 104 to 34 ms and the longest task 165 to 116 ms |

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

**Answered 2026-11-26 (LinkedIn):** linkedin.com/in/aryan-haghighi is the owner's profile; the address with `-24b779304` is no longer used. `site.ts`, the CV and `sameAs` use the short one.

### Owner checklist (by hand, monthly)

1. Google, logged out or in a private window: `"Aryan Haghighi"`. Note the positions of the site, LinkedIn and GitHub in the top 10.
2. Search Console: Pages indexed, and the queries the site shows for.
3. Bing: the same search. Bing Webmaster Tools: Pages indexed.
4. Ask ChatGPT, Perplexity, Gemini, Copilot and Claude, each with web search on: "Who is Aryan Haghighi, the AI engineer?" Save each answer word for word with the date.
5. Vercel Analytics: referrers from chatgpt.com (ChatGPT adds `utm_source=chatgpt.com`), perplexity.ai, bing.com and google.com.
