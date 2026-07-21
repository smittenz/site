import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, FileArchive, MagnifyingGlass } from "@phosphor-icons/react";
import "./style-guide.css";

const sections = [
  ["01", "FOUNDATIONS", "foundations"],
  ["02", "COLOR", "color"],
  ["03", "TYPE", "type"],
  ["04", "SIGNALS + NODES", "signals"],
  ["05", "COMPONENTS", "components"],
  ["06", "COMPOSITION", "composition"],
  ["07", "ACCESSIBILITY", "accessibility"],
];

const principles = [
  {
    code: "P.01",
    title: "WORK FIRST",
    copy: "The interface locates and frames the work, then gets quiet. Project imagery is the primary visual event.",
  },
  {
    code: "P.02",
    title: "ORGANIC + PRECISE",
    copy: "Living forms, bodies, scans, and textures sit inside exact grids, records, paths, and instrument-like controls.",
  },
  {
    code: "P.03",
    title: "SIGNAL, NOT DECORATION",
    copy: "Color, nodes, and motion always identify a state, relationship, location, or available action.",
  },
  {
    code: "P.04",
    title: "DECODE, THEN RESOLVE",
    copy: "Interactions can feel sampled or transmitted, but every sequence resolves into a clear and readable state.",
  },
];

const palette = [
  { name: "WHITE", token: "--palette-white", hex: "#FFFFFF", role: "Primary page and content surface", mode: "light" },
  { name: "FOG", token: "--palette-fog", hex: "#E8ECEA", role: "Secondary fields and quiet panels", mode: "light" },
  { name: "BLACK", token: "--palette-black", hex: "#000000", role: "Type, rules, controls, terminal chrome", mode: "dark" },
  { name: "GREEN", token: "--palette-green", hex: "#68C45B", role: "Priority 1 / connection paths, live signals, primary status", mode: "light" },
  { name: "YELLOW", token: "--palette-yellow", hex: "#F5E93A", role: "Priority 2 / focus, hover, selection, current position", mode: "light" },
  { name: "ORANGE", token: "--palette-orange", hex: "#F56861", role: "Priority 3 / hotspots, physical context, warnings", mode: "light" },
  { name: "TEAL", token: "--palette-teal", hex: "#54D7D6", role: "Priority 4 / digital context, transmission, active data", mode: "light" },
  { name: "BLUE", token: "--palette-blue", hex: "#5B8EF7", role: "Priority 5 / indexing, reference, and depth", mode: "light" },
];

const signalSteps = [
  {
    id: "identify",
    code: "01",
    label: "IDENTIFY",
    status: "TARGET FOUND",
    title: "Locate the relationship",
    copy: "A node marks an actual object, section, project, or state. It is never an unlabelled ornament.",
  },
  {
    id: "transmit",
    code: "02",
    label: "TRANSMIT",
    status: "SIGNAL MOVING",
    title: "Carry context outward",
    copy: "A restrained connector makes the source-to-destination relationship legible before a preview opens.",
  },
  {
    id: "decode",
    code: "03",
    label: "DECODE",
    status: "DATA RESOLVING",
    title: "Reveal one useful layer",
    copy: "The panel adds just enough title, metadata, or preview information to support the next decision.",
  },
  {
    id: "resolve",
    code: "04",
    label: "RESOLVE",
    status: "VIEW CLEAN",
    title: "Return attention to the work",
    copy: "Once opened, decorative connectors disappear and the selected image or project becomes clean and stable.",
  },
];

const spacing = [4, 8, 12, 16, 24, 32, 48, 72, 96];

const stateOptions = [
  { id: "idle", label: "IDLE" },
  { id: "hover", label: "HOVER / FOCUS" },
  { id: "selected", label: "SELECTED" },
];

