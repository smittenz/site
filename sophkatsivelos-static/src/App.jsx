import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import data from "./site-data.json";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { ArrowUpRight, FileArchive, FileCode, FolderSimpleDashed, HardDrives, MagnifyingGlass, SortAscending, SortDescending, TextAa } from "@phosphor-icons/react";
import StudyPage from "./StudyPage.jsx";
import StyleGuidePage from "./StyleGuidePage.jsx";
import { buildPortfolioSearchIndex, searchPortfolio } from "./portfolio-search.js";

const searchItems = buildPortfolioSearchIndex(data);

function go(event, href) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  window.history.pushState({}, "", href);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "instant" });
}

function Link({ href, children, className = "" }) {
  const external = /^https?:|^mailto:/.test(href);
  return <a className={className} href={href} onClick={external ? undefined : event => go(event, href)}>{children}</a>;
}

function CommandHeader({ path }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);
  const searchResults = searchPortfolio(searchItems, query);
  const openSearch = () => {
    setMenuOpen(true);
    setSearchOpen(true);
    window.setTimeout(() => searchRef.current?.focus(), 0);
  };
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setQuery("");
  }, [path]);
  useEffect(() => {
    const requestSearch = () => openSearch();
    window.addEventListener("open-site-search", requestSearch);
    if (new URLSearchParams(window.location.search).get("search") === "1") openSearch();
    return () => window.removeEventListener("open-site-search", requestSearch);
  }, []);
  return (
    <header className="home-header global-command-header">
      <Link href="/" className="home-wordmark"><span aria-hidden="true">&gt;</span>Sophie Katsivelos</Link>
      <div className="index-menu">
        <button className="index-toggle" type="button" aria-expanded={menuOpen} aria-controls="global-index-panel" onClick={() => {
          setMenuOpen(value => !value);
          if (menuOpen) setSearchOpen(false);
        }}>
          INDEX <span aria-hidden="true">{menuOpen ? "−" : "+"}</span>
        </button>
        {menuOpen && <div id="global-index-panel" className="index-dropdown">
          <div className="index-status"><b>SYS://INDEX</b><span>ONLINE</span></div>
          <form className="index-search" role="search" onSubmit={event => {
            event.preventDefault();
            if (!searchResults[0]) return;
            go(event, searchResults[0].href);
          }}>
            <input ref={searchRef} value={query} onFocus={() => setSearchOpen(true)} onChange={event => setQuery(event.target.value)} placeholder="SEARCH_" aria-label="Search the portfolio archive" />
            <button type="submit">GO</button>
          </form>
          {searchOpen && query.trim() && <div className="index-search-results" aria-live="polite">
            <span>{String(searchResults.length).padStart(2, "0")} SIGNALS</span>
            {searchResults.length ? searchResults.map((item, index) => (
              <Link href={item.href} key={item.id} className="index-result">
                <b>{String(index + 1).padStart(2, "0")}</b><span>{item.title}</span>
              </Link>
            )) : <p>NO MATCHING SIGNAL</p>}
          </div>}
          <nav className="index-links" aria-label="Portfolio index" onClick={() => setMenuOpen(false)}>
            <Link href="/"><span>&gt; HOME</span><b>01</b></Link>
            <Link href="/archive"><span>&gt; ARCHIVE</span><b>02</b></Link>
            <Link href="/contact"><span>&gt; ABOUT</span><b>03</b></Link>
          </nav>
          <small>LOCAL ARCHIVE // 2026</small>
        </div>}
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="home-footer">
      <Link href="/contact" className="footer-about">ABOUT</Link>
      <a href="https://www.linkedin.com/in/soph-katsivelos/">LINKEDIN ↗</a>
      <span>© {new Date().getFullYear()}</span>
    </footer>
  );
}

function ParticleOrganism({ zoomed, traveling }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ zoomed, traveling });
  useEffect(() => { stateRef.current = { zoomed, traveling }; }, [zoomed, traveling]);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const width = 1040;
    const height = 555;
    canvas.width = width;
    canvas.height = height;
    const source = document.createElement("canvas");
    const baseLayer = document.createElement("canvas");
    source.width = width;
    source.height = height;
    baseLayer.width = width;
    baseLayer.height = height;
    const sourceContext = source.getContext("2d", { willReadFrequently: true });
    const baseContext = baseLayer.getContext("2d");
    const image = new Image();
    const pointer = { x: width * .7, y: height * .5, targetX: width * .7, targetY: height * .5, active: false, strength: 0 };
    const bucketSize = 26;
    const bucketColumns = Math.ceil(width / bucketSize);
    const bucketRows = Math.ceil(height / bucketSize);
    const particleBuckets = Array.from({ length: bucketColumns * bucketRows }, () => []);
    const asciiGlyphs = [".", ",", ":", ";", "+", "=", "*", "#", "%", "@"];
    const glyphFont = '700 6px "Courier New", "Lucida Console", monospace';
    const heatedParticles = new Map();
    let lastHeatPoint = null;
    let previousTime = 0;
    let ready = false;
    let frame;
    const handlePointer = event => {
      const rect = canvas.getBoundingClientRect();
      const wasActive = pointer.active;
      const isPortraitMobile = window.matchMedia("(max-width: 700px) and (orientation: portrait)").matches;
      if (isPortraitMobile) {
        pointer.targetX = (event.clientY - rect.top) / rect.height * width;
        pointer.targetY = (rect.right - event.clientX) / rect.width * height;
      } else {
        pointer.targetX = (event.clientX - rect.left) / rect.width * width;
        pointer.targetY = (event.clientY - rect.top) / rect.height * height;
      }
      pointer.active = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (pointer.active && !wasActive) {
        pointer.x = pointer.targetX;
        pointer.y = pointer.targetY;
        pointer.strength = 0;
        lastHeatPoint = null;
      }
    };
    const handleLeave = () => { pointer.active = false; lastHeatPoint = null; };
    const animate = time => {
      context.clearRect(0, 0, width, height);
      const { zoomed: isZoomed, traveling: isTraveling } = stateRef.current;
      pointer.x += (pointer.targetX - pointer.x) * .19;
      pointer.y += (pointer.targetY - pointer.y) * .19;
      pointer.strength += ((pointer.active ? 1 : 0) - pointer.strength) * .12;
      const elapsed = previousTime ? Math.min(48, time - previousTime) : 16.7;
      previousTime = time;
      const heatDecay = Math.pow(.5, elapsed / 1250);
      heatedParticles.forEach((state, particle) => {
        state.heat *= heatDecay;
        if (state.heat < .012) heatedParticles.delete(particle);
      });
      if (ready) {
        const motion = isTraveling ? 4.8 : isZoomed ? 1.8 : .7;
        const driftX = Math.sin(time * .00075) * motion;
        const driftY = Math.cos(time * .00062) * motion * .55;
        const parallaxX = pointer.active ? (pointer.x - width / 2) / width * (isZoomed ? 7 : 3.5) : 0;
        const parallaxY = pointer.active ? (pointer.y - height / 2) / height * (isZoomed ? 7 : 3.5) : 0;
        context.globalAlpha = isTraveling ? .64 : isZoomed ? .96 : .9;
        context.drawImage(baseLayer, driftX + parallaxX, driftY + parallaxY);

        const cursorHue = (190 + pointer.x / width * 155 + pointer.y / height * 38) % 360;
        if (pointer.active && pointer.strength > .04) {
          const radius = isZoomed ? 108 : 88;
          const currentHeatPoint = {
            x: pointer.x - driftX - parallaxX,
            y: pointer.y - driftY - parallaxY,
            hue: cursorHue,
          };
          const previousHeatPoint = lastHeatPoint || currentHeatPoint;
          const segmentX = currentHeatPoint.x - previousHeatPoint.x;
          const segmentY = currentHeatPoint.y - previousHeatPoint.y;
          const segmentLengthSquared = segmentX * segmentX + segmentY * segmentY;
          const startColumn = Math.max(0, Math.floor((Math.min(previousHeatPoint.x, currentHeatPoint.x) - radius) / bucketSize));
          const endColumn = Math.min(bucketColumns - 1, Math.floor((Math.max(previousHeatPoint.x, currentHeatPoint.x) + radius) / bucketSize));
          const startRow = Math.max(0, Math.floor((Math.min(previousHeatPoint.y, currentHeatPoint.y) - radius) / bucketSize));
          const endRow = Math.min(bucketRows - 1, Math.floor((Math.max(previousHeatPoint.y, currentHeatPoint.y) + radius) / bucketSize));
          const hueDelta = ((currentHeatPoint.hue - previousHeatPoint.hue + 540) % 360) - 180;
          for (let row = startRow; row <= endRow; row++) for (let column = startColumn; column <= endColumn; column++) {
            particleBuckets[row * bucketColumns + column].forEach(particle => {
              const along = segmentLengthSquared
                ? Math.max(0, Math.min(1, ((particle.x - previousHeatPoint.x) * segmentX + (particle.y - previousHeatPoint.y) * segmentY) / segmentLengthSquared))
                : 0;
              const nearestX = previousHeatPoint.x + segmentX * along;
              const nearestY = previousHeatPoint.y + segmentY * along;
              const dx = particle.x - nearestX;
              const dy = particle.y - nearestY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance >= radius) return;
              const heat = Math.min(1, Math.pow(1 - distance / radius, 1.35) * (.76 + pointer.strength * .34));
              const existing = heatedParticles.get(particle);
              const angle = distance > .001 ? Math.atan2(dy, dx) : particle.phase;
              if (!existing) {
                heatedParticles.set(particle, {
                  heat,
                  hue: (previousHeatPoint.hue + hueDelta * along + 360) % 360,
                  forceX: Math.cos(angle),
                  forceY: Math.sin(angle),
                });
              } else {
                if (heat > existing.heat * .72) {
                  existing.hue = (previousHeatPoint.hue + hueDelta * along + 360) % 360;
                  existing.forceX = Math.cos(angle);
                  existing.forceY = Math.sin(angle);
                }
                existing.heat = Math.max(existing.heat, heat);
              }
            });
          }
          lastHeatPoint = currentHeatPoint;
        } else {
          lastHeatPoint = null;
        }

        if (heatedParticles.size) {
          const hueBandCount = 24;
          const strengthBandCount = 8;
          const renderBands = Array.from({ length: hueBandCount * strengthBandCount }, () => []);
          heatedParticles.forEach((state, particle) => {
            const originX = particle.x + driftX + parallaxX;
            const originY = particle.y + driftY + parallaxY;
            const displacement = Math.pow(state.heat, .82) * (isZoomed ? 13 : 9.5);
            const jitter = state.heat * 1.6;
            const x = originX + state.forceX * displacement + Math.sin(time * .0017 + particle.phase) * jitter;
            const y = originY + state.forceY * displacement + Math.cos(time * .00145 + particle.phase) * jitter;
            const hueBand = Math.min(hueBandCount - 1, Math.floor(state.hue / 360 * hueBandCount));
            const strengthBand = Math.min(strengthBandCount - 1, Math.floor(state.heat * strengthBandCount));
            const glyphLift = state.heat > .68 ? 2 : state.heat > .26 ? 1 : 0;
            renderBands[hueBand * strengthBandCount + strengthBand].push({
              x,
              y,
              originX,
              originY,
              originalGlyph: asciiGlyphs[particle.glyphIndex],
              heatedGlyph: asciiGlyphs[Math.min(asciiGlyphs.length - 1, particle.glyphIndex + glyphLift)],
            });
          });

          context.save();
          context.font = glyphFont;
          context.textAlign = "center";
          context.textBaseline = "middle";
          renderBands.forEach((points, index) => {
            if (!points.length) return;
            const hueBand = Math.floor(index / strengthBandCount);
            const strengthBand = index % strengthBandCount;
            const strength = (strengthBand + .5) / strengthBandCount;
            context.globalCompositeOperation = "destination-out";
            context.globalAlpha = .04 + strength * .76;
            points.forEach(point => context.fillText(point.originalGlyph, point.originX, point.originY));
            context.globalCompositeOperation = "source-over";
            context.globalAlpha = .05 + strength * .92;
            context.fillStyle = `hsl(${hueBand / hueBandCount * 360} 94% ${61 + strength * 12}%)`;
            points.forEach(point => context.fillText(point.heatedGlyph, point.x, point.y));
          });
          context.restore();
        }

        if (isTraveling) {
          context.globalAlpha = .16;
          context.drawImage(baseLayer, driftX + 7, driftY - 3);
        }
      }
      context.globalAlpha = 1;
      frame = requestAnimationFrame(animate);
    };
    image.onload = () => {
      sourceContext.clearRect(0, 0, width, height);
      sourceContext.filter = "blur(10px) saturate(1.45) contrast(.96)";
      sourceContext.drawImage(image, 0, 0, width, height);
      sourceContext.filter = "none";
      const pixels = sourceContext.getImageData(0, 0, width, height).data;
      const gridStep = 4;
      baseContext.font = glyphFont;
      baseContext.textAlign = "center";
      baseContext.textBaseline = "middle";
      for (let y = 1; y < height; y += gridStep) for (let x = 1; x < width; x += gridStep) {
        const index = (y * width + x) * 4;
        const red = pixels[index]; const green = pixels[index + 1]; const blue = pixels[index + 2]; const alpha = pixels[index + 3];
        const brightness = (red + green + blue) / 3;
        const chroma = Math.max(red, green, blue) - Math.min(red, green, blue);
        if (alpha > 10 && brightness < 253 && brightness > 35 && chroma > 5) {
          const seed = (x * 17 + y * 31) % 97;
          const signal = Math.min(1, chroma / 255 * .58 + (1 - brightness / 255) * .42);
          const glyphIndex = Math.max(0, Math.min(asciiGlyphs.length - 1, Math.floor(signal * asciiGlyphs.length + seed / 97 * .8)));
          baseContext.globalAlpha = Math.min(.98, .82 + alpha / 255 * .16);
          baseContext.fillStyle = `rgb(${red},${green},${blue})`;
          baseContext.fillText(asciiGlyphs[glyphIndex], x, y);
          const particle = { x, y, glyphIndex, phase: seed * .13 };
          const bucketColumn = Math.min(bucketColumns - 1, Math.floor(x / bucketSize));
          const bucketRow = Math.min(bucketRows - 1, Math.floor(y / bucketSize));
          particleBuckets[bucketRow * bucketColumns + bucketColumn].push(particle);
        }
      }
      baseContext.globalAlpha = 1;
      ready = true;
    };
    image.src = "/homepage-color-only.png";
    window.addEventListener("pointermove", handlePointer, { passive: true });
    window.addEventListener("pointerleave", handleLeave);
    frame = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("pointermove", handlePointer); window.removeEventListener("pointerleave", handleLeave); };
  }, []);
  return <canvas ref={canvasRef} className="particle-organism" aria-hidden="true" />;
}

function LineworkOverlay() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const width = 1040;
    const height = 555;
    canvas.width = width;
    canvas.height = height;
    const image = new Image();
    image.onload = () => {
      context.drawImage(image, 0, 0, width, height);
      const frame = context.getImageData(0, 0, width, height);
      const pixels = frame.data;
      for (let index = 0; index < pixels.length; index += 4) {
        const red = pixels[index];
        const green = pixels[index + 1];
        const blue = pixels[index + 2];
        const sourceAlpha = pixels[index + 3] / 255;
        const luminance = red * .299 + green * .587 + blue * .114;
        const chroma = Math.max(red, green, blue) - Math.min(red, green, blue);
        const alpha = chroma < 48 && luminance < 210 ? Math.min(255, Math.max(0, (210 - luminance) * 2.15)) * sourceAlpha : 0;
        pixels[index] = 10;
        pixels[index + 1] = 10;
        pixels[index + 2] = 10;
        pixels[index + 3] = alpha;
      }
      context.clearRect(0, 0, width, height);
      context.putImageData(frame, 0, 0);
    };
    image.src = "/homepage-particle-source.png";
  }, []);
  return <canvas ref={canvasRef} className="linework-organism" aria-hidden="true" />;
}

function PointCloudOrganism({ zoomed, traveling }) {
  const mountRef = useRef(null);
  const stateRef = useRef({ zoomed, traveling, pointerX: 0, pointerY: 0 });
  useEffect(() => { stateRef.current.zoomed = zoomed; stateRef.current.traveling = traveling; }, [zoomed, traveling]);
  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, .01, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xffffff, 0);
    mount.appendChild(renderer.domElement);
    const group = new THREE.Group();
    scene.add(group);
    let cloud;
    let frame;
    const palette = [new THREE.Color("#ed654d"), new THREE.Color("#eee477"), new THREE.Color("#9bc49a"), new THREE.Color("#7f9fc5"), new THREE.Color("#73c8d1")];
    const loader = new GLTFLoader();
    loader.load("/organism.glb", gltf => {
      const positions = [];
      gltf.scene.updateMatrixWorld(true);
      gltf.scene.traverse(object => {
        if (!object.isMesh || !object.geometry?.attributes?.position) return;
        const attribute = object.geometry.attributes.position;
        const step = Math.max(1, Math.ceil(attribute.count / 22000));
        for (let index = 0; index < attribute.count; index += step) {
          const point = new THREE.Vector3().fromBufferAttribute(attribute, index).applyMatrix4(object.matrixWorld);
          positions.push(point.x, point.y, point.z);
        }
      });
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      geometry.computeBoundingBox();
      const box = geometry.boundingBox;
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      geometry.translate(-center.x, -center.y, -center.z);
      const colors = [];
      const color = new THREE.Color();
      const position = geometry.attributes.position;
      for (let index = 0; index < position.count; index++) {
        const normalizedX = position.getX(index) / Math.max(size.x, .001) + .5;
        const normalizedY = position.getY(index) / Math.max(size.y, .001) + .5;
        const palettePosition = Math.min(.999, Math.max(0, normalizedX * .68 + normalizedY * .32)) * (palette.length - 1);
        const start = Math.floor(palettePosition);
        color.copy(palette[start]).lerp(palette[Math.min(start + 1, palette.length - 1)], palettePosition - start);
        colors.push(color.r, color.g, color.b);
      }
      geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      const material = new THREE.PointsMaterial({ size: Math.max(size.x, size.y, size.z) / 260, vertexColors: true, transparent: true, opacity: .92, sizeAttenuation: true });
      cloud = new THREE.Points(geometry, material);
      group.add(cloud);
      const maxDimension = Math.max(size.x, size.y, size.z);
      camera.position.set(0, 0, maxDimension * 2.25);
      camera.near = maxDimension / 100;
      camera.far = maxDimension * 10;
      camera.updateProjectionMatrix();
    });
    const resize = () => {
      const rect = mount.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / Math.max(rect.height, 1);
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    const pointerMove = event => {
      const rect = mount.getBoundingClientRect();
      stateRef.current.pointerX = ((event.clientX - rect.left) / rect.width - .5) * 2;
      stateRef.current.pointerY = ((event.clientY - rect.top) / rect.height - .5) * 2;
    };
    window.addEventListener("pointermove", pointerMove, { passive: true });
    const animate = time => {
      const state = stateRef.current;
      const targetY = state.pointerX * .32 + time * .000035;
      const targetX = -state.pointerY * .16;
      group.rotation.y += (targetY - group.rotation.y) * .035;
      group.rotation.x += (targetX - group.rotation.x) * .035;
      const targetScale = state.zoomed ? 1.08 : 1;
      group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), .04);
      if (cloud) {
        cloud.material.size += ((state.zoomed ? cloud.geometry.boundingBox.getSize(new THREE.Vector3()).length() / 420 : cloud.geometry.boundingBox.getSize(new THREE.Vector3()).length() / 560) - cloud.material.size) * .04;
        cloud.material.opacity = state.traveling ? .58 : .92;
        cloud.rotation.z = Math.sin(time * .00025) * .018;
      }
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    resize();
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", pointerMove);
      group.traverse(object => { object.geometry?.dispose(); object.material?.dispose(); });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);
  return <div ref={mountRef} className="point-cloud-organism" aria-label="Interactive three-dimensional point cloud organism" role="img" />;
}

