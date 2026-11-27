// The MCP server scorecards. Every number on /mcp-servers/ comes from one
// file, src/data/mcp-servers.json, exported from the mcp-server-evals repo
// with `npm run mcp-data`. Nothing here is typed in by hand.
import raw from "../data/mcp-servers.json";
import { launch, mcpCards } from "../data/site";

export const REPO = "https://github.com/CipherDriftX/mcp-server-evals";
export const WIKI_MCP = "https://en.wikipedia.org/wiki/Model_Context_Protocol";

export type Level = "fail" | "warn" | "note";
export interface Finding {
  rule: string;
  level: Level;
  detail: string;
}
export interface Tool {
  name: string;
  tokens: number;
  description: string;
  findings: Finding[];
}
export interface Rule {
  level: Level;
  title: string;
  basis: string;
  source: string;
}
export interface Server {
  id: string;
  name: string;
  maker: string;
  repo: string;
  kind: "npm" | "pypi" | "github-release";
  package: string;
  version: string;
  command: string;
  env_names: string[];
  notes: string;
  date: string;
  checker: { name: string; version: string; spec: string; tokenizer: string };
  status: string;
  protocol: {
    era: "modern" | "legacy" | null;
    version: string | null;
    unknown_tool: string;
    order_stable: boolean | null;
    stdout_noise_lines: number;
    probe_restart: boolean;
  };
  tool_tax: { total: number; description_tokens: number; schema_tokens: number; per_tool_median: number };
  instructions_tokens: number;
  metrics: {
    tools: number;
    short_descriptions: number;
    short_description_share: number | null;
    params: number;
    params_undocumented: number;
    params_undocumented_share: number | null;
    protocol_issues: string[];
  };
  popularity: { registry?: string; weekly_downloads?: number; stars?: number };
  tools: Tool[];
  server_findings: Finding[];
}
interface Data {
  generated: string;
  rules: Record<string, Rule>;
  selection: { date: string; out: { id: string; name: string; package: string; version: string; reason: string }[] };
  servers: Server[];
}

const data = raw as unknown as Data;
export const rules = data.rules;
export const selection = data.selection;

// The table order: the heaviest tool list first. Rank 1 = most tokens.
export const servers = data.servers
  .filter((s) => s.status === "ok")
  .sort((a, b) => b.tool_tax.total - a.tool_tax.total)
  .map((s, i) => ({ ...s, rank: i + 1 }));
export type RankedServer = (typeof servers)[number];

if (servers.some((s) => s.id === "method")) throw new Error('A server id "method" would clash with /mcp-servers/method/.');
const unknown = mcpCards.filter((id) => !servers.some((s) => s.id === id));
if (unknown.length) throw new Error(`mcpCards in src/data/site.ts names servers with no result: ${unknown.join(", ")}`);

/** A server gets its own page in production only when it is in mcpCards. */
export const hasPage = (id: string) =>
  import.meta.env.DEV || (launch.mcpServers && (mcpCards as readonly string[]).includes(id));

export const byId = (id: string) => servers.find((s) => s.id === id);

// ---------- numbers ----------

export const fmt = (n: number) => n.toLocaleString("en-US");
export const pct = (x: number | null) => (x === null ? "none" : `${Math.round(x * 100)}%`);

const median = (xs: number[]) => {
  const v = [...xs].sort((a, b) => a - b);
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : Math.round((v[m - 1] + v[m]) / 2);
};

const taxes = servers.map((s) => s.tool_tax.total);
export const stats = {
  servers: servers.length,
  tools: servers.reduce((n, s) => n + s.metrics.tools, 0),
  minTax: Math.min(...taxes),
  maxTax: Math.max(...taxes),
  medianTax: median(taxes),
  over20: servers.filter((s) => s.metrics.tools > 20).length,
  protocolClean: servers.filter((s) => s.metrics.protocol_issues.length === 0).length,
  modern: servers.filter((s) => s.protocol.era === "modern").length,
  date: servers.map((s) => s.date).sort().at(-1)!,
  spec: servers[0]?.checker.spec ?? "",
  tokenizer: servers[0]?.checker.tokenizer ?? "",
  checker: servers[0]?.checker.version ?? "",
};

/** The page text may name these, e.g. {servers} or {maxTax}. */
export function fill(text: string): string {
  const values: Record<string, string> = {
    servers: String(stats.servers),
    tools: fmt(stats.tools),
    minTax: fmt(stats.minTax),
    maxTax: fmt(stats.maxTax),
    medianTax: fmt(stats.medianTax),
    over20: String(stats.over20),
    date: stats.date,
  };
  return text.replace(/\{(\w+)\}/g, (all, key) => {
    if (!(key in values)) throw new Error(`Unknown number {${key}} in the MCP page text.`);
    return values[key];
  });
}

// ---------- links ----------

