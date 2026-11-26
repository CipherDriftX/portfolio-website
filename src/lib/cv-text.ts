// Inline marks in src/data/cv.ts, shared by the /cv/ page and the PDFs:
// **bold** and [text](href). Everything else is escaped.
// No imports, so plain Node can load it too (scripts/cv.mjs).

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** One line as HTML. `base` turns site paths into full addresses (the PDFs). */
export function inline(text: string, base = ""): string {
  return escape(text)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, href: string) => {
      const url = href.startsWith("/") ? base + href : href;
      return `<a href="${url}">${label}</a>`;
    })
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
}

/** The same line as plain text, for llms.txt and meta descriptions. */
export function plain(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1").replace(/\*\*(.+?)\*\*/g, "$1");
}
