"""Draws the six Work thumbnails as SVG, from real data where the drawing
shows data. Run from the repo root:

    python3 _thumbs/make.py

Writes src/components/thumbs/<project id>.svg. The page inlines them, so
the labels use the site's own Hanken Grotesk. Colours come from DESIGN.md:
the table surface, cream ink, ash umber, and tan from the site mark as the
one key ink per drawing.

Data files in _thumbs/data/ name their source. Layouts that only explain an
idea (the graph walk, the outreach flow) use a fixed random seed, so every
run draws the same picture.
"""

import json
import math
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src/components/thumbs"
DATA = ROOT / "_thumbs/data"

W, H = 1200, 520
BG = "#211413"  # table (surface)
PANEL = "#2c1c1a"  # a sheet on the table
CREAM = "#f6e9ce"
MUTED = "#a38f7d"
FAINT = "#5c463b"
WOOD = "#432d26"
TAN = "#cf9a63"  # the site mark's lit facet: the key ink
SANS = "'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif"
MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace"


def f(n):
    """Short number for SVG attributes."""
    return f"{n:.1f}".rstrip("0").rstrip(".")


def text(x, y, s, size=22, fill=MUTED, anchor="start", weight=400, minor=False, mono=False, key=False):
    """minor: hidden on phones. key: set larger on phones so it stays readable."""
    cls = ' class="minor"' if minor else (' class="key"' if key else "")
    fam = f' font-family="{MONO}"' if mono else ""
    w = f' font-weight="{weight}"' if weight != 400 else ""
    return (
        f'<text x="{f(x)}" y="{f(y)}" font-size="{size}" fill="{fill}" text-anchor="{anchor}"{w}{fam}{cls}>{s}</text>'
    )


def svg(pid, title, body):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" '
        f'aria-labelledby="thumb-{pid}" font-family="{SANS}" '
        f'style="font-variant-numeric: tabular-nums lining-nums">'
        f'<title id="thumb-{pid}">{title}</title>'
        f'<rect width="{W}" height="{H}" fill="{BG}"/>' + "".join(body) + "</svg>\n"
    )


# ---------------------------------------------------------------- Graph Research


def graph_research():
    rnd = random.Random(11)
    seed = (196, 262)
    body = []

    # Keyword search: the same few big channels, close to the niche.
    big = []
    for i, r in enumerate([27, 24, 22, 20, 19, 17, 16]):
        a = -math.pi / 2 + i * (2 * math.pi / 7) + 0.25
        d = 86 + (i % 3) * 9
        big.append((seed[0] + d * math.cos(a), seed[1] + d * math.sin(a), r))

    # Graph walk: bands of channels fanning out to the right, each one
    # linked back to a channel found one step earlier. Dashed links are
    # channels that also share commenters.
    keep_out = [(800, 34, 1170, 122)]  # label area
    nodes = [(x, y, r, 0, None) for x, y, r in big]
    edges, cross = [], []
    prev = list(range(len(big)))
    for k in range(14):
        bx = 318 + k * 60
        half = min(205, 92 + k * 15)
        want = min(15, 6 + k)
        band = []
        for _ in range(want * 12):
            if len(band) >= want:
                break
            x = bx + rnd.uniform(-20, 20)
            y = seed[1] + rnd.uniform(-half, half)
            if not (48 < y < 476) or any(x0 < x < x1 and y0 < y < y1 for x0, y0, x1, y1 in keep_out):
                continue
            if any(math.dist((x, y), nodes[i][:2]) < 30 for i in band + prev):
                continue
            r = max(3.2, 8.8 - k * 0.42) + rnd.uniform(-1.3, 1.3)
            near = sorted(prev, key=lambda i: math.dist((x, y), nodes[i][:2]))
            nodes.append((x, y, r, k + 1, near[0]))
            band.append(len(nodes) - 1)
            edges.append((near[0], len(nodes) - 1))
            if len(near) > 1 and rnd.random() < 0.38:
                cross.append((near[1], len(nodes) - 1))
        prev = band

    def fade(x):
        return 1.0 if x < 700 else max(0.3, 1 - (x - 700) / 600)

    for a_i, b_i in cross:
        (x0, y0), (x1, y1) = nodes[a_i][:2], nodes[b_i][:2]
        body.append(
            f'<line x1="{f(x0)}" y1="{f(y0)}" x2="{f(x1)}" y2="{f(y1)}" stroke="{WOOD}" '
            f'stroke-width="1.5" stroke-dasharray="3 5" opacity="{f(fade(max(x0, x1)))}"/>'
        )
    for a_i, b_i in edges:
        (x0, y0), (x1, y1) = nodes[a_i][:2], nodes[b_i][:2]
        body.append(
            f'<line x1="{f(x0)}" y1="{f(y0)}" x2="{f(x1)}" y2="{f(y1)}" stroke="{FAINT}" '
            f'stroke-width="1.5" opacity="{f(fade(x1))}"/>'
        )
    for x, y, r in big:
        body.append(
            f'<line x1="{seed[0]}" y1="{seed[1]}" x2="{f(x)}" y2="{f(y)}" stroke="{MUTED}" stroke-width="1.5"/>'
        )
    for x, y, r, depth, _ in nodes[len(big):]:
        body.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{TAN}" opacity="{f(fade(x))}"/>')
    for x, y, r in big:
        body.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{r}" fill="{BG}" stroke="{CREAM}" stroke-width="2.5"/>')
    body.append(f'<circle cx="{seed[0]}" cy="{seed[1]}" r="9" fill="{CREAM}"/>')

    body.append(text(196, 418, "Keyword search", 26, CREAM, "middle", 600, key=True))
    body.append(text(196, 450, "the same big channels", 21, MUTED, "middle", minor=True))
    body.append(text(1136, 74, "Graph walk", 26, TAN, "end", 600, key=True))
    body.append(text(1136, 106, "channels search never returns", 21, MUTED, "end", minor=True))

    return svg(
        "graph-research",
        "A niche at the left with seven big channels around it, the ones keyword search finds. "
        "From them a web of links spreads right to well over a hundred smaller channels that only the graph walk reaches.",
        body,
    )


