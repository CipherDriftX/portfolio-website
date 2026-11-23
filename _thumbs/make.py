"""Draws the six Work thumbnails as SVG. Run from the repo root:

    python3 _thumbs/make.py

Writes src/components/thumbs/<project id>.svg. The page inlines them, so
the labels use the site's own Hanken Grotesk and Gloock.

Each drawing tells the project as numbered steps a stranger can follow
(you put this in, it does this, you get this out), drawn with the real
things from the repo: the template text, the code path, the test calls,
the attack titles. Data comes from _thumbs/data, each file naming its
source. Layouts that only explain an idea (the channel web) use a fixed
random seed, so every run draws the same picture.

Colours come from DESIGN.md: the table surface, cream ink, ash umber,
and tan from the site mark as the one key ink per drawing.
"""

import json
import math
import random
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src/components/thumbs"
DATA = ROOT / "_thumbs/data"

W, H = 1200, 520
BG = "#211413"  # table (surface)
PANEL = "#2e1d1a"  # a sheet on the table
CREAM = "#f6e9ce"
MUTED = "#a38f7d"
FAINT = "#5c463b"
WOOD = "#432d26"
TAN = "#cf9a63"  # the site mark's lit facet: the key ink
SANS = "'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif"
SERIF = "Gloock, 'Iowan Old Style', Georgia, serif"
MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
STEP_Y = 62


def f(n):
    """Short number for SVG attributes."""
    return f"{n:.1f}".rstrip("0").rstrip(".")


def text(x, y, s, size=20, fill=MUTED, anchor="start", weight=400, minor=False, mono=False, serif=False, key=False, raw=False):
    """minor: hidden on phones. key: set larger on phones so it stays readable."""
    cls = ' class="minor"' if minor else (' class="key"' if key else "")
    fam = f' font-family="{MONO}"' if mono else (f' font-family="{SERIF}"' if serif else "")
    w = f' font-weight="{weight}"' if weight != 400 else ""
    a = f' text-anchor="{anchor}"' if anchor != "start" else ""
    body = s if raw else escape(s)
    return f'<text x="{f(x)}" y="{f(y)}" font-size="{size}" fill="{fill}"{a}{w}{fam}{cls}>{body}</text>'


def step(x, n, label):
    """A numbered step heading: tan number, cream words."""
    return (
        f'<text x="{x}" y="{STEP_Y}" font-size="25" font-weight="600" fill="{CREAM}" class="key">'
        f'<tspan fill="{TAN}">{n}</tspan><tspan dx="12">{escape(label)}</tspan></text>'
    )


def rect(x, y, w, h, fill):
    return f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" fill="{fill}"/>'


def line(x1, y1, x2, y2, stroke=FAINT, width=2, extra=""):
    return f'<line x1="{f(x1)}" y1="{f(y1)}" x2="{f(x2)}" y2="{f(y2)}" stroke="{stroke}" stroke-width="{width}"{extra}/>'


def arrow(x1, x2, y, stroke=FAINT):
    return line(x1, y, x2, y, stroke) + (
        f'<path d="M{f(x2 - 9)} {f(y - 6)} L{f(x2)} {f(y)} L{f(x2 - 9)} {f(y + 6)}" fill="none" stroke="{stroke}" stroke-width="2"/>'
    )


def svg(pid, title, body):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" '
        f'aria-labelledby="thumb-{pid}" font-family="{SANS}" '
        f'style="font-variant-numeric: tabular-nums lining-nums">'
        f"<title id=\"thumb-{pid}\">{escape(title)}</title>"
        f'<rect width="{W}" height="{H}" fill="{BG}"/>' + "".join(body) + "</svg>\n"
    )


# ---------------------------------------------------------------- Graph Research


