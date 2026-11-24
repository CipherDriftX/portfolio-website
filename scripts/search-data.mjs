// What people actually searched to find the site, from Google Search Console
// and Bing Webmaster Tools. Prints a Markdown section for the weekly report.
//
//   node scripts/search-data.mjs [--out file.md]
//
// Reads two optional secrets from the environment and skips any it lacks:
//   GSC_SERVICE_ACCOUNT  the JSON key of a Google service account that was
//                        added as a (restricted) user on the Search Console
//                        property. Read-only scope.
//   BING_API_KEY         Bing Webmaster Tools > Settings > API access.
// No dependencies: the Google token is a JWT signed with node:crypto.

import { createSign } from "node:crypto";
import { appendFileSync, writeFileSync } from "node:fs";

const SITE = "https://www.aryanhaghighi.com/";
const GSC_PROPERTY = "sc-domain:aryanhaghighi.com";
const NAME = /aryan|haghighi|حقیقی|آریان|cipherdrift/i;

const args = process.argv.slice(2);
const outPath = args.includes("--out") ? args[args.indexOf("--out") + 1] : null;
const day = (offset) => new Date(Date.now() - offset * 864e5).toISOString().slice(0, 10);
const lines = ["", "## Search data", ""];

const table = (rows, cols) => [
  `| ${cols.map((c) => c[0]).join(" | ")} |`,
  `|${cols.map(() => "---").join("|")}|`,
  ...rows.map((r) => `| ${cols.map((c) => c[1](r)).join(" | ")} |`),
];

async function googleToken(key) {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
    iss: key.client_email,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(key.private_key, "base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${signature}`,
    }),
  });
  if (!res.ok) throw new Error(`Google token: HTTP ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
}

async function google() {
  if (!process.env.GSC_SERVICE_ACCOUNT) return lines.push("**Google:** not connected (no `GSC_SERVICE_ACCOUNT` secret).", "");
  const token = await googleToken(JSON.parse(process.env.GSC_SERVICE_ACCOUNT));
  // Search Console data lags about 2 days; 28 days ends 3 days ago.
  const query = async (dimensions) => {
    const res = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_PROPERTY)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify({ startDate: day(30), endDate: day(3), dimensions, rowLimit: 25 }),
      },
    );
    if (!res.ok) throw new Error(`Search Console: HTTP ${res.status} ${await res.text()}`);
    return (await res.json()).rows ?? [];
  };
  const queries = await query(["query"]);
  const name = queries.filter((r) => NAME.test(r.keys[0]));
  const other = queries.filter((r) => !NAME.test(r.keys[0]));
  const sum = (rows, k) => rows.reduce((n, r) => n + r[k], 0);
  lines.push(
    `**Google, ${day(30)} to ${day(3)}:** ${sum(queries, "impressions")} impressions, ${sum(queries, "clicks")} clicks over ${queries.length} queries. ` +
      `Name queries: ${name.length}. Other queries: ${other.length}.`,
    "",
  );
  if (queries.length)
    lines.push(
      ...table(queries.slice(0, 15), [
        ["Query", (r) => r.keys[0]],
        ["Impressions", (r) => r.impressions],
        ["Clicks", (r) => r.clicks],
        ["Position", (r) => r.position.toFixed(1)],
      ]),
      "",
    );
}

async function bing() {
  if (!process.env.BING_API_KEY) return lines.push("**Bing:** not connected (no `BING_API_KEY` secret).", "");
  const url = `https://ssl.bing.com/webmaster/api.svc/json/GetQueryStats?siteUrl=${encodeURIComponent(SITE)}&apikey=${process.env.BING_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Bing: HTTP ${res.status}`);
  // One row per query per week; add them up per query.
  const byQuery = new Map();
  for (const r of (await res.json()).d ?? []) {
    const q = byQuery.get(r.Query) ?? { query: r.Query, impressions: 0, clicks: 0 };
    q.impressions += r.Impressions;
    q.clicks += r.Clicks;
    byQuery.set(r.Query, q);
  }
  const rows = [...byQuery.values()].sort((a, b) => b.impressions - a.impressions);
  lines.push(`**Bing:** ${rows.length} queries on record.`, "");
  if (rows.length)
    lines.push(
      ...table(rows.slice(0, 15), [
        ["Query", (r) => r.query],
        ["Impressions", (r) => r.impressions],
        ["Clicks", (r) => r.clicks],
      ]),
      "",
    );
}

// A failure in one source is reported, never fatal: the site check decides
// whether the run fails.
for (const [label, source] of [["Google", google], ["Bing", bing]]) {
  try {
    await source();
  } catch (e) {
    lines.push(`**${label}:** failed: ${e.message.slice(0, 200)}`, "");
  }
}

const text = lines.join("\n");
console.log(text);
if (outPath) appendFileSync(outPath, text + "\n");
if (process.env.GITHUB_STEP_SUMMARY) writeFileSync(process.env.GITHUB_STEP_SUMMARY, text + "\n", { flag: "a" });
