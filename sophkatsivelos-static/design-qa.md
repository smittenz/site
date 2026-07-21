# Stories on Skin Design QA

- Source visual truth: `C:\Users\sophi\AppData\Local\Temp\codex-clipboard-4e7ba9ba-c43a-4f8d-a618-f595d4b2ad03.png`
- Source-matched implementation screenshot: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\stories-skin-qa-reference-viewport.png`
- Full-view comparison: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\stories-skin-design-comparison.png`
- Desktop screenshot: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\stories-skin-qa-desktop-top.png`
- Desktop open-preview screenshot: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\stories-skin-qa-hover.png`
- Mobile screenshot: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\stories-skin-qa-mobile.png`
- Mobile open-preview screenshot: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\stories-skin-qa-mobile-popup.png`
- Viewports: 686 x 845 source-matched view; 1440 x 1000 desktop; 390 x 844 mobile.
- States: default wall, selected/focused cast, cycling detail preview, Escape dismissal, mobile tap preview.

## Full-view comparison evidence

The source and implementation were placed side by side at 686 x 845 in `stories-skin-design-comparison.png`. The implementation preserves the source's core composition: an off-white wall, irregular unframed silicone casts arranged at gallery scale, a compact project statement near the top, a film window below the statement, and a long exploratory vertical field. The production site header remains intentionally present.

## Focused-region comparison evidence

- `stories-skin-qa-hover.png` verifies the anchored desktop detail window, installation photography, visible frame count, focus outline, edge-aware right placement, and zero horizontal overflow.
- `stories-skin-qa-mobile-popup.png` verifies the bottom-fixed touch preview remains within the 390 x 844 viewport with a 14 px gutter and no horizontal overflow.
- `stories-skin-qa-mobile.png` verifies that mobile uses a readable vertical sequence rather than shrinking the project statement beside the first cast.

## Required fidelity surfaces

- Fonts and typography: the reference's heavy sans-serif title and typewriter-like supporting copy are preserved with the project's Arial and Courier stacks. Mobile body copy is 10 px with 1.24 line height; no clipping or truncation was found.
- Spacing and layout rhythm: the five casts retain the reference's loose gallery-wall spacing. At 686 px, the film sits 93 px below the text card; at 390 px, it sits 146 px below it. No horizontal overflow was found.
- Colors and visual tokens: the warm off-white wall, black window chrome, and restrained blue/cyan/green system accents use the existing portfolio palette.
- Image quality and asset fidelity: five high-resolution, alpha-matted silicone cast assets are used as real raster imagery. The preview cycles through the project's installation photograph, scar macro, and existing wall documentation. No placeholder boxes, CSS-drawn artwork, or visible chroma-key fringe remains.
- Copy and content: the original project title, materials, description, date, and film are preserved. No personal scar stories were invented.

## Comparison history

1. Earlier finding: desktop preview opening was gated by a browser capability query that did not reflect the actual pointer. Fix: gate by `pointerType` so mouse and pen open on pointer enter while touch remains tap-driven. Post-fix evidence: click/focus opens the preview with `aria-expanded="true"` and the expected cast detail.
2. Earlier finding: focus followed by click could immediately close the same cast. Fix: activation now always opens the selected cast; outside click and Escape own dismissal. Post-fix evidence: mobile and desktop activation both keep the preview open.
3. Earlier finding: the first mobile layout reduced body copy to 7 px. Fix: stack the first cast, full-width statement, and film at <=520 px. Post-fix evidence: 10 px copy, no overflow, and the film begins below the statement.
4. Earlier finding: the 686 px source-matched layout was too sparse. Fix: add a 521-700 px gallery breakpoint with denser cast placement and a film position directly below the text. Post-fix evidence: the source-matched screenshot shows four casts and the film within the first viewport.

## Findings

No actionable P0, P1, or P2 differences remain. The implementation intentionally uses the live YouTube player and the portfolio's existing global header rather than the reference's gray video placeholder and editor chrome.

## Primary interactions and console

- Cast activation: passed.
- Four-frame timed cycle: passed; frame label and count advanced while open.
- Escape dismissal: passed; preview removed and `aria-expanded` returned to `false`.
- Mobile tap preview: passed and fully contained within the viewport.
- Responsive overflow: passed at 1440, 686, and 390 px widths.
- Browser console warnings/errors: none.

## Follow-up polish

P3: the generated silicone casts preserve the reference's forms and palette but naturally differ in small surface details from the low-resolution source screenshot.

final result: passed

## MCAD × Ellwas development story — 2026-07-21

- Source visual truth: user-authored pages 63–103 of `C:\Users\sophi\Downloads\MCAAD-Art-Direction.pdf` plus the supplied full-resolution page 63, 75, 80–83, and 87–90 JPGs.
- Desktop verification: 1440 × 900 in-app browser viewport.
- Mobile verification: 390 × 844 in-app browser viewport.
- Preserved interaction: the existing pointer-grown dandelion bloom, reset control, bloom GIF, and resolved application views.

### Narrative and fidelity checks

1. The process now reads as a six-stage sequence: form search; motion prototype; dandelion selection; density, movement, and color variables; four-pillar system construction; and terminal/possible-mobile interaction. Five stages carry explicit decision notes, while `Light in Motion` is a focused behavior interlude between the first two chapters.
2. Twenty source boards retain their original 16:9 composition and are captioned with their PDF page numbers. The five composite-refinement studies on pages 75 and 80–83 share one wide cycling frame; the four terminal/mobile studies on pages 87–90 share a second cycling frame. Three later boards separately document interface, timeline, and environmental scale.
3. Exploration boards are clearly separated from the resolved four-pillar specimen, motion prototypes, and final applications.
4. Desktop boards remain legible in two- and three-column arrangements. Mobile reflows every board into one column with no cropping or horizontal overflow.
5. Runtime checks found five story chapters, thirteen visible process frames representing twenty source boards, three scale studies, zero broken images, and zero horizontal overflow at 390 px.
6. The premise maps theme, content, engagement, and visit progress to component/color, composition, density/emphasis, and growth. The physical museum terminal is consistently identified as the core interaction; photo upload and QR retrieval are labeled as a possible mobile extension.
7. `Light in Motion` contains one bloom GIF, zero videos, and no repeated still-image fallback. A full DOM media audit found zero duplicate image sources.
8. Both the five-state composite-refinement carousel and four-state terminal/mobile carousel passed manual next/previous controls and advanced automatically every 3.4 seconds while visible. Each offers an explicit pause/resume control, also pauses on hover/focus, stops auto-advancing offscreen, announces its active board to assistive technology, and remains within the 390 px mobile viewport.
9. Process and application boards share an expanded-detail preview. Desktop focus/hover, Escape dismissal, the explicit close control, viewport clamping, zero horizontal overflow, and the responsive bottom-docked treatment were verified; carousel controls remain above the image hit area.
10. Production build passed. Vite's existing large-chunk advisory remains non-blocking.

