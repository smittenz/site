**Source visual truth**

- `D:\assets\website\drafting\exec-b45987a0-79fc-4500-9181-3cb4dbc7c37f.png`
- The source is used as the organism geometry and palette reference, not as a full-page UI reference.

**Implementation evidence**

- Screenshot: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\design-qa-implementation.png`
- Side-by-side comparison: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\design-qa-comparison.png`
- Viewport: 1280 × 720
- State: Home map, no project selected
- Primary interaction tested: Digital Work node opens the zoomed project drawer and exposes previous, next, return, and project-entry controls.
- Console errors: none.

**Full-view comparison evidence**

- The implementation preserves the reference organism's silhouette, circuit paths, terminal dots, and left-to-right proportions.
- The opaque colored fill is removed. Color is represented by a live particle array beneath a separate black linework layer.
- The site intentionally scales the organism within its existing map frame and retains the five interactive portfolio nodes.

**Focused region comparison evidence**

- A separate crop was not needed because the organism occupies most of both comparison frames and the line, node, and particle separation is legible at full-view resolution.

**Findings**

- Fonts and typography: existing site typography is unchanged and remains visually separate from the supplied organism asset.
- Spacing and layout rhythm: organism proportions align with the source and fit the interactive map without clipping the main body.
- Colors and visual tokens: particle colors retain the source's coral, blue, mint, and yellow accents on white.
- Image quality and asset fidelity: the supplied raster is used directly as the sampling source; black linework is extracted at runtime rather than approximated.
- Copy and content: existing portfolio labels and project-node content are preserved.
- No remaining P0, P1, or P2 issues.

**Comparison history**

1. Earlier finding: [P1] transparent source pixels were incorrectly promoted to opaque black, creating a large black rectangle and reversing the apparent organism silhouette.
2. Fix made: linework alpha now multiplies the extracted threshold by the PNG's original alpha channel.
3. Post-fix evidence: `design-qa-implementation.png` and `design-qa-comparison.png` show a white background, black circuit overlay, and colored particle-only fill.

**Implementation checklist**

- [x] Use the supplied organism source.
- [x] Render color only as animated particles.
- [x] Render black circuit and terminal geometry above the particles.
- [x] Preserve zoom, project drawer, paging, drag, and keyboard behavior.
- [x] Verify the production build and browser console.

**Follow-up polish**

- Particle density and motion amplitude can be tuned further as a P3 visual preference.

final result: passed

# Design QA: Node Signal Hover Windows

**Source visual truth**

- Primary component reference: `C:\Users\sophi\AppData\Local\Temp\codex-clipboard-889fa5ec-7be4-46d2-b3cb-502dcbfb0b0d.png`
- Secondary style board: `https://www.pinterest.com/skatsive/portfolio-website/`
- The annotated screenshot defines the offset rectangular monitor and right-angle line from the node. The Pinterest board supplies the scientific-interface, biotech, glitch, bitmap, and dark terminal-chrome direction.

**Implementation evidence**

- Screenshot: `C:\Users\sophi\AppData\Local\Temp\soph-node-signal-hover-final.png`
- Full comparison: `C:\Users\sophi\AppData\Local\Temp\soph-node-signal-full-comparison-final.png`
- Focused comparison: `C:\Users\sophi\AppData\Local\Temp\soph-node-signal-focused-comparison-final.png`
- Desktop viewport: 1280 × 720
- Desktop state: Digital Work node hovered, monitor fully revealed
- Mobile viewport: 390 × 844
- Mobile state: rotated vertical map with keyboard/focus-equivalent monitor visible
- Primary interactions tested: hover/focus monitor reveal, mirrored left/right placement, click-to-open full project preview, Return to Map, and hidden monitor while full preview is selected.
- Runtime check: no Vite/React error overlay appeared, the generated bitmap loaded successfully, and the production build completed. Direct console-message collection was not exposed by the selected in-app browser surface.

**Full-view comparison evidence**

- The implementation keeps the supplied organism, node placement, white canvas, and existing site chrome unchanged.
- The monitor follows the annotated source composition: a long black right-angle line grows out of the node and terminates at a compact offset rectangle.
- The implementation intentionally adds denser terminal chrome, project identification, coordinates, and live-signal copy because the user requested a more graph-like, codey, cyber interface than the simple green reference block.

**Focused region comparison evidence**