def graph_research():
    rnd = random.Random(11)
    body = [step(48, 1, "You name a niche"), step(360, 2, "It follows the links"), step(812, 3, "You get a workbook")]

    # 1. The search box, with the README's own example niche.
    body.append(rect(48, 228, 246, 60, PANEL))
    body.append(f'<circle cx="74" cy="255" r="9" fill="none" stroke="{MUTED}" stroke-width="2.5"/>')
    body.append(line(80.5, 261.5, 88, 269, MUTED, 2.5))
    body.append(text(100, 265, "personal finance", 22, CREAM))
    body.append(text(48, 320, "or any topic", 17, MUTED, minor=True))
    body.append(arrow(302, 322, 258))

    # 2. Keyword search finds a few big channels next to the niche. The
    #    graph walk follows featured channels, recommendations and shared
    #    commenters out to the rest.
    seed = (398, 258)
    big = []
    for i, r in enumerate([20, 18, 17, 16, 15, 14, 13]):
        a = -math.pi / 2 + i * (2 * math.pi / 7) + 0.2
        d = 54 + (i % 3) * 6
        big.append((seed[0] + d * math.cos(a), seed[1] + d * math.sin(a), r))
    nodes = [(x, y, r) for x, y, r in big]
    edges, cross = [], []
    prev = list(range(len(big)))
    for k in range(6):
        bx = 494 + k * 54
        half = min(178, 74 + k * 22)
        want = min(12, 5 + 2 * k)
        band = []
        for _ in range(want * 14):
            if len(band) >= want:
                break
            x = bx + rnd.uniform(-16, 16)
            y = seed[1] + rnd.uniform(-half, half)
            if not (96 < y < 446):
                continue
            if any(math.dist((x, y), nodes[i][:2]) < 27 for i in band + prev):
                continue
            r = max(3.4, 8 - k * 0.8) + rnd.uniform(-1, 1)
            near = sorted(prev, key=lambda i: math.dist((x, y), nodes[i][:2]))
            nodes.append((x, y, r))
            band.append(len(nodes) - 1)
            edges.append((near[0], len(nodes) - 1))
            if len(near) > 1 and rnd.random() < 0.4:
                cross.append((near[1], len(nodes) - 1))
        prev = band

    for a_i, b_i in cross:
        body.append(line(*nodes[a_i][:2], *nodes[b_i][:2], WOOD, 1.5, ' stroke-dasharray="3 5"'))
    for a_i, b_i in edges:
        body.append(line(*nodes[a_i][:2], *nodes[b_i][:2], FAINT, 1.5))
    for x, y, r in big:
        body.append(line(*seed, x, y, MUTED, 1.5))
    for x, y, r in nodes[len(big):]:
        body.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{TAN}"/>')
    for x, y, r in big:
        body.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{r}" fill="{BG}" stroke="{CREAM}" stroke-width="2.5"/>')
    body.append(f'<circle cx="{seed[0]}" cy="{seed[1]}" r="7" fill="{CREAM}"/>')
    body.append(text(398, 372, "search finds these", 17, CREAM, "middle", minor=True))
    body.append(text(770, 486, "the walk finds the rest", 17, TAN, "end", minor=True))
    body.append(arrow(778, 806, 258))

    # 3. The workbook: one row per channel, and which method found it.
    wx, wy, ww, wh = 812, 100, 340, 380
    body.append(rect(wx, wy, ww, wh, PANEL))
    body.append(text(wx + 20, wy + 36, "Channel", 16, MUTED))
    body.append(text(wx + 142, wy + 36, "Subscribers", 16, MUTED))
    body.append(text(wx + 252, wy + 36, "Found by", 16, MUTED))
    body.append(line(wx, wy + 52, wx + ww, wy + 52, WOOD, 2))
    for i in range(9):
        y = wy + 82 + i * 29
        walk = i >= 2
        body.append(rect(wx + 20, y - 7, rnd.uniform(66, 106), 7, CREAM if i < 2 else MUTED))
        body.append(rect(wx + 142, y - 7, rnd.uniform(34, 62), 7, FAINT))
        body.append(text(wx + 252, y, "graph walk" if walk else "search", 16, TAN if walk else MUTED))
    body.append(line(wx, wy + 334, wx + ww, wy + 334, WOOD, 2))
    tabs = [("Overview", 20), ("Channels", 104), ("Videos", 192), ("Niches", 260)]
    for name, dx in tabs:
        on = name == "Channels"
        body.append(text(wx + dx, wy + 362, name, 15, CREAM if on else FAINT, weight=600 if on else 400))
    body.append(rect(wx + 104, wy + 334, 70, 3, TAN))

    return svg(
        "graph-research",
        "Three steps. You name a niche, such as personal finance. Keyword search finds the same few big channels, "
        "and Graph Research follows the links between channels out to many more. You get an Excel workbook "
        "with one row per channel, showing which method found it.",
        body,
    )