const displayFonts = [
  { name: "ROBOTO MONO", family: "'Roboto Mono', monospace", weight: "700", role: "Selected system display / precise and broadly readable" },
  { name: "ALDRICH", family: "Aldrich, sans-serif", weight: "400", role: "Technical display / engineered and restrained" },
  { name: "TURRET ROAD", family: "'Turret Road', sans-serif", weight: "800", role: "Primary display candidate / architectural and forceful" },
  { name: "DOPPIO ONE", family: "'Doppio One', sans-serif", weight: "400", role: "Secondary display / softer and highly readable" },
  { name: "BITCOUNT GRID DOUBLE", family: "'Bitcount Grid Double', monospace", weight: "400", role: "Bitmap display / structured digital texture" },
  { name: "SILKSCREEN", family: "Silkscreen, monospace", weight: "700", role: "Pixel display / compact labels and short titles" },
  { name: "JERSEY 25 CHARTED", family: "'Jersey 25 Charted', sans-serif", weight: "400", role: "Charted display / expressive system moments" },
  { name: "VT323", family: "VT323, monospace", weight: "400", role: "CRT terminal / open, narrow, low-resolution" },
  { name: "BITCOUNT SINGLE", family: "'Bitcount Single', monospace", weight: "400", role: "Bitmap display / cleaner single-cell rhythm" },
  { name: "SIXTYFOUR", family: "Sixtyfour, monospace", weight: "400", role: "Computer display / scan and transmission effects" },
];

function SectionHeading({ number, label, title, note }) {
  return (
    <header className="sg-section-heading">
      <div className="sg-section-heading__signal" aria-hidden="true"><i /><span>{number}</span></div>
      <div>
        <span>{label}</span>
        <h2 id={`${label.toLowerCase().replaceAll(" ", "-").replace("+", "and")}-title`}>{title}</h2>
      </div>
      <p>{note}</p>
    </header>
  );
}

