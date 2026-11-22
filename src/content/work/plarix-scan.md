---
title: "Plarix Scan: what your LLM tests really cost"
summary: "A GitHub Action and local proxy that records tokens and cost from real provider responses, and can fail a pull request that costs too much."
role: "Sole engineer"
clientType: "Own open-source tool"
stack: ["Go", "GitHub Actions", "Docker"]
links:
  code: "https://github.com/CipherDriftX/plarix-scan"
year: 2026
featured: true
draft: false
---

## The problem

Tests that call an LLM API cost money on every run. Without a record of each call, a pull request that doubles that cost looks the same in review as one that changes nothing.

## What I built

Plarix Scan wraps your test command and puts a small proxy between your code and the provider.

1. It starts a proxy on `localhost`.
2. It sets `OPENAI_BASE_URL`, `ANTHROPIC_BASE_URL` and `OPENROUTER_BASE_URL`, so the SDK you already use sends its calls through the proxy.
3. It reads the usage from each real response body, streaming included, before passing the response back unchanged.

Every call becomes one line in `plarix-ledger.jsonl` (provider, model, input and output tokens, cost). Totals per model go to `plarix-summary.json`.

## Where it runs

- **Pull requests:** as a GitHub Action, it posts the cost report on the pull request and fails the job when the cost passes `fail_on_cost_usd`.
- **Your laptop:** `plarix-scan run --command "npm test"` around any test command.
- **Production:** as a Docker sidecar that keeps a ledger of live LLM traffic.

## Measured, not estimated

It records a cost only when the provider returns usage fields. When a model is missing from the pricing table, it still records the tokens and marks the cost as unknown instead of guessing.