# ---------------------------------------------------------------- Outreach OS


def outreach_os():
    body = [step(48, 1, "Spots a buyer"), step(430, 2, "Researches the lead"), step(822, 3, "Fills your template")]
    rnd = random.Random(5)

    # 1. Posts from the seven sources. One is someone asking for what you sell.
    sources = ["Reddit", "Hacker News", "X", "Stack Exchange", "Upwork", "GitHub", "Bluesky"]
    hit = 4
    for i, name in enumerate(sources):
        y = 98 + i * 54
        body.append(rect(48, y, 330, 46, PANEL))
        on = i == hit
        if on:
            body.append(rect(48, y, 4, 46, TAN))
        body.append(text(64, y + 20, name, 15, CREAM if on else MUTED, weight=600 if on else 400))
        body.append(rect(64, y + 30, rnd.uniform(150, 250), 5, MUTED if on else FAINT))
        if on:
            body.append(text(364, y + 20, "asks for help", 15, TAN, "end", 600))
    hy = 98 + hit * 54 + 23
    body.append(f'<path d="M378 {hy} C404 {hy} 398 290 424 290" fill="none" stroke="{TAN}" stroke-width="2"/>')

    # 2. The dossier: every fact researched and graded. The weak one is dropped.
    dx, dy, dw, dh = 430, 98, 334, 382
    body.append(rect(dx, dy, dw, dh, PANEL))
    body.append(f'<circle cx="{dx + 34}" cy="{dy + 38}" r="16" fill="{MUTED}"/>')
    body.append(rect(dx + 60, dy + 28, 124, 9, CREAM))
    body.append(rect(dx + 60, dy + 44, 80, 6, FAINT))
    rows = [("Company", 3), ("Contact", 3), ("Pains", 2), ("Tech stack", 3), ("Competitors", 0)]
    for i, (name, grade) in enumerate(rows):
        y = dy + 104 + i * 52
        weak = grade == 0
        body.append(text(dx + 22, y, name, 17, FAINT if weak else MUTED))
        body.append(rect(dx + 22, y + 12, rnd.uniform(130, 200), 6, WOOD if weak else FAINT))
        for k in range(3):
            sx = dx + dw - 66 + k * 16
            if k < grade:
                body.append(rect(sx, y - 12, 11, 11, TAN))
            else:
                body.append(f'<rect x="{sx + 0.75}" y="{y - 11.25}" width="9.5" height="9.5" fill="none" stroke="{FAINT}" stroke-width="1.5"/>')
        if weak:
            body.append(line(dx + 16, y - 5, dx + 160, y - 5, MUTED, 1.5))
            body.append(text(dx + dw - 22, y + 18, "weak, left out", 14, MUTED, "end"))
    body.append(text(dx + 22, dy + dh - 22, "each fact graded, with its source", 14, MUTED, minor=True))
    body.append(arrow(770, 816, 290))

    # 3. The owner's real template (config/template.txt), filled only with
    #    graded facts. The competitor line needs a fact that failed its grade.
    lx, ly, lw, lh = 822, 98, 330, 382
    body.append(rect(lx, ly, lw, lh, PANEL))

    def tok(s):
        return f'<tspan fill="{TAN}" font-family="{MONO}" font-size="14">{escape(s)}</tspan>'

    letter = [
        (tok("[contact_first_name]") + ",", CREAM),
        ("", None),
        ("I came across your", MUTED),
        (tok("(signal_source_type)") + " on", MUTED),
        (tok("(signal_source_name)") + "…", MUTED),
        ("", None),
        ("…" + tok("[pain_summary]") + " is the", MUTED),
        ("kind of work we handle.", MUTED),
        ("We integrate with", MUTED),
        (tok("[tech_stack_primary_tools]") + ".", MUTED),
        ("STRUCK", None),
        ("Worth ten minutes this week?", MUTED),
    ]
    for i, (s, color) in enumerate(letter):
        y = ly + 40 + i * 28
        if s == "STRUCK":
            body.append(text(lx + 22, y, "switch from [competitor_name]", 14, FAINT, mono=True))
            body.append(line(lx + 18, y - 5, lx + 270, y - 5, MUTED, 1.5))
        elif s:
            body.append(text(lx + 22, y, s, 16, color, raw=True))
    body.append(text(lx, 508, "No AI writes the email.", 15, MUTED, minor=True))

    return svg(
        "outreach-os",
        "Three steps. Outreach OS reads posts on Reddit, Hacker News, X, Stack Exchange, Upwork, GitHub and Bluesky "
        "and finds someone asking for help. It researches the lead: company, contact, pains, tech stack and competitors, "
        "each fact graded, the weak one left out. Then it fills your own email template with the graded facts only.",
        body,
    )