function Home() {
  const [activeNode, setActiveNode] = useState(null);
  const [panMotion, setPanMotion] = useState("");
  const [visitedNodes, setVisitedNodes] = useState(() => {
    try {
      const storedNodes = JSON.parse(window.sessionStorage.getItem("portfolio-node-visits") || "[]");
      return Array.isArray(storedNodes) ? storedNodes : [];
    } catch {
      return [];
    }
  });
  const dragStart = useRef(null);
  const justDragged = useRef(false);
  const motionTimer = useRef(null);
  const nodes = [
    { href: "/physical/decay", label: "Decay", code: "01", x: 13.1, y: 25.5, side: "right", image: data.projects["/physical/decay"].images[0], meta: "Kinetic Sculpture + Physical Computing" },
    { href: "/digital/deficit", label: "Deficit", code: "02", x: 35.1, y: 49.8, side: "right", image: data.projects["/digital/deficit"].images[0], meta: "Virtual Reality Simulation" },
    { href: "/digital-sociology-study", label: "Digital Sociology Study", code: "03", x: 51.6, y: 49.8, side: "left", image: data.study.images[0], meta: "Networked VR Installation · 2025", primary: true },
    { href: "/physical/storiesonskin", label: "Stories on Skin", code: "04", x: 68.1, y: 49.8, side: "left", image: data.projects["/physical/storiesonskin"].images[0], meta: "Interactive Cast Installation" },
    { href: "/digital/merimnao", label: "Merimnao", code: "05", x: 75.9, y: 32.6, side: "left", image: data.projects["/digital/merimnao"].images[0], meta: "Surreal Maze Video Game" },
    { href: "/digital/biotic-gallery", label: "Biotic Gallery", code: "06", x: 49.4, y: 84.6, side: "left", image: data.projects["/digital/biotic-gallery"].images[0], meta: "Virtual Gallery Environment" },
    { href: "/digital/witches-flight-3d", label: "Witches' Flight 3D", code: "07", x: 26, y: 90.9, side: "right", image: "/assets/witches-render-frame.png", meta: "3D Painting Reconstruction" },
    { href: "/for-clients/mcadxellwas", label: "MCAD × Ellwas", code: "08", x: 13.4, y: 75.5, side: "right", image: data.projects["/for-clients/mcadxellwas"].images[0], meta: "Interactive Museum Experience + Light System" },
  ];
  const unvisitedCount = nodes.filter(node => !visitedNodes.includes(node.href)).length;
  const openNode = node => {
    setVisitedNodes(currentNodes => {
      if (currentNodes.includes(node.href)) return currentNodes;
      const nextNodes = [...currentNodes, node.href];
      try {
        window.sessionStorage.setItem("portfolio-node-visits", JSON.stringify(nextNodes));
      } catch {
        // The in-memory visited state still works when session storage is unavailable.
      }
      return nextNodes;
    });
    setActiveNode(node);
  };
  const moveNode = direction => {
    const current = Math.max(0, nodes.findIndex(node => node.href === activeNode?.href));
    setPanMotion(direction > 0 ? "pan-next" : "pan-prev");
    openNode(nodes[(current + direction + nodes.length) % nodes.length]);
    window.clearTimeout(motionTimer.current);
    motionTimer.current = window.setTimeout(() => setPanMotion(""), 950);
  };
  const startDrag = event => {
    if (!activeNode || event.target.closest("button, a")) return;
    justDragged.current = false;
    dragStart.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add("is-dragging");
  };
  const endDrag = event => {
    event.currentTarget.classList.remove("is-dragging");
    if (!dragStart.current) return;
    const distanceX = event.clientX - dragStart.current.x;
    const distanceY = event.clientY - dragStart.current.y;
    dragStart.current = null;
    const isPortraitMobile = window.matchMedia("(max-width: 700px) and (orientation: portrait)").matches;
    const primaryDistance = isPortraitMobile ? distanceY : distanceX;
    const crossDistance = isPortraitMobile ? distanceX : distanceY;
    if (Math.abs(primaryDistance) > 55 && Math.abs(primaryDistance) > Math.abs(crossDistance)) {
      justDragged.current = true;
      moveNode(primaryDistance < 0 ? 1 : -1);
      window.setTimeout(() => { justDragged.current = false; }, 50);
    }
  };
  const closePreviewFromMap = event => {
    if (!activeNode || justDragged.current || event.target.closest("button, a, .node-panel")) return;
    setActiveNode(null);
  };
  useEffect(() => {
    if (!activeNode) return undefined;
    const handleKey = event => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") moveNode(1);
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") moveNode(-1);
      if (event.key === "Escape") setActiveNode(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeNode]);
  return (
    <main className={activeNode ? "home is-previewing" : "home"}>
      <CommandHeader path="/" />
      <section className={`diagram-stage ${activeNode ? "is-zoomed" : ""} ${panMotion}`} aria-label="Interactive portfolio map">
        <div className="diagram-viewport" onClick={closePreviewFromMap} onPointerDown={startDrag} onPointerUp={endDrag} onPointerCancel={endDrag}>
          <div className="diagram-orientation">
            <div className="diagram-wrap" style={activeNode ? {
              transformOrigin: `${activeNode.x}% ${activeNode.y}%`,
              "--node-shift-x": `${44 - activeNode.x}%`,
              "--node-shift-y": `${50 - activeNode.y}%`,
              "--node-mobile-shift-x": `${34 - activeNode.x}%`,
            } : undefined}>
              <ParticleOrganism zoomed={Boolean(activeNode)} traveling={Boolean(panMotion)} />
              <LineworkOverlay />
              {nodes.map(node => (
                <button key={node.href} type="button" onClick={() => openNode(node)} className={`map-node node-${node.side} ${node.primary ? "map-node--primary" : ""} ${visitedNodes.includes(node.href) ? "is-visited" : "is-awaiting-input"} ${activeNode?.href === node.href ? "active" : ""}`} style={{ left: `${node.x}%`, top: `${node.y}%` }} aria-label={`${visitedNodes.includes(node.href) ? "Reopen" : "Open flashing"} project preview: ${node.label}`} aria-pressed={activeNode?.href === node.href}>
                  <span className="node-core" />
                  <span className="node-label" aria-hidden="true">
                    <span className="node-window-bar"><b>SYS://NODE.{node.code}</b><i>SIGNAL:LIVE</i></span>
                    <span className="node-window-visual">
                      <img className="node-window-project" src={node.image} alt="" />
                      <span className="node-window-scan" />
                    </span>
                    <span className="node-window-copy"><b>{node.code}</b><span>{node.label}</span></span>
                    <span className="node-window-data"><i>X:{node.x.toFixed(1)}</i><i>Y:{node.y.toFixed(1)}</i><i>OPEN SIGNAL</i></span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        {!activeNode && <aside className="map-instruction" role="note" aria-label="How to explore the project map">
          <strong>EXPLORE THE PROJECT MAP</strong>
          <span>Click or tap a flashing node to open a project.</span>
          <small>{unvisitedCount ? `${String(unvisitedCount).padStart(2, "0")} SIGNALS WAITING` : "ALL SIGNALS LOCATED"}</small>
        </aside>}
        {activeNode && <aside key={activeNode.href} className="node-panel" aria-live="polite">
          <button type="button" className="zoom-back" onClick={() => setActiveNode(null)}>← RETURN TO MAP</button>
          <span>NODE {activeNode.code} / SELECTED</span>
          <div className="panel-image-frame">
            <img className="panel-image" src={activeNode.image} alt={`Preview of ${activeNode.label}`} />
            <span className="panel-image-transmission" aria-hidden="true"><b>IMAGE://DECODE</b><i>100%</i></span>
            <span className="panel-image-scan" aria-hidden="true" />
          </div>
          <h2>{activeNode.label}</h2>
          <p>{activeNode.meta}</p>
          <div className="node-pager" aria-label="Move between organism nodes">
            <button type="button" onClick={() => moveNode(-1)} aria-label="Previous node">← PREV</button>
            <span>{activeNode.code} / {String(nodes.length).padStart(2, "0")}</span>
            <button type="button" onClick={() => moveNode(1)} aria-label="Next node">NEXT →</button>
          </div>
          <Link href={activeNode.href} className="enter-node">VIEW PROJECT ↗</Link>
        </aside>}
        {panMotion && <div className="scan-sweep" aria-hidden="true" />}
        {activeNode && <div className="drag-hint"><span className="drag-hint-horizontal">← DRAG TO PAN →</span><span className="drag-hint-vertical">SWIPE ↑ / ↓</span></div>}
        <div className="axis axis-x">0——— signal / matter / memory ———100</div>
        <div className="axis axis-y">LIVE ARCHIVE</div>
      </section>
      <Footer />
    </main>
  );
}

function Collection({ type }) {
  return (
    <>
      <main className={`collection collection-${type}`}>
        {data.collections[type].map(card => (
          <Link href={card.href} className={`work-card ${card.image ? "" : "text-card"}`} key={card.href}>
            {card.image && <img src={card.image} alt="" />}
            <span>{card.title}</span>
          </Link>
        ))}
      </main>
      <Footer />
    </>
  );
}

const projectChapterLayouts = {
  "/digital/collection": {
    heroMode: "index",
    chapters: [
      { titleIndexes: [0], contentIndexes: [1, 2, 3], linkIndexes: [0] },
      { titleIndexes: [4], contentIndexes: [5, 6, 7], embedIndexes: [0, 1] },
      { titleIndexes: [8], contentIndexes: [9, 10, 11], embedIndexes: [2], linkIndexes: [1] },
      { titleIndexes: [12], contentIndexes: [13, 14, 15], embedIndexes: [3], linkIndexes: [2] },
      { titleIndexes: [16], contentIndexes: [17, 18, 19], embedIndexes: [4], linkIndexes: [3, 4] },
      { titleIndexes: [20], contentIndexes: [21, 22, 23], imageIndexes: [0], linkIndexes: [5, 6] },
    ],
  },
  "/physical/theater-production-work": {
    heroMode: "image",
    heroImageIndex: 0,
    chapters: [
      { titleIndexes: [0], contentIndexes: [1, 2], imageIndexes: [1, 2] },
      { titleIndexes: [3], contentIndexes: [4, 5], imageIndexes: [3, 4] },
      { titleIndexes: [6, 7], contentIndexes: [8, 9], imageIndexes: [5, 6] },
    ],
  },
  "/for-clients/aippy": {
    heroMode: "embed",
    heroEmbedIndex: 0,
    chapters: [
      { titleIndexes: [0], contentIndexes: [1, 2, 3], linkIndexes: [0, 1], heroMediaNote: "FEATURED ABOVE" },
      { titleIndexes: [4], contentIndexes: [5, 6, 7], embedIndexes: [1], linkIndexes: [2] },
    ],
  },
};

const projectLayoutOverrides = {
  "/physical/african-bullfrog": {
    heroMode: "model",
    modelSrc: "/models/african-bullfrog/frog-scan.glb",
    excludedEmbedIndexes: [0],
  },
  "/digital/merimnao": {
    heroMode: "embed",
    heroEmbedIndex: 0,
    recordIndexes: [1, 2, 3, 4, 5],
    excludedEmbedIndexes: [0],
    imageIndexes: [0, 1, 2],
    imageCarousel: true,
    mediaHeading: "GAME STILLS",
    titleClass: "is-long",
  },
};

function takeIndexes(items = [], indexes = []) {
  return indexes.map(index => items[index]).filter(Boolean);
}

function getProjectGroup(path) {
  const routeGroup = path.split("/")[1];
  if (routeGroup === "physical") return { key: "physical", collectionKey: "physical", label: "PHYSICAL", code: "MAT" };
  if (routeGroup === "for-clients") return { key: "client", collectionKey: "clients", label: "CLIENT WORK", code: "COM" };
  return { key: "digital", collectionKey: "digital", label: "DIGITAL", code: "DIG" };
}

function getProjectRouteContext(path) {
  const group = getProjectGroup(path);
  const entries = data.collections[group.collectionKey] || [];
  const index = Math.max(0, entries.findIndex(entry => entry.href === path));
  return {
    ...group,
    index,
    total: entries.length,
    previous: index > 0 ? entries[index - 1] : null,
    next: index < entries.length - 1 ? entries[index + 1] : null,
  };
}

function getProjectYear(content = []) {
  return content.map(item => item.text.trim()).find(text => /^(?:19|20)\d{2}$/.test(text)) || "ARCHIVE";
}

function getProjectSummary(content = []) {
  const paragraphs = content.filter(item => item.tag === "p").map(item => item.text.trim());
  return paragraphs.find(text => text.length >= 80) || paragraphs.find(text => !/^(?:19|20)\d{2}$/.test(text)) || "Project record.";
}

function getProjectTags(content = [], summary = "") {
  return content
    .filter(item => item.tag === "p")
    .map(item => item.text.trim())
    .filter(text => text !== summary && !/^(?:19|20)\d{2}$/.test(text) && text.length <= 58)
    .slice(0, 3);
}

function ContentBlocks({ content, className = "" }) {
  return <div className={`project-copy ${className}`.trim()}>{content.map((item, index) => {
    const isYear = /^(?:19|20)\d{2}$/.test(item.text.trim());
    if (isYear) return <p className="project-record-year" key={index}>{item.text}</p>;
    if (item.tag === "h2") return <h2 key={index}>{item.text}</h2>;
    if (item.tag === "h3") return <h3 key={index}>{item.text}</h3>;
    return <p key={index}>{item.text}</p>;
  })}</div>;
}

function Gallery({ images, title, autoCycle = false, footerLabel = "PRIMARY VISUAL" }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => setIndex(0), [images]);
  useEffect(() => {
    if (!autoCycle || paused || !images || images.length < 2) return undefined;
    const timer = window.setInterval(() => setIndex(value => (value + 1) % images.length), 3200);
    return () => window.clearInterval(timer);
  }, [autoCycle, images, paused]);
  if (!images?.length) return null;
  const previous = () => setIndex(value => (value - 1 + images.length) % images.length);
  const next = () => setIndex(value => (value + 1) % images.length);
  return (
    <div
      className={`project-signal-frame project-gallery-frame${autoCycle ? " is-auto-cycling" : ""}`}
      onPointerEnter={() => autoCycle && setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => autoCycle && setPaused(true)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
    >
      <div className="project-frame-bar"><b>IMG://{String(index + 1).padStart(2, "0")}</b><span>{autoCycle ? `${paused ? "PAUSED" : "AUTO CYCLE"} / ${String(images.length).padStart(2, "0")}` : `${String(images.length).padStart(2, "0")} FILES / READY`}</span></div>
      <div className="project-gallery-visual">
        <img src={images[index]} alt={`${title}, image ${index + 1} of ${images.length}`} />
        {images.length > 1 && <>
          <button className="gallery-arrow previous" type="button" onClick={previous} aria-label="Previous image">&larr;</button>
          <button className="gallery-arrow next" type="button" onClick={next} aria-label="Next image">&rarr;</button>
        </>}
      </div>
      <div className="project-frame-footer"><span>{footerLabel}</span><b>{String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</b></div>
    </div>
  );
}

function ProjectEmbedFrame({ embed, index = 0, featured = false }) {
  if (!embed) return null;
  return (
    <div className={`project-signal-frame project-embed ${featured ? "is-featured" : ""}`}>
      <div className="project-frame-bar"><b>EMBED_{String(index + 1).padStart(2, "0")}</b><span>LIVE SIGNAL</span></div>
      <iframe
        src={embed.src}
        title={embed.title || `${index + 1} embedded media`}
        allow={embed.allow}
        allowFullScreen
        loading={featured ? "eager" : "lazy"}
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <div className="project-frame-footer"><span>{embed.title || "INTERACTIVE MEDIA"}</span><b>ONLINE</b></div>
    </div>
  );
}

function ProjectVideoFrame({ src, poster, index = 0, featured = false }) {
  if (!src) return null;
  return (
    <div className={`project-signal-frame project-video-frame ${featured ? "is-featured" : ""}`}>
      <div className="project-frame-bar"><b>VIDEO_{String(index + 1).padStart(2, "0")}</b><span>LOCAL MEDIA</span></div>
      <video controls preload="metadata" poster={poster}><source src={src} /></video>
      <div className="project-frame-footer"><span>MOVING IMAGE</span><b>PLAYBACK READY</b></div>
    </div>
  );
}

function ProjectSignalIndex({ project, layout }) {
  return (
    <nav className="project-signal-index" aria-label="Works in this project record">
      <div className="project-frame-bar"><b>SYS://RECORD.INDEX</b><span>{String(layout.chapters.length).padStart(2, "0")} ENTRIES</span></div>
      <div>
        {layout.chapters.map((chapter, index) => {
          const title = takeIndexes(project.content, chapter.titleIndexes).map(item => item.text).join(" ");
          return <a href={`#project-chapter-${index + 1}`} key={title}><b>{String(index + 1).padStart(2, "0")}</b><span>{title}</span><i aria-hidden="true">&darr;</i></a>;
        })}
      </div>
      <div className="project-frame-footer"><span>SELECT A RECORD</span><b>SCROLL TO LOCATE</b></div>
    </nav>
  );
}

function ProjectModelFrame({ src, title }) {
  const mountRef = useRef(null);
  const modelRootRef = useRef(null);
  const resetViewRef = useRef(() => {});
  const [loadState, setLoadState] = useState("loading");
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !src) return undefined;

    let disposed = false;
    let frame = 0;
    let isVisible = true;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe8ecea);
    const camera = new THREE.PerspectiveCamera(34, 1, 0.01, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.enablePan = false;
    controls.autoRotate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    controls.autoRotateSpeed = 0.55;
    controls.addEventListener("start", () => { controls.autoRotate = false; });

    scene.add(new THREE.HemisphereLight(0xffffff, 0x768075, 2.6));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.6);
    keyLight.position.set(4, 6, 7);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0x8fb1ff, 1.5);
    fillLight.position.set(-5, 1, 3);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0xffb199, 1.2);
    rimLight.position.set(2, 3, -5);
    scene.add(rimLight);

    const modelRoot = new THREE.Group();
    modelRootRef.current = modelRoot;
    scene.add(modelRoot);
    let initialCamera = new THREE.Vector3(0, 0, 5);

    const resetView = () => {
      modelRoot.rotation.set(0, 0, 0);
      camera.position.copy(initialCamera);
      controls.target.set(0, 0, 0);
      controls.autoRotate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      controls.update();
    };
    resetViewRef.current = resetView;

    new GLTFLoader().load(src, gltf => {
      if (disposed) return;
      const model = gltf.scene;
      model.traverse(node => {
        if (!node.isMesh) return;
        node.castShadow = false;
        node.receiveShadow = false;
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        materials.filter(Boolean).forEach(material => {
          material.map && (material.map.anisotropy = renderer.capabilities.getMaxAnisotropy());
          material.needsUpdate = true;
        });
      });
      const bounds = new THREE.Box3().setFromObject(model);
      const center = bounds.getCenter(new THREE.Vector3());
      const size = bounds.getSize(new THREE.Vector3());
      const radius = Math.max(bounds.getBoundingSphere(new THREE.Sphere()).radius, 0.01);
      model.position.copy(center).multiplyScalar(-1);
      modelRoot.add(model);

      const distance = radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)) * 1.12;
      initialCamera = new THREE.Vector3(distance * 0.62, distance * 0.32, distance);
      camera.near = Math.max(radius / 100, 0.001);
      camera.far = radius * 30;
      camera.position.copy(initialCamera);
      camera.updateProjectionMatrix();
      controls.minDistance = radius * 1.15;
      controls.maxDistance = radius * 7;
      controls.target.set(0, Math.min(size.y * 0.035, radius * 0.08), 0);
      controls.update();
      setLoadProgress(100);
      setLoadState("ready");
    }, event => {
      if (!disposed && event.total) setLoadProgress(Math.round(event.loaded / event.total * 100));
    }, () => {
      if (!disposed) setLoadState("error");
    });

    const resize = () => {
      const width = Math.max(mount.clientWidth, 1);
      const height = Math.max(mount.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    const visibilityObserver = new IntersectionObserver(entries => {
      isVisible = entries[0]?.isIntersecting ?? true;
    });
    visibilityObserver.observe(mount);

    const animate = () => {
      if (isVisible) {
        controls.update();
        renderer.render(scene, camera);
      }
      frame = window.requestAnimationFrame(animate);
    };
    resize();
    frame = window.requestAnimationFrame(animate);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      controls.dispose();
      modelRoot.traverse(node => {
        node.geometry?.dispose();
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        materials.filter(Boolean).forEach(material => {
          Object.values(material).forEach(value => value?.isTexture && value.dispose());
          material.dispose();
        });
      });
      renderer.dispose();
      renderer.domElement.remove();
      modelRootRef.current = null;
    };
  }, [src]);

  const handleKeyDown = event => {
    const root = modelRootRef.current;
    if (!root) return;
    if (event.key === "r" || event.key === "R") {
      event.preventDefault();
      resetViewRef.current();
      return;
    }
    const rotationKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    if (!rotationKeys.includes(event.key)) return;
    event.preventDefault();
    if (event.key === "ArrowLeft") root.rotation.y -= 0.16;
    if (event.key === "ArrowRight") root.rotation.y += 0.16;
    if (event.key === "ArrowUp") root.rotation.x -= 0.12;
    if (event.key === "ArrowDown") root.rotation.x += 0.12;
  };

  return (
    <div className="project-signal-frame project-model-frame">
      <div className="project-frame-bar"><b>SCAN://8K_MESH</b><span>{loadState === "ready" ? "INTERACTIVE / READY" : loadState === "error" ? "LOAD ERROR" : `LOADING / ${String(loadProgress).padStart(3, "0")}%`}</span></div>
      <div
        ref={mountRef}
        className="project-model-visual"
        role="img"
        tabIndex="0"
        aria-label={`Interactive 3D scan of ${title}. Drag to rotate, scroll or pinch to zoom, or use the arrow keys.`}
        onKeyDown={handleKeyDown}
      >
        {loadState !== "ready" && <span className={`project-model-status is-${loadState}`}>{loadState === "error" ? "MODEL SIGNAL LOST" : `LOCATING 3D SCAN / ${loadProgress}%`}</span>}
        <span className="project-model-axis" aria-hidden="true">X/Y/Z</span>
      </div>
      <div className="project-frame-footer project-model-footer"><span>DRAG TO ROTATE / SCROLL OR PINCH TO ZOOM</span><button type="button" onClick={() => resetViewRef.current()}>RESET VIEW</button></div>
    </div>
  );
}

