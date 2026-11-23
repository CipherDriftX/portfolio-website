---
name: "Wyatt"
repo: "https://github.com/plarix-ai/wyatt"
lane: safety
order: 2
context: "Plarix"
year: 2026
language: "Rust"
line: "A daemon between an AI agent and its tools. It checks every call against a policy, runs the tool itself in a sandbox, and signs a record of what happened."
figures:
  - value: "17/17"
    label: "attacks stopped in a live run, from path traversal and SSRF to secret exfiltration and an edited audit log"
  - value: "1.9 µs"
    label: "to decide a call; 66 µs end to end from Python, with a signed audit record"
stack: ["Rust", "Linux Landlock", "openat2", "Unix sockets", "Ed25519", "Python", "MCP"]
exhibit:
  caption: "Part of the attack suite, run against a live daemon."
  text: |-
    held  path traversal with ..                         policy: path_escape
    held  symlink swapped in while reading (300 reads)   kernel: 123 reads inside, 177 refused, 0 escaped
    held  read a secret, then send it out                policy: rule no-exfil on the session's labels
    held  SSRF to the cloud metadata address             driver: link-local address refused after DNS
    held  claim another agent's name                     identity: SO_PEERCRED uid does not match the agent
    held  keep a tool running after the kill switch      control: process group killed after 0.5 s, new calls frozen
    held  edit the audit log afterwards                  audit: verify points at line 3, the edited record

    17 of 17 attacks stopped
updated: 2026-11-23
---

The agent runs as a different Unix user and holds none of the keys its tools need, so a prompt-injected agent has nothing to skip the check with. The kernel tells Wyatt who is calling, and anything no rule allows is denied. File paths are checked again by the kernel, processes run in a Landlock sandbox with no shell, and web calls are pinned against SSRF. Sessions carry labels, so once an agent has read a secret it cannot send it out, even from a new session. Secrets are cut from tool output, a kill switch stops running tools, and every audit record is hash chained and signed. It also sits in front of MCP servers, LangChain, the OpenAI Agents SDK and Claude Code.
