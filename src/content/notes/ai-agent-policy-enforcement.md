---
title: "AI agent policy enforcement the agent cannot skip"
date: 2026-11-24
summary: "Wyatt checks every AI agent tool call against a policy from outside the agent, so a prompt-injected agent has nothing to skip. Design, attacks, numbers."
tags: ["agent safety"]
draft: true
---

Policy enforcement for an AI agent only holds if the check sits where the agent cannot reach it. If the agent holds the API keys and file access its tools need, a prompt injection can make it call the tool directly and skip the check. So in [Wyatt](https://github.com/plarix-ai/wyatt), the daemon I built for this, the agent holds nothing. It asks the daemon to use a tool. The daemon decides the call from a policy file, runs the tool itself in a sandbox, removes secrets from the output and writes a signed record of what happened.

## The agent has nothing to skip the check with

The agent and the daemon run as different Unix users and talk over a Unix socket. The agent's side has no file access, no network access and no keys for its tools. A ticket API token, for example, lives in the daemon's environment, and the agent never sees it.

The daemon does not trust the name an agent gives. It reads the caller's credentials from the kernel with `SO_PEERCRED` and rejects any claim that does not match the uid, executable path or token the policy binds to that agent.

## The policy denies by default

A call that no rule allows is denied. When several rules match, `deny` beats `approve` and `approve` beats `allow`, so the order of the rules never opens a hole. There is no permissive mode to leave on by accident.

Every tool declares its arguments. Unknown, missing and mistyped arguments are refused before any rule runs, which is how the attack suite's smuggled extra argument fails.

## The kernel checks paths a second time

A file path is checked twice. First as text against the tool's root, then by the kernel, which opens it with `openat2(RESOLVE_BENEATH)` and refuses any path that leaves the root. That second check also catches a symlink swapped in during the call. In the attack suite, 300 reads raced against a swapped symlink: 123 reads stayed inside the root, 177 were refused, 0 escaped.

Processes run with no shell, a cleared environment, resource limits and a Landlock ruleset for files and TCP. Web calls resolve DNS first, refuse private and cloud metadata addresses, and pin the checked address for the connection. A name that resolves to loopback is refused the same way.

## Allowed calls can still add up to a leak

Reading a file is fine. Posting to a webhook is fine. Reading a key and then posting it is a leak. Wyatt tracks this with labels. When the redactor finds a secret in tool output, it removes it and labels the session `secret`, and a rule can deny any post from that session:

```
$ wyatt eval -p examples/devops/wyatt.yaml -a oncall post_incident \
    '{"url":"https://hooks.slack.com/services/T0/B0/x","body":"hi"}' --label secret
deny  rule  this session has read a secret, so it cannot post outside
args  {"body":"hi","url":"https://hooks.slack.com/services/T0/B0/x"}
rules
  incident-channel  allow    skip   args.url.path = "/services/T0/B0/x" fails prefix
  no-exfil          deny     match
```

A rule on `history.labels` keeps the label with the agent, so opening a new session does not wash it off.

## 17 attacks, all held

`examples/attacks/run.py` in the repo starts a real daemon and attacks it through the Python client. All 17 attacks were held. Part of one run:

```
held  path traversal with ..                           policy: path_escape
held  symlink swapped in while reading (300 reads)     kernel: 123 reads inside, 177 refused, 0 escaped
held  shell injection in arguments                     driver: argv without a shell, printed literally
held  read a secret, then send it from a new session   policy: rule no-exfil on history.labels
held  SSRF to the cloud metadata address               driver: link-local address refused after DNS
held  claim another agent's name                       identity: SO_PEERCRED uid does not match the agent
held  keep a tool running after the kill switch        control: process group killed after 0.5 s, new calls frozen
held  edit the audit log afterwards                    audit: verify points at line 3, the edited record (hash chain, Ed25519)

17 of 17 attacks stopped
```

The last row is the audit log. Every record is hash chained and signed with Ed25519, and records cover outcomes too: exit status, duration, and the size and SHA-256 of the output. When the suite edits a record afterwards, `wyatt audit verify` names the line.

## The check costs microseconds

Measured on an Intel i3-1115G4 laptop with the release build:

| What | p50 | p99 |
|---|---|---|
| Decision engine alone, 200,000 decisions | 1.9 µs | 3.4 µs |
| A check from Python over the socket, with a signed audit record | 66 µs | 140 µs |
| An `fs.read` call: decide, open, read, redact, two signed records | 74 µs | 154 µs |

A model call takes hundreds of milliseconds, so the check is not the slow part.

## Limits

Wyatt runs on Linux only. File tools need Linux 5.6 or later, and sandboxed processes with no network need 6.7 or later. On an older kernel those tools are refused, not run without the sandbox.

Tools your own code runs (the `delegate` and `mcp` drivers) still get the policy check, the redactor and the audit record, but Wyatt cannot stop code that skips the check. Anything that touches production should run on the drivers Wyatt runs itself: `fs`, `proc` and `http`.

It protects one host. Microsoft's Agent Governance Toolkit covers far more ground: fleets of agents in many languages, trust between agents, compliance mappings. It runs inside the agent's process, and its own [limitations page](https://github.com/microsoft/agent-governance-toolkit/blob/main/docs/LIMITATIONS.md) lists it as "application-layer middleware", not "OS kernel / hardware isolation". The two can work together: the toolkit across the fleet, Wyatt under it on each host.

The policy reference, the threat model and everything Wyatt does not do are in the [repo](https://github.com/plarix-ai/wyatt), in `docs/POLICY.md`, `docs/DESIGN.md` and `docs/LIMITATIONS.md`.