export const rawUrl = (s: Server) => `${REPO}/tree/main/results/${s.id}/${s.date}`;
export const codeUrl = (s: Server) => (s.repo ? `https://github.com/${s.repo}` : undefined);
export function packageUrl(s: Server) {
  if (s.kind === "npm") return `https://www.npmjs.com/package/${s.package}/v/${s.version}`;
  if (s.kind === "pypi") return `https://pypi.org/project/${s.package}/${s.version}/`;
  return `https://github.com/${s.repo}/releases/tag/${s.version}`;
}
export const registry = (s: Server) => ({ npm: "npm", pypi: "PyPI", "github-release": "GitHub release" })[s.kind];

// ---------- what to fix first ----------

export interface Fix {
  rule: string;
  text: string;
  /** One real tool from the list, with its own words. */
  example?: { tool: string; quote?: string; params?: string };
}

const toolsWith = (s: Server, ...ids: string[]) => s.tools.filter((t) => t.findings.some((f) => ids.includes(f.rule)));
const short = (text: string, max = 170) => {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
};

/** Up to three fixes, most useful first. Descriptions lead: Anthropic calls
 *  them "by far the most important factor in tool performance". */
export function fixFirst(s: Server): Fix[] {
  const out: Fix[] = [];
  for (const f of s.server_findings.filter((x) => x.level !== "note" && x.rule !== "too-many-tools")) {
    out.push({ rule: f.rule, text: `${rules[f.rule].title}: ${f.detail}.` });
  }
  const broken = toolsWith(s, "schema-object");
  if (broken.length) {
    out.push({
      rule: "schema-object",
      text: `Give ${broken.length === 1 ? "1 tool" : `${broken.length} tools`} a valid input schema. The MCP spec requires a JSON Schema object.`,
      example: { tool: broken[0].name },
    });
  }
  const thin = toolsWith(s, "description-short", "description-missing");
  if (thin.length) {
    const ex = thin[0];
    out.push({
      rule: "description-short",
      text: `Write fuller descriptions for ${thin.length} of ${s.metrics.tools} tools: what the tool does, when to use it and what it returns. Anthropic's guide asks for at least 3 to 4 sentences.`,
      example: { tool: ex.name, quote: ex.description.trim() ? short(ex.description) : undefined },
    });
  }
  const bare = toolsWith(s, "param-description");
  if (bare.length) {
    const ex = bare[0];
    const detail = ex.findings.find((f) => f.rule === "param-description")!.detail;
    out.push({
      rule: "param-description",
      text: `Describe ${s.metrics.params_undocumented} of ${s.metrics.params} parameters. OpenAI's guide asks for the purpose and format of each one.`,
      example: { tool: ex.name, params: detail.split(": ").slice(1).join(": ") },
    });
  }
  if (s.metrics.tools > 20) {
    out.push({
      rule: "too-many-tools",
      text: `Offer fewer tools at a time, or let users turn groups on. ${s.metrics.tools} tools add ${fmt(s.tool_tax.total)} tokens to every request; OpenAI's guide suggests fewer than 20 at the start of a turn.`,
    });
  }
  // Notes are heuristics: they show in the tool table, never here.
  for (const id of ["name-chars", "name-length", "name-unique"]) {
    const hit = toolsWith(s, id);
    if (!hit.length || rules[id].level === "note") continue;
    const f = hit[0].findings.find((x) => x.rule === id)!;
    out.push({ rule: id, text: `${rules[id].title}: ${f.detail}.`, example: { tool: hit[0].name } });
  }
  return out.slice(0, 3);
}

/** The heaviest tools, with their share of the whole tool tax. */
export const heaviest = (s: Server, n = 5) =>
  [...s.tools]
    .sort((a, b) => b.tokens - a.tokens)
    .slice(0, n)
    .map((t) => ({ ...t, share: t.tokens / s.tool_tax.total }));

/** Short rule names for the tool table. */
export const tag = (rule: string) =>
  ({
    "description-short": "short description",
    "description-missing": "no description",
    "param-description": "undescribed parameters",
    "param-untyped": "untyped parameters",
    "look-alike": "look-alike",
    "big-enum": "big enum",
    "name-chars": "name characters",
    "name-length": "name length",
    "name-dot": "dot in name",
    "name-64": "name over 64",
    "name-unique": "duplicate name",
    "schema-object": "no valid schema",
    "schema-root-type": "schema root type",
  })[rule] ?? rule;

// ---------- words ----------

