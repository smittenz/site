---
name: build-blocky-digital-transitions
description: Build bold, art-directed blocky digital decode transitions for cycling images, galleries, carousels, and media swaps in web interfaces. Use when a user asks for a blocky, stepped, glitchy, transmitted, decoded, pixel-wipe, signal-scan, or cyber-editorial image transition that resolves to a clean final image.
---

# Build Blocky Digital Transitions

Create one short, decisive signal-decode between image states. Keep the final image clean and readable; animate only during the swap.

## Workflow

1. Inspect the existing image-swap mechanism, controls, pause behavior, and reduced-motion rules.
2. Reuse the existing carousel structure. Do not add a dependency for this effect.
3. Copy or adapt `assets/blocky-decode.css` and rename its generic selectors to match the project.
4. Ensure the animated wrapper remounts or receives a freshly toggled class on every automatic and manual image change. In React, a wrapper keyed by the active image source is usually sufficient.
5. Keep controls above the transition overlays and overlays non-interactive.
6. Verify automatic cycling, previous/next controls, touch layouts, keyboard controls, and `prefers-reduced-motion`.

## Art direction

- Use a 350–500 ms stepped transition with 5–7 frames.
- Start with a tight center reveal, high contrast, and reduced saturation; resolve to the untouched image.
- Pass one dominant blocky scan across the frame. A secondary color-block interference layer may add brief cyan, yellow, and coral signals.
- Use hard clips, stepped timing, right-angle blocks, and bitmap-like bands. Avoid blur, soft dissolves, spring motion, and continuous idle glitching.
- Let the image remain fully clean after the transition finishes.
- Keep overlays restrained enough that captions and controls stay legible.

## Performance and access

- Animate `opacity`, `transform`, `clip-path`, and short-lived filters only during the swap.
- Avoid JavaScript frame loops and large animated raster assets for this effect.
- Set overlay pseudo-elements to `pointer-events: none`.
- Remove all transition overlays and filters under `prefers-reduced-motion: reduce`.
- Prefer one remounted animated layer over stacking multiple persistent effects.

## Validation

- Confirm the effect replays for both timed and manual changes.
- Confirm the current image is sharp, unfiltered, and fully opaque after the animation.
- Confirm no horizontal overflow or control obstruction at mobile widths.
- Run the project's most relevant build or compilation check.