# ---------------------------------------------------------------- Outreach OS


def outreach_os():
    rnd = random.Random(5)
    body = []
    sources = ["Reddit", "Hacker News", "X", "Stack Exchange", "Upwork", "GitHub", "Bluesky"]
    lead = (624, 262)
    x0, x1 = 252, 540
    hits = []
    for i, name in enumerate(sources):
        y = 112 + i * 50
        body.append(text(226, y + 7, name, 20, MUTED, "end", minor=True))
        x = x0 + rnd.uniform(0, 10)
        picks = set(rnd.sample(range(14), rnd.choice([1, 1, 2])))
        k = 0
        while x < x1:
            if k in picks:
                body.append(f'<rect x="{f(x - 1.5)}" y="{y - 11}" width="3" height="22" fill="{TAN}"/>')
                hits.append((x, y))
            else:
                body.append(f'<rect x="{f(x - 1)}" y="{y - 6}" width="2" height="12" fill="{FAINT}"/>')
            x += rnd.uniform(12, 30)
            k += 1
    for x, y in hits:
        c1 = (x + (lead[0] - x) * 0.55, y)
        c2 = (lead[0] - 46, lead[1])
        body.append(
            f'<path d="M{f(x)} {y} C{f(c1[0])} {f(c1[1])} {f(c2[0])} {f(c2[1])} {lead[0]} {lead[1]}" '
            f'fill="none" stroke="{TAN}" stroke-width="1.5" opacity="0.75"/>'
        )
    body.append(f'<circle cx="{lead[0]}" cy="{lead[1]}" r="10" fill="{CREAM}"/>')

    # The dossier: facts, each with a grade. The weak one never reaches the offer.
    dx, dy, dw, dh = 676, 120, 226, 284
    body.append(f'<line x1="{lead[0] + 10}" y1="{lead[1]}" x2="{dx}" y2="{lead[1]}" stroke="{CREAM}" stroke-width="2"/>')
    body.append(f'<rect x="{dx}" y="{dy}" width="{dw}" height="{dh}" fill="{PANEL}"/>')
    body.append(f'<rect x="{dx + 22}" y="{dy + 26}" width="108" height="9" fill="{CREAM}"/>')
    grades = [3, 3, 2, 3, 1, 2]
    lens = [118, 92, 130, 76, 104, 88]
    for i, (g, ln) in enumerate(zip(grades, lens)):
        y = dy + 70 + i * 34
        weak = g == 1
        body.append(f'<rect x="{dx + 22}" y="{y}" width="{ln}" height="7" fill="{FAINT if weak else MUTED}"/>')
        for k in range(3):
            sx = dx + dw - 70 + k * 16
            if k < g and not weak:
                body.append(f'<rect x="{sx}" y="{y - 2}" width="11" height="11" fill="{TAN}"/>')
            else:
                body.append(
                    f'<rect x="{sx + 0.75}" y="{y - 1.25}" width="9.5" height="9.5" fill="none" stroke="{FAINT}" stroke-width="1.5"/>'
                )
        if weak:
            body.append(
                f'<line x1="{dx + 16}" y1="{y + 3.5}" x2="{dx + dw - 16}" y2="{y + 3.5}" stroke="{MUTED}" stroke-width="1.5"/>'
            )

    # The offer: your template, filled only with graded facts.
    lx, ly, lw, lh = 960, 104, 176, 316
    ax = dx + dw
    body.append(f'<line x1="{ax}" y1="{lead[1]}" x2="{lx - 8}" y2="{lead[1]}" stroke="{CREAM}" stroke-width="2"/>')
    body.append(f'<path d="M{lx - 16} {lead[1] - 6} L{lx - 6} {lead[1]} L{lx - 16} {lead[1] + 6}" fill="none" stroke="{CREAM}" stroke-width="2"/>')
    body.append(f'<rect x="{lx}" y="{ly}" width="{lw}" height="{lh}" fill="{PANEL}"/>')
    lines = [
        [(0, 64)],
        [(0, 40), (46, 70, "fact"), (122, 22)],
        [(0, 132)],
        [(0, 88), (94, 38, "fact")],
        [(0, 120)],
        [(0, 26), (32, 58, "fact"), (96, 36)],
        [(0, 110)],
        [(0, 70)],
        [],
        [(0, 54)],
    ]
    for i, segs in enumerate(lines):
        y = ly + 34 + i * 26
        for s in segs:
            fill = TAN if len(s) == 3 else FAINT
            body.append(f'<rect x="{lx + 20 + s[0]}" y="{y}" width="{s[1]}" height="7" fill="{fill}"/>')

    body.append(text(396, 486, "Signals", 24, CREAM, "middle", 600, key=True))
    body.append(text(789, 486, "Graded facts", 24, CREAM, "middle", 600, key=True))
    body.append(text(1040, 486, "Your offer", 24, CREAM, "middle", 600, key=True))
    return svg(
        "outreach-os",
        "Seven sources at the left, Reddit to Bluesky, each a row of posts with a few buying signals marked. "
        "The signals run into one lead, then a dossier of graded facts where the weak fact is struck out, "
        "then an offer letter filled only with the strong facts.",
        body,
    )