function StyleGuidePage({ Link, Footer }) {
  const [activeSignalId, setActiveSignalId] = useState("identify");
  const [componentState, setComponentState] = useState("idle");
  const [displayFontIndex, setDisplayFontIndex] = useState(() => {
    if (typeof window === "undefined") return 0;
    const savedIndex = Number(window.sessionStorage.getItem("style-guide-display-font-v2"));
    return Number.isInteger(savedIndex) && savedIndex >= 0 && savedIndex < displayFonts.length ? savedIndex : 0;
  });
  const activeSignal = signalSteps.find(step => step.id === activeSignalId) || signalSteps[0];
  const activeDisplayFont = displayFonts[displayFontIndex];

  const cycleDisplayFont = (direction) => {
    setDisplayFontIndex(current => (current + direction + displayFonts.length) % displayFonts.length);
  };

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Style System — Sophie Katsivelos";
    return () => { document.title = previousTitle; };
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem("style-guide-display-font-v2", String(displayFontIndex));
  }, [displayFontIndex]);

  return (
    <div className="style-guide-route" style={{ "--sg-font-display": activeDisplayFont.family }}>
      <main className="style-guide-page">
        <section className="sg-hero" id="top" aria-labelledby="style-guide-title">
          <div className="sg-hero__status">
            <span>SYS://PORTFOLIO.STYLE-GUIDE</span>
            <b><i aria-hidden="true" /> V01 / ACTIVE</b>
          </div>

          <div className="sg-hero__grid">
            <div className="sg-hero__copy">
              <span className="sg-eyebrow">CYBER-BIOLOGICAL INTERFACE SYSTEM / 2026</span>
              <h1 id="style-guide-title"><span>STYLE</span><span>SYSTEM</span></h1>
              <p>Part living archive, part scientific instrument. This system connects artwork, context, and action without competing with the work.</p>
              <div className="sg-hero__actions">
                <a href="#foundations">READ THE SYSTEM <span aria-hidden="true">&darr;</span></a>
                <Link href="/" className="sg-text-link">VIEW PORTFOLIO <ArrowUpRight size={17} weight="bold" aria-hidden="true" /></Link>
              </div>
            </div>

            <div className="sg-hero__network" aria-label="Interactive signal sequence">
              <div className="sg-window-bar"><b>SYS://SIGNAL.PATH</b><span>SELECT A NODE</span></div>
              <div className="sg-hero__network-body">
                <div className="sg-signal-list" role="tablist" aria-label="Signal sequence">
                  {signalSteps.map(step => (
                    <button
                      key={step.id}
                      type="button"
                      role="tab"
                      aria-selected={step.id === activeSignalId}
                      aria-controls="sg-active-signal"
                      className={step.id === activeSignalId ? "is-active" : ""}
                      onClick={() => setActiveSignalId(step.id)}
                    >
                      <i aria-hidden="true"><span /></i>
                      <b>{step.code}</b>
                      <span>{step.label}</span>
                    </button>
                  ))}
                </div>
                <article id="sg-active-signal" className="sg-signal-readout" role="tabpanel" aria-live="polite">
                  <span>{activeSignal.status}</span>
                  <strong>{activeSignal.title}</strong>
                  <p>{activeSignal.copy}</p>
                  <small>{activeSignal.code} / 04 &nbsp; // &nbsp; CLICK OR TAB BETWEEN NODES</small>
                </article>
              </div>
              <div className="sg-window-footer"><span>RELATIONSHIP: SOURCE &rarr; CONTEXT &rarr; ACTION</span><b>ONLINE</b></div>
            </div>
          </div>

          <nav className="sg-contents" aria-label="Style guide contents">
            {sections.map(([number, label, id]) => (
              <a href={`#${id}`} key={id}><i aria-hidden="true" /><b>{number}</b><span>{label}</span></a>
            ))}
          </nav>
        </section>

        <section className="sg-section sg-foundations" id="foundations" aria-labelledby="foundations-title">
          <SectionHeading
            number="01"
            label="FOUNDATIONS"
            title="A living archive with an interface spine."
            note="The system is expressive because the work is expressive. Its structure stays restrained, repeatable, and useful."
          />
          <div className="sg-principle-grid">
            {principles.map(principle => (
              <article key={principle.code}>
                <span>{principle.code}</span>
                <h3>{principle.title}</h3>
                <p>{principle.copy}</p>
              </article>
            ))}
          </div>
          <aside className="sg-core-equation" aria-label="Core visual equation">
            <span>ORGANIC EVIDENCE</span><i aria-hidden="true" /><b>+</b><i aria-hidden="true" /><span>PRECISE INTERFACE</span><strong>= DISTINCTLY SOPHIE</strong>
          </aside>
        </section>

        <section className="sg-section sg-color" id="color" aria-labelledby="color-title">
          <SectionHeading
            number="02"
            label="COLOR"
            title="Neutral fields. Saturated signals."
            note="White, fog, and black carry the interface. Accent priority is green, yellow, orange, teal, then blue."
          />
          <div className="sg-palette" aria-label="Core color palette">
            {palette.map(color => (
              <article className={`sg-swatch sg-swatch--${color.mode}`} style={{ "--swatch": color.hex }} key={color.name}>
                <div><span>{color.name}</span><b>{color.hex}</b></div>
                <p>{color.role}</p>
                <code>{color.token}</code>
              </article>
            ))}
          </div>
          <div className="sg-color-usage">
            <article>
              <span>BASE DISTRIBUTION / GUIDANCE</span>
              <div className="sg-color-ratio" aria-label="Suggested color distribution: 58 percent white, 24 percent fog, 12 percent black, 6 percent signal color">
                <i className="is-white">58</i><i className="is-fog">24</i><i className="is-black">12</i><i className="is-signal">06</i>
              </div>
              <p>Signal colors should feel found, not poured over the page. Use one dominant accent per interaction.</p>
            </article>
            <article className="sg-color-rules">
              <span>CONTRAST RULES</span>
              <ul>
                <li><b>BLACK ON SIGNALS</b><span>Use black type and icons on green, yellow, orange, teal, and blue.</span></li>
                <li><b>COLOR SUPPORTS MEANING</b><span>Pair color with a label, border, shape, or state change.</span></li>
                <li><b>MICROTYPE STAYS SOLID</b><span>Use black on light fields and white on black at small sizes.</span></li>
              </ul>
            </article>
          </div>
        </section>

        <section className="sg-section sg-type" id="type" aria-labelledby="type-title">
          <SectionHeading
            number="03"
            label="TYPE"
            title="Editorial scale meets machine-readable detail."
            note="Three voices create the hierarchy: display for impact, Portfolio for narrative, and mono for interface data."
          />
          <div
            className="sg-font-cycler"
            tabIndex="0"
            onKeyDown={(event) => {
              if (event.target !== event.currentTarget) return;
              if (event.key === "ArrowLeft") { event.preventDefault(); cycleDisplayFont(-1); }
              if (event.key === "ArrowRight") { event.preventDefault(); cycleDisplayFont(1); }
            }}
          >
            <div className="sg-window-bar"><b>TYPE://DISPLAY.CYCLER</b><span>LIVE PAGE PREVIEW</span></div>
            <div className="sg-font-cycler__controls">
              <button type="button" onClick={() => cycleDisplayFont(-1)} aria-label="Show previous display font"><ArrowLeft size={16} weight="bold" aria-hidden="true" /> PREVIOUS</button>
              <label>
                <span>ACTIVE DISPLAY FONT</span>
                <select value={displayFontIndex} onChange={(event) => setDisplayFontIndex(Number(event.target.value))}>
                  {displayFonts.map((font, index) => <option value={index} key={font.name}>{font.name}</option>)}
                </select>
              </label>
              <button type="button" onClick={() => cycleDisplayFont(1)} aria-label="Show next display font">NEXT <ArrowRight size={16} weight="bold" aria-hidden="true" /></button>
            </div>
            <div className="sg-font-cycler__sample" aria-live="polite">
              <span>{String(displayFontIndex + 1).padStart(2, "0")} / {String(displayFonts.length).padStart(2, "0")}</span>
              <strong>CONNECTIONS<br />MAKE RELATIONSHIPS<br />VISIBLE.</strong>
              <p>{activeDisplayFont.role}</p>
            </div>
            <div className="sg-window-footer"><span>Changes every display heading on this page</span><b>{activeDisplayFont.name} / {activeDisplayFont.weight}</b></div>
          </div>
          <div className="sg-type-specimens">
            <article className="sg-type-card sg-type-card--display">
              <header><span>T.01 / DISPLAY</span><b>{activeDisplayFont.name} / {activeDisplayFont.weight}</b></header>
              <div>PROJECT<br />ARCHIVE</div>
              <footer><code>clamp(60px, 7.2vw, 112px) / .77 / -0.075em</code><p>Page titles, major chapter openings, one strong statement per viewport.</p></footer>
            </article>
            <article className="sg-type-card sg-type-card--editorial">
              <header><span>T.02 / EDITORIAL</span><b>PORTFOLIO / 700</b></header>
              <blockquote>“The work remains strange, tactile, and human inside a precise digital record.”</blockquote>
              <footer><code>16px / 1.45 / normal case</code><p>Project descriptions, essays, captions with narrative weight.</p></footer>
            </article>
            <article className="sg-type-card sg-type-card--mono">
              <header><span>T.03 / INTERFACE</span><b>COURIER NEW / 700</b></header>
              <div><span>SYS://RECORD.006</span><strong>SIGNAL ONLINE</strong><code>06 / 20 OBJECTS</code></div>
              <footer><code>10–12px / 1.25 / +0.08em</code><p>Labels, data, controls, status, timestamps, file paths, and counters.</p></footer>
            </article>
          </div>
          <aside className="sg-type-rule"><b>MINIMUM</b><span>Interface labels start at 10px. Editorial copy starts at 15px. Tiny type is an annotation, never required reading.</span></aside>
        </section>

        <section className="sg-section sg-signals" id="signals" aria-labelledby="signals-and-nodes-title">
          <SectionHeading
            number="04"
            label="SIGNALS + NODES"
            title="Connections make relationships visible."
            note="Adapt the supplied node drawing as a grammar: anchor, path, label, destination. Never reproduce it as decorative wallpaper."
          />
          <div className="sg-node-anatomy">
            <div className="sg-node-anatomy__diagram" aria-label="Node component anatomy">
              <div className="sg-anatomy-node"><i aria-hidden="true"><span /></i><b>01</b><span>ANCHOR</span></div>
              <div className="sg-anatomy-connector" aria-hidden="true" />
              <div className="sg-anatomy-label"><span>SYS://NODE.01</span><b>PROJECT TITLE</b><p>One concise line of context.</p></div>
              <ol>
                <li><b>A</b><span>44px minimum hit area</span></li>
                <li><b>B</b><span>White shell + black core</span></li>
                <li><b>C</b><span>1–2px orthogonal path</span></li>
                <li><b>D</b><span>Attached terminal label</span></li>
              </ol>
            </div>
            <div className="sg-node-states">
              <div className="sg-window-bar"><b>NODE STATES</b><span>INTERACTION MATRIX</span></div>
              <div>
                {[
                  ["IDLE", "is-idle", "Ready / discoverable"],
                  ["FOCUS", "is-focus", "Yellow ring + visible label"],
                  ["SELECTED", "is-selected", "Yellow core + open panel"],
                  ["VISITED", "is-visited", "Solid core / pulse stops"],
                  ["UNAVAILABLE", "is-disabled", "Dashed shell + status text"],
                ].map(([label, className, copy]) => (
                  <div className="sg-node-state" key={label}>
                    <i className={className} aria-hidden="true"><span /></i><b>{label}</b><span>{copy}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="sg-node-rules">
            <article><span>USE FOR</span><p>Hotspots, records, process steps, related works, filters, state changes, and source-to-preview links.</p></article>
            <article><span>DO NOT</span><p>Cross body copy, build dense decorative webs, imply false relationships, or leave an interactive node unlabelled.</p></article>
            <article><span>MOBILE</span><p>Reflow into a vertical rail or stacked sequence. Keep labels upright and targets at least 44px.</p></article>
            <article><span>EXPANDED VIEW</span><p>Remove the connector after selection. Dock the source node and let the content resolve cleanly.</p></article>
          </div>
        </section>

        <section className="sg-section sg-components" id="components" aria-labelledby="components-title">
          <SectionHeading
            number="05"
            label="COMPONENTS"
            title="Flat, framed, and stateful."
            note="Components borrow from archives and instruments: square corners, nested rules, registration marks, explicit status, and crisp feedback."
          />
          <div className="sg-component-state-picker" role="group" aria-label="Choose component specimen state">
            <span>PREVIEW STATE</span>
            {stateOptions.map(option => (
              <button key={option.id} type="button" className={componentState === option.id ? "is-active" : ""} aria-pressed={componentState === option.id} onClick={() => setComponentState(option.id)}>{option.label}</button>
            ))}
          </div>
          <div className="sg-component-grid">
            <article className="sg-component-card">
              <header><span>C.01 / ACTIONS</span><b>3 LEVELS</b></header>
              <div className="sg-action-specimens">
                <button type="button" className="sg-button sg-button--primary">OPEN PROJECT <ArrowUpRight size={16} weight="bold" aria-hidden="true" /></button>
                <button type="button" className="sg-button sg-button--secondary">VIEW RECORD</button>
                <button type="button" className="sg-button sg-button--text">RETURN TO MAP &larr;</button>
              </div>
              <p>Primary actions are black. Hover and focus turn yellow. Secondary actions remain on white or fog.</p>
            </article>
            <article className="sg-component-card">
              <header><span>C.02 / STATUS + TAGS</span><b>SEMANTIC COLOR</b></header>
              <div className="sg-tag-specimens">
                <span className="sg-tag is-live"><i />ONLINE</span>
                <span className="sg-tag is-data">DIGITAL</span>
                <span className="sg-tag is-physical">PHYSICAL</span>
                <span className="sg-tag is-current">CURRENT</span>
                <span className="sg-tag">ARCHIVE_006</span>
              </div>
              <p>Tags are square, compact, and readable without color. Status dots reinforce live or available states.</p>
            </article>
            <article className="sg-component-card sg-component-card--window">
              <header><span>C.03 / TERMINAL WINDOW</span><b>3 PARTS</b></header>
              <div className="sg-demo-window">
                <div className="sg-window-bar"><b>SYS://PROJECT.RECORD</b><span>LIVE SIGNAL</span></div>
                <div className="sg-demo-window__body">
                  <FileArchive size={28} weight="thin" aria-hidden="true" />
                  <span>RECORD_006</span>
                  <strong>BIOTIC GALLERY</strong>
                  <p>Artwork, title, and concise metadata occupy one bounded field.</p>
                </div>
                <div className="sg-window-footer"><span>DIGITAL / 2024</span><b>OPEN &nearr;</b></div>
              </div>
              <p>Every window has a title bar, a single content field, and a status or action footer.</p>
            </article>
            <article className="sg-component-card">
              <header><span>C.04 / RECORD ROW</span><b>LIVE PREVIEW</b></header>
              <button type="button" className={`sg-record-row is-${componentState}`} onClick={() => setComponentState(componentState === "selected" ? "idle" : "selected")}>
                <span>06</span><FileArchive size={18} weight="thin" aria-hidden="true" /><b>BIOTIC GALLERY</b><small>2024</small><i>10</i>
              </button>
              <div className="sg-record-caption"><span>STATE: {componentState.toUpperCase()}</span><b>Click the row or state controls above.</b></div>
            </article>
            <article className="sg-component-card">
              <header><span>C.05 / SEARCH</span><b>UTILITY</b></header>
              <label className="sg-search-specimen"><MagnifyingGlass size={17} weight="bold" aria-hidden="true" /><span className="sr-only">Style guide search specimen</span><input type="search" placeholder="SEARCH ARCHIVE_" /></label>
              <p>Utility fields stay compact and rectangular, with a black frame and a clear yellow focus inset.</p>
            </article>
            <article className="sg-component-card">
              <header><span>C.06 / GEOMETRY</span><b>NO SOFT CARDS</b></header>
              <dl className="sg-geometry-list">
                <div><dt>HAIRLINE</dt><dd>1px</dd></div>
                <div><dt>STRONG FRAME</dt><dd>2px</dd></div>
                <div><dt>TERMINAL RAIL</dt><dd>3px / signal edge</dd></div>
                <div><dt>DOUBLE FRAME</dt><dd>1px / 5px gap</dd></div>
                <div><dt>RADIUS</dt><dd>0 / nodes 50%</dd></div>
              </dl>
            </article>
          </div>
        </section>

        <section className="sg-section sg-composition" id="composition" aria-labelledby="composition-title">
          <SectionHeading
            number="06"
            label="COMPOSITION"
            title="One field for the work. One field for context."
            note="Desktop layouts can overlap or split; mobile stacks. The relationship between artifact and information must survive both."
          />
          <div className="sg-layout-demo">
            <figure className="sg-layout-demo__media">
              <div className="sg-window-bar"><b>IMG://SIGNAL.FIELD</b><span>PRIMARY VISUAL</span></div>
              <div className="sg-bitmap-field" role="img" aria-label="Abstract bitmap style specimen showing halftone dots, ordered dithering, and scan bands without using a source image">
                <div className="sg-bitmap-sample is-halftone" aria-hidden="true"><span>01 / HALFTONE</span></div>
                <div className="sg-bitmap-sample is-dither" aria-hidden="true"><span>02 / DITHER</span></div>
                <div className="sg-bitmap-sample is-scan" aria-hidden="true"><span>03 / SCAN</span></div>
                <div className="sg-bitmap-field__note" aria-hidden="true"><b>STYLE LAYER</b><span>NO FIXED IMAGE ASSET</span></div>
              </div>
              <figcaption><span>BITMAP STYLE FIELD / 66%</span><b>HALFTONE + DITHER + SCAN</b></figcaption>
            </figure>
            <article className="sg-layout-demo__copy">
              <span>RECORD_01 / COMPOSITION</span>
              <h3>ARTIFACT + CONTEXT</h3>
              <p>Let media establish atmosphere and scale. Keep the related title, metadata, and next action in a distinct bounded field.</p>
              <dl><div><dt>DESKTOP</dt><dd>2:1 split or measured overlap</dd></div><div><dt>MOBILE</dt><dd>Media first, record second</dd></div><div><dt>MAX FIELD</dt><dd>1510–1540px</dd></div></dl>
            </article>
          </div>
          <div className="sg-scale-and-motion">
            <article className="sg-spacing-system">
              <span>SPACING SCALE / PX</span>
              <div>{spacing.map(value => <i key={value} style={{ "--space": `${value}px` }}><b>{value}</b></i>)}</div>
              <p>Use dense steps inside controls and terminal chrome; use 48–96px rhythm between editorial sections.</p>
            </article>
            <article className="sg-motion-system">
              <span>MOTION LANGUAGE</span>
              <ol>
                <li><b>01 / IDENTIFY</b><span>120–180ms / decisive feedback</span></li>
                <li><b>02 / TRANSMIT</b><span>240–420ms / stepped reveal</span></li>
                <li><b>03 / RESOLVE</b><span>420–950ms / clean end state</span></li>
              </ol>
              <p>Use one dominant motion idea per interaction. Avoid bounce, generic fades, and ambient loops that compete with the work.</p>
            </article>
          </div>
        </section>

        <section className="sg-section sg-accessibility" id="accessibility" aria-labelledby="accessibility-title">
          <SectionHeading
            number="07"
            label="ACCESSIBILITY"
            title="Experimental does not mean cryptic."
            note="Every exploratory interaction must remain legible, operable, and understandable with keyboard, touch, reduced motion, and high zoom."
          />
          <div className="sg-accessibility-grid">
            {[
              ["FOCUS", "All controls receive a 3px yellow ring reinforced by a black edge. Focus never relies on color alone."],
              ["TOUCH", "Any hover preview has a tap equivalent. Interactive nodes and compact controls use a minimum 44px target."],
              ["MOTION", "Reduced motion removes scans, pulses, parallax, and staged transforms. Content appears immediately."],
              ["CONTRAST", "Required text uses black on light fields or white on black. Accent-colored microtype is supplementary only."],
              ["LABELS", "Icons, arrows, nodes, and counters include visible text or a precise accessible name."],
              ["ORDER", "DOM order follows reading order: artwork, title, context, action. Visual overlap never changes that sequence."],
            ].map(([title, copy], index) => (
              <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{copy}</p></article>
            ))}
          </div>
          <aside className="sg-accessibility-check">
            <span>RELEASE CHECK</span>
            <strong>Can a visitor locate the work, understand the state, and complete the same action without relying on hover, color, or motion?</strong>
            <b>YES = SHIP &nbsp; / &nbsp; NO = ITERATE</b>
          </aside>
        </section>

        <section className="sg-closing" aria-label="Style guide closing statement">
          <div className="sg-closing__path" aria-hidden="true"><i /><i /><i /><i /></div>
          <span>END OF SYSTEM RECORD / 07 SECTIONS</span>
          <h2>CONNECT THE INFORMATION.<br />LET THE WORK STAY ALIVE.</h2>
          <Link href="/" className="sg-button sg-button--primary">RETURN TO PORTFOLIO <ArrowUpRight size={18} weight="bold" aria-hidden="true" /></Link>
        </section>
      </main>
      {Footer && <Footer />}
    </div>
  );
}

export default StyleGuidePage;
