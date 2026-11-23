---
name: "Outreach OS"
repo: "https://github.com/CipherDriftX/outreach-system"
lane: agents
order: 2
year: 2026
language: "Python"
line: "Finds people who need what you sell, researches each one, and fills your offer with facts it can source."
figures:
  - value: "7"
    label: "signal sources: Reddit, Hacker News, X, Stack Exchange, Upwork, GitHub and Bluesky"
stack: ["LangGraph", "Postgres", "FastAPI", "React", "DeepSeek V4"]
updated: 2026-11-23
---

Built on the Graph Research walk. Every lead gets a research pass on the company, the contact, their pains, tech stack and competitors, and each fact is graded on corroboration, consistency, recency and effect size. The email is your own template. A fact that fails its grade is left out, never guessed.
