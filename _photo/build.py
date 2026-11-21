"""Cut, grade and export the portrait for the site and the link preview.

Run from the repo root:
    python3 _photo/build.py ~/Pictures/aryan-image01.jpg

Needs magick (ImageMagick 7 with AVIF and WebP support).

Writes public/photo/{desk,phone}-<width>.{avif,webp,jpg}. The link preview
(_og/build.py) is cut from desk-1600.jpg.
Every output is stripped of metadata (EXIF, GPS, XMP, ICC comments).

The boxes below are fractions of the source size, so the same photo at any
resolution cuts the same way. They keep out three things that must never ship:
the beer glass and the ashtray (bottom right) and the person in the background
(right edge, middle). A different photo needs new boxes: open it, find the
pixel box you want, and divide by the width and height.
"""
import pathlib
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "photo"

# (left, top, right, bottom) as fractions of the source width and height.
# Checked on the 3024x4032 original: the glass starts at x 0.944, the
# ashtray at y 0.908, the background person at x 0.903 (her blurred
# edge at 0.893, so the desk box stops at 0.882).
DESK = (0.0, 0.0, 0.882, 0.893)    # window, street, bulbs, arms and watch
PHONE = (0.200, 0.240, 0.86667, 0.865)  # head, shoulders, arms (4:5)

DESK_WIDTHS = (640, 960, 1280, 1600)
PHONE_WIDTHS = (480, 720, 960)

# Light grade only: pull the black point down so the darkest table and
# ceiling tones sit on the page base and the masked edge melts into it.
# No smoothing, no face edits, no upscaling.
GRADE = ["-channel", "RGB", "-level", "3%,100%,0.96", "+channel"]

QUALITY = {"avif": "52", "webp": "72", "jpg": "78"}


def run(*cmd):
    subprocess.run([str(c) for c in cmd], check=True)


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


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    src = pathlib.Path(sys.argv[1]).expanduser()
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        desk, phone = pathlib.Path(tmp) / "desk.png", pathlib.Path(tmp) / "phone.png"
        desk_w = cut(src, DESK, desk)
        phone_w = cut(src, PHONE, phone)
        export(desk, "desk", DESK_WIDTHS, desk_w)
        export(phone, "phone", PHONE_WIDTHS, phone_w)
    for f in sorted(OUT.iterdir()):
        print(f"{f.relative_to(ROOT)}  {f.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
