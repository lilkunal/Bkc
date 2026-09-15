"""Create the 1200x630 link-preview image shown when the site is shared (public/og-image.png).

Usage:
  python scripts/make-share-image.py
  python scripts/make-share-image.py --title "STORE" --subtitle "Your subtitle" --tagline "One line about the store." --url "example.com"
"""

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, features

ROOT = Path(__file__).resolve().parent.parent
FONT_DIRS = [Path("C:/Windows/Fonts"), Path("/usr/share/fonts/truetype/dejavu"), Path("/Library/Fonts"), Path("/System/Library/Fonts/Supplemental")]

NIGHT = (11, 10, 8)
GOLD = (201, 162, 74)
GOLD_DEEP = (156, 122, 46)
BONE = (242, 236, 224)
MUTED = (168, 159, 142)


def font(names: list[str], size: int) -> ImageFont.FreeTypeFont:
    for name in names:
        for folder in FONT_DIRS:
            path = folder / name
            if path.exists():
                return ImageFont.truetype(str(path), size)
    return ImageFont.load_default(size)


def tracked(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, fnt, fill, spacing: int) -> None:
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += draw.textlength(ch, font=fnt) + spacing


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--title", default="BKC")
    parser.add_argument("--subtitle", default="Bharat Ka Ch**tiya")
    parser.add_argument("--tagline", default="Printed tees for every Indian tongue.")
    parser.add_argument("--url", default="lilkunal.github.io/Bkc")
    parser.add_argument("--seal", default="चू", help="Short text inside the seal")
    parser.add_argument("--out", default=str(ROOT / "public" / "og-image.png"))
    args = parser.parse_args()

    w, h = 1200, 630
    img = Image.new("RGB", (w, h), NIGHT)

    glow = Image.new("RGB", (w, h), NIGHT)
    ImageDraw.Draw(glow).ellipse((20, 95, 420, 535), fill=(70, 55, 22))
    img = Image.blend(img, glow.filter(ImageFilter.GaussianBlur(90)), 0.9)
    draw = ImageDraw.Draw(img)

    cx, cy, r = 220, 315, 118
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), outline=GOLD, width=3)
    draw.ellipse((cx - r + 13, cy - r + 13, cx + r - 13, cy + r - 13), outline=GOLD_DEEP, width=1)

    # Devanagari needs complex text shaping (libraqm); without it, fall back to the first title letter.
    seal_text = args.seal if features.check("raqm") or args.seal.isascii() else args.title[:1]
    seal_font = font(["Nirmala.ttc", "Nirmala.ttf", "NirmalaB.ttf", "georgiab.ttf", "DejaVuSerif-Bold.ttf"], 118 if not seal_text.isascii() else 130)
    layout = {"layout_engine": ImageFont.Layout.RAQM} if features.check("raqm") else {}
    if layout:
        seal_font = ImageFont.truetype(seal_font.path, seal_font.size, **layout)
    draw.text((cx, cy + 4), seal_text, font=seal_font, fill=GOLD, anchor="mm")

    left = 410
    draw.line((left, 170, left + 80, 170), fill=GOLD_DEEP, width=2)
    tracked(draw, (left - 6, 190), args.title.upper(), font(["georgiab.ttf", "DejaVuSerif-Bold.ttf"], 150), GOLD, 34)
    tracked(draw, (left, 372), args.subtitle.upper(), font(["seguisb.ttf", "segoeui.ttf", "DejaVuSans.ttf"], 28), MUTED, 7)
    draw.text((left, 425), args.tagline, font=font(["georgiai.ttf", "DejaVuSerif-Italic.ttf"], 40), fill=BONE)
    draw.line((left, 520, w - 80, 520), fill=(58, 50, 39), width=1)
    tracked(draw, (left, 540), args.url.upper(), font(["seguisb.ttf", "segoeui.ttf", "DejaVuSans.ttf"], 20), GOLD_DEEP, 5)

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, optimize=True)
    print(f"wrote {out} ({out.stat().st_size // 1024} KB, seal text: {seal_text!r}, raqm: {features.check('raqm')})")


if __name__ == "__main__":
    main()