# ---------------------------------------------------------------- Relicon


def relicon():
    body = [step(48, 1, "You write a line"), step(372, 2, "It plans scenes"), step(722, 3, "A finished ad, 4 sizes")]
    mid = 226

    # 1. The input: one sentence, with a caret.
    body.append(rect(48, mid - 76, 284, 152, PANEL))
    for i, s in enumerate(["One sentence", "about your", "product."]):
        body.append(text(70, mid - 30 + i * 36, s, 27, CREAM))
    body.append(rect(176, mid + 20, 3, 28, TAN))
    body.append(arrow(338, 366, mid))

    # 2. Hook, problem, solution: the three scenes in the README.
    fw, fh = 92, 164
    for i, name in enumerate(["Hook", "Problem", "Solution"]):
        x, y = 372 + i * 104, mid - fh / 2
        body.append(rect(x, y, fw, fh, PANEL))
        cx = x + fw / 2
        if i == 0:
            body.append(rect(x + 14, y + 44, 64, 11, CREAM))
            body.append(rect(x + 14, y + 61, 48, 11, CREAM))
            body.append(rect(x + 14, y + 88, 34, 5, MUTED))
        elif i == 1:
            body.append(line(x + 10, y + 110, x + fw - 10, y + 110, FAINT, 2))
            body.append(f'<circle cx="{cx}" cy="{f(y + 60)}" r="10" fill="{MUTED}"/>')
            body.append(f'<path d="M{cx - 16} {f(y + 110)} Q{cx} {f(y + 66)} {cx + 16} {f(y + 110)}" fill="{MUTED}"/>')
        else:
            body.append(f'<circle cx="{cx}" cy="{f(y + 68)}" r="23" fill="{TAN}"/>')
            body.append(f'<rect x="{x + 18}" y="{f(y + 116)}" width="56" height="16" fill="none" stroke="{CREAM}" stroke-width="2"/>')
        body.append(text(cx, y + fh + 32, name, 18, MUTED, "middle"))
    body.append(arrow(686, 714, mid))

    # 3. The four exports: same short side, a play mark, a progress bar,
    #    and the caption inside each platform's safe zone.
    s = 72
    shapes = [("9:16", s, s * 16 / 9), ("1:1", s, s), ("4:5", s, s * 5 / 4), ("16:9", s * 16 / 9, s)]
    x = 724
    base = mid + 64
    for name, w, h in shapes:
        y = base - h
        body.append(rect(x, y, w, h, PANEL))
        cx, cy = x + w / 2, y + h * 0.42
        t = min(w, h) * 0.16
        body.append(f'<path d="M{f(cx - t * 0.7)} {f(cy - t)} L{f(cx + t)} {f(cy)} L{f(cx - t * 0.7)} {f(cy + t)} Z" fill="{TAN}"/>')
        ix, iy = w * 0.1, h * 0.1
        body.append(
            f'<rect x="{f(x + ix)}" y="{f(y + iy)}" width="{f(w - 2 * ix)}" height="{f(h - 2 * iy)}" '
            f'fill="none" stroke="{FAINT}" stroke-width="1.25" stroke-dasharray="3 3"/>'
        )
        cw = (w - 2 * ix) * 0.7
        body.append(rect(x + (w - cw) / 2, y + h - iy - 12, cw, 5, CREAM))
        body.append(rect(x, y + h - 3, w, 3, FAINT))
        body.append(rect(x, y + h - 3, w * 0.38, 3, TAN))
        body.append(text(x + w / 2, base + 32, name, 18, MUTED, "middle"))
        x += w + 12

    # 4. The loop: results from the ads go back into the next plan.
    body.append(
        f'<path d="M940 {mid + 106} V{mid + 168} H526 V{mid + 132}" fill="none" stroke="{TAN}" stroke-width="2.5"/>'
        f'<path d="M519 {mid + 142} L526 {mid + 130} L533 {mid + 142}" fill="none" stroke="{TAN}" stroke-width="2.5"/>'
    )
    body.append(
        f'<text x="560" y="{mid + 206}" font-size="25" font-weight="600" fill="{CREAM}" class="key">'
        f'<tspan fill="{TAN}">4</tspan><tspan dx="12">It learns from the results</tspan></text>'
    )
    body.append(text(560, mid + 236, "hook rate, clicks and return on spend steer the next batch", 16, MUTED, minor=True))

    return svg(
        "relicon",
        "Four steps in a loop. You write one sentence about your product. Relicon plans a hook, problem and solution scene. "
        "You get a finished video ad in four sizes, 9:16, 1:1, 4:5 and 16:9. Then it reads how the ads did and uses "
        "the results to plan the next batch.",
        body,
    )


