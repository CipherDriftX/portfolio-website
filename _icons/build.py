"""Render the favicon set and the candidate sheet.

Run from the repo root:
    python3 _icons/build.py

Needs rsvg-convert (librsvg), magick (ImageMagick 7) and chromium (for the sheet).

The mark (SHIP below): j, a hypersonic jet seen from above, nose up, its
leading edge one blended curve, two flat facets lit from the right.
  j-favicon.svg  favicon.svg, transparent: cream/tan on dark tabs, near-black
                 on light tabs (prefers-color-scheme inside the SVG)
  j.svg          16/32/48 px ICO frames and favicon-192.png, transparent,
                 copper (PNG frames cannot switch colour; copper holds about
                 3:1 on both tabs and on Google's light and dark results)
  j-touch.svg    180/192/512 px, flat dark tile (iOS fills transparency black)

Writes to public/: favicon.svg, favicon.ico (16/32/48), favicon-192.png,
apple-touch-icon.png, icon-192.png, icon-512.png.

favicon-192.png is the icon for search results. Google reads BMP, GIF, ICO,
PNG, JPEG, PPM and TIFF, not SVG, and asks for more than 48x48 (Search
Central, "Favicon in search results", updated 2026-10-27). Writes the comparison sheet to _icons/sheet.png.
"""
import pathlib
import shutil
import struct
import subprocess
import tempfile
import zlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
ICONS = ROOT / "_icons"
PUBLIC = ROOT / "public"

SHIP = "j"

COLORS = {"b": "#211413", "a": "#f7bc7c", "c": "#f6e9ce", "s": "#3f537c"}

# Optional hand-tuned 16x16 maps, one character per pixel ("." = transparent).
# A mark without a map renders its 16 px frame from <name>.svg.
PIXELS = {}

ORIGIN = "Origin: rendered, not generated. {src} rasterized by _icons/build.py (rsvg-convert, magick). No image model."


def run(*cmd):
    subprocess.run([str(c) for c in cmd], check=True)


def add_text(path, key, text):
    """Insert a PNG tEXt chunk before IEND (Impeccable reads impeccable:prompt as provenance)."""
    data = pathlib.Path(path).read_bytes()
    body = key.encode("latin-1") + b"\0" + text.encode("latin-1")
    chunk = struct.pack(">I", len(body)) + b"tEXt" + body + struct.pack(">I", zlib.crc32(b"tEXt" + body))
    end = data.rindex(b"IEND") - 4
    pathlib.Path(path).write_bytes(data[:end] + chunk + data[end:])


def pixel_svg(name):
    rows = [r for r in PIXELS[name].strip().splitlines()]
    assert len(rows) == 16 and all(len(r) == 16 for r in rows), f"{name}: map must be 16x16"
    rects = "".join(
        f'<rect x="{x}" y="{y}" width="1" height="1" fill="{COLORS[ch]}"/>'
        for y, row in enumerate(rows)
        for x, ch in enumerate(row)
        if ch != "."
    )
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" shape-rendering="crispEdges">{rects}</svg>'


def png(src_svg, size, dst, src_label):
    raw = dst.with_suffix(".raw.png")
    run("rsvg-convert", "-w", size, "-h", size, src_svg, "-o", raw)
    run("magick", raw, "-strip", "-define", "png:compression-level=9", f"PNG32:{dst}")
    raw.unlink()
    add_text(dst, "impeccable:prompt", ORIGIN.format(src=src_label))


