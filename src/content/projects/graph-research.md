---
name: "graph-research"
repo: "https://github.com/CipherDriftX/graph-research"
lane: agents
order: 1
year: 2026
language: "Python"
line: "An agent that maps a whole YouTube niche and hands back a workbook you can filter, sort and pivot."
figures:
  - value: "1,000+"
    label: "tests, run in CI against a real Postgres"
  - value: "5"
    label: "discovery methods running side by side"
stack: ["LangGraph", "Postgres", "FastAPI", "React", "MCP", "DeepSeek V4"]
updated: 2026-11-23
---

Keyword search keeps returning the same big channels. graph-research also follows the links between channels: featured lists, recommended videos and shared commenters. Each channel records which method found it, so the workbook shows what the graph walk added. It runs as a LangGraph state machine over Postgres with a checkpoint at every step, hard spend ceilings and a live React console.