# ---------------------------------------------------------------- WyScan


def wyscan():
    rnd = random.Random(3)
    body = [step(48, 1, "It reads the agent's code"), step(800, 2, "It flags what can break")]
    top, pitch = 100, 26

    def panel(x, name, lines):
        """A code file: name, then lines. Each line is (indent, text or bar width, colour)."""
        body.append(rect(x, top, 340, 380, PANEL))
        body.append(text(x + 20, top + 30, name, 15, MUTED, mono=True))
        body.append(line(x, top + 46, x + 340, top + 46, WOOD, 2))
        ys = {}
        for i, (ind, item, color) in enumerate(lines):
            y = top + 80 + i * pitch
            lx = x + 24 + ind * 20
            if isinstance(item, str):
                body.append(text(lx, y, item, 16, color, mono=True))
                ys[item] = (lx, y, len(item) * 9.6)
            elif item:
                body.append(rect(lx, y - 7, item, 6, color))
        return ys

    bar = lambda: rnd.uniform(90, 200)
    p1 = panel(48, "tools/setup.py", [
        (0, bar(), FAINT), (1, bar(), FAINT), (0, 0, None),
        (0, "@tool", TAN), (0, "def setup_agent(...):", CREAM),
        (1, bar(), FAINT), (1, bar(), FAINT), (1, "delete_workspace(...)", CREAM),
        (1, bar(), FAINT), (0, 0, None), (0, bar(), FAINT), (1, bar(), FAINT),
    ])
    p2 = panel(420, "helpers/files.py", [
        (0, bar(), FAINT), (0, 0, None),
        (0, "def delete_workspace(...):", CREAM), (1, bar(), FAINT),
        (1, "shutil.rmtree(...)", TAN), (0, 0, None),
        (0, bar(), FAINT), (1, bar(), FAINT), (1, bar(), FAINT), (0, 0, None),
        (0, bar(), FAINT), (1, bar(), FAINT),
    ])

    # The call path from the README's finding, drawn through the code.
    tx, ty, _ = p1["@tool"]
    cx, cy, cw = p1["delete_workspace(...)"]
    dx, dy, _ = p2["def delete_workspace(...):"]
    sx, sy, sw = p2["shutil.rmtree(...)"]
    g1, g2 = 60, 432  # gutters
    body.append(f'<circle cx="{g1}" cy="{ty - 5}" r="5" fill="{TAN}"/>')
    body.append(
        f'<path d="M{g1} {ty - 5} V{cy - 5} H{f(cx - 6)} M{f(cx + cw + 6)} {cy - 5} H404 V{dy - 5} H{f(dx - 4)} '
        f'M{g2} {dy - 5} V{sy - 5} H{f(sx - 6)}" fill="none" stroke="{TAN}" stroke-width="2.5"/>'
    )
    end = sx + sw + 8
    body.append(rect(end, sy - 11, 12, 12, TAN))
    body.append(line(end + 12, sy - 5, 800, sy - 5, TAN, 2))

    # The finding, as the tool reports it.
    fx, fy = 800, sy - 112
    body.append(rect(fx, fy, 352, 214, PANEL))
    body.append(rect(fx, fy, 4, 214, TAN))
    body.append(text(fx + 28, fy + 44, "CRITICAL", 18, TAN, weight=600))
    body.append(text(fx + 28, fy + 90, "An agent tool can", 27, CREAM))
    body.append(text(fx + 28, fy + 124, "delete files.", 27, CREAM))
    body.append(text(fx + 28, fy + 164, "No permission check on the way.", 17, MUTED))
    body.append(text(fx + 28, fy + 192, "tools/setup.py → helpers/files.py", 13, MUTED, mono=True))
    body.append(text(fx, 508, "found by reading the code; nothing runs", 15, MUTED, minor=True))

    return svg(
        "wyscan",
        "Two steps. WyScan reads an agent's code: a tool, setup_agent in tools/setup.py, calls delete_workspace in "
        "helpers/files.py, which calls shutil.rmtree. It flags it as critical: an agent tool can delete files, "
        "with no permission check on the way.",
        body,
    )