function ProjectHeroMedia({ project, layout }) {
  const videos = (project.media || []).filter(src => /\.(mp4|webm)(?:$|\?)/i.test(src));
  const audio = (project.media || []).filter(src => /\.(mp3|wav|ogg)(?:$|\?)/i.test(src));
  const mode = layout?.heroMode || (videos.length ? "video" : project.images?.length ? "image" : project.embeds?.length ? "embed" : audio.length ? "audio" : "index");
  if (mode === "index") return <ProjectSignalIndex project={project} layout={layout} />;
  if (mode === "embed") {
    const embedIndex = layout?.heroEmbedIndex || 0;
    return <ProjectEmbedFrame embed={project.embeds?.[embedIndex]} index={embedIndex} featured />;
  }
  if (mode === "video") return <ProjectVideoFrame src={videos[0]} poster={project.mediaPosters?.[0]} featured />;
  if (mode === "audio") return <div className="project-audio-frame"><span>AUDIO SIGNAL</span><audio controls preload="metadata"><source src={audio[0]} /></audio></div>;
  if (mode === "model") return <ProjectModelFrame src={layout.modelSrc} title={project.title} />;
  const heroImages = Number.isInteger(layout?.heroImageIndex) ? [project.images[layout.heroImageIndex]] : project.images;
  return <Gallery images={heroImages} title={project.title} />;
}

function ProjectLinks({ links }) {
  if (!links?.length) return null;
  return (
    <section className="project-links" aria-label="Project links">
      <span>PROJECT LINKS / {String(links.length).padStart(2, "0")}</span>
      <div>{links.map((link, index) => (
        <a href={link.href} target="_blank" rel="noreferrer" key={`${link.href}-${link.label}`}>
          <b>{String(index + 1).padStart(2, "0")}</b><span>{link.label}</span><i aria-hidden="true">↗</i>
        </a>
      ))}</div>
    </section>
  );
}

const bioticMapNodes = [
  { code: "01", x: 23.9, y: 35.1, label: "Dark cathedral grove", side: "right", image: "/assets/148-76c3c5cd0a73.png" },
  { code: "02", x: 48.3, y: 15.4, label: "Purple crystal pod", side: "right", image: "/assets/146-7f006a0cf70e.png" },
  { code: "03", x: 79.7, y: 19.6, label: "Neon rib canopy", side: "left", image: "/assets/144-bee9d8294ed8.png" },
  { code: "04", x: 49.9, y: 63.2, label: "Flower grove", side: "right", image: "/assets/151-69783d19f380.webp" },
  { code: "05", x: 22.2, y: 84.6, label: "White creature", side: "up-right", image: "/assets/142-6473479be4c0.png" },
  { code: "06", x: 85.1, y: 78.7, label: "Hanging flowers", side: "up-left", image: "/assets/149-da1474f97d37.png" },
];