- `soph-node-signal-focused-comparison-final.png` places the annotated target and rendered Digital Work monitor in one image at comparable scale.
- Both use a hard black rectangular frame, upper offset placement, a visible L-shaped node connection, and green/blue bitmap texture.
- The rendered monitor is slightly larger than the literal green block to keep project identity and data readable; this is an intentional functional expansion, not uncontrolled layout drift.

**Findings**

- Fonts and typography: compact Courier terminal text matches the site's existing monospaced system; node identity and status remain legible without competing with the diagram.
- Spacing and layout rhythm: the final desktop window is 232 × 158 with a 62px vertical connector. It reads as a small satellite window and does not create document overflow.
- Colors and visual tokens: black, white, fog, yellow, green, cyan, and blue map directly to the established Section 1 palette.
- Image quality and asset fidelity: the monitor uses the existing project thumbnail plus the real generated raster `public/assets/node-signal-bitmap.png`; the dither and graph texture are not approximated with CSS art.
- Copy and content: each window exposes its existing node number and project title plus accurate X/Y node coordinates and live/open-signal states.
- Accessibility and motion: hover and focus-visible share the same state, reduced-motion removes stepped/jitter/scan animations, and the full preview remains reachable by click.
- Responsiveness: at 390 × 844 the monitor is 168 × 127, ends at x=383.2, and has no clipping or horizontal overflow.
- No remaining P0, P1, or P2 issues.

**Comparison history**

1. [P2] First desktop pass was oversized at 258 × 179 compared with the compact annotated block.
   - Fix: reduced the final window to 232 × 158 and lengthened the vertical connector to 62px so the component feels smaller while preserving the source's strong node-to-window relationship.
   - Post-fix evidence: `soph-node-signal-full-comparison-final.png` and `soph-node-signal-focused-comparison-final.png`.
2. [P2] First mobile pass ended at x=395.2 in a 390px viewport, clipping the cyan hard shadow by roughly five pixels.
   - Fix: reduced the mobile monitor to 168px and moved its offset inward.
   - Post-fix evidence: final measured bounds x=215.2–383.2 with no clipping.

**Implementation checklist**

- [x] Use a real bitmap/dither texture asset.
- [x] Preserve the project thumbnail inside the monitor.
- [x] Build a terminal header, project row, graph field, and coordinate readout.
- [x] Animate the right-angle connector before the stepped window reveal.
- [x] Add scan and restrained bitmap jitter with reduced-motion support.
- [x] Mirror left/right window placement from the node data.
- [x] Verify desktop, mobile, click-through, full-preview, and production-build behavior.

**Follow-up polish**

- P3: bitmap density and project-image blend can be tuned per project if individual thumbnails need more subject visibility.

final result: passed

---

# Design QA: Clear Signal Preview + Node Decode

**Source visual truth**

- Primary direction: the user's feedback that the hover overlay obscured the project and that clicking a node should produce a clearer, vibe-matched transition into the full preview.
- Previous hover implementation: `C:\Users\sophi\AppData\Local\Temp\soph-node-signal-hover-final.png`.

**Implementation evidence**

- Clear hover monitor: `C:\Users\sophi\AppData\Local\Temp\soph-node-hover-clear.png`.
- Click transition state: `C:\Users\sophi\AppData\Local\Temp\soph-node-click-transition.png`.
- Settled full preview: `C:\Users\sophi\AppData\Local\Temp\soph-node-click-settled.png`.
- Settled mobile preview: `C:\Users\sophi\AppData\Local\Temp\soph-node-clear-mobile.png`.
- Desktop state verified in the local app; mobile state verified in a 390 × 844 frame.

**Focused comparison evidence**

- The old hover treatment blended the bitmap over the whole project photograph. The revised monitor renders the photograph at opacity `1` with no blend mode, then puts the raster signal in its own 22px data strip below it.
- Clicking a node now triggers a stepped node burst, panel signal lock, scan line, and temporary decode readout. The sequence ends with opacity `1`, `clip-path: inset(0)`, identity transform, and no image filter.

**Findings**

- Image clarity: the Digital Work subject is immediately recognizable in the hover card and fully clear after the click transition settles.
- Visual continuity: the bitmap, terminal strip, cyan/yellow scan line, and stepped timing retain the cyber-biological signal-monitor direction without covering the project image.
- Interaction causality: the node burst and panel lock make the selected point feel like it transmits the image into the preview sheet.
- Responsiveness: the compact mobile preview remains upright inside the vertical map layout, with a clear 18vh image and no visible horizontal clipping.
- Accessibility and motion: the status strip is decorative, the project image keeps its descriptive alt text, and reduced-motion mode skips the burst/decode effects and shows the clean final image immediately.
- Production build: passed with 35 transformed modules and no compile errors.
- No remaining P0, P1, or P2 issues.