# ---------------------------------------------------------------- Wyatt


def wyatt():
    attacks = json.loads((DATA / "wyatt.json").read_text())["attacks"]
    assert len(attacks) == 17
    by_name = {r["attack"]: r for r in attacks}
    # (what the drawing says, the suite's row). The first one is let through
    # with the secret cut out; the rest are stopped.
    shown = [
        ("read a file that holds a key", "secret in tool output reaches the model"),
        ("path traversal with ..", "path traversal with .."),
        ("symlink swapped in mid-read", "symlink swapped in while reading (300 reads)"),
        ("shell injection in arguments", "shell injection in arguments"),
        ("read a secret, then send it out", "read a secret, then send it out"),
        ("SSRF to the cloud metadata address", "SSRF to the cloud metadata address"),
        ("claim another agent's name", "claim another agent's name"),
        ("keep running after the kill switch", "keep a tool running after the kill switch"),
    ]
    body = [step(48, 1, "An agent tries"), step(440, 2, "Wyatt checks it"), step(842, 3, "Only safe calls run")]
    gx, gw = 470, 118  # the Wyatt column
    layers = ["identity", "policy", "kernel", "driver", "control"]
    body.append(rect(gx, 92, gw, 384, PANEL))
    lx = {name: gx + 15 + k * 22 for k, name in enumerate(layers)}
    for x in lx.values():
        body.append(line(x, 104, x, 464, WOOD, 3))
    for i, (label, key) in enumerate(shown):
        r = by_name[key]
        y = 120 + i * 46
        body.append(text(48, y + 6, label, 18, CREAM))
        body.append(line(48 + len(label) * 8.4 + 14, y, gx, y, MUTED, 2))
        if r["stopped_by"] == "DLP":
            body.append(line(gx, y, 1004, y, CREAM, 2))
            body.append(rect(700, y - 7, 70, 14, TAN))
            body.append(text(1016, y + 6, "allowed,", 17, CREAM, weight=600))
            body.append(text(1016, y + 27, "key cut out", 15, MUTED))
        else:
            sx = lx[r["stopped_by"]]
            body.append(line(gx, y, sx, y, MUTED, 2))
            body.append(rect(sx - 3, y - 13, 6, 26, TAN))
            body.append(text(gx + gw + 18, y + 6, f"stopped \u00b7 {r['stopped_by']}", 17, TAN, weight=600))
    body.append(text(48, 508, f"{len(shown)} of the {len(attacks)} attacks in the suite. All {len(attacks)} held.", 15, MUTED, minor=True))

    return svg(
        "wyatt",
        "Three steps. An AI agent tries calls such as path traversal, a symlink swapped in mid-read, SSRF to the "
        "cloud metadata address or sending a secret out. Wyatt checks each one before it runs, and each attack is "
        "stopped by its policy, the kernel, the tool driver, the agent's identity or the kill switch. A file read "
        "that holds a key is allowed with the key cut out.",
        body,
    )