### Findings

No actionable P0, P1, or P2 differences remain. One earlier hot-reload error referenced the removed pre-restructure array and did not recur after a clean page reload.

final result: passed

## Stories on Skin annotated reorganization and active color — 2026-07-21

- Source visual truth: `design-reference-stories-on-skin-reorg.png`.
- Desktop implementation: `design-qa-stories-on-skin-reorg-desktop.png` at 1154 x 945.
- Clicked-state evidence: `design-qa-stories-on-skin-green-active.png` with cast 05 expanded.
- Mobile implementation: `design-qa-stories-on-skin-reorg-mobile.png` at 390 x 844.
- Same-input comparison: `design-qa-comparison-stories-on-skin-reorg.png`.

### Full-view and focused comparison evidence

The side-by-side comparison places the annotated desktop source beside the revised live wall. Cast 02 now occupies the open upper space beside cast 01, the film has moved right beneath the statement, cast 04 remains at 40% wall height, and cast 05 remains at 58% wall height as the large lower anchor. The clicked-state capture focuses on cast 05 and verifies that its selection rectangle is green while its close-up window remains aligned beside it.

### Required fidelity surfaces

- Fonts and typography: the existing title, project statement, metadata, and film chrome are unchanged.
- Spacing and layout rhythm: the rearrangement follows the user's directional marks without introducing overlaps or horizontal overflow.
- Colors and visual tokens: active and keyboard-focus outlines now use the existing palette green (`rgb(112, 195, 94)`) instead of blue.
- Image quality and asset fidelity: all original cast artwork and dedicated close-up sequences remain in place; no assets were substituted.
- Copy and content: project copy, cast labels, film, counters, and interaction instructions remain unchanged.

### Comparison history

1. P2 annotated layout issue: cast 02 sat too low and the film was too far left. Fix: move cast 02 to 32% / 10% and the desktop film to 57% left, with the 940px breakpoint adjusted to 52%. Post-fix evidence: the desktop comparison shows the open top area filled and the film aligned to the right-hand zone.
2. P2 interaction-color issue: the selected cast rectangle was blue. Fix: apply the portfolio's existing green token to both active and focus-visible cast artwork. Post-fix evidence: the clicked-state and mobile captures show a 2px green outline.

### Primary interactions and verification

- Desktop cast 05 click and close-up window: passed.
- Mobile cast 01 click and close-up window: passed.
- Active outline color: `rgb(112, 195, 94)` at desktop and mobile.
- Responsive horizontal overflow: none at 1154 x 945 or 390 x 844.
- Escape dismissal: passed.
- Browser console warnings/errors: none.
- Production build: passed; the existing bundle-size advisory remains non-blocking.

### Findings

No actionable P0, P1, or P2 issues remain.

final result: passed

---

# Archive Drive Design QA

- Source visual truth: `C:\Users\sophi\AppData\Local\Temp\codex-clipboard-0eae867e-8c2c-4ae2-a586-d771e45af654.png`
- Implementation screenshot: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\archive-drive-qa-desktop-final.png`
- Mobile screenshot: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\archive-drive-qa-ascii-black-mobile.png`
- High-resolution ASCII and sorting screenshot: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\archive-drive-qa-ascii-sort-desktop.png`
- Full-view comparison: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\archive-drive-design-comparison.png`
- Viewports: 1440 x 1000 desktop; 390 x 844 mobile.
- States: default mounted drive, selected project file, category-filtered list, searched list, pulled record preview, and mobile stacked preview.

## Full-view comparison evidence

The supplied Windows file-explorer reference and the resolved desktop implementation are placed together in `archive-drive-design-comparison.png`. The implementation preserves the reference's compact vertical directory rows, file icon/name column, adjacent metadata columns, and clear selected-row behavior while translating the utility UI into the portfolio's white/fog/black technical system. The preview drawer is an intentional extension of the source idea and samples the exact collection-card thumbnail into a high-resolution green ASCII bitmap on black.

## Focused-region comparison evidence

A separate crop was not needed because the comparison enlarges the 534 x 268 source and keeps the implementation's directory rows, icons, metadata, and selected state legible. `archive-drive-qa-mobile-thumbnail-icon.png` additionally verifies the green code-file icon and original Biotic Gallery thumbnail in the compact stacked state.

## Required fidelity surfaces

- Fonts and typography: the source's compact utility text is represented with Courier metadata, while the archive title and file names use the site's existing heavy Arial hierarchy. Labels remain readable, selected file names do not wrap, and long names truncate only inside the list while remaining complete in the preview.
- Spacing and layout rhythm: desktop uses a three-part mounted drive with volumes, a scrollable vertical directory, and a pulled preview. Mobile converts volumes to a horizontal strip and stacks the preview below a bounded file list. No page-level horizontal overflow was found at either viewport.
- Colors and visual tokens: white, fog, and black remain the principal surfaces; yellow marks the selected file, green signals mounted/digital file state, coral indexes records, and blue remains restrained metadata.
- Image quality and asset fidelity: preview sources resolve from each original collection card's `image` field before any project-gallery fallback, then render through a responsive canvas as fine green ASCII glyphs on black. The African Bullfrog source matched `/assets/038-e54c4b68d41a.webp`, and the searched Biotic Gallery source matched `/assets/029-1611b531b438.png`.
- Copy and content: all 20 records remain alphabetized and retain their real title, category, year when available, object count, summary, and project route. Missing year metadata is labeled `N/D` rather than presented as a date.

## Comparison history

