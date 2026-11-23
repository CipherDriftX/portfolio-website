---
name: "Relicon"
repo: "https://github.com/aegix-ai/relicon"
lane: agents
order: 3
year: 2026
language: "Python, TypeScript"
line: "A self-improving ad engine: it makes video ads, reads how they did, and makes the next batch better."
figures:
  - value: "49%"
    label: "of the best possible return after 15 rounds in a simulated market, up from 21%. A fixed template stays at 20%."
  - value: "10"
    label: "steps from sentence to finished ad, each cached and resumable"
stack: ["FastAPI", "Next.js", "Claude", "MiniMax", "ElevenLabs", "FFmpeg", "Postgres"]
updated: 2026-11-23
---

It expands the brief, plans the scenes, draws a storyboard and checks the cost against a budget before anything renders. FFmpeg cuts the final ad with voice ducking, loudness normalization and safe-zone captions, and a vision judge sends failed scenes back for a re-render. Every ad is saved as a Creative Genome: its hook, structure, offer and style as fields. Results come back from Meta and TikTok exports or the simulator. A Thompson-sampling model works out which fields moved hook rate and clicks, then picks the next batch, keeping part of the budget for new ideas. Every policy is versioned and can be rolled back.
