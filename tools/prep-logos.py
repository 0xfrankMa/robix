"""Build partner logos for the home page wall from files taken off each
company's own website (assets/logos/src/, not committed).

Usage:  python tools/prep-logos.py
Output: assets/logos/<id>.png|svg — the wall renders them as one-colour
silhouettes (CSS), so colour doesn't matter here, only shape.

Several makers use a bilingual lockup with the Chinese name as a second
line. For the Japan-facing site we keep the English line only; nothing
else about the mark is changed.
"""
import os, shutil
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), "..", "assets", "logos")
SRC = os.path.join(ROOT, "src")

# id: (source file, how to handle it)
LOGOS = {
    "unitree":      ("unitree.svg",      "copy"),
    "agibot":       ("agibot.png",       "trim"),
    "galbot":       ("galbot.svg",       "copy"),
    "fourier":      ("fourier.png",      "drop-second-line-right"),
    "booster":      ("booster-v0.svg",   "copy"),
    "galaxea":      ("galaxea.png",      "first-line"),
    "robotera":     ("robotera-en.png",  "trim"),
    "limx":         ("limx.svg",         "copy"),
    "deeprobotics": ("deeprobotics.png", "first-line"),
    "spiritai":     ("spiritai.svg",     "copy"),
    "xsquare":      ("x2robot-v0.svg",   "copy"),
    "agilex":       ("agilex.png",       "trim"),
    "kepler":       ("kepler.png",       "trim"),
}


def bands(mask, axis_len, filled):
    """Runs of rows (or cols) that contain any ink."""
    out, start = [], None
    for i in range(axis_len):
        if filled(i) and start is None:
            start = i
        elif not filled(i) and start is not None:
            out.append((start, i)); start = None
    if start is not None:
        out.append((start, axis_len))
    return out


def ink(im):
    a = im.getchannel("A").point(lambda v: 255 if v > 24 else 0)
    w, h = a.size
    px = a.load()
    rows = lambda y: any(px[x, y] for x in range(w))
    return a, w, h, px, rows


def merge(bs, gap):
    """Join bands separated by less than `gap` px (letters with holes, accents)."""
    out = []
    for b in bs:
        if out and b[0] - out[-1][1] < gap:
            out[-1] = (out[-1][0], b[1])
        else:
            out.append(b)
    return out


def process(name, src, how):
    path = os.path.join(SRC, src)
    if how == "copy":
        shutil.copy(path, os.path.join(ROOT, name + ".svg"))
        return
    im = Image.open(path).convert("RGBA")
    a, w, h, px, rows = ink(im)
    if how == "first-line":
        lines = merge(bands(a, h, rows), gap=max(2, h // 40))
        top, bottom = lines[0]
        im = im.crop((0, top, w, bottom))
    elif how == "drop-second-line-right":
        # icon on the left spans both lines; text column to its right has two lines
        cols = merge(bands(a, w, lambda x: any(px[x, y] for y in range(h))), gap=max(2, w // 30))
        icon_end = cols[0][1]
        sub = im.crop((icon_end, 0, w, h))
        sa, sw, sh, spx, srows = ink(sub)
        lines = merge(bands(sa, sh, srows), gap=max(2, sh // 30))
        second = lines[1]
        clear = Image.new("RGBA", (w - icon_end, second[1] - second[0] + 1), (0, 0, 0, 0))
        im.paste(clear, (icon_end, second[0]))
    im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 24 else 0).getbbox())
    im.save(os.path.join(ROOT, name + ".png"), optimize=True)


if __name__ == "__main__":
    for name, (src, how) in LOGOS.items():
        process(name, src, how)
        print(name, how)