# ---------------------------------------------------------------- Prompt Injection Database


FAMILY = {
    "authority-hijacking": "Authority hijacking",
    "context-manipulation": "Context manipulation",
    "socio-emotional-leverage": "Emotional leverage",
    "obfuscation-and-misdirection": "Obfuscation",
    "information-extraction": "Information extraction",
    "structural-logical-exploitation": "Logic exploit",
    "indirect-injection": "Indirect injection",
}


def prompt_injection_db():
    recs = json.loads((DATA / "prompt-injection-db.json").read_text())["records"]
    cards = json.loads((DATA / "prompt-injection-cards.json").read_text())["cards"]
    assert len(recs) == 82 and len(cards) == 12
    body = [step(48, 1, f"{len(recs)} known attacks"), step(770, 2, "Each one labelled")]

    # 1. A wall of real records, by title. The lit one opens on the right.
    open_id = "7.2-002"
    cw, ch, gx, gy = 206, 80, 14, 12
    lit = None
    for i, c in enumerate(cards):
        col, row = i % 3, i // 3
        x, y = 48 + col * (cw + gx), 98 + row * (ch + gy)
        on = c["id"] == open_id
        body.append(rect(x, y, cw, ch, PANEL))
        if on:
            body.append(f'<rect x="{x + 1}" y="{y + 1}" width="{cw - 2}" height="{ch - 2}" fill="none" stroke="{TAN}" stroke-width="2"/>')
            lit = (x + cw, y + ch / 2)
        body.append(text(x + 16, y + 34, c["title"], 19, CREAM if on else MUTED, serif=True))
        body.append(text(x + 16, y + 60, FAMILY[c["category"]], 13, TAN if on else FAINT))
    body.append(text(48, 494, f"12 of the {len(recs)}, in 7 families", 15, MUTED, minor=True))

    # 2. The open record: its real labels.
    c = next(c for c in cards if c["id"] == open_id)
    bx, by, bw, bh = 770, 98, 382, 356
    body.append(line(lit[0], lit[1], bx, lit[1], TAN, 2))
    body.append(rect(bx, by, bw, bh, PANEL))
    body.append(rect(bx, by, bw, 4, TAN))
    body.append(text(bx + 28, by + 62, c["title"], 34, CREAM, serif=True))
    body.append(text(bx + 28, by + 92, c["id"], 14, FAINT, mono=True))
    fields = [
        ("Family", FAMILY[c["category"]]),
        ("Arrives in", c["delivery_vector"].replace("-", " ")),
        ("Targets", c["target_surface"].replace("rag", "RAG").replace("-", " ")),
        ("Stealth", c["stealth"]),
        ("Difficulty", c["difficulty"]),
    ]
    for i, (k, v) in enumerate(fields):
        y = by + 148 + i * 40
        body.append(text(bx + 28, y, k, 16, MUTED))
        body.append(text(bx + 150, y, v, 18, TAN if k == "Stealth" else CREAM, weight=600 if k == "Stealth" else 400))
    body.append(text(bx, 494, "ready to run against your agent", 15, MUTED, minor=True))

    return svg(
        "prompt-injection-database",
        f"Two steps. A wall of {len(recs)} real prompt injection attacks, such as The Trojan PDF, The Sleeper Cell and "
        "Grandma's Lullaby, in seven families. One record, The Invisible Ink, is open: indirect injection, "
        "arrives in web content, targets the RAG retriever, high stealth, medium difficulty.",
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
