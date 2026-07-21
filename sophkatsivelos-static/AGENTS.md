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
- Place all eight home-page nodes on deliberate black-dot targets in the diagram. Keep node coordinates percentage-based and use the personal `place-map-nodes` skill when recalibrating them from screenshots.
- Map the eight home-page targets to Decay, Deficit, Digital Sociology Study, Stories on Skin, Merimnao, Biotic Gallery, Witches' Flight 3D, and MCAD × Ellwas. Keep Digital Sociology Study on the central target and slightly larger than the other map nodes; keep MCAD × Ellwas on the prominent lower-left loop target at `13.4%, 75.5%`.
- Keep a concise on-map blurb instructing visitors to click or tap the flashing project nodes. Let each node flash and pulse until it has been opened during the session, with Digital Sociology Study acting as the strongest central beacon.
- On portrait mobile, center the full home-page map as a vertical 90-degree composition while keeping node labels, tap targets, and the selected-project sheet upright.
- Keep the Witches' Flight 3D project minimal and image-first: use the supplied aligned 2:3 frames of the Goya painting, finished 3D render, and Maya wireframe, auto-cycling each resolved image for three seconds before a restrained digital bitmap crossfade.
- Keep the Witches' Flight sequence on a light editorial stage; confine black to the artwork itself and small active controls rather than spanning the full page width.
- Keep the Decay project centered on the supplied crumbleable Castle Williams STL rendered as a physics-based point cloud from an elevated three-quarter angle: preserve its disconnected geometry shells as coherent falling fragments that shake and progressively tumble apart unless the visitor actively presses and holds. Hover or focus alone must not stabilize it; releasing the pointer, touch, Space, or Enter resumes collapse.
- On Decay's opening frame, make its physical-installation status unmistakable with an exhibition-view photograph and the material/system description; the 3D interaction is an interpretation of the attached physical work, not a replacement for its documentation.
- Keep Merimnao grounded in the supplied black-and-white halftone body bitmap as a fixed black page background. Let it show through the video signal and translucent white editorial panels; do not tint the bitmap green.
- Present Merimnao's three game stills in one large auto-cycling signal window with previous/next controls and a visible counter; do not return them to a multi-card grid.
- Make the Witches' Flight transition visibly chunky and bitmap-like, using an opaque stepped pixel-block wipe and a hard frame swap with no actual opacity fade or dissolve.
- Use green, not cyan, for the Witches' Flight transition and active-sequence effects.
- Frame the Witches' Flight changing image with restrained digital chrome, green registration marks, and compact signal metadata without reducing or recropping the aligned 2:3 artwork.
- Treat home-page node previews as animated digital signal windows, with a visible line connecting each preview to its map point.
- Hide the home-page header and footer while a node's full preview is open so the zoomed map and preview sheet use the full viewport.
- Style hover/focus node previews as compact cyber-biological signal monitors: right-angle connector, dark terminal chrome, scientific graph cues, real bitmap/dither textures, and a stepped reveal that appears to transmit outward from the node.
- Render hover/focus project previews as one project-specific pixelated bitmap image with a single linear reveal/scan effect; do not layer a second texture image over or beneath it.
- On node selection, use a short digital transmission/decode animation that resolves to a clean, unfiltered full-preview image.
- Do not draw connector lines in the zoomed-in expanded-preview state; keep the selected node docked and let the node/panel decode animation carry the transition.
- Explicitly suppress the hover/focus connector pseudo-element while zoomed, including when the selected node remains under the pointer.
- Keep one global header on every route, styled as the minimal floating command interface from the homepage: mixed-case `>Sophie Katsivelos` wordmark at left, one compact `INDEX +` control at right, and both search and primary navigation inside its white terminal dropdown; reserve yellow for hover states. The homepage may hide this shared header only while its expanded node preview is open.
- Keep map-node fills white in hover, focus, and selected states; use the Section 1 yellow as the signal ring/core accent instead of filling the whole node.
- Keep expanded node-preview panels flat and quiet: no gradient trim along the panel edge and no grid texture behind the content.
- Treat the Biotic Gallery project as its own six-node specimen map using the supplied `Background.png` as the base image with a transparent SVG network layered directly above it. Do not show environment-frame previews or an environment-frame archive. Keep the six interactive dots black by default and connect them with black paths in the SVG overlay.
- Keep the archive ordered alphabetically by project title and make the global `INDEX +` control visibly larger than the surrounding terminal metadata on both desktop and mobile.
- Treat the Archive route as a vertical mounted drive: project links behave like selectable folders that pull an interactive record preview into view, with a dedicated stacked open-record treatment on mobile.
- In the Archive drive, use each collection card's original thumbnail for the pulled record preview and use green digital-file icons for project rows.
- Render Archive record thumbnails as a high-resolution luminous green ASCII bitmap sampled from the original collection image on a black terminal field; keep the underlying thumbnail mapping intact.
- On Deficit, keep the central video signal window square to match the source embed. Credit every displayed peripheral 3D model to its original Sketchfab creator with a direct source link. Keep the Unreal Engine / Meta Quest program details in a compact web-style window in the opening section, and keep the lower documentation windows tightly stacked without excess negative space.
- Keep the Archive alphabetized by default, with explicit A–Z, newest-first, and oldest-first sort controls; undated entries remain last in either date order.
- For non–Digital Sociology project pages, preserve the original portfolio's complete media inventory: full-size gallery images, every local video and poster, external links, and all YouTube/Vimeo/interactive iframes. Leave Digital Sociology content out of bulk syncs unless the user explicitly includes it.
- Treat pages 63–103 of `MCAAD-Art-Direction.pdf` as the source of truth for Sophie's MCAD × Ellwas development story: point-to-fan/star light motion, alternate growth languages, dandelion selection and observation, density/movement/color variables, the four-pillar composite, terminal interaction, possible mobile handoff, and interface/environment applications. Explain that the exhibits, people, stories, milestones, and four themes visitors engaged with shaped the light. The physical museum terminal is the primary interaction; mobile is only a possible supporting extension. Preserve the live interactive bloom and existing resolved application media, begin the process directly with the five development chapters without a separate `From Search to System` overview block, place `Light in Motion` directly between `Finding a Language for Growth` and `Choosing the Dandelion`, keep its readout at `02 MOTION STUDIES`, show only the bloom GIF in that section, keep pages 75 and 80–83 together in one wide cycling composite-refinement frame, keep pages 87–90 together in a separate cycling terminal/mobile frame, keep only the three source-backed scale studies in the final application section, avoid repeated image sources, and do not add the unrelated Dana/OBS GIF treatment.