def render(name, out):
    """All sizes of one candidate into folder `out`. Returns {size: path}."""
    out.mkdir(parents=True, exist_ok=True)
    files = {}
    files[16] = out / f"{name}-16.png"
    if name in PIXELS:
        px = out / f"{name}-16.svg"
        px.write_text(pixel_svg(name))
        png(px, 16, files[16], f"_icons/build.py pixel map '{name}'")
    else:
        png(ICONS / f"{name}.svg", 16, files[16], f"_icons/{name}.svg")
    for size in (32, 48):
        files[size] = out / f"{name}-{size}.png"
        png(ICONS / f"{name}.svg", size, files[size], f"_icons/{name}.svg")
    files["search"] = out / f"{name}-192-transparent.png"
    png(ICONS / f"{name}.svg", 192, files["search"], f"_icons/{name}.svg")
    for size in (180, 192, 512):
        files[size] = out / f"{name}-{size}.png"
        png(ICONS / f"{name}-touch.svg", size, files[size], f"_icons/{name}-touch.svg")
    return files


def ico(frames, dst):
    """Pack PNG frames into an ICO (ImageMagick writes uncompressed frames, ~15 KB)."""
    offset = 6 + 16 * len(frames)
    header = struct.pack("<HHH", 0, 1, len(frames))
    entries, data = b"", b""
    for size, path in frames:
        blob = pathlib.Path(path).read_bytes()
        entries += struct.pack("<BBBBHHII", size, size, 0, 0, 1, 32, len(blob), offset + len(data))
        data += blob
    dst.write_bytes(header + entries + data)


def sheet(all_files, tmp):
    rows = ""
    for name, files in all_files.items():
        cells = ""
        for bar in ("light", "dark"):
            tabs = "".join(
                f'<div class="tab"><img src="{files[s]}" width="{s}" height="{s}" alt=""><span>{s}</span></div>'
                for s in (16, 32, 48, 180)
            )
            cells += f'<div class="bar {bar}">{tabs}</div>'
        rows += f'<section><h2>{name.upper()}{" (ships)" if name == SHIP else ""}</h2>{cells}</section>'
    html = f"""<!doctype html><meta charset="utf-8"><style>
body{{margin:0;padding:24px;background:#fff;font:14px system-ui,sans-serif;width:1100px}}
section{{display:grid;grid-template-columns:60px 1fr 1fr;gap:12px;align-items:center;margin-bottom:16px}}
h2{{font-size:18px;margin:0}}
.bar{{display:flex;align-items:flex-end;gap:20px;padding:14px 16px;border-radius:10px}}
.light{{background:#dee1e6;color:#3c4043}}.dark{{background:#35363a;color:#bdc1c6}}
.tab{{display:flex;flex-direction:column;align-items:center;gap:6px}}
img{{image-rendering:pixelated}}
</style><body>{rows}<p>Real size, 1 image pixel = 1 screen pixel. Light bar = Chrome light tab strip, dark bar = Chrome dark.</p></body>"""
    page = pathlib.Path(tmp) / "sheet.html"
    page.write_text(html)
    run("chromium", "--headless=new", "--hide-scrollbars", "--disable-gpu", "--force-device-scale-factor=1",
        "--window-size=1150,860", f"--screenshot={ICONS / 'sheet.png'}", f"file://{page}")


def main():
    with tempfile.TemporaryDirectory() as tmp:
        all_files = {name: render(name, pathlib.Path(tmp) / name) for name in (SHIP,)}
        ship = all_files[SHIP]
        shutil.copyfile(ICONS / f"{SHIP}-favicon.svg", PUBLIC / "favicon.svg")
        ico([(s, ship[s]) for s in (16, 32, 48)], PUBLIC / "favicon.ico")
        shutil.copyfile(ship["search"], PUBLIC / "favicon-192.png")
        shutil.copyfile(ship[180], PUBLIC / "apple-touch-icon.png")
        shutil.copyfile(ship[192], PUBLIC / "icon-192.png")
        shutil.copyfile(ship[512], PUBLIC / "icon-512.png")
        sheet(all_files, tmp)
    for f in ("favicon.svg", "favicon.ico", "favicon-192.png", "apple-touch-icon.png", "icon-192.png", "icon-512.png"):
        print(f"public/{f}  {(PUBLIC / f).stat().st_size} B")


if __name__ == "__main__":
    main()