# ---------------------------------------------------------------- Relicon


def relicon():
    body = []
    mid = 238
    # The brief: one sentence.
    for i, line in enumerate(["\u201cOne sentence", "about your", "product.\u201d"]):
        body.append(text(64, mid - 42 + i * 50, line, 41, CREAM))
    body.append(f'<rect x="64" y="{mid + 84}" width="52" height="3" fill="{TAN}"/>')

    def arrow(xa, xb, y):
        return (
            f'<line x1="{xa}" y1="{y}" x2="{xb}" y2="{y}" stroke="{FAINT}" stroke-width="2"/>'
            f'<path d="M{xb - 9} {y - 6} L{xb} {y} L{xb - 9} {y + 6}" fill="none" stroke="{FAINT}" stroke-width="2"/>'
        )

    body.append(arrow(316, 346, mid))

    # Storyboard: hook, problem, solution, each a 9:16 frame.
    fw, fh = 98, 174
    for i, name in enumerate(["Hook", "Problem", "Solution"]):
        x, y = 362 + i * 112, mid - fh / 2
        body.append(f'<rect x="{x}" y="{f(y)}" width="{fw}" height="{fh}" fill="{PANEL}"/>')
        cx = x + fw / 2
        if i == 0:
            body.append(f'<rect x="{x + 14}" y="{f(y + 46)}" width="64" height="11" fill="{CREAM}"/>')
            body.append(f'<rect x="{x + 14}" y="{f(y + 63)}" width="48" height="11" fill="{CREAM}"/>')
            body.append(f'<rect x="{x + 14}" y="{f(y + 90)}" width="34" height="5" fill="{MUTED}"/>')
        elif i == 1:
            body.append(f'<line x1="{x + 10}" y1="{f(y + 112)}" x2="{x + fw - 10}" y2="{f(y + 112)}" stroke="{FAINT}" stroke-width="2"/>')
            body.append(f'<circle cx="{cx}" cy="{f(y + 62)}" r="10" fill="{MUTED}"/>')
            body.append(f'<path d="M{cx - 16} {f(y + 112)} Q{cx} {f(y + 68)} {cx + 16} {f(y + 112)}" fill="{MUTED}"/>')
        else:
            body.append(f'<circle cx="{cx}" cy="{f(y + 70)}" r="23" fill="{TAN}"/>')
            body.append(f'<rect x="{x + 18}" y="{f(y + 118)}" width="56" height="16" fill="none" stroke="{CREAM}" stroke-width="2"/>')
        body.append(text(cx, y + fh + 34, name, 20, MUTED, "middle", minor=True))

    body.append(arrow(698, 724, mid))

    # Exports: 9:16, 1:1, 4:5 and 16:9, all with the same short side, as the
    # engine renders them. Captions stay inside each platform's safe zone.
    s = 80
    shapes = [("9:16", s, s * 16 / 9), ("1:1", s, s), ("4:5", s, s * 5 / 4), ("16:9", s * 16 / 9, s)]
    x = 738
    base = mid + 80
    for name, w, h in shapes:
        y = base - h
        body.append(f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" fill="{PANEL}"/>')
        r = min(w, h) * 0.2
        body.append(f'<circle cx="{f(x + w / 2)}" cy="{f(y + h * 0.42)}" r="{f(r)}" fill="{TAN}"/>')
        ix, iy = w * 0.1, h * 0.1
        body.append(
            f'<rect x="{f(x + ix)}" y="{f(y + iy)}" width="{f(w - 2 * ix)}" height="{f(h - 2 * iy)}" '
            f'fill="none" stroke="{FAINT}" stroke-width="1.25" stroke-dasharray="3 3"/>'
        )
        cw = (w - 2 * ix) * 0.7
        body.append(f'<rect x="{f(x + (w - cw) / 2)}" y="{f(y + h - iy - 12)}" width="{f(cw)}" height="5" fill="{CREAM}"/>')
        body.append(text(x + w / 2, base + 34, name, 20, MUTED, "middle", key=True))
        x += w + 12

    body.append(text(64, 474, "One sentence in", 24, CREAM, weight=600, key=True))
    body.append(text(1136, 474, "A finished ad out, in 4 formats", 24, CREAM, "end", 600, key=True))
    return svg(
        "relicon",
        "One sentence about a product turns into a three-frame storyboard, hook, problem and solution, "
        "and then into four finished ads at 9:16, 1:1, 4:5 and 16:9, captions kept inside each safe zone.",
        body,
    )


# ---------------------------------------------------------------- WyScan


def wyscan():
    rnd = random.Random(3)
    body = []
    cols = 6
    cw, gap = 150, 32
    x0, y0, step, rows = 70, 104, 14, 25
    keep = (cw + gap) * 4 + x0 - 10, 176, 1140, 318  # label area, no code
    special = {(0, 3): "tool", (3, 10): "fn", (3, 12): "sink", (1, 6): "tool2", (4, 19): "gated"}
    pos = {}
    for c in range(cols):
        x = x0 + c * (cw + gap)
        r = 0
        indent = 0
        while r < rows:
            y = y0 + r * step
            if not (keep[0] < x + cw and x < keep[2] and keep[1] < y < keep[3]):
                kind = special.get((c, r))
                if kind in ("fn",):
                    indent = 0
                if r == 0 or kind == "fn" or rnd.random() < 0.13:
                    indent = 0
                    ln = rnd.uniform(70, 120) if kind != "fn" else 112
                else:
                    indent = min(2, max(1, indent + rnd.choice([-1, 0, 0, 1])))
                    ln = rnd.uniform(26, cw - indent * 16 - 6)
                if kind == "tool":
                    ln = 96
                if kind == "sink":
                    ln = 86
                lx = x + indent * 16
                fill = {"tool": TAN, "fn": CREAM, "sink": TAN, "tool2": MUTED, "gated": MUTED}.get(kind, FAINT)
                if kind is None and rnd.random() < 0.12:
                    fill = WOOD
                if kind is None and rnd.random() < 0.08:
                    r += 1
                    continue
                body.append(f'<rect x="{f(lx)}" y="{y}" width="{f(ln)}" height="5" fill="{fill}"/>')
                if kind:
                    pos[kind] = (lx, y + 2.5, ln)
            r += 1

    def arc(a, b, color, width, lift):
        (ax, ay), (bx, by) = a, b
        mx = (ax + bx) / 2
        return (
            f'<path d="M{f(ax)} {f(ay)} C{f(ax + 40)} {f(ay - lift)} {f(bx - 40)} {f(by - lift)} {f(bx)} {f(by)}" '
            f'fill="none" stroke="{color}" stroke-width="{width}"/>'
        )

    # A path that is checked: it ends at a gate.
    t2 = pos["tool2"]
    g = pos["gated"]
    gx = g[0] - 18
    body.append(arc((t2[0] + t2[2], t2[1]), (gx, g[1]), MUTED, 1.75, 60))
    body.append(f'<rect x="{f(gx)}" y="{f(g[1] - 11)}" width="3" height="22" fill="{CREAM}"/>')
    body.append(f'<rect x="{f(gx + 6)}" y="{f(g[1] - 11)}" width="3" height="22" fill="{CREAM}"/>')

    # The finding: tool -> delete_workspace -> shutil.rmtree, no gate.
    t = pos["tool"]
    fn = pos["fn"]
    sk = pos["sink"]
    a = (t[0] + t[2] + 6, t[1])
    b = (fn[0] - 6, fn[1])
    body.append(arc(a, b, TAN, 3, 90))
    body.append(
        f'<path d="M{f(fn[0] - 6)} {f(fn[1])} L{f(fn[0] - 6)} {f(sk[1])} L{f(sk[0] - 6)} {f(sk[1])}" fill="none" stroke="{TAN}" stroke-width="3"/>'
    )
    body.append(f'<circle cx="{f(a[0])}" cy="{f(a[1])}" r="6" fill="{TAN}"/>')
    ex, ey = sk[0] + sk[2] + 16, sk[1]
    body.append(f'<line x1="{f(sk[0] + sk[2] + 4)}" y1="{f(ey)}" x2="{f(keep[0] + 8)}" y2="{f(ey)}" stroke="{TAN}" stroke-width="2"/>')
    body.append(f'<rect x="{f(ex - 7)}" y="{f(ey - 7)}" width="14" height="14" fill="{TAN}"/>')

    lx = keep[0] + 22
    body.append(text(lx, 226, "shutil.rmtree", 26, CREAM, mono=True, key=True))
    body.append(text(lx, 262, "reachable from a tool,", 21, MUTED, minor=True))
    body.append(text(lx, 290, "no permission check", 21, TAN, weight=600, key=True))

    body.append(text(x0, 78, "tools/setup.py", 17, MUTED, mono=True, minor=True))
    body.append(text(x0 + 3 * (cw + gap), 78, "helpers/files.py", 17, MUTED, mono=True, minor=True))
    ly = 488
    body.append('<g class="minor">')  # legend: hidden on phones
    body.append(f'<rect x="{x0}" y="{ly - 15}" width="3" height="18" fill="{CREAM}"/>')
    body.append(f'<rect x="{x0 + 6}" y="{ly - 15}" width="3" height="18" fill="{CREAM}"/>')
    body.append(text(x0 + 22, ly, "a permission check: the path stops here", 20, MUTED, minor=True))
    body.append('</g>')  # legend end
    return svg(
        "wyscan",
        "Six files drawn as lines of code. A traced path runs from a tool in tools/setup.py into delete_workspace in helpers/files.py "
        "and ends at shutil.rmtree, with no permission check on the way. Another path ends at a check and passes.",
        body,
    )


# ---------------------------------------------------------------- Wyatt


def wyatt():
    reqs = json.loads((DATA / "wyatt.json").read_text())["requests"]
    assert len(reqs) == 17
    body = []
    gates = [("Tool", 404, "tool"), ("Data", 594, "data"), ("Exec", 784, "exec"), ("Context", 974, "ctx")]
    top, pitch = 100, 20.5
    left, right = 112, 1112
    for name, gx, _ in gates:
        body.append(f'<rect x="{gx - 5}" y="78" width="10" height="{f(top + 16 * pitch + 24 - 78)}" fill="{WOOD}"/>')
        body.append(text(gx, 62, name, 22, CREAM, "middle", 600, key=True))
    gate_x = {k: gx for _, gx, k in gates}
    for i, r in enumerate(reqs):
        y = top + i * pitch
        body.append(f'<circle cx="{left}" cy="{f(y)}" r="3.5" fill="{MUTED}"/>')
        if r["stop"]:
            end = gate_x[r["stop"]] - 14
            body.append(f'<line x1="{left}" y1="{f(y)}" x2="{end}" y2="{f(y)}" stroke="{MUTED}" stroke-width="2"/>')
            body.append(f'<rect x="{end}" y="{f(y - 8)}" width="4" height="16" fill="{TAN}"/>')
        elif r.get("redact"):
            cut = gate_x["ctx"] + 34
            body.append(f'<line x1="{left}" y1="{f(y)}" x2="{cut}" y2="{f(y)}" stroke="{CREAM}" stroke-width="2"/>')
            body.append(f'<rect x="{cut}" y="{f(y - 6)}" width="44" height="12" fill="{TAN}"/>')
            body.append(f'<line x1="{cut + 44}" y1="{f(y)}" x2="{right}" y2="{f(y)}" stroke="{CREAM}" stroke-width="2"/>')
            body.append(f'<circle cx="{right}" cy="{f(y)}" r="4.5" fill="{CREAM}"/>')
        else:
            body.append(f'<line x1="{left}" y1="{f(y)}" x2="{right}" y2="{f(y)}" stroke="{CREAM}" stroke-width="2"/>')
            body.append(f'<circle cx="{right}" cy="{f(y)}" r="4.5" fill="{CREAM}"/>')

    stopped = sum(1 for r in reqs if r["stop"])
    passed = len(reqs) - stopped
    body.append(text(left, 62, f"{len(reqs)} requests", 22, MUTED, key=True))
    ly = 492
    body.append('<g class="minor">')  # legend: hidden on phones
    body.append(f'<rect x="{left}" y="{ly - 14}" width="4" height="16" fill="{TAN}"/>')
    body.append(text(left + 16, ly, f"{stopped} stopped at a check", 21, MUTED, minor=True))
    body.append(f'<circle cx="{left + 272}" cy="{ly - 6}" r="4.5" fill="{CREAM}"/>')
    body.append(text(left + 286, ly, f"{passed} allowed", 21, MUTED, minor=True))
    body.append(f'<rect x="{left + 420}" y="{ly - 12}" width="30" height="12" fill="{TAN}"/>')
    body.append(text(left + 462, ly, "1 secret cut from the output", 21, MUTED, minor=True))
    body.append('</g>')  # legend end
    return svg(
        "wyatt",
        f"{len(reqs)} requests from a test agent run left to right through four checks: tool, data, exec and context. "
        f"{stopped} are stopped at a check, {passed} pass, and one of those has a secret cut from its output.",
        body,
    )


# ---------------------------------------------------------------- Prompt Injection Database


def prompt_injection_db():
    recs = json.loads((DATA / "prompt-injection-db.json").read_text())["records"]
    assert len(recs) == 82
    fams = [
        ("authority-hijacking", "Authority"),
        ("context-manipulation", "Context"),
        ("socio-emotional-leverage", "Emotion"),
        ("obfuscation-and-misdirection", "Obfuscation"),
        ("information-extraction", "Extraction"),
        ("structural-logical-exploitation", "Structure"),
        ("indirect-injection", "Indirect"),
    ]
    body = []
    cell, pitch = 30, 36
    bw = cell + pitch
    margin = 104
    gap = (W - 2 * margin - 7 * bw) / 6
    base = 392
    for i, (key, label) in enumerate(fams):
        items = [r for r in recs if r["category"] == key]
        bx = margin + i * (bw + gap)
        rows = math.ceil(len(items) / 2)
        for k, r in enumerate(items):
            col, row = k % 2, k // 2
            x = bx + col * pitch
            y = base - (row + 1) * pitch + (pitch - cell)
            if r["stealth"] == "high":
                body.append(f'<rect x="{f(x)}" y="{f(y)}" width="{cell}" height="{cell}" fill="{CREAM}"/>')
            elif r["stealth"] == "medium":
                body.append(f'<rect x="{f(x)}" y="{f(y)}" width="{cell}" height="{cell}" fill="{FAINT}"/>')
            else:
                body.append(
                    f'<rect x="{f(x + 1)}" y="{f(y + 1)}" width="{cell - 2}" height="{cell - 2}" fill="none" stroke="{FAINT}" stroke-width="2"/>'
                )
            if r["difficulty"] == "high":
                body.append(f'<rect x="{f(x + 10)}" y="{f(y + 10)}" width="10" height="10" fill="{TAN}"/>')
        top = base - rows * pitch + (pitch - cell)
        cx = bx + bw / 2 - (pitch - cell) / 2
        body.append(text(cx, top - 16, str(len(items)), 26, CREAM, "middle", 600, key=True))
        body.append(text(cx, base + 38, label, 20, MUTED, "middle", minor=True))

    hi = sum(1 for r in recs if r["stealth"] == "high")
    hard = sum(1 for r in recs if r["difficulty"] == "high")
    ly = 488
    body.append('<g class="minor">')  # legend: hidden on phones
    body.append(f'<rect x="{margin}" y="{ly - 15}" width="16" height="16" fill="{CREAM}"/>')
    body.append(text(margin + 26, ly, f"high stealth, {hi}", 20, MUTED, minor=True))
    mid_n = sum(1 for r in recs if r["stealth"] == "medium")
    low_n = sum(1 for r in recs if r["stealth"] == "low")
    body.append(f'<rect x="{margin + 200}" y="{ly - 15}" width="16" height="16" fill="{FAINT}"/>')
    body.append(text(margin + 226, ly, f"medium, {mid_n}", 20, MUTED, minor=True))
    body.append(f'<rect x="{margin + 361}" y="{ly - 14}" width="14" height="14" fill="none" stroke="{FAINT}" stroke-width="2"/>')
    body.append(text(margin + 386, ly, f"low, {low_n}", 20, MUTED, minor=True))
    body.append(f'<rect x="{margin + 500}" y="{ly - 15}" width="16" height="16" fill="{FAINT}"/>')
    body.append(f'<rect x="{margin + 503}" y="{ly - 12}" width="10" height="10" fill="{TAN}"/>')
    body.append(text(margin + 526, ly, f"hardest to pull off, {hard}", 20, MUTED, minor=True))
    body.append('</g>')  # legend end
    body.append(text(margin - 6, 70, f"{len(recs)} attacks, 7 families", 26, CREAM, weight=600, key=True))
    return svg(
        "prompt-injection-database",
        f"82 squares, one per attack, stacked in seven families: authority 10, context 10, emotion 8, obfuscation 12, "
        f"extraction 10, structure 16 and indirect 16. Light squares are the {hi} high-stealth attacks, "
        f"and a tan centre marks the {hard} hardest.",
        body,
    )


DRAWINGS = {
    "graph-research": graph_research,
    "outreach-system": outreach_os,
    "relicon": relicon,
    "wyscan": wyscan,
    "wyatt": wyatt,
    "prompt-injection-db": prompt_injection_db,
}

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for pid, draw in DRAWINGS.items():
        (OUT / f"{pid}.svg").write_text(draw())
        print(pid, (OUT / f"{pid}.svg").stat().st_size, "bytes")