function BioticGallery({ project }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const activeNode = hoveredIndex === null ? null : bioticMapNodes[hoveredIndex];
  return (
    <>
      <main className="biotic-gallery-page">
        <section className="biotic-gallery-hero" aria-labelledby="biotic-gallery-title">
          <div className="biotic-map-column">
            <div className="biotic-window-bar"><b>SYS://BIOTIC.NETWORK</b><span>06 NODES / CONNECTED</span></div>
            <div className="biotic-map-stage">
              <img className="biotic-map-image" src="/assets/biotic-gallery-map.png" alt="Green halftone Biotic Gallery organism" />
              {bioticMapNodes.map((node, index) => (
                <div
                  className={`biotic-node biotic-node--${node.side}`}
                  key={node.code}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  aria-label={`Hover to preview image for ${node.label}`}
                  onPointerEnter={() => setHoveredIndex(index)}
                  onPointerLeave={() => setHoveredIndex(null)}
                >
                  <span className="biotic-node-core" />
                  <span className="biotic-node-label" aria-hidden="true">NODE_{node.code}</span>
                  <span className="biotic-node-popout" aria-hidden={hoveredIndex !== index}>
                    <img src={node.image} alt="" />
                    <span>IMAGE_{node.code}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="biotic-map-footer"><span>BLACK DOTS / SIGNAL PATHS</span><span>HOVER TO TRACE</span></div>
          </div>

          <aside className="biotic-gallery-console">
            <header className="biotic-gallery-heading">
              <span>PROJECT_2024 / UNREAL ENVIRONMENT</span>
              <h1 id="biotic-gallery-title">BIOTIC<br />GALLERY</h1>
              <p>A gallery of organics in Unreal Engine.</p>
              <p>All assets were designed and poly-modeled in Maya, textured in Substance Painter, and shaded in Unreal 5.</p>
              <div className="biotic-meta"><span>PRATT INSTITUTE</span><span>MAYA</span><span>UNREAL 5</span></div>
            </header>

            <section className="biotic-network-note" aria-live="polite" aria-label="Biotic network status">
              <span>NETWORK://{activeNode ? "TRACED" : "IDLE"}</span>
              <strong>{activeNode ? `NODE_${activeNode.code} ACTIVE` : "SELECT A BLACK DOT"}</strong>
              <p>{activeNode ? `${activeNode.label} is connected through the Riso signal map.` : "Six points follow the branching paths through the organism."}</p>
            </section>
          </aside>
        </section>

        <ProjectLinks links={project.links} />
      </main>
      <Footer />
    </>
  );
}

const storiesOnSkinPieces = [
  { id: "01", image: "/assets/stories-on-skin/cast-01-legs.png", label: "Silicone cast of a torso and legs", x: 3, y: 3, width: 21.5, rotate: -1.8, frameOffset: 0 },
  { id: "02", image: "/assets/stories-on-skin/cast-02-side.png", label: "Small pale silicone torso cast", x: 32, y: 10, width: 14, rotate: 2.2, frameOffset: 2 },
  { id: "03", image: "/assets/stories-on-skin/cast-03-vertical.png", label: "Vertical silicone cast with a long scar", x: 78, y: 54, width: 12.5, rotate: -1.1, frameOffset: 1 },
  { id: "04", image: "/assets/stories-on-skin/cast-04-back.png", label: "Dark silicone back cast with a raised scar", x: 8, y: 40, width: 22, rotate: 1.4, frameOffset: 1 },
  { id: "05", image: "/assets/stories-on-skin/cast-05-chest.png", label: "Wide silicone chest cast with a horizontal scar", x: 17, y: 58, width: 49, rotate: -.6, frameOffset: 2 },
];

const storiesOnSkinFrames = [
  { src: "/assets/196-733644c8c42a.jpg", position: "24% 50%", label: "Scar surface, close study" },
  { src: "/assets/196-733644c8c42a.jpg", position: "56% 48%", label: "Silicone texture, macro study" },
  { src: "/assets/195-0e01536c3dfa.jpg", position: "53% 43%", label: "Installation detail with touch interaction" },
  { src: "/assets/033-e4941318f782.webp", position: "43% 48%", label: "Three casts installed on the gallery wall" },
];

const storiesOnSkinChestFrames = [
  { src: "/assets/stories-on-skin/chest-closeup-01.jpg", position: "50% 50%", label: "Chest scar, close study 01" },
  { src: "/assets/stories-on-skin/chest-closeup-02.jpg", position: "50% 50%", label: "Chest scar, close study 02" },
];

const storiesOnSkinKneeFrames = [
  { src: "/assets/stories-on-skin/knee-closeup-01.jpg", position: "50% 50%", label: "Knee scar, close study 01" },
  { src: "/assets/stories-on-skin/knee-closeup-02.jpg", position: "50% 50%", label: "Knee cast in the exhibition, close study 02" },
  { src: "/assets/stories-on-skin/knee-closeup-03.jpg", position: "50% 50%", label: "Knee scar, close study 03" },
  { src: "/assets/stories-on-skin/knee-closeup-04.jpg", position: "50% 50%", label: "Knee scar, close study 04" },
];

const storiesOnSkinThighFrames = [
  { src: "/assets/stories-on-skin/thigh-closeup-01.jpg", position: "50% 50%", label: "Thigh scar, close study 01" },
  { src: "/assets/stories-on-skin/thigh-closeup-02.jpg", position: "50% 50%", label: "Thigh scar, close study 02" },
];

const storiesOnSkinSideFrames = [
  { src: "/assets/stories-on-skin/side-closeup-01.jpg", position: "50% 50%", label: "Side scar, close study 01" },
  { src: "/assets/stories-on-skin/side-closeup-02.jpg", position: "50% 50%", label: "Side scar, close study 02" },
];

const storiesOnSkinArmFrames = [
  { src: "/assets/stories-on-skin/arm-closeup-01.jpg", position: "50% 50%", label: "Arm scar, close study 01" },
  { src: "/assets/stories-on-skin/arm-closeup-02.jpg", position: "50% 50%", label: "Arm scar, close study 02" },
  { src: "/assets/stories-on-skin/arm-closeup-03.jpg", position: "50% 50%", label: "Arm scar, close study 03" },
  { src: "/assets/stories-on-skin/arm-closeup-04.jpg", position: "50% 50%", label: "Arm scar, close study 04" },
  { src: "/assets/stories-on-skin/arm-closeup-05.jpg", position: "50% 50%", label: "Arm scar, close study 05" },
];

const storiesOnSkinFramesByPiece = {
  "01": storiesOnSkinThighFrames,
  "02": storiesOnSkinSideFrames,
  "03": storiesOnSkinArmFrames,
  "04": storiesOnSkinKneeFrames,
  "05": storiesOnSkinChestFrames,
};

function getSkinPreviewPosition(rect) {
  const gutter = 12;
  const compact = window.innerWidth <= 700;
  const width = compact ? Math.min(330, window.innerWidth - gutter * 2) : 300;
  const height = compact ? 250 : 268;
  if (compact) return { left: Math.max(gutter, (window.innerWidth - width) / 2), top: window.innerHeight - height - gutter, side: "bottom" };
  const spaceRight = window.innerWidth - rect.right;
  const side = spaceRight >= width + 34 ? "right" : "left";
  const left = side === "right" ? rect.right + 28 : rect.left - width - 28;
  const top = rect.top + rect.height / 2 - height / 2;
  return {
    left: Math.max(gutter, Math.min(window.innerWidth - width - gutter, left)),
    top: Math.max(gutter, Math.min(window.innerHeight - height - gutter, top)),
    side,
  };
}

function StoriesOnSkin({ project }) {
  const [activeId, setActiveId] = useState(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [previewPosition, setPreviewPosition] = useState({ left: 0, top: 0, side: "right" });
  const pieceRefs = useRef(new Map());
  const closeTimer = useRef(null);
  const activePiece = storiesOnSkinPieces.find(piece => piece.id === activeId) || null;
  const activeFrames = storiesOnSkinFramesByPiece[activePiece?.id] || storiesOnSkinFrames;
  const frameOffset = activeFrames === storiesOnSkinFrames ? activePiece?.frameOffset || 0 : 0;
  const visibleFrameIndex = activePiece ? (frameIndex + frameOffset) % activeFrames.length : 0;
  const visibleFrame = activePiece ? activeFrames[visibleFrameIndex] : null;

  const cancelClose = () => window.clearTimeout(closeTimer.current);
  const openPiece = (piece, element) => {
    cancelClose();
    setActiveId(piece.id);
    setFrameIndex(0);
    setPreviewPosition(getSkinPreviewPosition(element.getBoundingClientRect()));
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setActiveId(null), 180);
  };

  useEffect(() => {
    if (!activePiece || activeFrames.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setInterval(() => {
      if (!document.hidden) setFrameIndex(index => (index + 1) % activeFrames.length);
    }, 1800);
    return () => window.clearInterval(timer);
  }, [activePiece]);

  useEffect(() => {
    if (!activeId) return undefined;
    const update = () => {
      const element = pieceRefs.current.get(activeId);
      if (element) setPreviewPosition(getSkinPreviewPosition(element.getBoundingClientRect()));
    };
    const closeOnEscape = event => { if (event.key === "Escape") setActiveId(null); };
    const closeOutside = event => {
      if (!event.target.closest(".skin-piece, .skin-preview-window")) setActiveId(null);
    };
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
      window.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [activeId]);

  useEffect(() => () => cancelClose(), []);

  const paragraphs = project.content.filter(item => item.tag === "p");
  const embed = project.embeds?.[0];
  return (
    <>
      <main className="stories-on-skin-page">
        <section className="skin-wall" aria-labelledby="stories-on-skin-title">
          <article className="skin-wall-note">
            <span>PROJECT_2023 / INTERACTIVE INSTALLATION</span>
            <h1 id="stories-on-skin-title">STORIES ON SKIN</h1>
            <p className="skin-materials">{paragraphs[0]?.text}</p>
            <p>{paragraphs[1]?.text}</p>
            <p>{paragraphs[2]?.text}</p>
            <p className="skin-wall-instruction"><b>HOVER / FOCUS / TAP</b> A CAST TO MOVE CLOSER.</p>
          </article>

          {storiesOnSkinPieces.map(piece => (
            <button
              className={`skin-piece skin-piece-${piece.id} ${activeId === piece.id ? "is-active" : ""}`}
              type="button"
              key={piece.id}
              ref={element => { if (element) pieceRefs.current.set(piece.id, element); else pieceRefs.current.delete(piece.id); }}
              style={{ "--skin-x": `${piece.x}%`, "--skin-y": `${piece.y}%`, "--skin-width": `${piece.width}%`, "--skin-rotate": `${piece.rotate}deg` }}
              aria-label={`Explore cast ${piece.id}: ${piece.label}`}
              aria-expanded={activeId === piece.id}
              aria-controls="skin-preview-window"
              onPointerEnter={event => { if (event.pointerType !== "touch") openPiece(piece, event.currentTarget); }}
              onPointerLeave={event => { if (event.pointerType !== "touch") scheduleClose(); }}
              onFocus={event => openPiece(piece, event.currentTarget)}
              onBlur={scheduleClose}
              onClick={event => openPiece(piece, event.currentTarget)}
            >
              <img className="skin-piece-art" src={piece.image} alt="" draggable="false" />
              <span className="skin-piece-number" aria-hidden="true">{piece.id}</span>
            </button>
          ))}

          {embed && <section className="skin-film" aria-label="Stories on Skin film">
            <div className="skin-film-bar"><b>DOCUMENT://FILM</b><span>08:24 / EXHIBITION RECORD</span></div>
            <iframe src={embed.src} title={embed.title || "Stories on Skin film"} allow={embed.allow} allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
          </section>}

          <div className="skin-wall-ledger" aria-hidden="true"><span>05 CASTS</span><span>05 LIVED RECORDS</span><span>TOUCH ENABLED</span></div>
        </section>

        {activePiece && visibleFrame && <aside
          id="skin-preview-window"
          className="skin-preview-window"
          data-side={previewPosition.side}
          style={{ left: previewPosition.left, top: previewPosition.top }}
          aria-live="polite"
          onPointerEnter={cancelClose}
          onPointerLeave={scheduleClose}
        >
          <div className="skin-preview-bar"><b>CAST_{activePiece.id}</b><span>DETAIL LOOP</span></div>
          <div className="skin-preview-visual" key={`${activePiece.id}-${frameIndex}`}>
            <img src={visibleFrame.src} alt={visibleFrame.label} style={{ objectPosition: visibleFrame.position }} />
            <span className="skin-preview-scan" aria-hidden="true" />
          </div>
          <div className="skin-preview-copy"><span>{visibleFrame.label}</span><b>{String(visibleFrameIndex + 1).padStart(2, "0")} / {String(activeFrames.length).padStart(2, "0")}</b></div>
        </aside>}
      </main>
      <Footer />
    </>
  );
}

function ProjectChapterLinks({ links }) {
  if (!links?.length) return null;
  return <div className="project-chapter-links">{links.map((link, index) => (
    <a href={link.href} target="_blank" rel="noreferrer" key={`${link.href}-${index}`}>
      <b>{String(index + 1).padStart(2, "0")}</b><span>{link.label}</span><i aria-hidden="true">&nearr;</i>
    </a>
  ))}</div>;
}

function ProjectChapterMedia({ project, chapter, chapterIndex }) {
  const images = takeIndexes(project.images, chapter.imageIndexes);
  const embeds = takeIndexes(project.embeds, chapter.embedIndexes);
  if (!images.length && !embeds.length) {
    return <div className="project-chapter-signal" aria-hidden="true"><span>RECORD_{String(chapterIndex + 1).padStart(2, "0")}</span><b>{chapter.heroMediaNote || "TEXT / RESEARCH ENTRY"}</b><i>ARCHIVE SIGNAL</i></div>;
  }
  return <div className="project-chapter-media">
    {embeds.map((embed, index) => <ProjectEmbedFrame embed={embed} index={(chapter.embedIndexes || [])[index]} key={embed.src} />)}
    {images.map((src, index) => <figure className="project-archive-image" key={src}>
      <div className="project-frame-bar"><b>IMG_{String((chapter.imageIndexes || [])[index] + 1).padStart(2, "0")}</b><span>ARCHIVE FILE</span></div>
      <img src={src} alt={`${project.title}, project image ${(chapter.imageIndexes || [])[index] + 1}`} loading="lazy" />
      <figcaption><span>PROJECT RECORD</span><b>{String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</b></figcaption>
    </figure>)}
  </div>;
}

function ProjectChapters({ project, layout }) {
  return (
    <section className="project-chapters" id="project-chapters" aria-labelledby="project-chapters-title">
      <header className="project-section-heading">
        <span>SECTION_01 / COMPOSITE RECORD</span>
        <h2 id="project-chapters-title">WORKS IN THIS RECORD</h2>
        <b>{String(layout.chapters.length).padStart(2, "0")} ENTRIES</b>
      </header>
      {layout.chapters.map((chapter, index) => {
        const title = takeIndexes(project.content, chapter.titleIndexes).map(item => item.text).join(" ");
        const content = takeIndexes(project.content, chapter.contentIndexes);
        const links = takeIndexes(project.links, chapter.linkIndexes);
        return (
          <article className="project-chapter" id={`project-chapter-${index + 1}`} key={`${title}-${index}`}>
            <ProjectChapterMedia project={project} chapter={chapter} chapterIndex={index} />
            <div className="project-chapter-copy">
              <span>ENTRY_{String(index + 1).padStart(2, "0")} / {String(layout.chapters.length).padStart(2, "0")}</span>
              <h2>{title}</h2>
              <ContentBlocks content={content} className="project-chapter-content" />
              <ProjectChapterLinks links={links} />
            </div>
          </article>
        );
      })}
    </section>
  );
}

function ProjectRecord({ content }) {
  return (
    <section className="project-record" id="project-record" aria-labelledby="project-record-title">
      <header>
        <span>SECTION_01 / PROJECT RECORD</span>
        <h2 id="project-record-title">ABOUT THE WORK</h2>
      </header>
      <ContentBlocks content={content} className="project-record-copy" />
    </section>
  );
}

function ProjectMediaArchive({ project, layout, heroMode }) {
  const archivedImages = layout.hideImages
    ? []
    : layout.imageIndexes
      ? takeIndexes(project.images, layout.imageIndexes)
      : (project.images || []);
  const videos = (project.media || []).filter(src => /\.(mp4|webm)(?:$|\?)/i.test(src));
  const audio = (project.media || []).filter(src => /\.(mp3|wav|ogg)(?:$|\?)/i.test(src));
  const archivedVideos = heroMode === "video" ? videos.slice(1) : videos;
  const archivedAudio = heroMode === "audio" ? audio.slice(1) : audio;
  const excludedEmbeds = new Set(layout.excludedEmbedIndexes || (heroMode === "embed" ? [layout.heroEmbedIndex || 0] : []));
  const archivedEmbeds = (project.embeds || []).map((embed, index) => ({ embed, index })).filter(item => !excludedEmbeds.has(item.index));
  const mediaTotal = archivedImages.length + archivedVideos.length + archivedAudio.length + archivedEmbeds.length;
  if (!mediaTotal) return null;
  return (
    <section className="project-media-archive" id="project-media" aria-labelledby="project-media-title">
      <header className="project-section-heading">
        <span>SECTION_02 / MEDIA INVENTORY</span>
        <h2 id="project-media-title">{layout.mediaHeading || "MEDIA ARCHIVE"}</h2>
        <b>{String(mediaTotal).padStart(2, "0")} FILES</b>
      </header>
      {!!archivedImages.length && (layout.imageCarousel
        ? <div className="project-media-carousel"><Gallery images={archivedImages} title={project.title} autoCycle footerLabel="GAME STILL" /></div>
        : <div className="project-media-grid">
          {archivedImages.map((src, index) => <figure className="project-archive-image" key={src}>
            <div className="project-frame-bar"><b>IMG_{String(index + 1).padStart(2, "0")}</b><span>ARCHIVE FILE</span></div>
            <img src={src} alt={`${project.title}, project image ${index + 1}`} loading="lazy" />
            <figcaption><span>FULL RECORD</span><b>{String(index + 1).padStart(2, "0")} / {String(archivedImages.length).padStart(2, "0")}</b></figcaption>
          </figure>)}
        </div>)}
      {!!archivedVideos.length && <div className="project-moving-media">
        {archivedVideos.map((src, index) => <ProjectVideoFrame src={src} poster={project.mediaPosters?.[index + (heroMode === "video" ? 1 : 0)]} index={index + (heroMode === "video" ? 1 : 0)} key={src} />)}
      </div>}
      {!!archivedEmbeds.length && <div className="project-embeds">
        {archivedEmbeds.map(({ embed, index }) => <ProjectEmbedFrame embed={embed} index={index} key={embed.src} />)}
      </div>}
      {!!archivedAudio.length && <div className="project-audio-list">{archivedAudio.map((src, index) => <div className="project-audio-frame" key={src}><span>AUDIO_{String(index + 1).padStart(2, "0")}</span><audio controls preload="metadata"><source src={src} /></audio></div>)}</div>}
    </section>
  );
}

function ProjectRoutePager({ context }) {
  return (
    <nav className="project-route-pager" aria-label="More projects in this collection">
      {context.previous ? <Link href={context.previous.href} className="project-route-link is-previous"><b>&larr; PREV</b><span>{context.previous.title}</span></Link> : <span className="project-route-edge">START OF {context.label} RECORD</span>}
      <span className="project-route-count">{String(context.index + 1).padStart(2, "0")} / {String(context.total).padStart(2, "0")}</span>
      {context.next ? <Link href={context.next.href} className="project-route-link is-next"><b>NEXT &rarr;</b><span>{context.next.title}</span></Link> : <span className="project-route-edge">END OF {context.label} RECORD</span>}
    </nav>
  );
}

const deficitObjectFiles = [
  { id: "MIKU", title: "Hatsune Miku", creator: "Tigerar1", source: "https://sketchfab.com/3d-models/hatsune-miku-34f3e7daa4c64c8a8000ae7f90b01ceb", src: "/models/deficit/miku/scene.gltf", color: 0x69d5d5, lane: "left", x: -0.4, y: 0.16, z: 0.1, scale: 2.8, drift: 0.12 },
  { id: "CUP_1951", title: "1951.304 Cup and Saucer", creator: "Cleveland Museum of Art", source: "https://sketchfab.com/3d-models/1951304-cup-and-saucer-59a0521a04e54f0093d45ed99cececa8", src: "/models/deficit/cup/scene.gltf", color: 0xf1ea45, lane: "right", x: 0.4, y: 0.28, z: -0.2, scale: 2.2, drift: 0.1 },
  { id: "ALLOSAURUS", title: "Allosaurus Fragilis", creator: "Thomas Flynn", source: "https://sketchfab.com/3d-models/allosaurus-fragilis-b30bd9c9d048435cb412bc76314cca62", src: "/models/deficit/allosaurus/scene.gltf", color: 0xec7064, lane: "left", x: -0.4, y: -0.24, z: -0.1, scale: 2.65, drift: 0.08 },
  { id: "WIRE", title: "Pikaia", creator: "darwinmuseum.ru", source: "https://sketchfab.com/3d-models/pikaia-fdf35446aa6044ebac35ed2a83c9f717", src: "/models/deficit/wire/scene.gltf", color: 0x181818, lane: "right", x: 0.4, y: -0.12, z: 0.3, scale: 2.3, drift: 0.13 },
  { id: "ANGELFISH", title: "Freshwater Angelfish", creator: "Wataru Onuki", source: "https://sketchfab.com/3d-models/freshwater-angelfish-37475fc6c8904b6bbf7e27617bd851b8", src: "/models/deficit/angelfish/scene.gltf", color: 0x70c35e, lane: "bottom", x: 0.18, y: -0.36, z: 0.4, scale: 2.15, drift: 0.12 },
  { id: "HUMAN_HEART", title: "Lowpoly Human Heart", creator: "l0r3l3i", source: "https://sketchfab.com/3d-models/lowpoly-human-heart-69d53ff1e0714f11b416eacc9263959b", src: "/models/deficit/heart/scene.gltf", color: 0xffffff, lane: "top", x: -0.08, y: 0.34, z: 0.2, scale: 2.3, drift: 0.11 },
  { id: "EXTINGUISHER", title: "Realistic Fire Extinguisher", creator: "Renend Studio", source: "https://sketchfab.com/3d-models/realistic-fire-extinguisher-low-poly-7bc661f26edc487d9b6182a9efa97b7a", src: "/models/deficit/extinguisher/scene.gltf", color: 0x70c35e, lane: "right", x: 0.3, y: 0.08, z: -0.3, scale: 2.45, drift: 0.09 },
];

function DeficitBitmapBackground({ src }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !src) return undefined;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const image = new Image();
    let cancelled = false;
    image.onload = () => {
      if (cancelled) return;
      const width = canvas.width;
      const height = canvas.height;
      const sourceRatio = image.width / image.height;
      const targetRatio = width / height;
      let sourceWidth = image.width;
      let sourceHeight = image.height;
      let sourceX = 0;
      let sourceY = 0;
      if (sourceRatio > targetRatio) {
        sourceWidth = image.height * targetRatio;
        sourceX = (image.width - sourceWidth) / 2;
      } else {
        sourceHeight = image.width / targetRatio;
        sourceY = (image.height - sourceHeight) / 2;
      }
      context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
      const bitmap = context.getImageData(0, 0, width, height);
      const palette = [
        [255, 255, 255],
        [232, 236, 234],
        [104, 140, 245],
        [105, 213, 213],
        [241, 234, 69],
        [236, 112, 100],
        [0, 0, 0],
      ];
      for (let index = 0; index < bitmap.data.length; index += 4) {
        let nearest = palette[0];
        let nearestDistance = Number.POSITIVE_INFINITY;
        palette.forEach(color => {
          const red = bitmap.data[index] - color[0];
          const green = bitmap.data[index + 1] - color[1];
          const blue = bitmap.data[index + 2] - color[2];
          const distance = red * red + green * green + blue * blue;
          if (distance < nearestDistance) {
            nearest = color;
            nearestDistance = distance;
          }
        });
        bitmap.data[index] = nearest[0];
        bitmap.data[index + 1] = nearest[1];
        bitmap.data[index + 2] = nearest[2];
      }
      context.putImageData(bitmap, 0, 0);
    };
    image.src = src;
    return () => { cancelled = true; };
  }, [src]);

  return <canvas ref={canvasRef} className="deficit-bitmap-background" width="210" height="120" aria-hidden="true" />;
}

function DeficitObjectField() {
  const mountRef = useRef(null);
  const [loadState, setLoadState] = useState("loading");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-5, 5, 4, -4, 0.1, 100);
    camera.position.set(0, 0, 14);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(0.72);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.visible = false;
    scene.add(group);
    const objects = [];
    const loader = new GLTFLoader();
    let viewWidth = 10;
    let viewHeight = 8;
    let frame = 0;
    let previousTime = 0;
    let protectedZones = [];
    let modelsReady = false;
    let spawnResolved = false;
    let disposed = false;

    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      const aspect = width / height;
      viewHeight = aspect < 0.62 ? 18 : 8;
      viewWidth = viewHeight * aspect;
      camera.left = -viewWidth / 2;
      camera.right = viewWidth / 2;
      camera.top = viewHeight / 2;
      camera.bottom = -viewHeight / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      if (modelsReady) {
        spawnResolved = false;
        group.visible = false;
      }
      protectedZones = [];
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    Promise.all(deficitObjectFiles.map((config, index) => new Promise(resolve => {
      loader.load(config.src, gltf => {
        if (disposed) return resolve();
        const model = gltf.scene;
        const bounds = new THREE.Box3().setFromObject(model);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        const longest = Math.max(size.x, size.y, size.z) || 1;
        const normalizationScale = config.scale / longest;
        model.scale.setScalar(normalizationScale);
        model.position.copy(center).multiplyScalar(-normalizationScale);
        model.rotation.set((index % 2 ? -1 : 1) * 0.16, index * 0.72, (index - 2) * 0.08);
        model.traverse(node => {
          node.visible = true;
          if (!node.isMesh) return;
          node.frustumCulled = false;
          node.castShadow = false;
          node.receiveShadow = false;
          const sourceMaterials = Array.isArray(node.material) ? node.material : [node.material];
          sourceMaterials.filter(Boolean).forEach(material => {
            Object.values(material).forEach(value => value?.isTexture && value.dispose());
            material.dispose();
          });
          node.material = new THREE.MeshBasicMaterial({
            color: config.color,
            side: THREE.DoubleSide,
          });
        });
        const normalizedBounds = new THREE.Box3().setFromObject(model);
        const normalizedSphere = normalizedBounds.getBoundingSphere(new THREE.Sphere());
        const pivot = new THREE.Group();
        pivot.add(model);
        const mixer = gltf.animations?.length ? new THREE.AnimationMixer(model) : null;
        gltf.animations?.forEach(clip => mixer.clipAction(clip).play());
        const angle = 0.55 + index * 1.83;
        const speed = 1.05 + (index % 3) * 0.18;
        pivot.userData = {
          ...config,
          order: index,
          velocity: new THREE.Vector2(Math.cos(angle) * speed, Math.sin(angle) * speed),
          baseRadius: normalizedSphere.radius,
          radius: normalizedSphere.radius,
          initialized: false,
          angularVelocity: (index % 2 ? -1 : 1) * (0.18 + index * 0.018),
          mixer,
        };
        group.add(pivot);
        objects.push(pivot);
        resolve();
      }, undefined, () => resolve());
    }))).then(() => {
      if (!disposed) {
        modelsReady = true;
        setLoadState(objects.length ? "ready" : "error");
      }
    });

    const resolveProtectedZones = pivot => {
      const config = pivot.userData;
      protectedZones.forEach(zone => {
        const blockedLeft = zone.left - config.radius;
        const blockedRight = zone.right + config.radius;
        const blockedTop = zone.top + config.radius;
        const blockedBottom = zone.bottom - config.radius;
        const insideBlockedX = pivot.position.x > blockedLeft && pivot.position.x < blockedRight;
        const insideBlockedY = pivot.position.y > blockedBottom && pivot.position.y < blockedTop;
        if (!insideBlockedX || !insideBlockedY) return;
        const candidates = [
          { edge: "left", distance: Math.abs(pivot.position.x - blockedLeft), fits: blockedLeft >= config.minX },
          { edge: "right", distance: Math.abs(blockedRight - pivot.position.x), fits: blockedRight <= config.maxX },
          { edge: "bottom", distance: Math.abs(pivot.position.y - blockedBottom), fits: blockedBottom >= config.minY },
          { edge: "top", distance: Math.abs(blockedTop - pivot.position.y), fits: blockedTop <= config.maxY },
        ].filter(candidate => candidate.fits).sort((a, b) => a.distance - b.distance);
        if (!candidates.length) return;
        const nearest = candidates[0].edge;
        if (nearest === "left" || nearest === "right") {
          pivot.position.x = nearest === "left" ? blockedLeft : blockedRight;
          config.velocity.x = nearest === "left" ? -Math.abs(config.velocity.x) : Math.abs(config.velocity.x);
        } else {
          pivot.position.y = nearest === "bottom" ? blockedBottom : blockedTop;
          config.velocity.y = nearest === "bottom" ? -Math.abs(config.velocity.y) : Math.abs(config.velocity.y);
        }
        config.angularVelocity *= -1;
      });
      pivot.position.x = THREE.MathUtils.clamp(pivot.position.x, config.minX, config.maxX);
      pivot.position.y = THREE.MathUtils.clamp(pivot.position.y, config.minY, config.maxY);
    };

    const resolveInitialLayout = () => {
      const ordered = [...objects].sort((a, b) => a.userData.order - b.userData.order);
      const slots = [
        [-0.4, 0.34], [-0.08, 0.38], [0.28, 0.34],
        [-0.42, -0.02], [0.42, -0.02],
        [-0.27, -0.36], [0.17, -0.36],
      ];
      ordered.forEach((pivot, index) => {
        const config = pivot.userData;
        const slot = slots[index % slots.length];
        pivot.position.x = THREE.MathUtils.clamp(slot[0] * viewWidth, config.minX, config.maxX);
        pivot.position.y = THREE.MathUtils.clamp(slot[1] * viewHeight, config.minY, config.maxY);
      });
      for (let pass = 0; pass < 180; pass += 1) {
        for (let first = 0; first < ordered.length; first += 1) {
          for (let second = first + 1; second < ordered.length; second += 1) {
            const a = ordered[first];
            const b = ordered[second];
            let dx = b.position.x - a.position.x;
            let dy = b.position.y - a.position.y;
            let distance = Math.hypot(dx, dy);
            const minimum = a.userData.spawnRadius + b.userData.spawnRadius;
            if (distance >= minimum) continue;
            if (distance < 0.0001) {
              const angle = (first * 1.7 + second * 2.3) % (Math.PI * 2);
              dx = Math.cos(angle);
              dy = Math.sin(angle);
              distance = 1;
            }
            const overlap = (minimum - distance) * 0.505;
            const nx = dx / distance;
            const ny = dy / distance;
            a.position.x -= nx * overlap;
            a.position.y -= ny * overlap;
            b.position.x += nx * overlap;
            b.position.y += ny * overlap;
            a.position.x = THREE.MathUtils.clamp(a.position.x, a.userData.minX, a.userData.maxX);
            a.position.y = THREE.MathUtils.clamp(a.position.y, a.userData.minY, a.userData.maxY);
            b.position.x = THREE.MathUtils.clamp(b.position.x, b.userData.minX, b.userData.maxX);
            b.position.y = THREE.MathUtils.clamp(b.position.y, b.userData.minY, b.userData.maxY);
          }
        }
        ordered.forEach(resolveProtectedZones);
      }
      spawnResolved = true;
      group.visible = true;
    };

    const render = time => {
      if (previousTime && time - previousTime < 1000 / 45) {
        frame = window.requestAnimationFrame(render);
        return;
      }
      const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.035) : 0;
      previousTime = time;
      const compact = viewWidth < 6;

      objects.forEach((pivot, index) => {
        const config = pivot.userData;
        const requestedScale = compact ? 1.45 : 2.2;
        const containedScale = Math.min(viewWidth, viewHeight) * 0.19 / (config.baseRadius * 1.1);
        const displayScale = Math.min(requestedScale, Math.max(0.52, containedScale)) * (compact ? 2.5 : 3.75);
        const modelRadius = config.baseRadius * displayScale * 1.1;
        const visualRadius = 0;
        const radius = modelRadius * 0.3;
        config.radius = radius;
        config.visualRadius = visualRadius;
        config.spawnRadius = modelRadius * 0.6;
        pivot.scale.setScalar(displayScale);
        if (!config.initialized) {
          pivot.position.x = config.x * viewWidth;
          pivot.position.y = config.y * viewHeight;
          config.initialized = true;
        }
        const outerMinX = -viewWidth / 2 + visualRadius;
        const outerMaxX = viewWidth / 2 - visualRadius;
        const outerMinY = -viewHeight / 2 + visualRadius;
        const outerMaxY = viewHeight / 2 - visualRadius;
        config.minX = outerMinX;
        config.maxX = outerMaxX;
        config.minY = outerMinY;
        config.maxY = outerMaxY;
        pivot.position.x = THREE.MathUtils.clamp(pivot.position.x, config.minX, config.maxX);
        pivot.position.y = THREE.MathUtils.clamp(pivot.position.y, config.minY, config.maxY);
        if (!reduceMotion && delta && spawnResolved) {
          config.mixer?.update(delta);
          pivot.position.x += config.velocity.x * delta;
          pivot.position.y += config.velocity.y * delta;
          pivot.rotation.y += config.angularVelocity * delta * 1.8;
          if (pivot.position.x <= config.minX || pivot.position.x >= config.maxX) {
            pivot.position.x = THREE.MathUtils.clamp(pivot.position.x, config.minX, config.maxX);
            config.velocity.x *= -1;
            config.angularVelocity *= -1;
          }
          if (pivot.position.y <= config.minY || pivot.position.y >= config.maxY) {
            pivot.position.y = THREE.MathUtils.clamp(pivot.position.y, config.minY, config.maxY);
            config.velocity.y *= -1;
            config.angularVelocity *= -1;
          }
          resolveProtectedZones(pivot);
        }
        pivot.position.z = config.z;
        pivot.rotation.x = Math.sin(time * 0.00042 + index) * 0.18;
        pivot.rotation.z = Math.cos(time * 0.0003 + index * 1.4) * 0.11;
      });

      if (modelsReady && !spawnResolved && objects.every(object => Number.isFinite(object.userData.visualRadius))) {
        resolveInitialLayout();
      }

      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    frame = window.requestAnimationFrame(render);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      group.traverse(node => {
        if (node.geometry) node.geometry.dispose();
        if (node.material) {
          const materials = Array.isArray(node.material) ? node.material : [node.material];
          materials.forEach(material => {
            Object.values(material).forEach(value => value?.isTexture && value.dispose());
            material.dispose();
          });
        }
      });
      objects.forEach(object => {
        object.userData.mixer?.stopAllAction();
        object.userData.mixer?.uncacheRoot(object.children[0]);
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <>
    <div className="deficit-object-field" ref={mountRef} aria-hidden="true" />
    <span className={`deficit-object-status is-${loadState}`}>{loadState === "loading" ? "CACHING 3D OBJECTS" : loadState === "ready" ? "OBJECT FIELD LIVE" : "OBJECT CACHE OFFLINE"}</span>
  </>;
}

function DeficitExperience({ project, path }) {
  const context = getProjectRouteContext(path);
  const summary = getProjectSummary(project.content);
  const year = getProjectYear(project.content);
  const embed = project.embeds?.[0];

  return <>
    <main className="deficit-page">
      <section className="deficit-hero" aria-labelledby="deficit-title">
        <DeficitBitmapBackground src={project.images?.[0]} />
        <DeficitObjectField />
        <header className="deficit-heading">
          <span>DIG_10 / ATTENTION SIMULATION / {year}</span>
          <h1 id="deficit-title">DEFICIT</h1>
          <p>{summary}</p>
        </header>
        <div className="deficit-signal" aria-label="Deficit project film">
          <div className="deficit-signal-bar"><b>LIVE://SIMULATION.FEED</b><span>VIDEO SAFE ZONE</span></div>
          {embed && <iframe src={embed.src} title={embed.title} allow={embed.allow} allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />}
          <div className="deficit-signal-footer"><span>FOCUS CHANNEL / 01</span><b>PLAYBACK READY</b></div>
        </div>
        <aside className="deficit-program-window" aria-label="Project program information">
          <div className="deficit-program-bar"><span><i /> <i /> <i /></span><b>PROJECT_INFO.HTML</b></div>
          <dl>
            <div><dt>PROGRAM</dt><dd>UNREAL ENGINE 5</dd></div>
            <div><dt>PLATFORM</dt><dd>META QUEST</dd></div>
            <div><dt>FORMAT</dt><dd>VR EXPERIENCE</dd></div>
          </dl>
        </aside>
        <aside className="deficit-readout">
          <span>SKETCHFAB OBJECT CREDITS / 07</span>
          <p>PERIPHERAL 3D MODELS BY THEIR ORIGINAL CREATORS. OPEN A RECORD TO VIEW ITS SOURCE ON SKETCHFAB.</p>
          <div>{deficitObjectFiles.map((item, index) => <a href={item.source} target="_blank" rel="noreferrer" key={item.id}>
            <b>{String(index + 1).padStart(2, "0")} {item.title}</b>
            <span>BY {item.creator} <i aria-hidden="true">↗</i></span>
          </a>)}</div>
        </aside>
        <a className="deficit-scroll-cue" href="#deficit-documentation">DOCUMENTATION <span aria-hidden="true">&darr;</span></a>
      </section>

      <section className="deficit-documentation" id="deficit-documentation" aria-labelledby="deficit-documentation-title">
        <header>
          <span>SECTION_02 / CAPTURE SPILL</span>
          <h2 id="deficit-documentation-title">DOCUMENTATION</h2>
          <b>03 PROJECT FILES</b>
        </header>
        <div className="deficit-document-field">
          {(project.images || []).map((src, index) => <figure className={`deficit-document deficit-document--${index + 1}`} key={src}>
            <div><b>IMG_{String(index + 1).padStart(2, "0")}</b><span>{index === 1 ? "ACTIVE VIEWPORT" : "MEMORY CAPTURE"}</span></div>
            <img src={src} alt={`${project.title} documentation image ${index + 1}`} loading="lazy" />
            <figcaption><span>COORD / {String(18 + index * 27).padStart(3, "0")}.{String(84 - index * 19).padStart(3, "0")}</span><b>{index + 1} / 3</b></figcaption>
          </figure>)}
        </div>
      </section>

      <ProjectLinks links={project.links} />
      <ProjectRoutePager context={context} />
    </main>
    <Footer />
  </>;
}

function DecayPointCloud({ held, onIntegrityChange }) {
  const mountRef = useRef(null);
  const stateRef = useRef({ held });
  const callbackRef = useRef(onIntegrityChange);
  const [loadState, setLoadState] = useState("loading");

  useEffect(() => { stateRef.current.held = held; }, [held]);
  useEffect(() => { callbackRef.current = onIntegrityChange; }, [onIntegrityChange]);

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, .1, 80);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xe8ecea, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);
    camera.position.set(9.6, 5.3, 12.8);
    camera.lookAt(0, -.45, 0);

    let cloud;
    let positions;
    let localOffsets;
    let chunkIds;
    let chunkOrigins;
    let chunkPositions;
    let chunkVelocities;
    let chunkRotations;
    let chunkAngularVelocities;
    let chunkThresholds;
    let chunkPhases;
    let chunkReleased;
    let chunkFloorOffsets;
    let chunkMatrices;
    let floorY = -1.4;
    let damage = .08;
    let previousTime = performance.now();
    let previousIntegrity = -1;
    let frame;
    let disposed = false;
    let displayScale = 1;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const loader = new STLLoader();
    loader.load("/models/decay/castle-williams-crumble.stl", sourceGeometry => {
      if (disposed) return;
      const attribute = sourceGeometry.attributes.position;
      const triangleCount = Math.floor(attribute.count / 3);
      const parents = new Int32Array(triangleCount);
      const ranks = new Uint8Array(triangleCount);
      const vertexOwners = new Map();
      for (let triangle = 0; triangle < triangleCount; triangle++) parents[triangle] = triangle;
      const find = value => {
        let root = value;
        while (parents[root] !== root) root = parents[root];
        while (parents[value] !== value) {
          const next = parents[value];
          parents[value] = root;
          value = next;
        }
        return root;
      };
      const unite = (left, right) => {
        let rootLeft = find(left);
        let rootRight = find(right);
        if (rootLeft === rootRight) return;
        if (ranks[rootLeft] < ranks[rootRight]) [rootLeft, rootRight] = [rootRight, rootLeft];
        parents[rootRight] = rootLeft;
        if (ranks[rootLeft] === ranks[rootRight]) ranks[rootLeft]++;
      };

      for (let triangle = 0; triangle < triangleCount; triangle++) {
        for (let corner = 0; corner < 3; corner++) {
          const index = triangle * 3 + corner;
          const key = `${Math.round(attribute.getX(index) * 10000)},${Math.round(attribute.getY(index) * 10000)},${Math.round(attribute.getZ(index) * 10000)}`;
          const owner = vertexOwners.get(key);
          if (owner === undefined) vertexOwners.set(key, triangle);
          else unite(triangle, owner);
        }
      }
      vertexOwners.clear();

      const rootToChunk = new Map();
      const triangleChunks = new Uint16Array(triangleCount);
      for (let triangle = 0; triangle < triangleCount; triangle++) {
        const root = find(triangle);
        if (!rootToChunk.has(root)) rootToChunk.set(root, rootToChunk.size);
        triangleChunks[triangle] = rootToChunk.get(root);
      }
      const chunkCount = rootToChunk.size;
      const sourceBounds = new THREE.Box3();
      const sourcePoint = new THREE.Vector3();
      for (let index = 0; index < attribute.count; index++) {
        sourcePoint.set(attribute.getX(index), attribute.getZ(index), -attribute.getY(index));
        sourceBounds.expandByPoint(sourcePoint);
      }

      const center = sourceBounds.getCenter(new THREE.Vector3());
      const sourceSize = sourceBounds.getSize(new THREE.Vector3());
      const scale = 8 / Math.max(sourceSize.x, sourceSize.z, .001);
      const pointCount = triangleCount;
      positions = new Float32Array(pointCount * 3);
      localOffsets = new Float32Array(pointCount * 3);
      chunkIds = triangleChunks;
      chunkOrigins = new Float32Array(chunkCount * 3);
      chunkPositions = new Float32Array(chunkCount * 3);
      chunkVelocities = new Float32Array(chunkCount * 3);
      chunkRotations = new Float32Array(chunkCount * 3);
      chunkAngularVelocities = new Float32Array(chunkCount * 3);
      chunkThresholds = new Float32Array(chunkCount);
      chunkPhases = new Float32Array(chunkCount);
      chunkReleased = new Uint8Array(chunkCount);
      chunkFloorOffsets = new Float32Array(chunkCount);
      chunkFloorOffsets.fill(Infinity);
      chunkMatrices = new Float32Array(chunkCount * 9);
      const chunkPointCounts = new Uint32Array(chunkCount);
      const colors = new Float32Array(pointCount * 3);
      const black = new THREE.Color("#111111");
      const green = new THREE.Color("#68c45b");
      const blue = new THREE.Color("#5b8ef7");

      for (let triangle = 0; triangle < triangleCount; triangle++) {
        const pointOffset = triangle * 3;
        let rawX = 0;
        let rawY = 0;
        let rawZ = 0;
        for (let corner = 0; corner < 3; corner++) {
          const index = triangle * 3 + corner;
          rawX += attribute.getX(index);
          rawY += attribute.getZ(index);
          rawZ -= attribute.getY(index);
        }
        const x = (rawX / 3 - center.x) * scale;
        const y = (rawY / 3 - center.y) * scale;
        const z = (rawZ / 3 - center.z) * scale;
        positions[pointOffset] = x;
        positions[pointOffset + 1] = y;
        positions[pointOffset + 2] = z;
        const chunk = chunkIds[triangle];
        const chunkOffset = chunk * 3;
        chunkOrigins[chunkOffset] += x;
        chunkOrigins[chunkOffset + 1] += y;
        chunkOrigins[chunkOffset + 2] += z;
        chunkPointCounts[chunk]++;
        const seed = Math.abs(Math.sin(triangle * 12.9898 + chunk * 78.233) * 43758.5453) % 1;
        const color = seed > .965 ? blue : seed > .82 ? green : black;
        colors[pointOffset] = color.r;
        colors[pointOffset + 1] = color.g;
        colors[pointOffset + 2] = color.b;
      }

      for (let chunk = 0; chunk < chunkCount; chunk++) {
        const offset = chunk * 3;
        const count = Math.max(chunkPointCounts[chunk], 1);
        chunkOrigins[offset] /= count;
        chunkOrigins[offset + 1] /= count;
        chunkOrigins[offset + 2] /= count;
        chunkPositions[offset] = chunkOrigins[offset];
        chunkPositions[offset + 1] = chunkOrigins[offset + 1];
        chunkPositions[offset + 2] = chunkOrigins[offset + 2];
        const seed = Math.abs(Math.sin(chunk * 17.173 + 5.71) * 43183.127) % 1;
        chunkThresholds[chunk] = .08 + seed * .84;
        chunkPhases[chunk] = seed * Math.PI * 2;
      }

      for (let index = 0; index < pointCount; index++) {
        const offset = index * 3;
        const chunkOffset = chunkIds[index] * 3;
        localOffsets[offset] = positions[offset] - chunkOrigins[chunkOffset];
        localOffsets[offset + 1] = positions[offset + 1] - chunkOrigins[chunkOffset + 1];
        localOffsets[offset + 2] = positions[offset + 2] - chunkOrigins[chunkOffset + 2];
        chunkFloorOffsets[chunkIds[index]] = Math.min(chunkFloorOffsets[chunkIds[index]], localOffsets[offset + 1]);
      }

      floorY = -sourceSize.y * scale * .5 - .48;
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.computeBoundingSphere();
      const material = new THREE.PointsMaterial({
        size: .042,
        vertexColors: true,
        transparent: true,
        opacity: .94,
        sizeAttenuation: true,
        depthWrite: true,
      });
      cloud = new THREE.Points(geometry, material);
      group.add(cloud);
      sourceGeometry.dispose();
      setLoadState("ready");
    }, undefined, () => {
      if (!disposed) setLoadState("error");
    });

    const resize = () => {
      const rect = mount.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / Math.max(rect.height, 1);
      camera.updateProjectionMatrix();
      displayScale = camera.aspect < .68 ? .52 : camera.aspect < 1.05 ? .72 : 1.18;
      group.scale.setScalar(displayScale);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    const animate = time => {
      const delta = Math.min((time - previousTime) / 1000, .04);
      previousTime = time;
      const isHeld = stateRef.current.held;
      const stabilized = isHeld || reducedMotion;
      damage = reducedMotion ? 0 : THREE.MathUtils.clamp(damage + (isHeld ? -delta * .88 : delta * .13), 0, 1);
      const integrity = Math.round((1 - damage) * 100);
      if (integrity !== previousIntegrity) {
        previousIntegrity = integrity;
        callbackRef.current?.(integrity);
      }

      if (positions && cloud) {
        const timeSeconds = time * .001;
        const damping = Math.pow(isHeld ? .045 : .6, delta);
        for (let chunk = 0; chunk < chunkThresholds.length; chunk++) {
          const offset = chunk * 3;
          const originX = chunkOrigins[offset];
          const originY = chunkOrigins[offset + 1];
          const originZ = chunkOrigins[offset + 2];
          let x = chunkPositions[offset];
          let y = chunkPositions[offset + 1];
          let z = chunkPositions[offset + 2];
          let velocityX = chunkVelocities[offset];
          let velocityY = chunkVelocities[offset + 1];
          let velocityZ = chunkVelocities[offset + 2];
          let rotationX = chunkRotations[offset];
          let rotationY = chunkRotations[offset + 1];
          let rotationZ = chunkRotations[offset + 2];

          if (stabilized) {
            const spring = 18;
            velocityX = (velocityX + (originX - x) * spring * delta) * damping;
            velocityY = (velocityY + (originY - y) * spring * delta) * damping;
            velocityZ = (velocityZ + (originZ - z) * spring * delta) * damping;
            x += velocityX * delta;
            y += velocityY * delta;
            z += velocityZ * delta;
            const rotationDamping = Math.pow(.025, delta);
            chunkAngularVelocities[offset] = (chunkAngularVelocities[offset] - rotationX * 14 * delta) * rotationDamping;
            chunkAngularVelocities[offset + 1] = (chunkAngularVelocities[offset + 1] - rotationY * 14 * delta) * rotationDamping;
            chunkAngularVelocities[offset + 2] = (chunkAngularVelocities[offset + 2] - rotationZ * 14 * delta) * rotationDamping;
            rotationX += chunkAngularVelocities[offset] * delta;
            rotationY += chunkAngularVelocities[offset + 1] * delta;
            rotationZ += chunkAngularVelocities[offset + 2] * delta;
            if (damage < .015 && Math.abs(originX - x) + Math.abs(originY - y) + Math.abs(originZ - z) < .018) {
              x = originX;
              y = originY;
              z = originZ;
              velocityX = velocityY = velocityZ = 0;
              rotationX = rotationY = rotationZ = 0;
              chunkAngularVelocities[offset] = chunkAngularVelocities[offset + 1] = chunkAngularVelocities[offset + 2] = 0;
              chunkReleased[chunk] = 0;
            }
          } else if (damage >= chunkThresholds[chunk]) {
            if (!chunkReleased[chunk]) {
              const radialLength = Math.max(Math.hypot(originX, originZ), .3);
              const seed = chunkPhases[chunk] / (Math.PI * 2);
              velocityX = originX / radialLength * (.75 + seed * 1.35) + Math.sin(chunkPhases[chunk] * 3.1) * .35;
              velocityY = .3 + seed * .82;
              velocityZ = originZ / radialLength * (.75 + (1 - seed) * 1.35) + Math.cos(chunkPhases[chunk] * 2.7) * .35;
              chunkAngularVelocities[offset] = (seed - .5) * 2.8;
              chunkAngularVelocities[offset + 1] = Math.sin(chunkPhases[chunk] * 1.7) * 2.2;
              chunkAngularVelocities[offset + 2] = Math.cos(chunkPhases[chunk] * 2.3) * 2.8;
              chunkReleased[chunk] = 1;
            }
            velocityY -= 5.2 * delta;
            velocityX *= damping;
            velocityZ *= damping;
            x += velocityX * delta;
            y += velocityY * delta;
            z += velocityZ * delta;
            rotationX += chunkAngularVelocities[offset] * delta;
            rotationY += chunkAngularVelocities[offset + 1] * delta;
            rotationZ += chunkAngularVelocities[offset + 2] * delta;
            if (y + chunkFloorOffsets[chunk] < floorY) {
              y = floorY - chunkFloorOffsets[chunk];
              velocityY = Math.abs(velocityY) > .18 ? -velocityY * .16 : 0;
              const floorFriction = Math.pow(.18, delta);
              velocityX *= floorFriction;
              velocityZ *= floorFriction;
              chunkAngularVelocities[offset] *= floorFriction;
              chunkAngularVelocities[offset + 1] *= floorFriction;
              chunkAngularVelocities[offset + 2] *= floorFriction;
            }
          } else {
            const tremor = Math.sin(timeSeconds * 76 + chunkPhases[chunk]) * damage * .018;
            x = originX + tremor;
            y = originY + Math.cos(timeSeconds * 83 + chunkPhases[chunk]) * damage * .01;
            z = originZ - tremor * .7;
            velocityX = velocityY = velocityZ = 0;
            rotationX = Math.sin(timeSeconds * 67 + chunkPhases[chunk]) * damage * .006;
            rotationY = Math.cos(timeSeconds * 71 + chunkPhases[chunk]) * damage * .008;
            rotationZ = 0;
            chunkReleased[chunk] = 0;
          }

          chunkPositions[offset] = x;
          chunkPositions[offset + 1] = y;
          chunkPositions[offset + 2] = z;
          chunkVelocities[offset] = velocityX;
          chunkVelocities[offset + 1] = velocityY;
          chunkVelocities[offset + 2] = velocityZ;
          chunkRotations[offset] = rotationX;
          chunkRotations[offset + 1] = rotationY;
          chunkRotations[offset + 2] = rotationZ;

          const cosX = Math.cos(rotationX);
          const sinX = Math.sin(rotationX);
          const cosY = Math.cos(rotationY);
          const sinY = Math.sin(rotationY);
          const cosZ = Math.cos(rotationZ);
          const sinZ = Math.sin(rotationZ);
          const matrixOffset = chunk * 9;
          chunkMatrices[matrixOffset] = cosY * cosZ;
          chunkMatrices[matrixOffset + 1] = sinX * sinY * cosZ - cosX * sinZ;
          chunkMatrices[matrixOffset + 2] = cosX * sinY * cosZ + sinX * sinZ;
          chunkMatrices[matrixOffset + 3] = cosY * sinZ;
          chunkMatrices[matrixOffset + 4] = sinX * sinY * sinZ + cosX * cosZ;
          chunkMatrices[matrixOffset + 5] = cosX * sinY * sinZ - sinX * cosZ;
          chunkMatrices[matrixOffset + 6] = -sinY;
          chunkMatrices[matrixOffset + 7] = sinX * cosY;
          chunkMatrices[matrixOffset + 8] = cosX * cosY;
        }

        for (let index = 0; index < chunkIds.length; index++) {
          const offset = index * 3;
          const chunk = chunkIds[index];
          const chunkOffset = chunk * 3;
          const matrixOffset = chunk * 9;
          const localX = localOffsets[offset];
          const localY = localOffsets[offset + 1];
          const localZ = localOffsets[offset + 2];
          positions[offset] = chunkPositions[chunkOffset] + chunkMatrices[matrixOffset] * localX + chunkMatrices[matrixOffset + 1] * localY + chunkMatrices[matrixOffset + 2] * localZ;
          positions[offset + 1] = chunkPositions[chunkOffset + 1] + chunkMatrices[matrixOffset + 3] * localX + chunkMatrices[matrixOffset + 4] * localY + chunkMatrices[matrixOffset + 5] * localZ;
          positions[offset + 2] = chunkPositions[chunkOffset + 2] + chunkMatrices[matrixOffset + 6] * localX + chunkMatrices[matrixOffset + 7] * localY + chunkMatrices[matrixOffset + 8] * localZ;
        }
        cloud.geometry.attributes.position.needsUpdate = true;
        cloud.material.size += (((stabilized ? .046 : .042) / displayScale) - cloud.material.size) * .08;
        group.position.x += (((stabilized ? 0 : Math.sin(timeSeconds * 69) * .035 * (1 - damage * .45))) - group.position.x) * .28;
        group.position.z += (((stabilized ? 0 : Math.cos(timeSeconds * 73) * .025 * (1 - damage * .45))) - group.position.z) * .28;
        group.rotation.y += (((stabilized ? 0 : Math.sin(timeSeconds * 54) * .008)) - group.rotation.y) * .2;
      }

      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };

    resize();
    frame = window.requestAnimationFrame(animate);
    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      cloud?.geometry.dispose();
      cloud?.material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div ref={mountRef} className="decay-point-cloud" role="img" aria-label="Physics-based point cloud model of Castle Williams assembled from crumbleable architectural fragments">
      {loadState !== "ready" && <span className="decay-model-status">{loadState === "error" ? "MODEL SIGNAL LOST" : "LOCATING CASTLE GEOMETRY"}</span>}
    </div>
  );
}

function DecayExperience({ project, path }) {
  const [pressed, setPressed] = useState(false);
  const [integrity, setIntegrity] = useState(92);
  const held = pressed;
  const context = getProjectRouteContext(path);
  const recordContent = project.content?.[0]?.tag === "h2" ? project.content.slice(1) : project.content;
  const stateLabel = held ? "MAGNETIC HOLD / STABLE" : integrity < 22 ? "STRUCTURE / FAILED" : "MOTOR / ACTIVE";

  return (
    <>
      <main className="project archive-project archive-project--physical decay-page">
        <section className="decay-experience" aria-labelledby="decay-title">
          <div className="decay-window-bar"><b>SYS://DECAY.ACTUATOR</b><span>{stateLabel}</span></div>
          <div
            className={`decay-interaction-field ${held ? "is-held" : "is-decaying"}`}
            role="button"
            tabIndex="0"
            aria-label="Press and hold to keep Castle Williams together. Release to resume the collapse."
            aria-pressed={held}
            onPointerDown={event => {
              event.currentTarget.setPointerCapture?.(event.pointerId);
              setPressed(true);
            }}
            onPointerUp={() => setPressed(false)}
            onPointerCancel={() => setPressed(false)}
            onLostPointerCapture={() => setPressed(false)}
            onBlur={() => setPressed(false)}
            onKeyDown={event => {
              if (event.key === " " || event.key === "Enter") {
                event.preventDefault();
                setPressed(true);
              }
            }}
            onKeyUp={event => {
              if (event.key === " " || event.key === "Enter") setPressed(false);
            }}
          >
            <div className="decay-heading">
              <span>PHYSICAL INSTALLATION / 2023</span>
              <h1 id="decay-title">DECAY</h1>
              <p>Castle Williams cannot hold itself together.</p>
              <small>3D PLA MODEL · SHAKING PLATFORM · MAGNETS · DC MOTOR</small>
            </div>

            <div className="decay-visual">
              <DecayPointCloud held={held} onIntegrityChange={setIntegrity} />
            </div>

            <figure className="decay-physical-evidence" aria-label="Documentation of the physical Decay installation">
              <div><b>ARCHIVE_01</b><span>PHYSICAL WORK</span></div>
              <img src={project.images?.[1]} alt="Decay installed at Flux Factory: the Castle Williams sculpture on its motorized shaking platform with its participant button" />
              <figcaption>EXHIBITION VIEW <span>FLUX FACTORY · GOVERNORS ISLAND</span></figcaption>
            </figure>

            <div className="decay-instruction">
              <b>{held ? "BUTTON HELD / STABLE" : "PRESS + HOLD IT TOGETHER"}</b>
              <span className="decay-touch-copy">PRESS + HOLD TO STABILIZE</span>
              <small>{held ? "The motor stops. The pieces return." : "Release and the shaking resumes."}</small>
            </div>

            <div className="decay-integrity" aria-live="off">
              <div><span>STRUCTURAL INTEGRITY</span><b>{String(integrity).padStart(3, "0")}%</b></div>
              <progress max="100" value={integrity} aria-label={`Castle Williams structural integrity: ${integrity} percent`} />
              <small>{held ? "INPUT DETECTED / MAGNETIC LOCK" : "NO INPUT / DEGRADATION IN PROGRESS"}</small>
            </div>
          </div>
        </section>

        <ProjectRecord content={recordContent} />
        <ProjectMediaArchive project={project} layout={{ mediaHeading: "DOCUMENTATION" }} heroMode="interactive" />
        <ProjectLinks links={project.links} />
        <ProjectRoutePager context={context} />
      </main>
      <Footer />
    </>
  );
}

function Project({ project, path }) {
  const context = getProjectRouteContext(path);
  const chapterLayout = projectChapterLayouts[path];
  const layout = chapterLayout || projectLayoutOverrides[path] || {};
  const videos = (project.media || []).filter(src => /\.(mp4|webm)(?:$|\?)/i.test(src));
  const audio = (project.media || []).filter(src => /\.(mp3|wav|ogg)(?:$|\?)/i.test(src));
  const heroMode = layout.heroMode || (videos.length ? "video" : project.images?.length ? "image" : project.embeds?.length ? "embed" : audio.length ? "audio" : "index");
  const summary = getProjectSummary(project.content);
  const tags = getProjectTags(project.content, summary);
  const year = getProjectYear(project.content);
  const visibleImageCount = layout.hideImages
    ? 0
    : layout.imageIndexes
      ? takeIndexes(project.images, layout.imageIndexes).length
      : (project.images || []).length;
  const excludedEmbedIndexes = new Set(layout.excludedEmbedIndexes || (heroMode === "embed" ? [layout.heroEmbedIndex || 0] : []));
  const visibleEmbedCount = (project.embeds || []).filter((_, index) => !excludedEmbedIndexes.has(index)).length;
  const mediaCount = visibleImageCount + videos.length + audio.length + visibleEmbedCount + (layout.modelSrc ? 1 : 0);
  const defaultRecordStart = project.content?.[0]?.tag === "h2" ? 1 : 0;
  const recordContent = layout.recordIndexes ? takeIndexes(project.content, layout.recordIndexes) : project.content.slice(defaultRecordStart);
  const entryTarget = chapterLayout ? "project-chapters" : "project-record";
  const longestTitleWord = Math.max(...project.title.split(/\s+/).map(word => word.length));
  const titleClass = layout.titleClass || (project.title.length > 34 || longestTitleWord > 16 ? "is-very-long" : project.title.length > 15 || longestTitleWord > 10 ? "is-long" : "");
  return (
    <>
      <main className={`project archive-project archive-project--${context.key}${path === "/digital/merimnao" ? " merimnao-page" : ""}`}>
        <section className="archive-project-hero" aria-labelledby="archive-project-title">
          <div className="archive-project-stage"><ProjectHeroMedia project={project} layout={layout} /></div>
          <aside className="archive-project-console">
            <header>
              <span>{context.code}_{String(context.index + 1).padStart(2, "0")} / {context.label} / {year}</span>
              <h1 className={titleClass} id="archive-project-title">{project.title}</h1>
              <p>{summary}</p>
              <div className="archive-project-tags">{tags.length ? tags.map((tag, index) => <span key={`${tag}-${index}`}>{tag}</span>) : <span>{context.label}</span>}</div>
            </header>
            <div className="archive-project-status">
              <span>RECORD://LOCATED</span>
              <dl>
                <div><dt>MEDIA</dt><dd>{String(mediaCount).padStart(2, "0")}</dd></div>
                <div><dt>ENTRY</dt><dd>{String(context.index + 1).padStart(2, "0")} / {String(context.total).padStart(2, "0")}</dd></div>
                <div><dt>STATUS</dt><dd>ONLINE</dd></div>
              </dl>
              <a className="archive-project-enter" href={`#${entryTarget}`}>ENTER PROJECT RECORD <span aria-hidden="true">&darr;</span></a>
            </div>
          </aside>
        </section>

        {chapterLayout ? <ProjectChapters project={project} layout={chapterLayout} /> : <>
          <ProjectRecord content={recordContent} />
          <ProjectMediaArchive project={project} layout={layout} heroMode={heroMode} />
          <ProjectLinks links={project.links} />
        </>}
        <ProjectRoutePager context={context} />
      </main>
      <Footer />
    </>
  );
}

const ellwasProcessChapters = [
  {
    number: "01",
    label: "FORM SEARCH",
    title: "Finding a language for growth",
    copy: "I began with light in motion—testing how one point could open into fans and stars—then compared that behavior with branching roots, cosmic spirals, and modular geometry. Together, the studies clarified that the identity needed to feel alive, cumulative, and personal—not simply connected.",
    decision: "The form needed to hold both an individual story and a larger collective system.",
    layout: "quad",
    boards: [
      { src: "/assets/mcad-ellwas/process/00-fan-star-motion-study.jpg", page: "63", title: "Light in motion", alt: "Early motion study showing a point of blue light opening into fan and star forms" },
      { src: "/assets/mcad-ellwas/process/01-root-direction.jpg", page: "64", title: "Root", alt: "Early root-based form direction with branching structures" },
      { src: "/assets/mcad-ellwas/process/02-galaxy-spiral-direction.jpg", page: "65", title: "Galaxy / spiral", alt: "Early galaxy and spiral form direction" },
      { src: "/assets/mcad-ellwas/process/03-geometric-direction.jpg", page: "66", title: "Geometric", alt: "Early modular geometric form direction" },
    ],
  },
  {
    number: "03",
    label: "CONCEPT SELECTION",
    title: "Choosing the dandelion",
    copy: "The dandelion connected the project’s two scales. From a distance it could read as one luminous family tree; up close it separated into seeds, branches, and individual contributions. Its cycle of accumulation and dispersal also gave the identity a natural way to change over time.",
    decision: "One bloom could represent many generations without losing the individual seed.",
    layout: "pair",
    boards: [
      { src: "/assets/mcad-ellwas/process/04-tree-of-generations.jpg", page: "67", title: "Tree of Generations", alt: "Tree of Generations concept board combining family imagery with an environmental installation" },
      { src: "/assets/mcad-ellwas/process/05-dandelion-observation.jpg", page: "72", title: "Dispersal", alt: "Dandelion observation showing seeds dispersing from the flower" },
    ],
  },
  {
    number: "04",
    label: "BEHAVIOR STUDIES",
    title: "Turning observation into variables",
    copy: "Instead of treating the bloom as a fixed mark, I broke it into behaviors the museum experience could control. Density registered accumulated engagement, movement introduced gravity and atmosphere, and color connected the form to the themes a visitor explored.",
    decision: "A small set of variables translated different museum interactions into distinct lights while keeping the system recognizable.",
    layout: "triptych",
    boards: [
      { src: "/assets/mcad-ellwas/process/06-density-study.jpg", page: "77", title: "Density", alt: "Density studies showing a luminous dandelion form becoming progressively fuller" },
      { src: "/assets/mcad-ellwas/process/07-movement-gravity-study.jpg", page: "78", title: "Movement", alt: "Movement and gravity studies bending the luminous radial form" },
      { src: "/assets/mcad-ellwas/process/08-color-study.jpg", page: "79", title: "Color", alt: "Color studies introducing multiple signals into the luminous form" },
    ],
  },
  {
    number: "05",
    id: "ellwas-composite-refinement",
    label: "SYSTEM CONSTRUCTION",
    title: "Building one light from four signals",
    copy: "The composite developed through repeated combinations, moving from a radial seed network toward a layered botanical bloom. Four distinct components corresponded to Finance, Entrepreneurship, Education, and Health; the exhibits, people, stories, and milestones a visitor engaged with determined their balance.",
    decision: "The final identity became a readable record of what interested each visitor—not simply where they walked.",
    layout: "system",
    boards: [
      {
        key: "composite-refinement",
        carousel: true,
        controlsLabel: "Composite refinement study controls",
        previousLabel: "Previous composite refinement study",
        nextLabel: "Next composite refinement study",
        slides: [
          { src: "/assets/mcad-ellwas/process/composite-01-radial.jpg", page: "75", title: "Radial seed network", alt: "Early composite study connecting luminous dandelion seed heads in a radial structure" },
          { src: "/assets/mcad-ellwas/process/composite-02-botanical.jpg", page: "80", title: "Botanical assembly", alt: "Composite bloom combining four botanical forms into concentric rings" },
          { src: "/assets/mcad-ellwas/process/composite-03-branching.jpg", page: "81", title: "Branching variation", alt: "Composite variation pairing soft seed heads with branching terminal structures" },
          { src: "/assets/mcad-ellwas/process/composite-04-expanded.jpg", page: "82", title: "Expanded component mix", alt: "Expanded composite study mixing several botanical terminals around a radial center" },
          { src: "/assets/mcad-ellwas/process/composite-05-refined.jpg", page: "83", title: "Composite refinement", alt: "Refined luminous bloom assembled from several botanical structures" },
        ],
      },
      { src: "/assets/mcad-ellwas/process/12-pillar-components.jpg", page: "92", title: "Four components", alt: "Four botanical components assigned to finance, entrepreneurship, education, and health" },
      { src: "/assets/mcad-ellwas/process/13-color-system.jpg", page: "98", title: "Pillar color system", alt: "Colored botanical component studies for the four museum pillars" },
    ],
  },
  {
    number: "06",
    id: "ellwas-terminal-flow",
    label: "EXPERIENCE FLOW",
    title: "From terminal to possible mobile handoff",
    copy: "The primary interaction was a physical museum terminal. Visitors could answer a prompt, then take or upload a family photo. A possible mobile continuation was also explored: a phone could supply the image or scan a QR code to receive the result during the visit.",
    decision: "The terminal remained the core experience; mobile was proposed as an optional bridge into and out of that interaction.",
    layout: "single",
    carousel: true,
    boards: [
      { src: "/assets/mcad-ellwas/process/terminal-01-invitation.jpg", page: "87", title: "Terminal invitation", alt: "A visitor and child approaching a physical museum terminal beside its opening Tree of Generations prompt" },
      { src: "/assets/mcad-ellwas/process/terminal-02-gesture.jpg", page: "88", title: "Terminal gesture", alt: "Gesture arrows showing how a visitor could activate and move through the physical museum terminal" },
      { src: "/assets/mcad-ellwas/process/terminal-03-mobile-detail.jpg", page: "89", title: "Possible mobile handoff", alt: "Proposed photo upload, family portrait capture, and QR handoff screens" },
      { src: "/assets/mcad-ellwas/process/terminal-04-flow.jpg", page: "90", title: "Terminal-to-mobile flow", alt: "Overview of the proposed terminal photo flow and optional mobile QR handoff" },
    ],
  },
];

const ellwasScaleStudies = [
  { src: "/assets/mcad-ellwas/process/14-interface-application.jpg", page: "101", title: "In-museum interface", note: "The radial language organizes people, milestones, and historical moments across the museum’s interactive screens.", alt: "Three touch interface studies using radial light forms around historical content" },
  { src: "/assets/mcad-ellwas/process/15-wall-timeline.jpg", page: "102", title: "Museum timeline", note: "The same modules scale into a multi-screen wall spanning generations of content.", alt: "Museum wall timeline composed from connected circular content modules" },
  { src: "/assets/mcad-ellwas/process/16-final-environment.jpg", page: "103", title: "Environmental light", note: "Color and shadow extend the personal light beyond the screen and into the architecture.", alt: "Environmental application studies projecting the colored botanical light into a dark interior" },
];

function EllwasFrame({ children, code, status, className = "" }) {
  return (
    <div className={`ellwas-frame ${className}`.trim()}>
      <div className="ellwas-frame-bar"><b>{code}</b><span>{status}</span></div>
      {children}
      <div className="ellwas-frame-footer"><span>MCAD × ELLWAS / 2022</span><b>LIGHT SYSTEM</b></div>
    </div>
  );
}

function EllwasPreviewTrigger({ item, activePreviewId, onOpen, onCloseSoon }) {
  const previewId = `ellwas-expanded-${item.id.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
  const expanded = activePreviewId === item.id;

  return (
    <div className="ellwas-preview-trigger">
      <img src={item.src} alt={item.alt} loading="lazy" />
      <button
        type="button"
        className="ellwas-preview-hitarea"
        aria-label={`Expand ${item.title}`}
        aria-expanded={expanded}
        aria-controls={previewId}
        onPointerEnter={event => {
          if (event.pointerType !== "touch") onOpen(item, event.currentTarget);
        }}
        onPointerLeave={event => {
          if (event.pointerType !== "touch") onCloseSoon();
        }}
        onFocus={event => onOpen(item, event.currentTarget)}
        onBlur={onCloseSoon}
        onClick={event => {
          if (window.matchMedia("(pointer: coarse)").matches) onOpen(item, event.currentTarget);
        }}
      >
        <span>EXPAND <b aria-hidden="true">↗</b></span>
      </button>
    </div>
  );
}

function EllwasExpandedPreview({ preview, onClose, onKeepOpen, onCloseSoon }) {
  const windowRef = useRef(null);
  const [position, setPosition] = useState({ left: 16, top: 16 });

  useEffect(() => {
    if (!preview) return undefined;

    const placeWindow = () => {
      const anchor = preview.trigger?.getBoundingClientRect();
      const popup = windowRef.current?.getBoundingClientRect();
      if (!anchor || !popup) return;
      const gap = 12;
      const edge = 12;
      const fitsRight = anchor.right + gap + popup.width <= window.innerWidth - edge;
      const left = fitsRight
        ? anchor.right + gap
        : Math.max(edge, anchor.left - gap - popup.width);
      const top = Math.max(edge, Math.min(anchor.top, window.innerHeight - popup.height - edge));
      setPosition({ left, top });
    };

    const frame = window.requestAnimationFrame(placeWindow);
    const handleKeyDown = event => {
      if (event.key === "Escape") onClose();
    };
    const handlePointerDown = event => {
      if (windowRef.current?.contains(event.target) || preview.trigger?.contains(event.target)) return;
      onClose();
    };
    window.addEventListener("resize", placeWindow);
    window.addEventListener("scroll", placeWindow, true);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", placeWindow);
      window.removeEventListener("scroll", placeWindow, true);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, [preview, onClose]);

  if (!preview) return null;

  return (
    <aside
      ref={windowRef}
      id={`ellwas-expanded-${preview.item.id.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}
      className="ellwas-expanded-preview"
      style={{ left: position.left, top: position.top }}
      aria-label={`Expanded view: ${preview.item.title}`}
      onPointerEnter={onKeepOpen}
      onPointerLeave={onCloseSoon}
    >
      <div className="ellwas-expanded-preview-bar">
        <b>DETAIL://PROCESS.IMAGE</b>
        <button type="button" onClick={onClose} aria-label="Close expanded image">CLOSE ×</button>
      </div>
      <div className="ellwas-expanded-preview-image">
        <img src={preview.item.src} alt={preview.item.alt} />
      </div>
      <footer><b>{preview.item.title}</b><span>PROCESS BOARD / P.{preview.item.page}</span></footer>
    </aside>
  );
}

function EllwasProcessCarousel({
  slides,
  activePreviewId,
  onPreviewOpen,
  onPreviewCloseSoon,
  controlsLabel = "Terminal interaction study controls",
  previousLabel = "Previous terminal interaction study",
  nextLabel = "Next terminal interaction study",
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pointerPaused, setPointerPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [rotationPaused, setRotationPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const carouselRef = useRef(null);
  const activeSlide = slides[activeIndex];
  const paused = pointerPaused || focusPaused || rotationPaused;

  useEffect(() => {
    const node = carouselRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "80px",
      threshold: 0.2,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || paused || !inView || slides.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex(index => (index + 1) % slides.length);
    }, 3400);
    return () => window.clearInterval(timer);
  }, [inView, paused, slides.length]);

  const showPrevious = () => setActiveIndex(index => (index - 1 + slides.length) % slides.length);
  const showNext = () => setActiveIndex(index => (index + 1) % slides.length);

  return (
    <figure
      ref={carouselRef}
      className="ellwas-process-board ellwas-process-carousel"
      aria-roledescription="carousel"
      onPointerEnter={() => setPointerPaused(true)}
      onPointerLeave={() => setPointerPaused(false)}
      onFocusCapture={() => setFocusPaused(true)}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusPaused(false);
      }}
    >
      <div className="ellwas-process-carousel-visual">
        <EllwasPreviewTrigger
          key={activeSlide.src}
          item={{ ...activeSlide, id: activeSlide.src }}
          activePreviewId={activePreviewId}
          onOpen={onPreviewOpen}
          onCloseSoon={onPreviewCloseSoon}
        />
        <div className="ellwas-process-carousel-controls" role="group" aria-label={controlsLabel}>
          <button type="button" onClick={showPrevious} aria-label={previousLabel}>←</button>
          <span>{String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
          <button
            type="button"
            className="ellwas-process-carousel-toggle"
            onClick={() => setRotationPaused(value => !value)}
            aria-label={rotationPaused ? "Resume automatic cycling" : "Pause automatic cycling"}
            aria-pressed={rotationPaused}
          >
            {rotationPaused ? "▶" : "Ⅱ"}
          </button>
          <button type="button" onClick={showNext} aria-label={nextLabel}>→</button>
          <span className="ellwas-process-carousel-announcement" aria-live="polite">
            {`${activeIndex + 1} of ${slides.length}: ${activeSlide.title}, process board page ${activeSlide.page}`}
          </span>
        </div>
      </div>
      <figcaption><b>{activeSlide.title}</b><span>PROCESS BOARD / P.{activeSlide.page}</span></figcaption>
    </figure>
  );
}