1. Earlier P2 finding: the first archive pass used each project's first gallery image rather than the collection-page thumbnail. Fix: prioritize the collection entry's original `image` field. Post-fix evidence: the live DOM and screenshots match the expected African Bullfrog and Biotic Gallery thumbnail asset paths.
2. User correction: the soft blue folder icons did not feel digital enough. Fix: replace project-row folders with Phosphor code-file icons and category folders with dashed digital folders, all using the portfolio green token. Post-fix evidence: computed icon color is `rgb(112, 195, 94)` and the code-file glyph is visible in both desktop and mobile screenshots.
3. Earlier P2 finding: Stories on Skin displayed the fallback word `ARCHIVE` beneath the `YEAR` heading. Fix: use `N/D` when no four-digit year is indexed. Post-fix evidence: the live row reports `N/D`.
4. Earlier mobile P2 finding: the file list kept the pulled preview too far below the initial viewport. Fix: bound the mobile list to 320 px so the record follows directly after a compact browsing surface. Post-fix evidence: the searched mobile state shows the selected row and preview together without horizontal overflow.
5. User correction: full-color thumbnails felt less integrated with the archive interface. Fix: sample every original thumbnail into a responsive high-resolution ASCII canvas using 3 x 4 px mobile cells and 4 x 5 px desktop cells. Post-fix evidence: desktop and mobile captures retain recognizable project imagery in luminous green on a black terminal field.
6. User request: date ordering needed both directions without losing the alphabetical baseline. Fix: add explicit A–Z, Newest, and Oldest controls. Post-fix evidence: newest begins with 2026 records, oldest begins with 2020, and the undated Stories on Skin record remains last in both date modes.

## Primary interactions and verification

- Category volume filtering: passed; Digital reduces the list to 10 records and automatically selects the first visible record.
- Local archive search: passed; searching `deficit` and `biotic` reduces the directory and updates the pulled preview.
- Sort controls: passed; A–Z preserves the default archive order, Newest sorts descending, and Oldest sorts ascending with undated entries last.
- File selection and preview update: passed with `aria-pressed`, keyboard focus selection, stepped reveal, and matching metadata.
- Open Project route: passed; selected records expose the correct internal project URL.
- Desktop and mobile overflow: passed; document width equals the client width in both tested states.
- Browser console: the prior full interaction pass was clean; the current motion-only pass rendered without an error overlay, while direct log retrieval was unavailable under the browser URL policy.
- Production build: passed; the existing large-chunk advisory remains non-blocking.

## Findings

No actionable P0, P1, or P2 differences remain. The implementation intentionally uses the site's light cyber-biological palette and a live preview drawer instead of copying the reference's Windows-black surface one-to-one.

final result: passed

## MCAD x Ellwas dandelion growth hero — 2026-07-21

- Source visual truth: `C:\Users\sophi\AppData\Local\Temp\codex-clipboard-f4e66a27-0a5b-46cd-8039-2bb859d24247.png`.
- Implemented vector sequence: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\public\assets\mcad-ellwas\growth-sequence.svg`.
- Browser-rendered implementation: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\ellwas-growth-qa.png`.
- Same-state comparison input: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\ellwas-growth-comparison.png`.
- Viewport: 1172 x 912 desktop; opening hero at scroll position 0 with the complete bloom state visible.

### Full-view comparison evidence

The combined comparison places the supplied seven-stage dandelion reference and the rendered MCAD x Ellwas opening in one input. The implementation preserves the reference's warm gray field, left-to-right accumulation, small-to-large radial progression, luminous white treatment, and held complete state. The project page intentionally uses the supplied `growth.svg` artwork rather than copying the reference's distinct flower illustration.

### Focused-region comparison evidence

The upper reference strip and the hero's gray animation field are both fully visible in `ellwas-growth-comparison.png`. This makes the stage order, brightness, negative space, and final radial form directly comparable while retaining the surrounding project title console for context.

### Required fidelity surfaces

- Fonts and typography: the existing MCAD x Ellwas display title, Courier system labels, and project copy remain unchanged and unclipped.
- Spacing and layout rhythm: the animation is contained inside the existing hero media slot, with the process strip centered in the gray field and the original two-column editorial balance preserved.
- Colors and visual tokens: the warm gray reference ground is matched with `#55514f`; the growth artwork receives a restrained brightness, contrast, and glow lift while the existing black, cream, green, coral, and yellow interface tokens remain intact.
- Image quality and asset fidelity: the implementation renders the supplied high-resolution SVG twice—one low-opacity guide and one progressively revealed foreground. No CSS-drawn dandelion, placeholder, or handmade replacement asset is used.
- Copy and content: all project title, role, description, metadata, sections, source links, and archive media remain present. The former opening GIF still appears in the motion-test section rather than being discarded.

### Comparison history

1. Earlier P2 finding: cropping the wide source into a single changing frame exposed neighboring forms and made the growth states feel misaligned. Fix: preserve the full supplied sequence and reveal it progressively from left to right in seven discrete steps. Post-fix evidence: the final comparison shows a coherent journey from the smallest form to the full bloom.
2. Earlier P2 finding: the first reveal pass was too dim relative to the luminous source reference. Fix: increase foreground brightness and contrast, add a restrained warm drop shadow, and reduce the guide opacity. Post-fix evidence: the completed stages read clearly while inactive future stages remain subordinate.

### Primary interactions and verification

- Seven-step timed reveal and complete-state hold: passed.
- Pause control: passed; button text changes to `PLAY` and the animation receives the `is-paused` state.
- Resume control: passed; button text returns to `PAUSE` and the animation continues.
- Reduced-motion fallback: implemented; the completed sequence is shown statically and decorative motion is suppressed.
- Desktop containment: passed at 1172 x 912 with no visual clipping or horizontal overflow in the opening.
- Mobile CSS path: reviewed; the existing <=700 px single-column hero and viewport-bounded media rules remain active. A separate narrow browser capture was unavailable in the current fixed in-app viewport.
- Production build: passed. The existing large-chunk advisory remains non-blocking.

### Findings

No actionable P0, P1, or P2 differences remain. The reference establishes the growth behavior and visual rhythm; the delivered animation retains the project's own supplied Ellwas growth forms.

final result: passed

## Merimnao halftone background - 2026-07-20

- Source visual truth: `C:\Users\sophi\Downloads\Untitled-1.png`.
- Implemented asset: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\public\assets\merimnao-halftone-background.png`.
- Desktop implementation screenshot: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\merimnao-bg-qa-desktop.png`.
- Mobile implementation screenshot: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\merimnao-bg-qa-mobile.png`.
- Desktop game-stills carousel screenshot: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\merimnao-carousel-qa-desktop.png`.
- Mobile game-stills carousel screenshot: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\merimnao-carousel-qa-mobile.png`.
- Same-view comparison: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\merimnao-bg-design-comparison.png`.
- Viewports: 745 x 678 and 390 x 844; opening state at scroll position 0.

