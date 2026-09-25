"""Prepare site media from the raw collection folder.

Usage:  python tools/prep-media.py [SRC_DIR]
Needs:  pip install pillow imageio-ffmpeg

Crops remove on-site signage; every output must be eyeballed for readable
text before it ships. Crop boxes are fractions of the source (l, t, r, b).
"""
import os, subprocess, sys
from PIL import Image, ImageFilter, ImageOps

SRC = sys.argv[1] if len(sys.argv) > 1 else r"C:\Users\yuema\OneDrive\Desktop\data-collection"
OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "img")
VID = os.path.join(os.path.dirname(__file__), "..", "assets", "video")

IMAGES = [
    # out name              source                                                     crop  [blur box]
    ("facility-hall",       "factory/Image_20260925122503_26_2.jpg",                     None),
    ("facility-arms",       "factory/img_v3_02106_3eeff0c4-d734-4f53-91c2-85cc76058a6g.jpg", (0.215, 0, 1, 1)),
    ("facility-home",       "factory/img_v3_02106_41effa70-cb2f-403f-9aac-563d9ee943fg.jpg", (0, 0, 0.9, 1)),
    ("facility-retail",     "factory/img_v3_02106_9c5339ed-b48a-4adb-9669-9bcc0fe1c33g.jpg", (0.1, 0, 0.895, 1)),
    ("wild-hotel-closet",   "in-the-wild/01205e42a24ee9cff8d0a6d91ed497e7.jpg",          None, (0.462, 0.30, 0.54, 0.45)),
    ("wild-warehouse-plush","in-the-wild/372c7cf81ff70195cd05dfd10f191a3c.jpg",          None),
    ("wild-hotel-bed",      "in-the-wild/3f0ac4596a6c456c9d6e2adb040c58e6.jpg",          None),
    ("wild-warehouse-boxes","in-the-wild/610ae615f6a2d56108623dc9f7dacfba.jpg",          None),
    ("wild-care-bed",       "in-the-wild/635d749625aa8901498b3cf4c6f90f51.jpg",          (0, 0.15, 1, 1)),
    ("wild-window",         "in-the-wild/0b2ba70bb694e01894ecdfb54a4e24c0.jpg",          (0, 0.14, 0.78, 1)),
]
LONG_EDGE = 1800


def image(name, rel, crop, blur=None):
    im = ImageOps.exif_transpose(Image.open(os.path.join(SRC, rel))).convert("RGB")
    if blur:  # unreadable-ify a notice that can't be cropped out (applied before crop)
        w, h = im.size
        box = (int(blur[0] * w), int(blur[1] * h), int(blur[2] * w), int(blur[3] * h))
        im.paste(im.crop(box).filter(ImageFilter.GaussianBlur(w / 90)), box)
    if crop:
        w, h = im.size
        im = im.crop((int(crop[0] * w), int(crop[1] * h), int(crop[2] * w), int(crop[3] * h)))
    im.thumbnail((LONG_EDGE, LONG_EDGE), Image.LANCZOS)
    im.save(os.path.join(OUT, name + ".jpg"), quality=80, optimize=True, progressive=True)
    im.save(os.path.join(OUT, name + ".webp"), quality=76, method=6)
    print(name, im.size)


def video():
    import imageio_ffmpeg
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    src = os.path.join(SRC, "2b86f125efaa6937d7bbc67c40f0c447.mp4")
    out = os.path.join(VID, "teleop.mp4")
    # 6s-18s: bimanual pick on the parts tray. No faces, no readable text.
    subprocess.run([ff, "-y", "-ss", "6", "-t", "12", "-i", src, "-an",
                    "-vf", "scale=540:-2,fps=30", "-c:v", "libx264", "-profile:v", "main",
                    "-crf", "27", "-preset", "slow", "-pix_fmt", "yuv420p",
                    "-movflags", "+faststart", out], check=True, capture_output=True)
    subprocess.run([ff, "-y", "-ss", "9", "-i", src, "-frames:v", "1",
                    "-vf", "scale=540:-2", "-q:v", "4",
                    os.path.join(OUT, "teleop-poster.jpg")], check=True, capture_output=True)
    print("teleop.mp4", os.path.getsize(out) // 1024, "KB")


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(VID, exist_ok=True)
    for args in IMAGES:
        image(*args)
    video()