function EllwasMotionStudy() {
  return (
    <section className="ellwas-motion ellwas-motion-step" aria-labelledby="ellwas-motion-title">
      <div className="ellwas-section-heading">
        <span>02 / BEHAVIOR PROTOTYPES</span>
        <h2 id="ellwas-motion-title">LIGHT IN MOTION</h2>
        <b>02 MOTION STUDIES</b>
      </div>
      <div className="ellwas-motion-grid">
        <EllwasFrame code="MOTION://BLOOM" status="GIF / LOOP" className="ellwas-gif-test">
          <img src="/assets/mcad-ellwas/light-bloom-loop.gif" alt="Light bloom animation test" loading="lazy" />
        </EllwasFrame>
      </div>
    </section>
  );
}

const ellwasPoofTips = [
  "/assets/mcad-ellwas/poof-finance.svg",
  "/assets/mcad-ellwas/poof-entrepreneurship.svg",
  "/assets/mcad-ellwas/poof-education.svg",
  "/assets/mcad-ellwas/poof-health.svg",
];

const ellwasBloomSprouts = [
  { count: 7, radius: 0.24, birth: 0.01, span: 0.14, size: 0.5, type: 0 },
  { count: 10, radius: 0.46, birth: 0.12, span: 0.2, size: 0.66, type: 3 },
  { count: 13, radius: 0.72, birth: 0.28, span: 0.24, size: 0.82, type: 2 },
  { count: 16, radius: 1, birth: 0.48, span: 0.32, size: 1, type: 1 },
].flatMap((ring, ringIndex) => Array.from({ length: ring.count }, (_, index) => ({
  angle: (-Math.PI / 2) + ((Math.PI * 2 * index) / ring.count) + (ringIndex * 0.12),
  birth: ring.birth + ((((index * 5) % ring.count) / ring.count) * ring.span),
  curve: Math.sin((index + 1) * 2.17 + ringIndex) * (5 + ringIndex * 5),
  length: ring.radius * (0.9 + (((index * 7) % 5) * 0.027)),
  ring: ringIndex,
  size: ring.size,
  type: ring.type,
})));