### Full-view comparison evidence

The combined comparison places the supplied 692 x 350 black-and-white bitmap beside the rendered opening. The implementation preserves the bitmap's black field, fine white halftone density, horizontal composition, and obscured body silhouette. The source is used directly as a fixed cover background rather than recreated with CSS.

### Focused-region comparison evidence

A separate focused crop was unnecessary because this change has one supplied raster surface. The desktop comparison clearly resolves the halftone over the complete hero, while the mobile capture verifies the same texture around the video and beneath the title console without horizontal overflow.

### Required fidelity surfaces

- Fonts and typography: the existing Merimnao display and terminal typography remain unchanged and readable over the translucent panels.
- Spacing and layout rhythm: the existing hero, console, record, archive, and pager geometry is preserved. Only page-specific background and panel transparency were introduced.
- Colors and visual tokens: the bitmap remains black and white after the brief green-tint exploration was explicitly reversed. Existing blue/coral interface signals remain unchanged.
- Image quality and asset fidelity: the supplied PNG is copied without resampling and rendered as the actual fixed background. No CSS illustration, SVG substitute, or generated approximation is used.
- Copy and content: all Merimnao copy, video, process-book images, navigation, and archive content remain intact.

### Comparison history

1. P2 finding: the first pass exposed the dot field around the page but made the body silhouette too faint over the opening video. Fix: make the hero background transparent and adjust the embedded signal frame to 0.82 opacity. Post-fix evidence: the final desktop comparison shows the body bitmap across the dark video while preserving controls and gameplay visibility.
2. User preference correction: a multiply-blended portfolio-green tint was tested and rejected. Fix: restore the original black-and-white source treatment. Post-fix evidence: the final captures show neutral white halftone marks on black.

### Primary interactions and verification

- Vimeo player remains visible and interactive.
- Game stills use one auto-cycling window; observed image state advancing from 1 of 3 to 3 of 3, with working previous/next buttons, pause-on-interaction behavior, and a live counter.
- Header navigation and project-record entry remain unobstructed.
- Responsive horizontal overflow: none at 745 px or 390 px.
- Browser console warnings/errors: none.
- Production build: passed; the existing bundle-size advisory remains non-blocking.

### Findings

No actionable P0, P1, or P2 differences remain. The background is recognizable, page-specific, and does not compromise content legibility.

final result: passed

## Decay physics point cloud - 2026-07-20

- Source visual truth: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\public\assets\206-d68221bb106a.jpg` and the supplied `D:\assets\website\drafting\castlewilliamscrumble.stl`.
- Implemented model asset: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\public\models\decay\castle-williams-crumble.stl`.
- Desktop implementation screenshot: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\decay-point-cloud-qa-desktop.png`.
- Mobile implementation screenshot: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\decay-point-cloud-qa-mobile.png`.
- Held-state screenshot: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\decay-point-cloud-qa-held.png`.
- Full-view comparison: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\decay-point-cloud-design-comparison.png`.
- Fragment-collapse screenshot: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\decay-fragment-qa-collapse.jpg`.
- Fragment-held screenshot: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\decay-fragment-qa-held.jpg`.
- Viewports: 1440 x 900 desktop and 390 x 844 mobile.
- States: active vibration/degradation, total structural failure, active press-and-hold magnetic recovery, release-to-collapse, and reduced-motion stabilization.

### Full-view comparison evidence

The source sculpture photograph and the 1440 px browser capture were normalized into one side-by-side comparison. The point cloud preserves the supplied Castle Williams mesh's circular footprint, courtyard opening, low curved wall, three-quarter viewpoint, and irregular architectural silhouette. The implementation intentionally replaces the source photograph's material surface and gallery table with the requested point-cloud system and a quiet fog-white editorial field.

### Focused-region comparison evidence

The held-state screenshot verifies that the central courtyard, front wall, interior vertical elements, and missing wall section resolve from the actual STL rather than a drawn approximation. The fragment-collapse screenshot verifies that disconnected architectural shells remain coherent while they tumble away. The mobile screenshot verifies the same model remains fully contained and legible at 390 px, with the instruction and integrity readout separated from the title and geometry.

### Required fidelity surfaces

- Fonts and typography: the global mixed-case wordmark, oversized Arial project title, and compact Courier system labels reuse the existing portfolio hierarchy. No title, instruction, or status text clips at 1440 or 390 px.
- Spacing and layout rhythm: the full-height interaction sits directly under the shared header, the enlarged desktop model holds the center of the field, and the mobile camera scale keeps the complete castle inside the viewport. No horizontal overflow was found.
- Colors and visual tokens: the page uses the established fog, black, blue, coral, yellow, green, and white palette. Saturated colors are limited to sparse point signals, focus, and system status.
- Image and asset fidelity: the visible point positions are triangle centroids from the supplied STL at 52,121 surface coordinates. Shared STL vertices are resolved into 290 disconnected architectural shells, which drive coherent fragment physics. No CSS illustration, handmade SVG, placeholder model, or procedural castle substitute is used.
- Copy and content: the original Decay statement, date, materials, three source photographs, local video, neighboring project navigation, and footer remain present.
- Physical-work context: the opening frame includes a persistent labeled exhibition-view inset using source image 207, visibly showing the PLA sculpture, shaking platform, wiring, and participant button. The heading also identifies the piece as a physical installation and names its physical system before the visitor scrolls.

### Comparison history

1. Earlier P2 finding: the first desktop point cloud was visually subordinate to the title and did not carry the source sculpture's physical presence. Fix: increase the desktop scene scale to 1.18 while retaining dedicated tablet and mobile scales. Post-fix evidence: the 1440 px comparison shows the castle as the dominant central object.
2. Earlier P2 finding: the initial floor friction stopped detached points inside the original ring footprint, making failure read as flattening rather than breakup. Fix: increase radial release impulses and convert floor drag to time-based friction. Post-fix evidence: the failed state spreads outward across the floor before settling.
3. Earlier P2 finding: the original mobile camera crop cut off both outer walls and the instruction overlapped the title. Fix: use a 0.52 portrait scene scale, compensate point size, widen the title measure, and move the touch instruction below the heading. Post-fix evidence: the 390 x 844 screenshot contains the full castle and separated UI regions.
4. P1 finding: the interactive opening could be mistaken for a standalone digital artwork because the physical sculpture and mechanism appeared only in the archive below. Fix: add a persistent `PHYSICAL WORK` exhibition inset and an explicit material/system label to the hero. Post-fix evidence: the first viewport now shows both the responsive point-cloud interpretation and the installed motorized sculpture.

