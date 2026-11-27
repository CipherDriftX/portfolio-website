---
# Before you set draft: false, check two things:
# 1. "I build MCP servers": true only if you have shipped one. If not, write
#    "I fix and test MCP servers" in `answer` and `description`.
# 2. The price: offer.price holds a placeholder for you. The build stops
#    until you replace it.
# Numbers in braces, like {servers}, come from the scorecard data.
title: "MCP Server Development and Testing · Aryan Haghighi"
h1: "MCP servers"
description: "I build and test MCP servers. Scorecards for {servers} popular MCP servers: tool count, token cost, description checks and what to fix first."
answer: "I build MCP servers that AI models use correctly, and I test the ones you already have. I checked {servers} popular public MCP servers: their tool lists add {minTax} to {maxTax} tokens to every request. Each scorecard shows the numbers, what to fix first, and the raw data."
steps:
  - title: "Start it in a sandbox"
    text: "I run the server with no network and dummy keys, and read its tool list the way a client does."
  - title: "Count the tool tax"
    text: "Tokens per tool, so you see what each one adds to every request."
  - title: "Check every definition"
    text: "Names, descriptions, parameters and schemas, against the MCP spec and Anthropic's and OpenAI's tool guides."
  - title: "Run real models"
    text: "Real tasks: the right tool, the right arguments, and no call when no tool fits."
  - title: "Fix and measure again"
    text: "Every change gets a before and an after number."
  - title: "Keep the checks"
    text: "The checks go into your CI, so a new tool cannot quietly break the old ones."
offer:
  lead: "One fixed-price job: a new MCP server for your API, or a fix for the one you have."
  includes:
    - "The server, or the fixed tool definitions, with tests"
    - "An eval suite with before and after numbers"
    - "The checks in your CI"
  time: "Two weeks"
  price: "[OWNER: price. My pick: from $2,500]"
faq:
  - q: "How much does MCP server development cost?"
    a: "It depends on how many tools the server needs, how sign-in works (an API key, or OAuth for a hosted server) and where it runs. My fixed price is above; you know the number before we start."
  - q: "How do you test an MCP server?"
    a: "In three layers. First the protocol: does it start, list its tools and reject a tool that does not exist. Then the tool definitions: names, descriptions, schemas and the token cost of each one. Then model runs: real tasks, to see if models pick the right tool with the right arguments, and call nothing when no tool fits. My open-source checker, mcp-server-evals, does the first two today."
  - q: "Should my MCP server run locally or remotely?"
    a: "Locally, over stdio, when it works on the user's own files or tools. Remotely, over Streamable HTTP, when many people share it or it needs a sign-in. Both are standard MCP transports. All {servers} servers in my table were run locally over stdio."
  - q: "How many tools should an MCP server have?"
    a: "As few as the job needs. OpenAI's guide suggests fewer than 20 functions at the start of a turn, as a soft limit. {over20} of the {servers} servers in my table offer more than 20. Every tool also adds tokens to the input of every request, used or not."
  - q: "What is the tool tax?"
    a: "The tokens your tool list adds to every request before the user types a word: each tool's name, description and input schema. I count it with OpenAI's o200k_base tokenizer. In my table it runs from {minTax} to {maxTax} tokens per server, and the median is {medianTax}."
  - q: "Do you fix servers you did not build?"
    a: "Yes. Most of the work is in the tool definitions: clearer descriptions, described parameters, and fewer tools that are easier to tell apart. I measure before and after, so you see what changed."
updated: 2026-11-27
draft: true
---
