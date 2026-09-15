"""Turn blank garment photos into the mockup maps the site recolours and prints on.

Put photos in public/mockups/ named blank-<type>.<jpg|jpeg|png|webp>, e.g. blank-tee.jpg, blank-shirt.png.
Then run:  python scripts/prepare-mockups.py

For each photo this writes public/mockups/<type>.webp (fold shading in RGB, garment cut-out in alpha)
and records it in public/mockups/mockups.json. Print boxes already in mockups.json are kept, so you can
tune them by hand; delete an entry (or pass --reset) to go back to the defaults below.

Best results: a white or very light garment, straight front view, on a plain background of a
different shade (or a transparent PNG).
"""

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
MOCKUPS = ROOT / "public" / "mockups"
OUT_HEIGHT = 1400

# Print box centre and size as fractions of the cropped garment image.
DEFAULT_PRINT = {
    "tee": {"x": 0.5, "y": 0.4, "w": 0.34, "h": 0.36},
    "shirt": {"x": 0.64, "y": 0.34, "w": 0.15, "h": 0.1},
}
FALLBACK_PRINT = {"x": 0.5, "y": 0.4, "w": 0.3, "h": 0.3}


def garment_mask(img: Image.Image) -> np.ndarray:
    """True where the garment is. Uses transparency when present, else separates a plain background."""
    if "A" in img.getbands():
        alpha = np.asarray(img.getchannel("A"))
        if alpha.min() < 250:
            return alpha > 12

    rgb = np.asarray(img.convert("RGB")).astype(np.float32)
    h, w, _ = rgb.shape
    border = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    bg = np.median(border, axis=0)
    dist = np.sqrt(((rgb - bg) ** 2).sum(axis=2))
    border_dist = np.sqrt(((border - bg) ** 2).sum(axis=1))
    tolerance = max(14.0, float(np.percentile(border_dist, 95)) * 1.8)

    # Background = pixels near the border colour that are connected to the image edge.
    near = Image.fromarray(np.where(dist < tolerance, 255, 0).astype(np.uint8))
    fill = near.copy()
    step = max(1, min(w, h) // 200)
    edge_points = [(x, 0) for x in range(0, w, step)] + [(x, h - 1) for x in range(0, w, step)]
    edge_points += [(0, y) for y in range(0, h, step)] + [(w - 1, y) for y in range(0, h, step)]
    for point in edge_points:
        if fill.getpixel(point) == 255:
            ImageDraw.floodfill(fill, point, 128)
    garment = np.asarray(fill) != 128

    # Remove specks and smooth the outline.
    m = Image.fromarray((garment * 255).astype(np.uint8))
    m = m.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.MaxFilter(5))
    return np.asarray(m) > 127


def prepare(src: Path) -> tuple[str, dict]:
    kind = src.stem.removeprefix("blank-")
    img = Image.open(src)
    img.load()
    mask = garment_mask(img)
    if mask.mean() < 0.05:
        raise SystemExit(f"{src.name}: couldn't find the garment. Use a plain background of a different shade, or a transparent PNG.")

    ys, xs = np.nonzero(mask)
    pad = int(max(mask.shape) * 0.03)
    top, bottom = max(0, ys.min() - pad), min(mask.shape[0], ys.max() + pad + 1)
    left, right = max(0, xs.min() - pad), min(mask.shape[1], xs.max() + pad + 1)

    rgb = np.asarray(img.convert("RGB")).astype(np.float32)[top:bottom, left:right]
    mask = mask[top:bottom, left:right]

    luma = 0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]
    reference = float(np.percentile(luma[mask], 88)) or 1.0
    shade = np.clip(luma / reference, 0, 1.27)

    encoded = np.clip(np.round(shade * 200), 0, 255).astype(np.uint8)
    alpha = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
    rgba = np.dstack([encoded, encoded, encoded, np.asarray(alpha)])
    out = Image.fromarray(rgba, "RGBA")

    if out.height > OUT_HEIGHT:
        out = out.resize((round(out.width * OUT_HEIGHT / out.height), OUT_HEIGHT), Image.LANCZOS)

    target = MOCKUPS / f"{kind}.webp"
    out.save(target, "WEBP", quality=92, method=6)
    coverage = mask.mean() * 100
    print(f"  {src.name} -> {target.name}  {out.width}x{out.height}, garment covers {coverage:.0f}% of the frame, {target.stat().st_size // 1024} KB")
    return kind, {"src": f"mockups/{kind}.webp", "width": out.width, "height": out.height}


def main() -> None:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    reset = "--reset" in sys.argv
    if args:
        photos = [Path(a).resolve() for a in args]
        for photo in photos:
            if not photo.exists() or not photo.stem.startswith("blank-"):
                raise SystemExit(f"{photo}: expected an existing file named blank-<type>.<jpg|png|webp>")
    else:
        photos = sorted(p for p in MOCKUPS.glob("blank-*") if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"})
    if not photos:
        raise SystemExit(f"No photos found. Add blank-tee.jpg / blank-shirt.jpg to {MOCKUPS}")

    manifest_path = MOCKUPS / "mockups.json"
    manifest = {} if reset or not manifest_path.exists() else json.loads(manifest_path.read_text("utf-8"))

    print(f"Preparing {len(photos)} mockup photo(s):")
    for photo in photos:
        kind, info = prepare(photo)
        previous = manifest.get(kind, {})
        manifest[kind] = {
            **info,
            "print": previous.get("print") or DEFAULT_PRINT.get(kind, FALLBACK_PRINT),
            "warp": previous.get("warp", 30),
        }

    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", "utf-8")
    print(f"Wrote {manifest_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