### Findings

No actionable P0, P1, or P2 differences remain. The raster source and point-cloud implementation intentionally differ in material treatment because the point-cloud transformation and physics collapse are the selected design direction.

### Primary interactions and console

- Progressive unattended degradation: passed; structural integrity reaches 0% and all 290 geometry fragments tumble and settle against the invisible floor.
- Magnetic recovery from total failure: passed; focus/click returned structural integrity to 100% and restored every fragment and sampled surface point to its source coordinate and rotation.
- Status and accessibility state: passed; `aria-pressed`, status copy, progress value, keyboard focus, and mobile press-and-hold instructions update with the interaction.
- Responsive containment: passed at 1440 x 900 and 390 x 844 with no horizontal overflow.
- Reduced motion: passed by holding the cloud at its source coordinates and suppressing vibration/collapse.
- Browser console warnings/errors: none.
- Production build: passed. The existing large-chunk advisory remains non-blocking.

### Follow-up polish

P3: a later performance pass could move point transforms into a GPU shader if the source mesh is increased substantially beyond the current 52,121 samples.

final result: passed

## Authored project layout system — 2026-07-20

- Reference routes: `http://127.0.0.1:4173/`, `http://127.0.0.1:4173/digital/biotic-gallery`, `http://127.0.0.1:4173/digital/witches-flight-3d`, and `http://127.0.0.1:4173/digital-sociology-study`.
- Primary source screenshots: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\biotic-gallery-qa-desktop.png` and `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\biotic-gallery-qa-mobile.png`.
- Browser-rendered implementation: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\project-layout-qa-desktop.png` and `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\project-layout-qa-mobile.png`.
- Same-viewport comparison inputs: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\project-layout-qa-desktop-comparison.png` and `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\project-layout-qa-mobile-comparison.png`.
- Viewports: 1425 x 891 desktop and 375 x 812 mobile. Responsive boundary checks also covered 700 and 701 px.
- Scope: all 16 routes rendered by the shared project system, including the section-aware Collection, Theater Production Work, and Aippy variants plus the Merimnao process-book override.

### Full-view comparison evidence

The combined desktop and mobile inputs compare Biotic Gallery's strongest system cues directly with the redesigned Small Planetarium route. The implementation preserves the reference hierarchy: shared command header, framed dominant visual, 1.42 / .58 desktop split, oversized sans display title, compact Courier metadata, hard one-pixel rules, status console, off-white ground, and deliberate mobile stacking. The project remains authored rather than cloned: its real plan artwork and project metadata replace Biotic's node map while using the same portfolio grammar.

### Required fidelity surfaces

- Fonts and typography: the reference's Arial/Helvetica black display treatment, Courier system labels, and compact editorial body rhythm are preserved. The first mobile comparison exposed a final-character wrap in `PLANETARIUM`; reducing the long-title breakpoint to 38 px keeps the word intact without weakening hierarchy.
- Spacing and layout: desktop hero alignment, gutters, framed media, console baseline, and CTA match the reference's composition. At <=980 px the hero becomes one column; at <=700 px chapters, media inventories, links, and route navigation remain readable with no horizontal overflow.
- Colors and tokens: Digital uses the existing portfolio blue/fog system, Physical uses coral/blush, and For Clients uses green/soft white. Borders remain square and flat, with no generic rounded-card or shadow treatment introduced.
- Image quality and asset fidelity: every project uses its existing raster, video, audio, and embed inventory with `object-fit: contain` where crop loss would damage artwork. No generated substitutes, placeholder boxes, CSS illustrations, or handcrafted SVG assets were added.
- Copy and content: original titles, descriptions, years, materials, embeds, and links are preserved. Multi-project pages now keep each work's copy, media, and CTA together rather than flattening them into detached groups.
- Accessibility and controls: gallery controls are semantic buttons with labels; project imagery has descriptive alt text; the header menu and primary record CTA are keyboard-addressable; focus styles use the established yellow active state; reduced-motion behavior remains inherited from the existing site.

### Comparison history

1. Earlier P1 finding: generic pages opened as a large gallery followed by flat copy and detached media, losing the authored hierarchy of the four reference pages. Fix: introduce a framed media-led hero, project console, record section, media archive, and collection pager. Post-fix evidence: both final comparison inputs preserve the reference's media/title/metadata hierarchy.
2. Earlier P1 finding: Collection, Theater Production Work, and Aippy lost subsection-to-media association. Fix: create route-aware chapters with 6, 3, and 2 sections respectively; Merimnao retains its lead film and separate process-book archive.
3. Earlier P2 finding: `SMALL PLANETARIUM` wrapped its final letter onto a third mobile line. Fix: tighten the mobile long-title scale from 42 px to 38 px. Post-fix evidence: the final 375 x 812 comparison keeps `PLANETARIUM` on one line.
4. Earlier console finding: duplicate tool labels generated repeated React keys on one project. Fix: include the tag index in each key. Post-fix evidence: a clean 16-route audit reports no warnings or errors.

### Primary interactions and verification

- Gallery next control: passed; counter and alt text advanced from `01 / 03` to `02 / 03`.
- Header Index menu: passed; collection links became visible and the menu closed normally.
- Primary CTA: passed; `ENTER PROJECT RECORD` navigated to `#project-record` and scrolled to the editorial record.
- Responsive audit: all 16 redesigned routes passed at 1440 x 1000 and 390 x 844 with header, hero, footer, and zero horizontal overflow. Four representative variants also passed at 700 and 701 px.
- Reference regression audit: Home, Biotic Gallery, Witches' Flight, Digital Sociology Study, and Stories on Skin passed desktop/mobile overflow and structure checks. Protected Biotic node mappings and Stories on Skin behavior were not edited.
- Redesigned-route console: no warnings or errors after the key correction. Digital Sociology retains its pre-existing FBXLoader material fallback warnings; no page errors were introduced.
- Production build: passed using `C:\tmp\sophkatsivelos-build-check`. The normal `dist` directory remained unavailable to Vite because OneDrive held `dist/assets`; this does not affect source compilation. The existing 500 kB chunk-size advisory remains non-blocking.

