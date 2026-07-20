# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Durable design direction

- The portfolio home page uses the supplied siphonophore circuit diagram as an exploratory, clickable navigation map.
- Keep the visual language cyber-biological, research-oriented, experimental, and editorial: part living archive, part scientific interface.
- Pair organic specimens, natural textures, and bodily forms with precise grids, diagrams, bitmap/dither treatments, terminal metadata, tracking marks, and restrained technical chrome.
- Avoid generic portfolio/SaaS styling, glossy gradients, soft rounded-card systems, gamer-style neon cyberpunk, or decoration that feels disconnected from the work.
- Use the supplied palette exactly for principal surfaces and accents: fog `#e8ecea`, coral `#f56861`, blue `#5b8ef7`, green `#68c45b`, yellow `#f5e93a`, white `#ffffff`, and black `#000000`.
- Keep white as the primary background, fog as the soft secondary surface, and black for typography, controls, icons, and terminal chrome. Use saturated colors as deliberate signals and focal accents rather than showing the whole palette at equal intensity.
- Place all seven home-page nodes on the user-annotated diagram targets. Keep node coordinates percentage-based and use the personal `place-map-nodes` skill when recalibrating them from screenshots.
- On portrait mobile, center the full home-page map as a vertical 90-degree composition while keeping node labels, tap targets, and the selected-project sheet upright.
- Treat home-page node previews as animated digital signal windows, with a visible line connecting each preview to its map point.
- Hide the home-page header and footer while a node's full preview is open so the zoomed map and preview sheet use the full viewport.
- Style hover/focus node previews as compact cyber-biological signal monitors: right-angle connector, dark terminal chrome, scientific graph cues, real bitmap/dither textures, and a stepped reveal that appears to transmit outward from the node.
- Render hover/focus project previews as one project-specific pixelated bitmap image with a single linear reveal/scan effect; do not layer a second texture image over or beneath it.
- On node selection, use a short digital transmission/decode animation that resolves to a clean, unfiltered full-preview image.
- Do not draw connector lines in the zoomed-in expanded-preview state; keep the selected node docked and let the node/panel decode animation carry the transition.
- Explicitly suppress the hover/focus connector pseudo-element while zoomed, including when the selected node remains under the pointer.
- Keep the home header minimal and floating like a command interface: mixed-case `>Soph Katsivelos` wordmark at left, one compact `INDEX +` control at right, and put both search and primary navigation inside its white terminal dropdown; reserve yellow for hover states.
- Keep map-node fills white in hover, focus, and selected states; use the Section 1 yellow as the signal ring/core accent instead of filling the whole node.

## Motion direction

- Use the [portfolio website Pinterest board](https://www.pinterest.com/skatsive/portfolio-website/) as the primary motion and atmosphere reference. Treat it as a pattern library to interpret, not a source to clone one-to-one.
- Motion should feel like information being located, sampled, transmitted, decoded, and archived. Favor cascading windows, stepped reveals, scan lines, tracking frames, pixel/bitmap resolves, clipped wipes, and brief signal distortion.
- Make motion interaction-led: cursor proximity, hover, focus, selection, scrolling, and taps should cause the system to respond. Avoid unrelated ambient spectacle or constant animation competing with the portfolio work.
- Build transitions in clear stages: identify the target, transmit or decode, then resolve to a clean and readable state. Use one dominant motion idea per interaction instead of stacking several effects.
- Keep micro-interactions crisp and short, and let larger map or panel transitions take slightly longer. Prefer stepped or decisive ease-out timing over bouncy springs and generic fades.
- Use depth sparingly through overlapping panels, crop changes, and subtle parallax; preserve the flat editorial grid and do not turn the interface into a cinematic 3D scene.
- Keep text, navigation, and project imagery legible throughout every transition. Continuous loops must be subtle, low-frequency, and paused when off-screen or obscured.
- Provide equivalent tap behavior on touch devices and honor `prefers-reduced-motion` by replacing scans, glitches, parallax, and multi-stage transforms with immediate state changes or short opacity transitions.
