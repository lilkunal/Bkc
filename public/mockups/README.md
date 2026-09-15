# Garment mockup photos

The store builds realistic product images by recolouring a blank garment photo and printing each design onto it.

## Add a photo

1. Save a photo per garment type here, named `blank-<type>`: `blank-tee.jpg`, `blank-shirt.jpg` (`.png` and `.webp` work too).
2. Run `python scripts/prepare-mockups.py` from the project root.
3. That writes `<type>.webp` (the fold shading and cut-out) and records it in `mockups.json`.

## What makes a good photo

- A **white or very light grey** garment with no print, logo or visible tag
- **Straight front view**, the whole garment in frame with some space around it
- **Flat-lay or invisible mannequin**: no person, hands or hanger across the front
- A **plain background that differs from the garment** (light grey or beige), or a transparent PNG
- Soft, even light, at least ~1500 px tall; natural folds are good
- A licence that allows commercial use and editing (e.g. Unsplash or Pexels)

## Tuning where the print sits

Each entry in `mockups.json` has a `print` box: centre `x`/`y` and size `w`/`h` as fractions of the image (0–1). Adjust and reload; re-running the prepare script keeps your print boxes. `warp` controls how much folds bend the print.