### Findings

No actionable P0, P1, or P2 design, behavior, accessibility, or responsive findings remain. P3 follow-up is limited to the existing bundle-size advisory and pre-existing Digital Sociology FBX material warnings.

final result: passed

## Stories on Skin wall rebalance - 2026-07-20

- Source visual truth: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\design-reference-stories-on-skin.png`.
- Browser-rendered implementation: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\design-qa-stories-on-skin-desktop.png`.
- Desktop overview: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\design-qa-stories-on-skin-desktop-top.png`.
- Mobile evidence: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\design-qa-stories-on-skin-mobile.png`.
- Same-state comparison input: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\design-qa-comparison-stories-on-skin.png`.
- Viewports: 970 x 682 desktop and 390 x 844 mobile.
- State: lower gallery wall with cast 05 selected and its first close-up visible; mobile default wall plus selected-popup bounds check.

### Full-view comparison evidence

The combined comparison places the annotated source and the revised browser capture side by side. The source shows a large inactive center and a cast 05 window stranded at the lower-right edge. The revised wall pulls casts 03 and 04 into a balanced upper pair, shifts cast 05 inward as the lower anchor, and places its preview directly in the marked open area. The shortened desktop wall removes excess empty space after the installation without changing the mobile exhibition sequence.

### Focused-region comparison evidence

No additional crop was needed because the desktop comparison is already focused on the complete affected region at native 970 x 682 resolution. The cast silhouettes, video edge, chest position, popup placement, connecting line, and remaining negative space are all readable in the same comparison input. The separate desktop-top and mobile captures cover the surrounding statement/video relationship and narrow-screen flow.

### Required fidelity surfaces

- Fonts and typography: the project statement, title hierarchy, Courier metadata, and global header remain unchanged; the desktop-top capture shows no new wrapping, clipping, or density drift.
- Spacing and layout rhythm: cast 02 no longer intersects the statement card, the film begins below the statement, casts 03 and 04 balance the video, and cast 05 plus its preview occupy the formerly empty center. The desktop wall was reduced from 1650 px to 1300 px; no horizontal overflow was introduced.
- Colors and visual tokens: the warm wall, black film/preview chrome, cyan connector shadow, blue focus outline, and existing borders remain unchanged.
- Image quality and asset fidelity: all supplied silicone-cast and close-up raster assets are preserved at their existing scale and crop behavior. No placeholder, generated substitute, CSS illustration, or SVG approximation was introduced.
- Copy and content: project text, cast labels, preview labels, counter, and film content remain unchanged.

### Comparison history

1. Earlier P2 finding: the lower wall had a broad inactive center, cast 05 sat too far left, and its preview was pushed toward the bottom-right edge. Fix: move cast 05 to 17% / 66% at 49% width, pull casts 03 and 04 inward, and reduce the desktop wall height. Post-fix evidence: the same-state comparison shows the chest centered beneath the upper pair and the preview occupying the user-marked area.
2. Earlier P2 finding: shortening the wall initially caused the film to touch the statement and cast 02 to overlap the statement edge. Fix: move the film to 32.5% and cast 02 to 33% / 29%. Post-fix evidence: `design-qa-stories-on-skin-desktop-top.png` shows a clean statement-to-film gap and an unobstructed cast.

### Findings

No actionable P0, P1, or P2 issues remain. The intentional differences from the annotated source are the requested layout improvements rather than fidelity regressions.

### Primary interactions and console

- Cast 05 activation and `01 / 02` frame counter: passed.
- Desktop popup bounds: 655-955 px horizontally and 285-553 px vertically, fully inside the 970 x 682 viewport.
- Mobile popup bounds: 14-361 px horizontally and 582-830 px vertically, fully inside the 390 x 844 viewport.
- Responsive horizontal overflow: none at desktop or mobile.
- Escape dismissal: passed.
- Browser console warnings/errors: none.
- Production build: passed; the existing bundle-size advisory remains non-blocking.

### Follow-up polish

No P3 follow-up is necessary for this layout pass.

final result: passed

## Stories on Skin placement correction - 2026-07-20

- Source annotations: `codex-clipboard-1792946d-2a06-4d51-bc31-f2433d0a5a15.png` and `codex-clipboard-4296cac3-eadd-483f-84d9-ee0a7b510146.png`.
- Desktop cast 04 moved from 50% to 40% wall height (about 165px upward at the 1068px reference width).
- Desktop cast 05 moved from 80% to 58% wall height (about 363px upward at the 1068px reference width).
- Verified at 1068 x 868: both casts occupy the annotated gaps, remain separated, and do not overlap the film window.
- Verified at 390 x 844: dedicated mobile positions remain active, content width equals viewport width, and no console errors were reported.
- Production build passed.

final result: passed

## Biotic Gallery location mapping correction — 2026-07-20

- Source visual truth: `C:\Users\sophi\AppData\Local\Temp\codex-clipboard-35709973-7dde-4783-a815-01531cbfc4b7.png`.
- Compared the complete Biotic Gallery source-image set against the six preview frames in the annotated map.
- Verified rendered order: 01→148 dark cathedral, 02→146 purple pod, 03→144 neon ribs, 04→151 flower grove, 05→142 white creature, 06→149 hanging flowers.
- Each node now owns its image path directly, so reordering the broader project gallery cannot scramble the map.
- Production build passed and the rendered route reported no console errors.

final result: passed

## MCAD x Ellwas interactive bloom — 2026-07-21

- Source visual truth: `C:\Users\sophi\AppData\Local\Temp\codex-clipboard-7d9fc7fd-d305-453d-9313-171d6f859724.png`.
- Supplied tip assets: `poof-finance.svg`, `poof-entrepreneurship.svg`, `poof-education.svg`, and `poof-health.svg` in `public\assets\mcad-ellwas`.
- Browser-rendered states: `ellwas-interactive-initial.png`, `ellwas-interactive-mid.png`, `ellwas-interactive-mature.png`, and `ellwas-interactive-physics.png`.
- Same-input comparison: `C:\Users\sophi\OneDrive\Documents\Website\sophkatsivelos-static\ellwas-interactive-comparison.png`.
- Viewport: 1172 x 912 desktop; opening hero at scroll position 0.
- States: resting seed, active mid-growth, mature four-ring bloom, direct cursor tracking, independent stem settling, held growth, keyboard growth, and reset.

### Full-view comparison evidence

The combined comparison places the supplied transition reference above three live implementation states. The interactive version preserves the reference's warm gray field, luminous center, radial growth, increasing density, and progression from a tiny seed to a complete mandala. It intentionally uses the four supplied MCAD poof drawings as the terminal forms instead of copying the reference's different petal artwork.

### Focused-region comparison evidence

The comparison crops the complete hero media field at early, middle, and mature states, making branch direction, poof orientation, glow, and density directly readable. `ellwas-interactive-physics.png` separately verifies that the luminous core occupies the pointer position while the outer stems carry the movement lag.

### Required fidelity surfaces

- Fonts and typography: the existing title console and compact Courier signal labels remain unchanged. New instructions and status text reuse the same terminal scale and optical weight.
- Spacing and layout rhythm: the interaction stays inside the original hero media slot and preserves the page's established two-column composition. The center is no longer constrained away from the edges because the user's cursor is the explicit anchor.
- Colors and visual tokens: the supplied reference's warm gray ground and creamy luminous linework are preserved, while focus and progress continue to use the portfolio's yellow system state.
- Image quality and asset fidelity: all four supplied SVG tip drawings are rendered directly as vector images at the stem endpoints. From the center outward, Finance, Health, Education, and Entrepreneurship each occupy one concentric ring, including their smaller side sprouts. The stems are live canvas paths required for the requested generative interaction; no replacement tip illustrations or placeholder assets are used.
- Copy and content: the page title, project statement, sections, links, and supporting media remain intact. The hero status now describes the live cursor interaction rather than the removed timeline animation.

### Comparison history

1. Earlier P1 finding: the first interpretation was a passive left-to-right reveal and did not respond to the pointer. Fix: replace it with a live canvas bloom whose center follows the pointer, accumulates sprouts only while active, freezes on leave, and stops at 100%. Post-fix evidence: pointer movement, progress changes, and the early/mid/mature captures verify the requested behavior.
2. Earlier P2 finding: sequential births formed a clockwise wedge rather than a balanced mandala. Fix: distribute each ring's birth order around the circumference with a deterministic permutation. Post-fix evidence: the mid-growth capture shows new forms emerging across multiple directions.
3. User correction: constraining the bloom for edge containment meant its center did not coincide exactly with the cursor. Fix: anchor the luminous core directly to the pointer and move the physics into a damped spring applied to the outer branches and poofs. Post-fix evidence: `ellwas-interactive-physics.png` and live movement testing show the core at the interaction point while the surrounding form bends and settles.
4. Earlier P1 finding: all supplied poofs were oriented back toward the stems. Fix: rotate endpoint assets 180 degrees around their anchor. Post-fix evidence: the corrected mid and mature captures show finance, entrepreneurship, education, and health poofs opening outward.
5. Earlier P2 finding: one shared sway value made the flower bend as a rigid bundle. Fix: assign every stem its own spring state, stiffness, damping, drag, and cross-axis phase, then derive its tip rotation from the live curve tangent. Post-fix evidence: `ellwas-interactive-physics.png` shows visibly different bend amounts and recovery across neighboring stems.
6. Earlier P1 finding: the four supplied poof types were shuffled across all radii, obscuring the pillar system. Fix: organize Finance, Entrepreneurship, Education, and Health into four ordered concentric growth rings and keep side sprouts within their parent type. Post-fix evidence: the mature comparison state clearly resolves four distinct terminal bands.
7. Earlier P2 finding: applying pointer drag as a shared screen-space offset let stems opposite the force extend beyond their grown radius, producing a rigid cone or fan silhouette. Fix: project movement into each stem's own radial and tangential axes, allow radial motion to compress only, and preserve independent sideways sweep and recovery. Post-fix evidence: fast diagonal sweeps keep every endpoint at or inside its resting radius while neighboring stems bend by different amounts.
8. User refinement: the constrained stems still needed a slight backward flex under acceleration. Fix: replace the single quadratic bow with a cubic stem whose anchored base, flexible middle, and velocity-sensitive tip react at different rates. Post-fix evidence: fast sweeps show the upper stem and poof trailing behind the cursor while the base remains rooted and the grown radius stays constrained.
9. User refinement: a static mature flower felt too still between interactions. Fix: after 650ms without pointer movement, ease the bloom into a central idle rotation at 0.036 radians per second; pointer movement eases the rotation back to a stop, and reduced-motion mode disables it. Post-fix evidence: two captures 4.2 seconds apart show a subtle clockwise change without moving the luminous cursor anchor.
10. User refinement: Entrepreneurship should define the outermost ring. Fix: swap the previous Health and Entrepreneurship assignments, preserving each type as a complete ring and keeping side sprouts matched to their parent type. Post-fix evidence: the mature state renders the Entrepreneurship SVGs across all 16 outer endpoints and Health across the 10-stem inner ring.

### Primary interactions and verification

- Pointer enter/move: passed; movement activates growth and relocates the bloom center.
- Cursor-core anchor: passed; the native cursor is hidden inside the field and replaced by the luminous flower center.
- Elastic response: passed; pointer velocity excites independent radial/tangential springs and a progressive cubic flex, so neighboring stems compress, trail backward, and settle at different rates without outward stretching.
- Four-type ring mapping: passed; the concentric order is Finance, Health, Education, then Entrepreneurship, and each ring's side branches retain that type.
- Idle rotation: passed; the mature bloom eases into a very slow central rotation after pointer stillness and stops rotating under renewed input.
- Pointer leave: passed; accumulated growth is held rather than reset.
- Timed growth cap: passed; the adjusted 14-second growth cycle reaches and remains at 100%.
- Reset Bloom: passed; progress returns to the seed state and remains held until reactivated.
- Keyboard activation: passed with visible focus, Space/Enter toggle behavior, and Escape hold.
- Reduced-motion mode: implemented; the mature form is rendered immediately without timed growth.
- Desktop horizontal overflow: none at 1172 x 912.
- Mobile CSS path: reviewed; the existing single-column, viewport-bounded hero remains active below 700 px. A separate narrow browser capture was unavailable in the fixed in-app viewport.
- Browser console: no application errors.
- Production build: passed; the existing large-chunk advisory remains non-blocking.

### Findings

No actionable P0, P1, or P2 differences remain. The primary visual difference from the transition reference is intentional: the final bloom uses the project's supplied line-art poofs rather than the reference image's furry petal forms.

final result: passed

## Stories on Skin collision-free responsive placement — 2026-07-21

- Source visual truth: `design-reference-stories-on-skin-reorg.png`.
- Desktop implementation: `design-qa-stories-on-skin-separated-desktop.png` at 1154 x 945.
- Tablet implementation: `design-qa-stories-on-skin-separated-tablet.png` at 700 x 844.
- Mobile implementation: `design-qa-stories-on-skin-separated-mobile.png` at 390 x 844.
- Side-cast selected state: `design-qa-stories-on-skin-separated-side-active.png`.
- Same-input comparison: `design-qa-comparison-stories-on-skin-separated.png`.
- Responsive comparison: `design-qa-stories-on-skin-separated-responsive.png`.

### Full-view and focused comparison evidence

The desktop comparison shows the vertical side cast moved completely below the film with a visible 36.4 px gap. The statement, film, and five casts remain visually distinct. The responsive comparison shows the dedicated tablet and mobile arrangements, while the selected-state capture confirms the green outline and close-up interaction remain intact after repositioning.

### Required fidelity surfaces

- Fonts and typography: existing project typography and wrapping are preserved.
- Spacing and layout rhythm: desktop wall height scales with wide viewports; cast 01 has a bounded width; cast 03 sits below the film; tablet cast 02 and cast 03 positions leave clearance; and narrow mobile cast 01 is capped to protect the statement.
- Colors and visual tokens: the green selected/focus outline remains unchanged.
- Image quality and asset fidelity: all original cast artwork and dedicated close-up sequences remain unchanged.
- Copy and content: statement, film metadata, cast labels, and instructions remain unchanged.

### Comparison history

1. P1 layout issue: cast 03 overlapped the bottom-right of the film. Fix: move desktop cast 03 from 44% to 54% wall height and the 521–700 px version from 47% to 53%. Post-fix evidence: the desktop film bottom is 719.6 px and cast 03 begins at 756.0 px.
2. P2 responsive collisions: cast 02 grazed the statement around 521–700 px, cast 01 could meet the statement at 520 px, and wide desktop casts could touch because the wall height stayed fixed while their widths grew. Fix: add breakpoint-specific cast widths/positions, cap narrow cast 01 at 270 px, and scale the desktop wall height with viewport width. Post-fix evidence: automated bounding-box checks report zero overlaps at 1280, 1154, 941, 940, 900, 701, 700, 600, 521, 520, 390, and 320 px.
3. P2 interaction-state risk: focus/selection scaling could close narrow gaps. Fix: add extra mobile clearance and recheck all five selected casts at representative breakpoints. Post-fix evidence: selected-state checks at 1280, 940, 700, 520, and 390 px report zero overlaps.

### Primary interactions and verification

- Statement, film, and cast overlap scan: passed at twelve widths from 320–1280 px.
- All five selected cast states: passed at five representative breakpoints.
- Desktop cast 03 placement: 36.4 px clear of the film.
- Horizontal overflow: none at every tested width.
- Browser console warnings/errors: none.
- Production build: passed; the existing bundle-size advisory remains non-blocking.

### Findings

No actionable P0, P1, or P2 issues remain.

final result: passed

## Style guide connected-node grammar — 2026-07-21

- Source visual truth: `C:\Users\sophi\AppData\Local\Temp\codex-clipboard-ae263c40-91e0-4cb9-88ce-80d0303f3b20.png`.
- Browser-rendered desktop evidence: `C:\Users\sophi\AppData\Local\Temp\style-guide-node-connection-desktop.png`.
- Browser-rendered mobile evidence: `C:\Users\sophi\AppData\Local\Temp\style-guide-node-connection-mobile.png`.
- Viewports: default in-app desktop viewport and 390 x 844 mobile.
- State: node anatomy specimen plus the interactive `TRANSMIT` signal state.

### Full-view and focused comparison evidence

The supplied source and desktop implementation were opened together in one comparison input. The implementation preserves the defining anatomy: a white circular shell with black core and yellow focus ring; a signal path leaving the node on its horizontal centerline; one orthogonal bend; and a direct connection into the top edge of a double-framed terminal window. The implementation intentionally uses green for the path because the user established green as the highest-priority accent.

The mobile focused capture verifies the same node-to-window attachment after the specimen stacks vertically. The line remains continuous and the terminal stays within the viewport.

### Required fidelity surfaces

- Fonts and typography: the source's heavy sans-serif title and small terminal labels remain represented by the guide's established display and mono stacks, with no clipping in the connected specimen.
- Spacing and layout rhythm: the desktop relationship matches the source's left anchor, broad horizontal run, single downward turn, and lower-right window. Mobile preserves the relationship through a compact vertical reflow.
- Colors and visual tokens: the documented priority is green, yellow, orange, teal, then blue. Green owns connection paths and primary signals; yellow owns focus and selection; orange owns hotspots and warnings; teal owns digital data; blue owns quiet reference metadata.
- Image quality and asset fidelity: the supplied image is used only as a layout reference. The connector is a live interface relationship, not a reused bitmap asset.
- Copy and content: `SYS://NODE.01`, `PROJECT TITLE`, the concise context line, and all anatomy annotations match the reference intent.

### Comparison history

1. Earlier P1 mismatch: the relationship was not visibly expressed as a node-to-window route. Fix: add an explicit responsive connector that begins at the node centerline and terminates at the terminal label's top border. Post-fix evidence: desktop and mobile captures show a continuous attached path.
2. User color correction: teal was previously treated as the primary signal. Fix: encode five accent-priority tokens and make green the primary signal, with teal moved to priority four and blue to priority five. Post-fix evidence: the path, node metadata, hierarchy copy, swatch order, and semantic roles all follow the corrected order.

### Primary interactions and verification

- Interactive `TRANSMIT` tab: passed; `aria-selected` changes to `true` and the readout updates to `SIGNAL MOVING`.
- Desktop connector attachment: passed.
- Mobile connector attachment at 390 x 844: passed.
- Production build: passed; the existing large-chunk advisory remains non-blocking.
- Console: no style-guide runtime error was introduced. Two stale HMR errors reference unrelated Ellwas files and predate this style-guide pass.

### Findings

No actionable P0, P1, or P2 differences remain. The straight terminal-grade green path is an intentional system translation of the source's hand-drawn magenta line.

final result: passed
