---
# Read this before you set draft: false. It is written in your voice.
# Numbers in braces, like {servers}, come from the scorecard data.
title: "MCP Server Development and Testing · Aryan Haghighi"
h1: "MCP servers"
description: "I test and fix MCP servers. Scorecards for {servers} popular MCP servers: tool count, token cost, description checks and what to fix first."
answer: "I test MCP servers and fix their tools so AI models use them correctly. I checked {servers} popular public MCP servers: their tool lists add {minTax} to {maxTax} tokens to every request. Each scorecard shows the numbers, what to fix first, and the raw data."
steps:
  - title: "Start it in a sandbox"
    text: "I run the server with no network and dummy keys, and read its tool list the way a client does."
  - title: "Count the tool tax"
    text: "Tokens per tool, so you see what each one adds to every request."
  - title: "Check every definition"
    text: "Names, descriptions, parameters and schemas, against the MCP spec and Anthropic's and OpenAI's tool guides."
  - title: "Run real models (next)"
    text: "Coming next: real tasks, to see if a model picks the right tool with the right arguments, and calls nothing when no tool fits."
  - title: "Fix and measure again"
    text: "Every change gets a before and an after number."
  - title: "Keep the checks"
    text: "The checks go into your CI, so a new tool cannot quietly break the old ones."
hire:
  lead: "I'm open to AI engineer roles and contracts on MCP servers and agent evals."
  includes:
    - "Test an MCP server and show what to fix first"
    - "Fix its tool definitions, with before and after numbers"
    - "Put the checks in CI, so new tools cannot quietly break old ones"
faq:
  - q: "How do you test an MCP server?"
    a: "In three layers. First the protocol: does it start, list its tools and reject a tool that does not exist. Then the tool definitions: names, descriptions, schemas and the token cost of each one. Then model runs: real tasks, to see if models pick the right tool with the right arguments, and call nothing when no tool fits. My open-source checker, mcp-server-evals, does the first two today."
  - q: "Should my MCP server run locally or remotely?"
    a: "Locally, over stdio, when it works on the user's own files or tools. Remotely, over Streamable HTTP, when many people share it or it needs a sign-in. Both are standard MCP transports. All {servers} servers in my table were run locally over stdio."
  - q: "How many tools should an MCP server have?"
    a: "As few as the job needs. OpenAI's guide suggests fewer than 20 functions at the start of a turn, as a soft limit. {over20} of the {servers} servers in my table offer more than 20. Every tool also adds tokens to the input of every request, used or not."
  - q: "What is the tool tax?"
    a: "The tokens your tool list adds to every request before the user types a word: each tool's name, description and input schema. I count it with OpenAI's o200k_base tokenizer. In my table it runs from {minTax} to {maxTax} tokens per server, and the median is {medianTax}."
  - q: "Can you fix my MCP server?"
    a: "Yes. Most of the work is in the tool definitions: clearer descriptions, described parameters, and fewer tools that are easier to tell apart. I measure before and after, so you see what changed."
  - q: "Can I hire you?"
    a: "Yes, for AI engineer roles and contracts on MCP servers and agent evals. Email me with what you are building."
updated: 2026-11-28
draft: false
---