**Comparison history**

1. [P2] The bitmap overlay made the hover photograph harder to identify.
   - Fix: separated the photograph and bitmap into a 74px clear image region plus a 22px signal strip; removed grayscale, opacity reduction, and multiply blending from the photograph.
2. [P2] Clicking a node had no visible transmission from the selected point into the full preview.
   - Fix: added a short node burst, stepped panel lock, scan/decode status, and an image reveal that resolves to an unfiltered frame.

**Implementation checklist**

- [x] Remove the bitmap overlay from the project photograph.
- [x] Keep a real bitmap texture in a separate signal strip.
- [x] Add a node-to-panel click transition.
- [x] Resolve the transition to a clean, unfiltered full image.
- [x] Preserve the existing project routes, node placement, header/footer behavior, and preview controls.
- [x] Verify desktop, mobile, reduced-motion behavior, and the production build.

final result: passed

---

# Design QA: Expanded Preview Signal Connection

**Source visual truth**

- Current selected-state implementation before this refinement: `C:\Users\sophi\AppData\Local\Temp\soph-expanded-preview-source.png`.
- User direction: keep the active node visibly connected to the expanded project preview.

**Implementation evidence**

- Final desktop state: `C:\Users\sophi\AppData\Local\Temp\soph-expanded-preview-connected-final.png`.
- Right-side node coverage: `C:\Users\sophi\AppData\Local\Temp\soph-expanded-preview-about-connected.png`.
- Mobile state at 390 × 844: `C:\Users\sophi\AppData\Local\Temp\soph-expanded-preview-mobile-connected.png`.
- Full before/after comparison: `C:\Users\sophi\AppData\Local\Temp\soph-expanded-preview-connector-comparison.png`.

**Full-view comparison evidence**

- The comparison preserves the expanded panel width, typography, clear image, pager, route action, diagram scale, and palette.
- The selected point now docks at a consistent visible position, and a black right-angle trace reaches the preview edge at the image's vertical center.
- The trace draws in with the existing stepped decode timing; a small cyan signal packet continues moving along the settled line.

**Focused region comparison evidence**

- In the source image, the organism's local branch line stops before the panel boundary. In the final image, the dedicated connector begins at the selected node's outer edge and terminates exactly at the panel boundary.
- Right-side nodes previously fell underneath the panel. The final About + Contact capture proves that a right-side node is moved to the shared visible signal dock before the connector is measured.
- On mobile, the active node remains upright and centered above the bottom sheet; a short vertical trace reaches the sheet's colored top border without crossing the project image or controls.

**Findings**

- Fonts and typography: unchanged from the approved expanded preview.
- Spacing and layout rhythm: the desktop elbow uses the open diagram area and enters the panel at the image center; the mobile line uses the short gap between the node and sheet.
- Colors and visual tokens: black is the structural trace and cyan is the animated signal, both from the established Section 1 palette.
- Image quality and asset fidelity: project imagery remains crisp and unobstructed; the connector never overlays the photograph.
- Copy and content: all selected project labels, metadata, paging copy, and actions remain unchanged.
- Responsiveness and accessibility: all seven nodes share the same visible docking behavior; the SVG trace is decorative and hidden from assistive technology; reduced-motion mode shows the completed black line immediately and removes the moving cyan packet.
- No remaining P0, P1, or P2 issues.

**Comparison history**

1. [P2] The initial connector worked for left-side nodes, but right-side nodes could remain underneath the expanded panel, leaving no visible source point.
   - Fix: moved every selected node to a consistent desktop and mobile signal dock before measuring the connector path.
   - Post-fix evidence: `soph-expanded-preview-about-connected.png` and `soph-expanded-preview-mobile-connected.png`.

**Implementation checklist**

- [x] Draw a persistent node-to-preview trace on desktop.
- [x] Animate the trace with the existing stepped decode sequence.
- [x] Keep every selected node visible before drawing the connection.
- [x] Use a vertical connection into the mobile bottom sheet.
- [x] Preserve image clarity, paging, dragging, keyboard navigation, routes, and reduced-motion behavior.
- [x] Compare the source and final state together and verify the production build.

final result: passed

---

# Design QA: Single Connection + Bitmap Hover

