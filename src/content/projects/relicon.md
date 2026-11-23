---
name: "Relicon"
repo: "https://github.com/aegix-ai/relicon"
lane: agents
order: 3
context: "Relicon"
year: 2026
language: "Python, TypeScript"
line: "Turns one sentence about a product into a packaged video ad, ready to post."
figures:
  - value: "10"
    label: "steps from sentence to finished ad, each cached and resumable"
  - value: "4"
    label: "formats from one render, captions inside each platform's safe zone"
stack: ["FastAPI", "Next.js", "Claude", "MiniMax", "ElevenLabs", "FFmpeg", "Postgres"]
updated: 2026-11-23
---

It expands the brief, plans the scenes, draws a storyboard and checks the cost against a budget before anything renders. FFmpeg cuts the final ad with voice ducking, loudness normalization and safe-zone captions. A vision judge reviews the cut and sends failed scenes back for a re-render. Every ad is saved as a Creative Genome: its hook, structure, offer and style as fields that results can be measured against.
