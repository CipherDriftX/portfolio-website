// Link preview images for case studies and notes, drawn at build time:
// satori lays the card out as SVG, resvg turns it into a 1200x630 PNG.
// Same room as the site: near-black, one bulb light from the top right,
// the title in Gloock, everything else in Hanken Grotesk.
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { site } from "../data/site";

type Font = { name: string; data: Buffer; weight: 400 | 600; style: "normal" };
let fonts: Font[] | undefined;

function loadFonts(): Font[] {
  // satori reads woff, not woff2: the Fontsource packages ship both.
  const file = (pkg: string, name: string) => readFileSync(join(process.cwd(), "node_modules/@fontsource", pkg, "files", name));
  return [
    { name: "Gloock", data: file("gloock", "gloock-latin-400-normal.woff"), weight: 400, style: "normal" },
    { name: "Hanken", data: file("hanken-grotesk", "hanken-grotesk-latin-400-normal.woff"), weight: 400, style: "normal" },
    { name: "Hanken", data: file("hanken-grotesk", "hanken-grotesk-latin-600-normal.woff"), weight: 600, style: "normal" },
  ];
}

const el = (type: string, style: Record<string, unknown>, children?: unknown) => ({ type, props: { style, children } });

/** A 1200x630 PNG with the page title, what kind of page it is, and the name. */
export async function ogPng(title: string, kind: string): Promise<Uint8Array> {
  fonts ??= loadFonts();
  const size = title.length > 70 ? 60 : title.length > 40 ? 72 : 88;
  const card = el(
    "div",
    {
      // satori sizes the content box: 1200x630 minus the padding.
      width: 1200 - 2 * 84,
      height: 630 - 2 * 72,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "72px 84px",
      backgroundColor: "#0b0807",
      backgroundImage: "radial-gradient(circle at 88% -10%, rgba(247,188,124,0.20), rgba(247,188,124,0.05) 38%, rgba(11,8,7,0) 62%)",
      color: "#f6e9ce",
      fontFamily: "Hanken",
    },
    [
      el("div", { display: "flex", color: "#cf9a63", fontSize: 28, fontWeight: 600, letterSpacing: 1 }, kind),
      el("div", { display: "flex", fontFamily: "Gloock", fontSize: size, lineHeight: 1.05, maxWidth: 1000 }, title),
      el("div", { display: "flex", alignItems: "flex-end", borderTop: "1px solid rgba(246,233,206,0.14)", paddingTop: 28 }, [
        el("div", { display: "flex", fontSize: 32, fontWeight: 600 }, site.name),
        el("div", { display: "flex", fontSize: 28, color: "#a38f7d", marginLeft: 24, paddingBottom: 2 }, `${site.title} · ${new URL(site.url).host.replace(/^www\./, "")}`),
      ]),
    ],
  );
  const svg = await satori(card as Parameters<typeof satori>[0], { width: 1200, height: 630, fonts });
  return new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
}