**Source visual truth**

- Duplicate expanded connection state: `C:\Users\sophi\AppData\Local\Temp\soph-expanded-preview-connected-final.png`.
- Previous layered hover state: `C:\Users\sophi\AppData\Local\Temp\soph-node-hover-clear.png`.
- User direction: show only one connection line in expanded mode, and make hover previews a single bitmap image with a linear effect.

**Implementation evidence**

- Final expanded state: `C:\Users\sophi\AppData\Local\Temp\soph-expanded-preview-single-line.png`.
- Final hover state: `C:\Users\sophi\AppData\Local\Temp\soph-node-hover-bitmap-linear.png`.
- Combined full-view comparison: `C:\Users\sophi\AppData\Local\Temp\soph-single-line-bitmap-hover-comparison.png`.
- Desktop viewport: 861 × 893.

**Full-view comparison evidence**

- Expanded mode keeps the selected node docked but removes the second SVG trace; the organism's original right-angle branch is now the only visible connection into the panel.
- Hover mode removes the separate bitmap-strip image. The monitor now contains one project-specific image rendered at half resolution and scaled with pixelated sampling, plus one linear scan.

**Focused region comparison evidence**

- The top comparison row shows the second, higher elbow removed while the original lower branch still reaches the preview boundary.
- The bottom comparison row shows the former clear-photo-plus-texture-strip anatomy replaced by one continuous bitmap project frame. The vertical black/cyan/yellow scan line is the only overlay effect.

**Findings**

- Fonts and typography: terminal chrome, project label, coordinate row, and status copy are unchanged.
- Spacing and layout rhythm: monitor and expanded-panel dimensions are unchanged; no content shifts or new overflow were introduced.
- Colors and visual tokens: the scan uses black, cyan, and yellow from the Section 1 palette; the project image keeps its own color.
- Image quality and asset fidelity: hover uses the real project image with browser pixelated sampling, not a second generic texture asset; expanded imagery remains crisp and unfiltered.
- Copy and content: unchanged.
- Interaction and accessibility: hover/focus share the bitmap reveal, the scan is decorative, selected-state paging and routes still work, and reduced-motion mode removes the reveal/scan animation.
- Runtime evidence: the hover visual contains exactly one image, expanded mode contains zero connector-overlay SVGs, and there is no horizontal overflow.
- No remaining P0, P1, or P2 issues.

**Comparison history**

1. [P2] The added expanded connector sat beside the organism's original branch, creating two visible right-angle lines.
   - Fix: removed the measured SVG connector and retained the selected-node docking so the original organism branch reaches the panel by itself.
   - Post-fix evidence: `soph-expanded-preview-single-line.png`.
2. [P2] The hover preview combined a normal project photograph with a separate bitmap strip, which read as an odd layered overlay.
   - Fix: removed the second image and rendered the project itself as the bitmap surface with one stepped linear reveal and scanning line.
   - Post-fix evidence: `soph-node-hover-bitmap-linear.png`.

**Implementation checklist**

- [x] Remove the duplicate expanded connector overlay.
- [x] Preserve one original organism-to-panel connection.
- [x] Use exactly one project image in each hover monitor.
- [x] Pixelate the hover image without layering a texture asset.
- [x] Keep one linear reveal/scan effect with reduced-motion support.
- [x] Verify the production build and compare before/after states together.

final result: passed

---

# Design QA: Stable Aligned Connector Animation

**Source visual truth**

- Prior static single-connection state: `C:\Users\sophi\AppData\Local\Temp\soph-expanded-preview-single-line.png`.
- User direction: restore the preferred animated connector while making it connect reliably across every selected node.

**Implementation evidence**

- Digital Work transition: `C:\Users\sophi\AppData\Local\Temp\soph-aligned-connector-transition.png`.
- Digital Work settled state: `C:\Users\sophi\AppData\Local\Temp\soph-aligned-connector-review.png`.
- Project Archive settled state after paging: `C:\Users\sophi\AppData\Local\Temp\soph-aligned-connector-stable.png`.
- Mobile Physical Work state at 390 × 844: `C:\Users\sophi\AppData\Local\Temp\soph-aligned-connector-mobile.png`.
- Static before/after comparison: `C:\Users\sophi\AppData\Local\Temp\soph-aligned-connector-comparison.png`.

**Full-view comparison evidence**