- Keep MCAD × Ellwas process and application images inspectable through the contained expanded-detail window: desktop hover/focus opens it, touch uses tap, Escape/outside click/its close control dismiss it, and carousel controls remain independently usable.

## Motion direction

- Use the [portfolio website Pinterest board](https://www.pinterest.com/skatsive/portfolio-website/) as the primary motion and atmosphere reference. Treat it as a pattern library to interpret, not a source to clone one-to-one.
- Motion should feel like information being located, sampled, transmitted, decoded, and archived. Favor cascading windows, stepped reveals, scan lines, tracking frames, pixel/bitmap resolves, clipped wipes, and brief signal distortion.
- Make motion interaction-led: cursor proximity, hover, focus, selection, scrolling, and taps should cause the system to respond. Avoid unrelated ambient spectacle or constant animation competing with the portfolio work.
- Build transitions in clear stages: identify the target, transmit or decode, then resolve to a clean and readable state. Use one dominant motion idea per interaction instead of stacking several effects.
- Keep micro-interactions crisp and short, and let larger map or panel transitions take slightly longer. Prefer stepped or decisive ease-out timing over bouncy springs and generic fades.
- Use depth sparingly through overlapping panels, crop changes, and subtle parallax; preserve the flat editorial grid and do not turn the interface into a cinematic 3D scene.
- Keep text, navigation, and project imagery legible throughout every transition. Continuous loops must be subtle, low-frequency, and paused when off-screen or obscured.
- Provide equivalent tap behavior on touch devices and honor `prefers-reduced-motion` by replacing scans, glitches, parallax, and multi-stage transforms with immediate state changes or short opacity transitions.
