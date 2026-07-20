# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Durable design direction

- The portfolio home page uses the supplied siphonophore circuit diagram as an exploratory, clickable navigation map.
- Keep the background white and the visual language digital/editorial.
- Use the supplied Section 1 palette exactly for principal surfaces and accents: coral `#ec7064`, blue `#688cf5`, cyan `#69d5d5`, white `#ffffff`, green `#70c35e`, fog `#e8ecea`, yellow `#f1ea45`, and black `#000000`.
- Place all seven home-page nodes on the user-annotated diagram targets. Keep node coordinates percentage-based and use the personal `place-map-nodes` skill when recalibrating them from screenshots.
- On portrait mobile, center the full home-page map as a vertical 90-degree composition while keeping node labels, tap targets, and the selected-project sheet upright.
- Treat home-page node previews as animated digital signal windows, with a visible line connecting each preview to its map point.
- Hide the home-page header and footer while a node's full preview is open so the zoomed map and preview sheet use the full viewport.
- Style hover/focus node previews as compact cyber-biological signal monitors: right-angle connector, dark terminal chrome, scientific graph cues, real bitmap/dither textures, and a stepped reveal that appears to transmit outward from the node.
- Render hover/focus project previews as one project-specific pixelated bitmap image with a single linear reveal/scan effect; do not layer a second texture image over or beneath it.
- On node selection, use a short digital transmission/decode animation that resolves to a clean, unfiltered full-preview image.
- Do not draw connector lines in the zoomed-in expanded-preview state; keep the selected node docked and let the node/panel decode animation carry the transition.
- Explicitly suppress the hover/focus connector pseudo-element while zoomed, including when the selected node remains under the pointer.
