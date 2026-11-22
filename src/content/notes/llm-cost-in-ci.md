---
title: "See what your LLM tests cost, on every pull request"
date: 2026-11-22
summary: "Route the SDK through a local proxy, read usage from the provider's own response, and post the total on the pull request."
draft: false
---

If your tests call an LLM API, every run costs money. Here is how I measure it per pull request with [Plarix Scan](/work/plarix-scan/), my open-source GitHub Action.

## Add the workflow

```yaml
name: LLM Cost Check
on: [pull_request]

permissions:
  pull-requests: write

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: plarix-ai/scan@v1
        with:
          command: "pytest -v"
          fail_on_cost_usd: 1.0
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

## What happens

The action starts a proxy on `localhost` and sets the provider base URLs (`OPENAI_BASE_URL`, `ANTHROPIC_BASE_URL`, `OPENROUTER_BASE_URL`). Your SDK sends its calls through the proxy, which reads the token usage from each real response and writes one line per call to `plarix-ledger.jsonl`.

At the end it posts the total on the pull request. With `fail_on_cost_usd` set, a run that costs more than that fails the check.

## The one rule

Use the usage numbers the provider returns, never an estimate from counting tokens yourself. If a model has no known price, keep the tokens and mark the cost unknown.