export const plural = (n: number, one: string, many = `${one}s`) => `${fmt(n)} ${n === 1 ? one : many}`;
const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`;
};

/** "GitLab MCP (zereight)" → "GitLab", "MCP Atlassian (sooperset)" → "Atlassian". */
export const shortName = (s: Server) =>
  s.name
    .replace(/\s*\(.*\)$/, "")
    .replace(/^MCP\s+/, "")
    .replace(/\s+MCP(\s+Server)?$/, "");

export const cardPath = (s: Server) => `/mcp-servers/${s.id}/`;
export const cardTitle = (s: Server) => `${shortName(s)} MCP Server: Token Cost and Tool Checks`;

export function cardDescription(s: Server) {
  const m = s.metrics;
  return (
    `${s.name} ${s.version} scorecard: ${plural(m.tools, "tool")} add ${fmt(s.tool_tax.total)} tokens to every request. ` +
    `Short descriptions: ${pct(m.short_description_share)}. Undescribed parameters: ${pct(m.params_undocumented_share)}. What to fix first.`
  );
}

/** The card's opening answer: the numbers in plain sentences. */
export function cardLead(s: RankedServer) {
  const m = s.metrics;
  const place = s.rank === 1 ? "the largest" : `the ${ordinal(s.rank)} largest`;
  const parts = [
    `${s.name} ${s.version} offers ${plural(m.tools, "tool")}.`,
    `${m.tools === 1 ? "Its definition adds" : "Their definitions add"} ${fmt(s.tool_tax.total)} tokens to every request, ${place} of the ${stats.servers} popular servers I checked.`,
    `${fmt(m.short_descriptions)} of ${m.tools} descriptions are shorter than 3 sentences, and ` +
      (m.params === 0
        ? "the tools take no parameters."
        : m.params_undocumented === 0
          ? `all ${plural(m.params, "parameter")} have one.`
          : `${fmt(m.params_undocumented)} of ${plural(m.params, "parameter")} have no description.`),
  ];
  if (m.protocol_issues.length === 0) parts.push("It answered the MCP handshake and listed its tools with no protocol errors.");
  return parts.join(" ");
}

export const versionText = (s: Server) =>
  s.protocol.era === "modern"
    ? `${s.protocol.version}, through server/discover`
    : `${s.protocol.version}, through initialize`;

/** What the whole table says, in sentences anyone can quote. */
export function hubFindings(): string[] {
  const heavy = servers[0];
  const light = servers.at(-1)!;
  const halfShort = servers.filter((s) => (s.metrics.short_description_share ?? 0) >= 0.5).length;
  const halfBare = servers.filter((s) => (s.metrics.params_undocumented_share ?? 0) >= 0.5).length;
  const allClean = stats.protocolClean === stats.servers;
  return [
    `The tool lists add ${fmt(stats.minTax)} to ${fmt(stats.maxTax)} tokens to every request. The median server adds ${fmt(stats.medianTax)}.`,
    `${heavy.name} is the heaviest: ${plural(heavy.metrics.tools, "tool")} and ${fmt(heavy.tool_tax.total)} tokens. ${light.name} is the lightest: ${plural(light.metrics.tools, "tool")} and ${fmt(light.tool_tax.total)} tokens.`,
    `${stats.over20} of ${stats.servers} servers offer more than 20 tools, the soft limit in OpenAI's function calling guide.`,
    `${halfShort} of ${stats.servers} servers give at least half of their tools a description shorter than 3 sentences. Anthropic's guide asks for 3 to 4.`,
    `${halfBare} of ${stats.servers} servers leave at least half of their parameters without a description.`,
    allClean
      ? `All ${stats.servers} answered the MCP handshake and listed their tools with no protocol errors. ${stats.modern} already speak the ${stats.spec} version.`
      : `${stats.protocolClean} of ${stats.servers} answered the MCP handshake and listed their tools with no protocol errors.`,
  ];
}

/** The MCP part of /llms.txt (short) and /llms-full.txt (full), when live. */
export function llmsLines(
  hub: { h1: string; answer: string; faq: { q: string; a: string }[] },
  siteUrl: string,
  full: boolean,
): string[] {
  const cards = servers.filter((s) => hasPage(s.id));
  const out = [
    `## ${hub.h1}`,
    "",
    fill(hub.answer),
    "",
    ...hubFindings().map((f) => `- ${f}`),
    "",
    `- [MCP server scorecards](${siteUrl}/mcp-servers/): the table, how I test an MCP server, and how to hire me`,
    `- [Method](${siteUrl}/mcp-servers/method/): sandbox, tool tax, every rule with its source, the limits`,
    ...cards.map((s) => `- [${s.name} scorecard](${siteUrl}${cardPath(s)}): ${cardLead(s)}`),
    `- Code and raw data: ${REPO}`,
    "",
  ];
  if (!full) return out;
  out.push(
    `### All ${stats.servers} servers, checked ${stats.date}`,
    "",
    "| Server | Tools | Tool tax (tokens) | Median per tool | Short descriptions | Parameters with no description |",
    "|---|---|---|---|---|---|",
    ...servers.map(
      (s) =>
        `| ${s.name} | ${s.metrics.tools} | ${fmt(s.tool_tax.total)} | ${fmt(s.tool_tax.per_tool_median)} | ${pct(s.metrics.short_description_share)} | ${pct(s.metrics.params_undocumented_share)} |`,
    ),
    "",
    "### Questions",
    "",
    ...hub.faq.flatMap((f) => [`**${fill(f.q)}**`, "", fill(f.a), ""]),
  );
  return out;
}
