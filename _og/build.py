"""Render the link preview image, public/og.jpg (1200x630, at most 120 KB).

Run from the repo root, after _photo/build.py:
    python3 _og/build.py

Needs chromium and magick. The card is _og/card.html; edit the copy there.
The photo comes from public/photo/desk-1600.jpg, which already leaves out
the glass, the ashtray and the background person.
"""
import pathlib
import subprocess
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
CARD = ROOT / "_og" / "card.html"
OUT = ROOT / "public" / "og.jpg"
LIMIT = 120 * 1024
ORIGIN = ("Origin: rendered, not generated. _og/card.html (Gloock and Hanken Grotesk over "
          "public/photo/desk-1600.jpg, a crop of the owner's own photo) screenshotted by chromium. No image model.")


def run(*cmd):
    subprocess.run([str(c) for c in cmd], check=True, capture_output=True)


with tempfile.TemporaryDirectory() as tmp:
    raw = pathlib.Path(tmp) / "og.png"
    run("chromium", "--headless=new", "--hide-scrollbars", "--disable-gpu", "--force-device-scale-factor=1",
        "--virtual-time-budget=4000", "--window-size=1200,630", f"--screenshot={raw}", f"file://{CARD}")
    for quality in (86, 82, 78, 74, 70, 66):
        run("magick", raw, "-strip", "-sampling-factor", "4:2:0", "-interlace", "Plane",
            "-quality", quality, "-set", "comment", f"impeccable:prompt {ORIGIN}", OUT)
        if OUT.stat().st_size <= LIMIT:
            break
    else:
        raise SystemExit(f"og.jpg is {OUT.stat().st_size // 1024} KB, over the 120 KB limit")
print(f"public/og.jpg  {OUT.stat().st_size // 1024} KB at quality {quality}")
