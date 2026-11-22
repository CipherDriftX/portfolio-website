"""Cut, grade and export the portrait for the site and the link preview.

Run from the repo root:
    python3 _photo/build.py ~/Pictures/aryan-image01.jpg

Needs magick (ImageMagick 7 with AVIF and WebP support).

Writes public/photo/print-<width>.{avif,webp,jpg}: one black and white print,
used on every screen size. The link preview (_og/build.py) uses print-1280.jpg.
Every output is stripped of metadata (EXIF, GPS, XMP, ICC comments), then
gets one origin note (Impeccable provenance): a JPEG comment, or a
<file>.json sidecar for WebP and AVIF, which have no comment field.

The boxes below are fractions of the source size, so the same photo at any
resolution cuts the same way. They keep out three things that must never ship:
the beer glass and the ashtray (bottom right) and the person in the background
(right edge, middle). A different photo needs new boxes: open it, find the
pixel box you want, and divide by the width and height.
"""
import json
import pathlib
import struct
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "photo"

# (left, top, right, bottom) as fractions of the source width and height.
# Checked on the 3024x4032 original: the glass starts at x 0.944, the
# ashtray at y 0.908, the background person at x 0.903 (her blurred
# edge at 0.893, so the box stops at 0.867, and its bottom at 0.810).
PRINT = (0.200, 0.185, 0.86667, 0.810)  # head with headroom, shoulders, arms (4:5)

WIDTHS = (480, 720, 960, 1280, 1600)

# Black and white, levels only: Rec. 709 luma, black point 6%, white point
# 96%, a little more contrast in the mids. The bar falls back into the dark
# and the face holds the light. No smoothing, no face edits, no upscaling.
GRADE = ["-grayscale", "Rec709Luma", "-level", "6%,96%,0.9"]

QUALITY = {"avif": "52", "webp": "72", "jpg": "78"}

ORIGIN = ("Origin: sourced, not generated. The owner's own phone photo, cut to the {name} crop, "
          "black and white levels-only grade and resize by _photo/build.py (ImageMagick). "
          "No AI edit, no upscaling, no smoothing, no face edits.")


def run(*cmd):
    subprocess.run([str(c) for c in cmd], check=True)


def stamp(path, text):
    """Write the origin note the way `impeccable embed-prompt` does."""
    if path.suffix == ".jpg":
        body = b"impeccable:prompt\0" + text.encode("ascii")
        data = path.read_bytes()
        assert data[:2] == b"\xff\xd8"
        path.write_bytes(data[:2] + b"\xff\xfe" + struct.pack(">H", len(body) + 2) + body + data[2:])
    else:
        pathlib.Path(f"{path}.json").write_text(json.dumps({"prompt": text}, indent=2) + "\n")


def size(path):
    out = subprocess.run(["magick", "identify", "-format", "%w %h", str(path)],
                         check=True, capture_output=True, text=True).stdout
    w, h = out.split()
    return int(w), int(h)


def cut(src, box, dst):
    w, h = size(src)
    left, top, right, bottom = box
    x, y = round(left * w), round(top * h)
    cw, ch = round(right * w) - x, round(bottom * h) - y
    run("magick", src, "-auto-orient", "-crop", f"{cw}x{ch}+{x}+{y}", "+repage",
        "-colorspace", "sRGB", *GRADE, "-strip", dst)
    return cw


def export(master, name, widths, max_width):
    for width in widths:
        if width > max_width:
            print(f"skip {name}-{width}: source crop is only {max_width}px wide")
            continue
        for ext, q in QUALITY.items():
            dst = OUT / f"{name}-{width}.{ext}"
            extra = ["-interlace", "Plane", "-sampling-factor", "4:2:0"] if ext == "jpg" else []
            run("magick", master, "-resize", f"{width}x", "-strip", *extra, "-quality", q, dst)
            stamp(dst, ORIGIN.format(name=name))


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    src = pathlib.Path(sys.argv[1]).expanduser()
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        master = pathlib.Path(tmp) / "print.png"
        export(master, "print", WIDTHS, cut(src, PRINT, master))
    for f in sorted(OUT.glob("*-*.[aw]*")) + sorted(OUT.glob("*.jpg")):
        print(f"{f.relative_to(ROOT)}  {f.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