function EllwasInteractiveBloom() {
  const canvasRef = useRef(null);
  const fieldRef = useRef(null);
  const pointerRef = useRef({ targetX: 0.5, targetY: 0.5, inside: false, lastMoveAt: 0 });
  const idleRotationRef = useRef({ angle: 0, speed: 0 });
  const stemPhysicsRef = useRef(ellwasBloomSprouts.map((sprout, index) => ({
    radialOffset: 0,
    tangentialOffset: 0,
    radialVelocity: 0,
    tangentialVelocity: 0,
    radialStiffness: 13 + (((index * 11) % 7) * 0.7) - (sprout.ring * 0.35),
    tangentStiffness: 7.4 + (((index * 13) % 6) * 0.65) - (sprout.ring * 0.55),
    radialDamping: 4.2 + (((index * 5) % 3) * 0.3),
    tangentDamping: 2.6 + (((index * 7) % 4) * 0.32),
    drag: 3.2 + (sprout.ring * 1.2) + (((index * 7) % 5) * 0.2),
    phase: Math.sin((index + 1) * 1.73),
  })));
  const growthRef = useRef(0.025);
  const lastProgressRef = useRef(2);
  const [progress, setProgress] = useState(2);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const field = fieldRef.current;
    if (!canvas || !field) return undefined;

    const context = canvas.getContext("2d");
    const tipImages = ellwasPoofTips.map(source => {
      const image = new Image();
      image.src = source;
      return image;
    });
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frameId = 0;
    let previousTime = performance.now();
    let width = 1;
    let height = 1;
    let pixelRatio = 1;

    const resize = () => {
      const bounds = field.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const drawTip = (image, x, y, angle, scale, opacity) => {
      if (!image.complete || !image.naturalWidth) return;
      const base = 27 * scale;
      const ratio = image.naturalWidth / image.naturalHeight;
      const tipWidth = ratio >= 1 ? base * ratio : base;
      const tipHeight = ratio >= 1 ? base : base / ratio;
      context.save();
      context.translate(x, y);
      context.rotate(angle + (Math.PI / 2));
      context.globalAlpha = opacity;
      context.filter = "invert(1) sepia(.38) saturate(.45) brightness(2.3) drop-shadow(0 0 5px rgba(255,248,210,.78))";
      context.drawImage(image, -tipWidth / 2, -tipHeight / 2, tipWidth, tipHeight);
      context.restore();
    };

    const drawBloom = (growth, centerX, centerY, stemPhysics, idleRotation) => {
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);
      const radius = Math.min(width * 0.33, height * 0.36, 185);

      context.save();
      context.translate(centerX, centerY);
      context.lineCap = "round";
      context.lineJoin = "round";

      ellwasBloomSprouts.forEach((sprout, sproutIndex) => {
        const local = Math.max(0, Math.min(1, (growth - sprout.birth) / 0.14));
        if (local <= 0) return;
        const eased = 1 - ((1 - local) ** 3);
        const length = radius * sprout.length * eased;
        const normalizedLength = length / Math.max(1, radius);
        const stemMotion = stemPhysics[sproutIndex];
        const baseAngle = sprout.angle + idleRotation;
        const motionWeight = (normalizedLength ** 1.18) * (0.72 + (sprout.ring * 0.18));
        const compression = Math.min(0, stemMotion.radialOffset);
        const dynamicLength = Math.max(0, length + (compression * motionWeight * 0.55));
        const angularDeflection = (stemMotion.tangentialOffset * motionWeight) / Math.max(42, dynamicLength);
        const velocityDeflection = Math.max(-0.16, Math.min(0.16, stemMotion.tangentialVelocity / 2300)) * motionWeight;
        const dynamicAngle = baseAngle + angularDeflection + velocityDeflection;
        const middleAngle = baseAngle + (angularDeflection * 0.52) + (velocityDeflection * 0.28);
        const radialEndX = Math.cos(dynamicAngle) * dynamicLength;
        const radialEndY = Math.sin(dynamicAngle) * dynamicLength;
        const endX = radialEndX;
        const endY = radialEndY;
        const basePerpendicularX = -Math.sin(baseAngle);
        const basePerpendicularY = Math.cos(baseAngle);
        const middlePerpendicularX = -Math.sin(middleAngle);
        const middlePerpendicularY = Math.cos(middleAngle);
        const tipLag = stemMotion.tangentialOffset * motionWeight;
        const naturalCurve = sprout.curve * eased;
        const controlOneRadius = dynamicLength * 0.3;
        const controlTwoRadius = Math.max(0, (dynamicLength * 0.72) - Math.min(dynamicLength * 0.07, Math.abs(tipLag) * 0.05));
        const controlOneX = (Math.cos(baseAngle) * controlOneRadius) + (basePerpendicularX * naturalCurve * 0.28);
        const controlOneY = (Math.sin(baseAngle) * controlOneRadius) + (basePerpendicularY * naturalCurve * 0.28);
        const controlTwoX = (Math.cos(middleAngle) * controlTwoRadius) + (middlePerpendicularX * ((naturalCurve * 0.72) + (tipLag * 0.035)));
        const controlTwoY = (Math.sin(middleAngle) * controlTwoRadius) + (middlePerpendicularY * ((naturalCurve * 0.72) + (tipLag * 0.035)));
        const opacity = 0.38 + (eased * 0.62);

        context.beginPath();
        context.moveTo(0, 0);
        context.bezierCurveTo(controlOneX, controlOneY, controlTwoX, controlTwoY, endX, endY);
        context.strokeStyle = `rgba(255, 249, 218, ${opacity})`;
        context.lineWidth = 0.7 + (sprout.ring * 0.22);
        context.shadowColor = "rgba(255, 246, 194, .72)";
        context.shadowBlur = 5 + (sprout.ring * 2);
        context.stroke();

        if (local > 0.48 && sprout.ring > 0) {
          const branchGrowth = Math.min(1, (local - 0.48) / 0.42);
          const t = 0.58;
          const stemX = (3 * ((1 - t) ** 2) * t * controlOneX) + (3 * (1 - t) * (t ** 2) * controlTwoX) + ((t ** 3) * endX);
          const stemY = (3 * ((1 - t) ** 2) * t * controlOneY) + (3 * (1 - t) * (t ** 2) * controlTwoY) + ((t ** 3) * endY);
          const side = sproutIndex % 2 === 0 ? 1 : -1;
          const sideAngle = dynamicAngle + (side * (0.34 + sprout.ring * 0.05));
          const sideLength = radius * (0.09 + sprout.ring * 0.025) * branchGrowth;
          const sideX = stemX + (Math.cos(sideAngle) * sideLength);
          const sideY = stemY + (Math.sin(sideAngle) * sideLength);
          context.beginPath();
          context.moveTo(stemX, stemY);
          context.lineTo(sideX, sideY);
          context.lineWidth = 0.65;
          context.strokeStyle = `rgba(255, 249, 218, ${0.3 + branchGrowth * 0.5})`;
          context.stroke();
          if (branchGrowth > 0.72) {
            drawTip(tipImages[sprout.type], sideX, sideY, sideAngle, 0.35 + (sprout.size * 0.25 * branchGrowth), branchGrowth * 0.72);
          }
        }

        if (local > 0.68) {
          const tipGrowth = Math.min(1, (local - 0.68) / 0.32);
          const tipAngle = Math.atan2(endY - controlTwoY, endX - controlTwoX);
          drawTip(tipImages[sprout.type], endX, endY, tipAngle, (0.38 + sprout.size * 0.42) * tipGrowth, tipGrowth);
        }
      });

      context.shadowColor = "rgba(255, 248, 216, .95)";
      context.shadowBlur = 16;
      context.fillStyle = "rgba(255, 252, 229, .96)";
      context.beginPath();
      context.arc(0, 0, 3.2 + (growth * 3.4), 0, Math.PI * 2);
      context.fill();
      context.shadowBlur = 5;
      context.strokeStyle = "rgba(255, 249, 218, .7)";
      context.lineWidth = 0.7;
      context.beginPath();
      context.arc(0, 0, 10 + (growth * 12), 0, Math.PI * 2);
      context.stroke();
      context.restore();
    };

    const tick = now => {
      const delta = Math.min(0.05, Math.max(0, (now - previousTime) / 1000));
      previousTime = now;
      const pointer = pointerRef.current;
      const stemPhysics = stemPhysicsRef.current;
      const idleRotation = idleRotationRef.current;
      stemPhysics.forEach(stem => {
        if (reduceMotion) {
          stem.radialOffset = 0;
          stem.tangentialOffset = 0;
          stem.radialVelocity = 0;
          stem.tangentialVelocity = 0;
          return;
        }
        stem.radialVelocity += ((-stem.radialStiffness * stem.radialOffset) - (stem.radialDamping * stem.radialVelocity)) * delta;
        stem.tangentialVelocity += ((-stem.tangentStiffness * stem.tangentialOffset) - (stem.tangentDamping * stem.tangentialVelocity)) * delta;
        stem.radialOffset = Math.max(-40, Math.min(0, stem.radialOffset + (stem.radialVelocity * delta)));
        stem.tangentialOffset = Math.max(-90, Math.min(90, stem.tangentialOffset + (stem.tangentialVelocity * delta)));
        if (stem.radialOffset === 0 && stem.radialVelocity > 0) stem.radialVelocity = 0;
      });

      if (reduceMotion) {
        idleRotation.angle = 0;
        idleRotation.speed = 0;
      } else {
        const idleTargetSpeed = now - pointer.lastMoveAt > 650 ? 0.036 : 0;
        const idleEase = Math.min(1, delta * 2.4);
        idleRotation.speed += (idleTargetSpeed - idleRotation.speed) * idleEase;
        idleRotation.angle = (idleRotation.angle + (idleRotation.speed * delta)) % (Math.PI * 2);
      }

      if (reduceMotion) growthRef.current = 1;
      else if (pointer.inside) growthRef.current = Math.min(1, growthRef.current + (delta / 14));

      const centerX = pointer.targetX * width;
      const centerY = pointer.targetY * height;
      drawBloom(growthRef.current, centerX, centerY, stemPhysics, idleRotation.angle);

      const nextProgress = Math.round(growthRef.current * 100);
      if (nextProgress !== lastProgressRef.current) {
        lastProgressRef.current = nextProgress;
        setProgress(nextProgress);
      }
      frameId = window.requestAnimationFrame(tick);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(field);
    frameId = window.requestAnimationFrame(tick);

    return () => {
      resizeObserver.disconnect();
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  const updatePointer = event => {
    const bounds = fieldRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const pointer = pointerRef.current;
    const nextX = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const nextY = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    const movementX = (nextX - pointer.targetX) * bounds.width;
    const movementY = (nextY - pointer.targetY) * bounds.height;
    if (Math.hypot(movementX, movementY) > 0.35) pointer.lastMoveAt = performance.now();
    stemPhysicsRef.current.forEach((stem, stemIndex) => {
      const angle = ellwasBloomSprouts[stemIndex].angle + idleRotationRef.current.angle;
      const cosine = Math.cos(angle);
      const sine = Math.sin(angle);
      const radialMovement = (movementX * cosine) + (movementY * sine);
      const tangentialMovement = (movementX * -sine) + (movementY * cosine);
      const compressionImpulse = Math.max(0, radialMovement);
      stem.radialVelocity = Math.max(-900, Math.min(0, stem.radialVelocity - (compressionImpulse * stem.drag * 0.9)));
      stem.tangentialVelocity = Math.max(-1300, Math.min(1300,
        stem.tangentialVelocity
        - (tangentialMovement * stem.drag * 1.25)
        + (radialMovement * stem.phase * stem.drag * 0.18),
      ));
    });
    pointer.targetX = nextX;
    pointer.targetY = nextY;
  };

  const beginGrowth = event => {
    updatePointer(event);
    pointerRef.current.inside = true;
    setActive(true);
  };

  const continueGrowth = event => {
    updatePointer(event);
    if (!pointerRef.current.inside) {
      pointerRef.current.inside = true;
      setActive(true);
    }
  };

  const holdGrowth = () => {
    pointerRef.current.inside = false;
    setActive(false);
  };

  const resetBloom = () => {
    growthRef.current = 0.025;
    lastProgressRef.current = 2;
    stemPhysicsRef.current.forEach(stem => {
      stem.radialOffset = 0;
      stem.tangentialOffset = 0;
      stem.radialVelocity = 0;
      stem.tangentialVelocity = 0;
    });
    setProgress(2);
  };

  const status = progress >= 100 ? "BLOOM COMPLETE / MAX SIGNAL" : active ? "SIGNAL ACTIVE / GROWING" : "MOVE INSIDE / GROWTH HELD";

  return (
    <div className={`ellwas-bloom${active ? " is-active" : ""}`}>
      <div
        ref={fieldRef}
        className="ellwas-bloom-field"
        role="group"
        tabIndex="0"
        aria-label="Interactive dandelion mandala. Move the pointer inside this frame to guide the bloom and grow new sprouts."
        onPointerEnter={beginGrowth}
        onPointerMove={continueGrowth}
        onPointerLeave={holdGrowth}
        onPointerDown={event => {
          event.currentTarget.setPointerCapture?.(event.pointerId);
          beginGrowth(event);
        }}
        onPointerUp={holdGrowth}
        onFocus={() => {
          pointerRef.current.inside = true;
          setActive(true);
        }}
        onBlur={holdGrowth}
        onKeyDown={event => {
          if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            const nextActive = !pointerRef.current.inside;
            pointerRef.current.inside = nextActive;
            setActive(nextActive);
          }
          if (event.key === "Escape") holdGrowth();
        }}
      >
        <canvas ref={canvasRef} className="ellwas-bloom-canvas" aria-hidden="true" />
        <span className="ellwas-bloom-instruction" aria-hidden="true">MOVE TO GUIDE / STAY TO GROW</span>
        <span className="ellwas-bloom-live" aria-live="polite">Bloom growth {progress}%</span>
      </div>
      <div className="ellwas-bloom-controls">
        <span>{status}</span>
        <b>{String(progress).padStart(3, "0")}%</b>
        <button type="button" onClick={resetBloom}>RESET BLOOM</button>
      </div>
    </div>
  );
}

function McadEllwas({ project, path }) {
  const context = getProjectRouteContext(path);
  const [expandedPreview, setExpandedPreview] = useState(null);
  const previewCloseTimer = useRef(null);
  const summary = "Worked as a design intern for Dana Karwas on an experience design concept for the Milken Center for Advancing the American Dream.";
  const concept = "The concept centered on a personal light that grew as visitors engaged with the museum. The exhibits, people, stories, and milestones they explored across four themes influenced its botanical components, color, density, and growth. The core interaction lived on physical museum terminals, with a possible mobile extension explored for photo upload and QR retrieval.";

  const keepPreviewOpen = useCallback(() => {
    window.clearTimeout(previewCloseTimer.current);
  }, []);
  const closePreview = useCallback(() => {
    window.clearTimeout(previewCloseTimer.current);
    setExpandedPreview(null);
  }, []);
  const closePreviewSoon = useCallback(() => {
    window.clearTimeout(previewCloseTimer.current);
    previewCloseTimer.current = window.setTimeout(() => setExpandedPreview(null), 140);
  }, []);
  const openPreview = useCallback((item, trigger) => {
    keepPreviewOpen();
    setExpandedPreview({ item, trigger });
  }, [keepPreviewOpen]);
  useEffect(() => () => window.clearTimeout(previewCloseTimer.current), []);

  return (
    <>
      <main className="ellwas-page">
        <section className="ellwas-hero" aria-labelledby="ellwas-title">
          <div className="ellwas-hero-media">
            <div className="ellwas-frame-bar"><b>LIVE://DANDELION.GROWTH</b><span>VISITOR SIGNAL / ACTIVE</span></div>
            <EllwasInteractiveBloom />
            <div className="ellwas-hero-readout"><span>INPUT / JOURNEY</span><i aria-hidden="true">→</i><span>OUTPUT / UNIQUE LIGHT</span></div>
          </div>

          <header className="ellwas-hero-copy">
            <span>COM_01 / EXPERIENCE SYSTEM / 2022</span>
            <h1 id="ellwas-title">MCAD<br /><i>×</i> ELLWAS</h1>
            <p>{summary}</p>
            <div className="ellwas-tags"><span>EXPERIENCE DESIGN</span><span>VISUAL SYSTEM</span><span>MUSEUM UI</span></div>
            <a href="#ellwas-process">TRACE THE EXPLORATION <b aria-hidden="true">↓</b></a>
          </header>
        </section>

        <section className="ellwas-concept" aria-labelledby="ellwas-concept-title">
          <header>
            <span>01 / DESIGN PREMISE</span>
            <h2 id="ellwas-concept-title">ONE LIGHT.<br />MANY JOURNEYS.</h2>
          </header>
          <div className="ellwas-concept-copy">
            <p>{concept}</p>
            <dl>
              <div><dt>INPUT</dt><dd>Exhibits, people, stories, and milestones explored</dd></div>
              <div><dt>LOGIC</dt><dd>Theme and engagement adjust form, color, density, and growth</dd></div>
              <div><dt>OUTPUT</dt><dd>A personal light across museum terminals, with a possible mobile continuation</dd></div>
            </dl>
            <div className="ellwas-influence-map" aria-label="How museum interactions influenced each visitor's light">
              <span>WHAT SHAPED THE LIGHT</span>
              <div><b>THEME</b><p>Finance / Entrepreneurship / Education / Health</p><i>COMPONENT + COLOR</i></div>
              <div><b>CONTENT</b><p>Exhibits / People / Stories / Milestones</p><i>COMPOSITION</i></div>
              <div><b>ENGAGEMENT</b><p>What each visitor chose to explore</p><i>DENSITY + EMPHASIS</i></div>
              <div><b>PROGRESS</b><p>Accumulation throughout the museum visit</p><i>GROWTH</i></div>
            </div>
          </div>
        </section>

        <section className="ellwas-process ellwas-story" id="ellwas-process" aria-label="Development story">
          <div className="ellwas-story-chapters">
            {ellwasProcessChapters.map(chapter => (
              <Fragment key={chapter.number}>
                <article className="ellwas-story-chapter" id={chapter.id}>
                  <header>
                    <span>{chapter.number} / {chapter.label}</span>
                    <h3>{chapter.title}</h3>
                    <p>{chapter.copy}</p>
                    <aside><b>DECISION</b><span>{chapter.decision}</span></aside>
                  </header>
                  <div className={`ellwas-board-grid is-${chapter.layout}`}>
                    {chapter.carousel ? <EllwasProcessCarousel slides={chapter.boards} activePreviewId={expandedPreview?.item.id} onPreviewOpen={openPreview} onPreviewCloseSoon={closePreviewSoon} /> : chapter.boards.map(board => (
                      board.carousel ? (
                        <EllwasProcessCarousel
                          key={board.key}
                          slides={board.slides}
                          controlsLabel={board.controlsLabel}
                          previousLabel={board.previousLabel}
                          nextLabel={board.nextLabel}
                          activePreviewId={expandedPreview?.item.id}
                          onPreviewOpen={openPreview}
                          onPreviewCloseSoon={closePreviewSoon}
                        />
                      ) : (
                        <figure className="ellwas-process-board" key={board.src}>
                          <EllwasPreviewTrigger
                            item={{ ...board, id: board.src }}
                            activePreviewId={expandedPreview?.item.id}
                            onOpen={openPreview}
                            onCloseSoon={closePreviewSoon}
                          />
                          <figcaption><b>{board.title}</b><span>PROCESS BOARD / P.{board.page}</span></figcaption>
                        </figure>
                      )
                    ))}
                  </div>
                </article>
                {chapter.number === "01" ? <EllwasMotionStudy /> : null}
              </Fragment>
            ))}
          </div>
        </section>

        <section className="ellwas-pillars" aria-labelledby="ellwas-pillars-title">
          <div className="ellwas-section-heading">
            <span>03 / RESOLVED VISUAL GRAMMAR</span>
            <h2 id="ellwas-pillars-title">FOUR PILLARS</h2>
            <b>04 DISTINCT GROWTH SIGNALS</b>
          </div>
          <p className="ellwas-section-intro">The component family gives each pillar its own silhouette. Combined in different proportions, the four signals produce a personal light that is unique to each museum journey.</p>
          <EllwasFrame code="SPECIMEN://PILLARS" status="FINANCE / ENTREPRENEURSHIP / EDUCATION / HEALTH" className="ellwas-pillars-frame">
            <img src="/assets/309-b6a78abcfe15.jpg" alt="Four luminous forms representing finance, entrepreneurship, education, and health" loading="lazy" />
          </EllwasFrame>
        </section>

        <section className="ellwas-application" aria-labelledby="ellwas-application-title">
          <div className="ellwas-section-heading">
            <span>05 / SYSTEM APPLICATION</span>
            <h2 id="ellwas-application-title">ONE SYSTEM.<br />MANY SCALES.</h2>
            <b>03 APPLICATION VIEWS</b>
          </div>
          <p className="ellwas-section-intro">The final language moves from a personal emblem to physical museum terminals, exhibit touchscreens, and a room-scale timeline. Mobile was explored as a possible supporting interaction for supplying a photo or retrieving a result by QR code—not as the project’s primary interface.</p>
          <div className="ellwas-scale-grid">
            {ellwasScaleStudies.map(study => (
              <figure className="ellwas-scale-study" key={study.src}>
                <EllwasPreviewTrigger
                  item={{ ...study, id: study.src }}
                  activePreviewId={expandedPreview?.item.id}
                  onOpen={openPreview}
                  onCloseSoon={closePreviewSoon}
                />
                <figcaption><b>{study.title}</b><p>{study.note}</p><span>PROCESS BOARD / P.{study.page}</span></figcaption>
              </figure>
            ))}
          </div>
        </section>

        <ProjectLinks links={project.links} />
        <ProjectRoutePager context={context} />
        <EllwasExpandedPreview
          preview={expandedPreview}
          onClose={closePreview}
          onKeepOpen={keepPreviewOpen}
          onCloseSoon={closePreviewSoon}
        />
      </main>
      <Footer />
    </>
  );
}

const witchesFlightFrames = [
  {
    src: "/assets/witches-goya-frame.jpg",
    label: "Goya painting",
    shortLabel: "SOURCE",
    className: "witches-frame--painting",
  },
  {
    src: "/assets/witches-render-frame.png",
    label: "Witches' Flight 3D render",
    shortLabel: "RENDER",
    className: "witches-frame--render",
  },
  {
    src: "/assets/witches-wireframe-frame.png",
    label: "Aligned Maya wireframe view",
    shortLabel: "MESH",
    className: "witches-frame--wireframe",
  },
];

const WITCHES_HOLD_MS = 3000;
const WITCHES_CROSSFADE_MS = 900;

function WitchesFlight({ project }) {
  const [activeFrame, setActiveFrame] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    let timer;
    let cancelled = false;
    const queueNext = delay => {
      timer = window.setTimeout(() => {
        if (cancelled) return;
        setActiveFrame(frame => (frame + 1) % witchesFlightFrames.length);
        queueNext(WITCHES_HOLD_MS + WITCHES_CROSSFADE_MS);
      }, delay);
    };
    queueNext(WITCHES_HOLD_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [paused]);

  const selectFrame = index => {
    setActiveFrame(index);
    setPaused(true);
  };

  return (
    <>
      <main className="witches-page">
        <section className="witches-hero" aria-labelledby="witches-title">
          <header className="witches-hero-heading">
            <div>
              <span>IMAGE STUDY / 2024</span>
              <h1 id="witches-title">WITCHES&rsquo; FLIGHT 3D</h1>
            </div>
            <button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? "Play image sequence" : "Pause image sequence"}>
              {paused ? "PLAY" : "PAUSE"}
            </button>
          </header>

          <div className="witches-image-stack" aria-live="off">
            {witchesFlightFrames.map((frame, index) => (
              <img
                className={`witches-frame ${frame.className} ${activeFrame === index ? "is-active" : ""}`}
                src={frame.src}
                alt={frame.label}
                aria-hidden={activeFrame !== index}
                key={frame.src}
              />
            ))}
            <span className="witches-raster-transition" aria-hidden="true" key={activeFrame} />
            <div className="witches-digital-frame" aria-hidden="true">
              <span className="witches-frame-readout witches-frame-readout--top">
                SIGNAL://WITCHES.FLIGHT / FRAME {String(activeFrame + 1).padStart(2, "0")}
              </span>
              <span className="witches-frame-readout witches-frame-readout--bottom">
                <i /> BITMAP DECODE / 2:3 / LOCKED
              </span>
              <i className="witches-frame-corner witches-frame-corner--tl" />
              <i className="witches-frame-corner witches-frame-corner--tr" />
              <i className="witches-frame-corner witches-frame-corner--bl" />
              <i className="witches-frame-corner witches-frame-corner--br" />
            </div>
          </div>

          <div className={`witches-sequence-controls ${paused ? "is-paused" : ""}`} role="tablist" aria-label="Witches' Flight image sequence">
            {witchesFlightFrames.map((frame, index) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeFrame === index}
                className={activeFrame === index ? "is-active" : ""}
                onClick={() => selectFrame(index)}
                key={frame.shortLabel}
              >
                <b>{String(index + 1).padStart(2, "0")}</b>
                <span>{frame.shortLabel}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="witches-project-notes" aria-label="Project details">
          <div>
            <span>3D RECONSTRUCTION / 2024</span>
            <h2>ABOUT THE WORK</h2>
          </div>
          <div className="witches-project-copy">
            <p>A 3D recreation of Francisco Goya&rsquo;s 1798 oil painting <i>Witches&rsquo; Flight</i>.</p>
            <p>All assets and textures are completely original.</p>
            <dl>
              <div><dt>TOOLS</dt><dd>Maya / ZBrush / Substance Painter</dd></div>
              <div><dt>DISPLAY</dt><dd>Three aligned 2:3 frames</dd></div>
              <div><dt>SEQUENCE</dt><dd>3 second hold / bitmap crossfade</dd></div>
            </dl>
          </div>
        </section>
        <ProjectLinks links={project.links} />
      </main>
      <Footer />
    </>
  );
}

function Study() {
  return <StudyPage Footer={Footer} />;
}

function About() {
  const biography = data.about.content.filter(item => item.tag === "p" && item.text !== "Areas of Expertise");
  const expertise = data.about.content.filter(item => item.tag !== "p");
  return (
    <>
      <main className="about">
        <div className="about-copy"><h1>SOPHIE KATSIVELOS</h1><div className="expertise"><p>Areas of Expertise</p>{expertise.map((item, index) => item.tag === "h2" ? <h2 key={index}>{item.text}</h2> : <h3 key={index}>{item.text}</h3>)}</div><div className="biography">{biography.map((item, index) => <p key={index}>{item.text}</p>)}</div></div>
        {data.about.images[0] && <img src={data.about.images[0]} alt="Portrait of Sophie Katsivelos" />}
      </main>
      <Footer />
    </>
  );
}

function AsciiArchivePreview({ src, alt }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !src) return undefined;

    const image = new Image();
    const glyphs = " .`^,:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
    let disposed = false;

    const draw = () => {
      if (disposed || !image.complete || !image.naturalWidth) return;
      const width = Math.max(1, Math.round(canvas.clientWidth));
      const height = Math.max(1, Math.round(canvas.clientHeight));
      const cellWidth = width < 520 ? 3 : 4;
      const cellHeight = width < 520 ? 4 : 5;
      const columns = Math.max(1, Math.ceil(width / cellWidth));
      const rows = Math.max(1, Math.ceil(height / cellHeight));
      const density = Math.min(window.devicePixelRatio || 1, 2);
      const context = canvas.getContext("2d");
      const sample = document.createElement("canvas");
      const sampleContext = sample.getContext("2d", { willReadFrequently: true });

      canvas.width = Math.round(width * density);
      canvas.height = Math.round(height * density);
      context.setTransform(density, 0, 0, density, 0, 0);
      context.fillStyle = "#020805";
      context.fillRect(0, 0, width, height);
      context.font = `700 ${cellHeight}px Consolas, \"Courier New\", monospace`;
      context.textBaseline = "top";

      sample.width = columns;
      sample.height = rows;
      const sourceAspect = image.naturalWidth / image.naturalHeight;
      const targetAspect = width / height;
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = image.naturalWidth;
      let sourceHeight = image.naturalHeight;

      if (sourceAspect > targetAspect) {
        sourceWidth = image.naturalHeight * targetAspect;
        sourceX = (image.naturalWidth - sourceWidth) / 2;
      } else {
        sourceHeight = image.naturalWidth / targetAspect;
        sourceY = (image.naturalHeight - sourceHeight) / 2;
      }

      sampleContext.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, columns, rows);
      const pixels = sampleContext.getImageData(0, 0, columns, rows).data;

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const pixel = (row * columns + column) * 4;
          const red = pixels[pixel];
          const green = pixels[pixel + 1];
          const blue = pixels[pixel + 2];
          const alpha = pixels[pixel + 3] / 255;
          const luminance = (red * .2126 + green * .7152 + blue * .0722) / 255;
          const glyphIndex = Math.min(glyphs.length - 1, Math.floor(luminance * glyphs.length));
          const glyph = glyphs[glyphIndex];
          if (glyph === " " || alpha < .04) continue;
          context.fillStyle = `rgba(112,195,94,${(.22 + luminance * .78) * alpha})`;
          context.fillText(glyph, column * cellWidth, row * cellHeight);
        }
      }
    };

    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    image.onload = draw;
    image.src = src;

    return () => {
      disposed = true;
      image.onload = null;
      observer.disconnect();
    };
  }, [src]);

  return <canvas ref={canvasRef} className="archive-ascii-preview" role="img" aria-label={alt} />;
}

