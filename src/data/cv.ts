// The CV: one file for the /cv/ page and both PDFs (/cv.pdf, /cv-a4.pdf).
// Name, title, email and links come from site.ts.
//
// After a change: run `npm run cv`, look at the PDFs, and commit this file
// with them. The build stops when the PDFs and this file disagree
// (integrations/cv-check.mjs).
//
// Inline marks: **bold** and [text](/path/). A site path links to that page
// here and becomes a full address in the PDFs. Every number must come from
// a repo or the owner. No phone number: this repo is public (the phone goes
// only into the Desktop copies, see scripts/cv.mjs).
//
// No imports, so plain Node can load it too.

export type CvItem = {
  /** The role, school or project name. */
  title: string;
  /** Where, or the project's one line. */
  org: string;
  when: string;
  blurb?: string;
  stack?: string;
  bullets: string[];
};

export type Cv = {
  /** The day the content last changed: sitemap lastmod and the page. */
  updated: string;
  /** After the title in the PDF header: "AI Engineer · <headline>". */
  headline: string;
  summary: string;
  experience: CvItem[];
  projects: CvItem[];
  education: CvItem[];
  honors: string[];
  skills: [label: string, value: string][];
};

export const cv: Cv = {
  updated: "2026-11-26",
  headline: "Production agentic systems + evals",
  summary:
    "AI engineer who ships agentic systems into production, with evals that prove they work. Co-founded **Relicon** and founded **Plarix**, both open source. Self-taught after competitive robotics; now researching drone world models.",
  experience: [
    {
      title: "AI Researcher",
      org: "Istanbul Big Data Research Center, Bahçeşehir University",
      when: "Jun 2026 – Present",
      bullets: [
        "Research world models (V-JEPA) so high-speed drones can detect and avoid other aircraft.",
      ],
    },
    {
      title: "AI Engineer, part-time",
      org: "MacroLOC",
      when: "Nov 2026 – Present",
      bullets: [
        "Build internal AI tools and data systems.",
      ],
    },
    {
      title: "Founder",
      org: "Plarix",
      when: "Mar 2026 – Jul 2026",
      blurb: "Runtime security for AI agents. Open source: [github.com/plarix-ai](https://github.com/plarix-ai)",
      bullets: [
        "Built **[Wyatt](/work/wyatt/)**, a Rust runtime that enforces security policy on every agent tool call. It stopped **17 of 17** attacks in testing, with microsecond overhead.",
        "Built **[WyScan](/work/wyscan/)**, a static analyzer for agent codebases. It found **20** critical security issues in 10 major open-source agent projects with **540k+** combined GitHub stars, including AutoGPT and MetaGPT.",
        "Created an [82-attack prompt-injection dataset](/work/prompt-injection-db/) for testing agents before release.",
      ],
    },
    {
      title: "Co-founder",
      org: "[Relicon](/work/relicon/)",
      when: "Jun 2025 – Nov 2025",
      blurb: "Self-improving video ad engine for small DTC brands. 3 investors, 7 design partners and customers. Open-sourced.",
      bullets: [
        "Built the end-to-end system that turns a one-line brief into a finished video ad, with automated quality checks.",
        "Built a learning loop that improves each batch from ad results: 21% to **49%** of optimal return in benchmark.",
      ],
    },
  ],
  projects: [
    {
      title: "[Graph Research](/work/graph-research/)",
      org: "Research agent for YouTube niches",
      when: "2026",
      stack: "Python, LangGraph, Postgres, FastAPI, React, MCP",
      bullets: [
        "Agent that maps a whole niche by following links between channels, with 1,100+ tests in CI.",
        "Its core powers [Outreach OS](/work/outreach-system/), a lead research agent that keeps only facts it can corroborate.",
      ],
    },
  ],
  education: [
    {
      title: "Bahçeşehir University",
      org: "B.Sc. Artificial Intelligence Engineering, Istanbul",
      when: "Sep 2024 – Jun 2028 (expected)",
      bullets: [],
    },
  ],
  honors: [
    "**2nd place**, RoboCup IranOpen 2017, Rescue Simulation league (international RoboCup event, Tehran)",
    "**1st place**, FarzCup 2017, Rescue Simulation (inter-school competition of SAMPAD, Iran's gifted schools)",
  ],
  skills: [
    ["Agentic systems", "LangGraph, LangChain, MCP, tool calling, RAG, evals, LLM-as-judge, checkpointed workflows"],
    ["AI & ML", "Deep learning (PyTorch), world models (V-JEPA), reinforcement learning, computer vision"],
    ["AI security", "Prompt injection, agent red teaming, tool sandboxing, MCP security, data-loss prevention"],
    ["Security", "Threat modeling, offensive security, Linux sandboxing (Landlock), static analysis, audit logging"],
    ["Languages", "Python, Rust, TypeScript, Go, C++, SQL"],
    ["Infrastructure", "FastAPI, Postgres, SQLite, Docker, Linux (systemd), GitHub Actions, React, Next.js"],
    ["Robotics", "Drones and robots, in progress: MuJoCo simulation, CAD (CadQuery), feedback control, PX4, ESP32"],
    ["Spoken", "English (fluent, B2+), Persian (native), German (limited working), Turkish (elementary)"],
  ],
};