- The settled desktop composition is intentionally unchanged from the approved single-line state: selected-node dock, panel dimensions, diagram crop, typography, and image remain identical.
- The restored trace sits directly on the node's existing horizontal circuit direction, so it adds motion without adding a second offset elbow.

**Focused region comparison evidence**

- The transition capture shows the black trace drawing from the selected node toward the panel, followed by a cyan/yellow signal packet.
- Project Archive proves the horizontal trace remains complete after paging to a distant node.
- Mobile Physical Work proves the same connection becomes a short vertical trace into the bottom sheet and remains complete after paging.

**Findings**

- Fonts and typography: unchanged.
- Spacing and layout rhythm: unchanged; the trace occupies the existing node-to-panel gap.
- Colors and visual tokens: black structural line with cyan signal and yellow glow uses the established Section 1 palette.
- Image quality and asset fidelity: project images remain crisp in expanded mode and the bitmap-only hover treatment is unchanged.
- Copy and content: unchanged.
- Interaction and accessibility: the connector is decorative and hidden from assistive technology; reduced-motion mode displays the completed black connection immediately and suppresses the moving packet.
- Runtime evidence: the completed path reaches the panel boundary, the draw animation finishes with zero dash offset, and no horizontal overflow occurs.
- No remaining P0, P1, or P2 issues.

**Comparison history**

1. [P2] The non-animated organism branch did not read as a reliable connection for every selected node.
   - Fix: restored a measured connector aligned to the selected node's horizontal circuit direction on desktop and vertical direction on mobile.
2. [P2] Paging restarted the draw animation when the map's travel class cleared, briefly returning the connector to a partial state.
   - Fix: keyed the animated connector only to the selected node, so it animates once per selection and remains fully drawn after map motion ends.
   - Post-fix evidence: `soph-aligned-connector-stable.png` and `soph-aligned-connector-mobile.png`.

**Implementation checklist**

- [x] Restore the animated connection.
- [x] Align it with the existing circuit direction instead of adding an offset elbow.
- [x] Keep every selected node docked and measurable.
- [x] Prevent paging from restarting the completed line.
- [x] Preserve mobile vertical behavior and reduced-motion behavior.
- [x] Verify multiple nodes, mobile paging, production build, and combined visual comparison.

final result: passed

---

# Design QA: Line-Free Zoomed Preview

**Source visual truth**

- Zoomed state with the lingering hover connector: `C:\Users\sophi\AppData\Local\Temp\soph-zoomed-no-connectors.png`.
- User direction: remove connector lines entirely while zoomed into an expanded preview.

**Implementation evidence**

- Final zoomed state: `C:\Users\sophi\AppData\Local\Temp\soph-zoomed-no-lines-final.png`.
- Same-viewport comparison: `C:\Users\sophi\AppData\Local\Temp\soph-zoomed-no-lines-comparison.png`.
- Desktop viewport: 1024 × 768.

**Full-view comparison evidence**

- The right-angle hover connector visible between the selected node and panel in the source is completely absent in the final state.
- The selected node, organism crop, panel layout, clear image, typography, pager, action, and palette remain unchanged.

**Focused region comparison evidence**

- The comparison centers the node-to-panel gap at identical scale. The source shows a thick black vertical/horizontal connector; the final shows only the organism artwork and white gap.
- No separate SVG connector paths exist in the final DOM, and the hover/focus connector pseudo-element computes to opacity `0` with no animation while zoomed.

**Findings**

- Fonts and typography: unchanged.
- Spacing and layout rhythm: unchanged.
- Colors and visual tokens: unchanged.
- Image quality and asset fidelity: expanded project image remains crisp and unfiltered.
- Copy and content: unchanged.
- Interaction and accessibility: node/panel decode animation, paging, dragging, keyboard controls, routes, and reduced-motion behavior remain intact; only connector-line rendering is removed in the zoomed state.
- Runtime evidence: zero zoomed connector SVGs, hidden hover connector pseudo-element, and no horizontal overflow.
- No remaining P0, P1, or P2 issues.

**Comparison history**

1. [P2] Removing the explicit SVG trace still left the hover connector visible when the selected node remained under the pointer.
   - Fix: added a zoomed-state override that suppresses the hover/focus connector pseudo-element regardless of hover state or source-order precedence.
   - Post-fix evidence: `soph-zoomed-no-lines-final.png` and `soph-zoomed-no-lines-comparison.png`.

**Implementation checklist**

