---
name: "prompt-injection-db"
repo: "https://github.com/plarix-ai/prompt-injection-db"
lane: safety
order: 3
context: "Plarix"
year: 2026
language: "Python"
line: "A labeled set of prompt injection attacks for testing agents before they ship."
figures:
  - value: "82"
    label: "attacks in 7 families and 41 techniques"
stack: ["Python", "JSON", "BM25"]
updated: 2026-11-23
---

Every attack is written by hand and tagged by technique, from fake system messages to memory poisoning and abuse of MCP connectors. Each record carries difficulty, stealth and realism ratings and fill-in templates. A small Python adapter searches the set with BM25, so an eval pipeline picks the same attacks every time, with no model in the loop.
