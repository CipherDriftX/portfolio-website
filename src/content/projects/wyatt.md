---
name: "Wyatt"
repo: "https://github.com/plarix-ai/wyatt"
lane: safety
order: 2
context: "Plarix"
year: 2026
language: "Python"
line: "Sits between an agent and its tools. Every call is checked before it runs, and anything not allowed is denied."
figures:
  - value: "17/17"
    label: "requests from a test DevOps agent decided correctly, from routine log reads to /etc/shadow and path traversal"
stack: ["Python", "Unix sockets", "Open Policy Agent"]
exhibit:
  caption: "The daemon's log as it stops an agent reading /etc/shadow."
  text: |-
    [REQ]         devops-agent → read_file({path: /etc/shadow})
    [AFB04:TOOL]  ALLOW (read_file permitted for devops-agent)
    [AFB04:DATA]  DENY (path=/etc/shadow matches deny pattern /etc/*)
    [DENY]        Blocked: path=/etc/shadow matches deny pattern /etc/*
updated: 2026-11-23
---

Each request passes four checks in order: is this tool allowed for this agent, are the arguments safe, which limits does it run under, and what may the output show. The first no stops the call. Keys and secrets are cut from results, and every decision is logged with who asked, what would change and which rule decided.