- [x] Remove the explicit animated connector implementation.
- [x] Suppress the hover/focus connector while zoomed.
- [x] Preserve the selected-node and expanded-panel animations.
- [x] Preserve the bitmap-only hover preview outside zoomed mode.
- [x] Verify the line-free state under the pointer and compare it at the same viewport.
- [x] Verify the production build.

final result: passed

---

# Design QA: Minimal Command Header

**Source visual truth**

- Supplied header reference: `C:\Users\sophi\AppData\Local\Temp\codex-clipboard-dc144d17-876b-4467-8319-906e210453f0.png`.
- User direction: keep the header extremely minimal and digital, make INDEX the dropdown control, and contain search inside it.

**Implementation evidence**

- Closed desktop state: `C:\Users\sophi\AppData\Local\Temp\soph-header-closed.png`.
- Open desktop index: `C:\Users\sophi\AppData\Local\Temp\soph-header-open.png`.
- Open mobile index at 390 x 844: `C:\Users\sophi\AppData\Local\Temp\soph-header-mobile-open.png`.
- Desktop test viewport: 861 x 912.

**Full-view comparison evidence**

- The implementation matches the reference's floating composition: a mixed-case prompt wordmark at the upper left and a single compact yellow navigation control at the upper right, with no center information block or header rule.
- The map remains the dominant visual and the open panel stays confined to the upper-right corner.

**Focused region comparison evidence**

- The wordmark uses the same `>Soph Katsivelos` command-line motif and quiet sans-serif scale as the reference.
- The yellow panel preserves the reference's small terminal character while adding the requested inline search field, compact system status, and numbered HOME / ARCHIVE / ABOUT links.

**Findings**

- Fonts and typography: clean mixed-case Arial wordmark paired with compact monospaced terminal controls.
- Spacing and layout rhythm: the transparent 94px desktop header and 74px mobile header float above the diagram without shifting or clipping the controls.
- Colors and visual tokens: the INDEX terminal keeps a white fill and uses Section 1 yellow only for hover states, alongside the established black, blue, cyan, green, and fog accents.
- Node interaction color: hover, keyboard focus, and selected nodes keep a white fill while the signal ring and core switch to Section 1 yellow.
- Image quality and asset fidelity: the diagram artwork and node imagery are unchanged.
- Copy and content: SEARCH and primary navigation are consolidated into the INDEX panel; no duplicate navigation surface remains.
- Interaction and accessibility: semantic button, search form, navigation landmark, focus styles, live result count, first-result submit behavior, and reduced-motion handling are present.
- Runtime evidence: `witches` returns the Witches' Flight 3D result on desktop and mobile; the dropdown stays fully within both viewports; document width remains 390px on mobile; no horizontal or vertical overflow appears on desktop.
- No remaining P0, P1, or P2 issues.

**Implementation checklist**

- [x] Replace the heavy header bar with a floating command-style header.
- [x] Use the supplied prompt wordmark treatment.
- [x] Consolidate navigation and search into one INDEX dropdown.
- [x] Keep the dropdown compact, digital, and palette-aligned.
- [x] Verify search results and layout bounds on desktop and mobile.
- [x] Verify the yellow node interaction state preserves a white fill and black border.
- [x] Compare the source reference and final implementation together.
- [x] Verify the production build.

final result: passed

---

# Content QA: Complete Original-Site Media Sync

**Scope**

- Current source audit: `C:\tmp\source-projects-current.json`.
- Included: all 19 Digital, Physical, and Client project routes from the original portfolio.
- Excluded by user direction: Digital Sociology Study.

**Inventory evidence**

- 19/19 project records retain the complete source text-block count.
- 85/85 unique source gallery images are mapped to local assets, with canonical full-size files preferred over Squarespace preview variants.
- 16/16 source iframes are restored across 11 routes.
- Small Scale Work includes all five source embeds; Aippy includes both source video embeds.
- All three locally hosted project videos include their original poster imagery.
- 28 source project/tool links are restored across applicable pages.
- Asset validation reports zero missing local image, poster, or video files.

**Implementation checklist**

- [x] Preserve the homepage and Digital Sociology content without bulk changes.
- [x] Restore YouTube, Vimeo, Vectary, and interactive-web iframes.
- [x] Restore project links with safe external-link behavior.
- [x] Render every local video, its poster, and any additional audio/video records.
- [x] Prefer full canonical images over preview-sized variants.
- [x] Use responsive two-column embeds on desktop and one column on mobile.
- [x] Verify inventory counts against the current original site audit.
- [x] Verify the production build.

final result: passed
