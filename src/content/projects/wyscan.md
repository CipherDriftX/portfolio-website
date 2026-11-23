---
name: "wyscan"
repo: "https://github.com/plarix-ai/wyscan"
lane: safety
order: 1
context: "Plarix"
year: 2026
language: "TypeScript"
line: "A static scanner that shows what an agent's tools can break, before the agent ships."
figures:
  - value: "8,731"
    label: "files scanned across 10 open-source agent codebases, AutoGPT, MetaGPT and OpenHands among them"
  - value: "20"
    label: "critical findings: calls that delete data or run code, reachable from a tool with no permission check"
stack: ["TypeScript", "Node.js", "tree-sitter"]
exhibit:
  caption: "One finding, as wyscan prints it."
  text: |-
    ● CRITICAL  setup.py:60:5
      shutil.rmtree(agent_dir)
      Detected reachable call from tool "setup_agent" (langchain) to shutil.rmtree
      through 1 intermediate call. No policy gate detected.
      tool: tools/setup.py:12
      path: cross-file
updated: 2026-11-23
---

It parses Python and TypeScript with tree-sitter, finds the tools registered in LangChain, CrewAI, AutoGen, MCP servers and other agent frameworks, then traces every call each tool can reach, across files. A path only counts as safe when it really checks permission. A log line or a try block does not count. Findings map to the OWASP Agentic AI Top 10.
