"""Render favicon.ico and apple-touch-icon.png from the SVGs in this folder.

Run from the repo root: python3 _icons/build.py
Needs rsvg-convert (librsvg) and magick (ImageMagick 7).
ImageMagick writes uncompressed ICO frames (about 15 KB), so the ICO is
packed here from PNG frames instead (about 2 KB).
"""
import pathlib
import struct
import subprocess
import tempfile
import zlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
ICONS = ROOT / "_icons"


ORIGIN = ("Origin: rendered, not generated. _icons/touch.svg (signal-orange disc on night) "
          "rasterized by rsvg-convert at 180x180, then magick -colors 16 as a 4-bit palette PNG. No image model involved.")
ICO_ORIGIN = "Origin: rendered from _icons/mark.svg by _icons/build.py. No image model."


def run(*cmd):
    subprocess.run(cmd, check=True)


def add_text(path, key, text):
    """Insert a PNG tEXt chunk before IEND (Impeccable reads impeccable:prompt as provenance)."""
    data = pathlib.Path(path).read_bytes()
    body = key.encode("latin-1") + b"\0" + text.encode("latin-1")
    chunk = struct.pack(">I", len(body)) + b"tEXt" + body + struct.pack(">I", zlib.crc32(b"tEXt" + body))
    end = data.rindex(b"IEND") - 4
    pathlib.Path(path).write_bytes(data[:end] + chunk + data[end:])


with tempfile.TemporaryDirectory() as tmp:
    frames = []
    for size in (16, 32, 48):
        raw, small = f"{tmp}/raw{size}.png", f"{tmp}/{size}.png"
        run("rsvg-convert", "-w", str(size), "-h", str(size), str(ICONS / "mark.svg"), "-o", raw)
        run("magick", raw, "-strip", "-define", "png:compression-level=9",
            "-define", "png:compression-filter=5", f"PNG32:{small}")
        add_text(small, "impeccable:prompt", ICO_ORIGIN)
        frames.append((size, pathlib.Path(small).read_bytes()))

    offset = 6 + 16 * len(frames)
    header = struct.pack("<HHH", 0, 1, len(frames))
    entries, data = b"", b""
    for size, png in frames:
        entries += struct.pack("<BBBBHHII", size, size, 0, 0, 1, 32, len(png), offset + len(data))
        data += png
    (ROOT / "favicon.ico").write_bytes(header + entries + data)

    touch = f"{tmp}/touch.png"
    run("rsvg-convert", "-w", "180", "-h", "180", str(ICONS / "touch.svg"), "-o", touch)
    run("magick", touch, "-strip", "-colors", "16", "-define", "png:bit-depth=4",
        "-define", "png:color-type=3", "-define", "png:compression-level=9",
        "-define", "png:compression-filter=0", "-define", "png:compression-strategy=0",
        str(ROOT / "apple-touch-icon.png"))
    add_text(ROOT / "apple-touch-icon.png", "impeccable:prompt", ORIGIN)