function Archive() {
  const categories = ["All", "Digital", "Physical", "Client", "Study"];
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState("title");
  const entries = useMemo(() => [
    {
      href: "/digital-sociology-study",
      title: "Digital Sociology Study",
      category: "Study",
      preview: "/assets/006-0cb84c00d68b.jpg",
      year: "2025",
      summary: "An interactive mixed-reality study connecting two participants and a live observing audience.",
      objectCount: 9,
    },
    ...data.collections.digital.map(item => ({ ...item, category: "Digital" })),
    ...data.collections.physical.map(item => ({ ...item, category: "Physical" })),
    ...data.collections.clients.map(item => ({ ...item, category: "Client" })),
  ].map(item => {
    const project = data.projects[item.href];
    const indexedYear = getProjectYear(project?.content || []);
    return {
      ...item,
      preview: item.preview || item.image || project?.images?.[0] || project?.mediaPosters?.[0] || "",
      year: item.year || (indexedYear === "ARCHIVE" ? "N/D" : indexedYear),
      summary: item.summary || getProjectSummary(project?.content || []) || "Project record available for review.",
      objectCount: item.objectCount ?? ((project?.images?.length || 0) + (project?.media?.length || 0) + (project?.embeds?.length || 0)),
    };
  }).sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base", numeric: true })), []);
  const visibleEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = entries.filter(item => (
      (activeCategory === "All" || item.category === activeCategory)
      && (!normalizedQuery || `${item.title} ${item.category} ${item.year}`.toLowerCase().includes(normalizedQuery))
    ));
    return [...filtered].sort((a, b) => {
      if (sortMode === "title") return a.title.localeCompare(b.title, undefined, { sensitivity: "base", numeric: true });
      const yearA = /^\d{4}$/.test(a.year) ? Number(a.year) : null;
      const yearB = /^\d{4}$/.test(b.year) ? Number(b.year) : null;
      if (yearA === null && yearB === null) return a.title.localeCompare(b.title, undefined, { sensitivity: "base", numeric: true });
      if (yearA === null) return 1;
      if (yearB === null) return -1;
      const yearDifference = sortMode === "newest" ? yearB - yearA : yearA - yearB;
      return yearDifference || a.title.localeCompare(b.title, undefined, { sensitivity: "base", numeric: true });
    });
  }, [activeCategory, entries, query, sortMode]);
  const [selectedHref, setSelectedHref] = useState(entries[0]?.href || "");
  const selected = visibleEntries.find(item => item.href === selectedHref) || visibleEntries[0] || null;

  useEffect(() => {
    if (visibleEntries.length && !visibleEntries.some(item => item.href === selectedHref)) {
      setSelectedHref(visibleEntries[0].href);
    }
  }, [selectedHref, visibleEntries]);

  const categoryCount = category => category === "All" ? entries.length : entries.filter(item => item.category === category).length;
  return (
    <>
      <main className="archive-page">
        <header className="archive-heading">
          <div>
            <span>LIVE DATABASE / {String(entries.length).padStart(2, "0")} PROJECT DIRECTORIES</span>
            <h1>PROJECT<br />ARCHIVE</h1>
          </div>
          <p>Browse the drive. Select a folder to pull its record into view, then open the full project.</p>
        </header>

        <section className="archive-drive" aria-label="Project archive drive">
          <div className="archive-drive-bar">
            <span><HardDrives size={15} weight="fill" aria-hidden="true" /> PORTFOLIO_DRIVE / PROJECTS</span>
            <span>VOLUME ONLINE&nbsp;&nbsp;•&nbsp;&nbsp;{String(visibleEntries.length).padStart(2, "0")} OBJECTS</span>
          </div>

          <div className="archive-toolbar">
            <div className="archive-breadcrumb"><HardDrives size={16} weight="duotone" aria-hidden="true" /><span>PORTFOLIO_DRIVE</span><b>/</b><span>PROJECTS</span>{selected && <><b>/</b><strong>{selected.title}</strong></>}</div>
            <div className="archive-sort-controls" aria-label="Sort project archive">
              <button type="button" className={sortMode === "title" ? "is-active" : ""} onClick={() => setSortMode("title")} aria-pressed={sortMode === "title"}><TextAa size={14} weight="bold" aria-hidden="true" /> A–Z</button>
              <button type="button" className={sortMode === "newest" ? "is-active" : ""} onClick={() => setSortMode("newest")} aria-pressed={sortMode === "newest"}><SortDescending size={14} weight="bold" aria-hidden="true" /> NEWEST</button>
              <button type="button" className={sortMode === "oldest" ? "is-active" : ""} onClick={() => setSortMode("oldest")} aria-pressed={sortMode === "oldest"}><SortAscending size={14} weight="bold" aria-hidden="true" /> OLDEST</button>
            </div>
            <label className="archive-search">
              <MagnifyingGlass size={15} weight="bold" aria-hidden="true" />
              <span className="sr-only">Search project archive</span>
              <input value={query} onChange={event => setQuery(event.target.value)} placeholder="SEARCH DRIVE" />
            </label>
          </div>

          <div className="archive-drive-body">
            <aside className="archive-volumes" aria-label="Archive folders">
              <span>VOLUMES</span>
              {categories.map(category => (
                <button
                  type="button"
                  className={activeCategory === category ? "is-active" : ""}
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={activeCategory === category}
                  key={category}
                >
                  <FolderSimpleDashed size={17} weight={activeCategory === category ? "fill" : "duotone"} aria-hidden="true" />
                  <span>{category}</span>
                  <b>{String(categoryCount(category)).padStart(2, "0")}</b>
                </button>
              ))}
              <div className="archive-volume-status"><i /> DRIVE MOUNTED<br />READ / EXPLORE</div>
            </aside>

            <div className="archive-browser">
              <div className="archive-columns" aria-hidden="true"><span>NAME</span><span>YEAR</span><span>TYPE</span><span>FILES</span></div>
              <div className="archive-list">
                {visibleEntries.map((item, index) => {
                  const isSelected = selected?.href === item.href;
                  return (
                    <button
                      type="button"
                      className={`archive-row${isSelected ? " is-selected" : ""}`}
                      onClick={() => setSelectedHref(item.href)}
                      onFocus={() => setSelectedHref(item.href)}
                      aria-pressed={isSelected}
                      key={item.href}
                    >
                      <span className="archive-file-name">
                        <FileCode size={20} weight={isSelected ? "fill" : "duotone"} aria-hidden="true" />
                        <b>{String(entries.indexOf(item) + 1).padStart(2, "0")}</b>
                        <strong>{item.title}</strong>
                      </span>
                      <time>{item.year}</time>
                      <em>{item.category} folder</em>
                      <span className="archive-file-count">{String(item.objectCount).padStart(2, "0")}</span>
                    </button>
                  );
                })}
                {!visibleEntries.length && <div className="archive-empty"><FileArchive size={28} weight="thin" aria-hidden="true" /><b>NO MATCHING RECORDS</b><span>Adjust the folder or search query.</span></div>}
              </div>
            </div>

            <aside className="archive-record-shell" aria-live="polite">
              {selected ? (
                <article className={`archive-record archive-record--${selected.category.toLowerCase()}`} key={selected.href}>
                  <div className="archive-record-bar"><span>RECORD PREVIEW</span><b>{String(entries.indexOf(selected) + 1).padStart(2, "0")} / {String(entries.length).padStart(2, "0")}</b></div>
                  <div className="archive-record-visual">
                    {selected.preview
                      ? <AsciiArchivePreview src={selected.preview} alt={`High-resolution green ASCII bitmap preview of ${selected.title}`} />
                      : <div className="archive-record-no-visual"><FileArchive size={42} weight="thin" aria-hidden="true" />VISUAL NOT INDEXED</div>}
                    <span>DECODED / {selected.category.toUpperCase()}</span>
                  </div>
                  <div className="archive-record-copy">
                    <span>/{selected.category.toLowerCase()}/{selected.href.split("/").filter(Boolean).at(-1)}</span>
                    <h2>{selected.title}</h2>
                    <p>{selected.summary}</p>
                    <dl>
                      <div><dt>YEAR</dt><dd>{selected.year}</dd></div>
                      <div><dt>CLASS</dt><dd>{selected.category}</dd></div>
                      <div><dt>OBJECTS</dt><dd>{String(selected.objectCount).padStart(2, "0")}</dd></div>
                    </dl>
                    <Link href={selected.href} className="archive-record-open">OPEN PROJECT <ArrowUpRight size={18} weight="bold" aria-hidden="true" /></Link>
                  </div>
                </article>
              ) : <div className="archive-record archive-record-empty"><FileArchive size={34} weight="thin" aria-hidden="true" />SELECT A PROJECT FILE</div>}
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function NotFound() {
  return <main className="not-found"><h1>PAGE NOT FOUND</h1><Link href="/">Return home</Link></main>;
}

export function App() {
  const [path, setPath] = useState(window.location.pathname.replace(/\/$/, "") || "/");
  useEffect(() => { const update = () => setPath(window.location.pathname.replace(/\/$/, "") || "/"); window.addEventListener("popstate", update); return () => window.removeEventListener("popstate", update); }, []);
  const content = useMemo(() => {
    if (path === "/") return <Home />;
    if (path === "/digital") return <Collection type="digital" />;
    if (path === "/physical") return <Collection type="physical" />;
    if (path === "/for-clients") return <Collection type="clients" />;
    if (path === "/archive") return <Archive />;
    if (path === "/contact") return <About />;
    if (path === "/style-guide") return <StyleGuidePage Link={Link} Footer={Footer} />;
    if (path === "/digital-sociology-study") return <Study />;
    if (path === "/digital/biotic-gallery") return <BioticGallery project={data.projects[path]} />;
    if (path === "/digital/witches-flight-3d") return <WitchesFlight project={data.projects[path]} />;
    if (path === "/digital/deficit") return <DeficitExperience project={data.projects[path]} path={path} />;
    if (path === "/physical/storiesonskin") return <StoriesOnSkin project={data.projects[path]} />;
    if (path === "/physical/decay") return <DecayExperience project={data.projects[path]} path={path} />;
    if (path === "/for-clients/mcadxellwas") return <McadEllwas project={data.projects[path]} path={path} />;
    if (data.projects[path]) return <Project project={data.projects[path]} path={path} />;
    return <NotFound />;
  }, [path]);
  return <div className={path === "/" ? "app home-app" : "app"}>{path !== "/" && <CommandHeader path={path} />}{content}</div>;
}
