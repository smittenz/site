import { useEffect, useMemo, useRef, useState } from "react";
import data from "./site-data.json";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const navItems = [
  ["/", "Home"],
  ["/?search=1", "Search"],
  ["/archive", "Archive"],
  ["/contact", "About"],
];

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

function Header({ path }) {
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  return (
    <header className="site-header">
      <Link href="/" className="brand">SOPH KATSIVELOS</Link>
      <button className="menu-toggle" type="button" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
        <span /><span /><span />
      </button>
      <nav className={open ? "nav open" : "nav"} aria-label="Main navigation">
        {navItems.map(([href, label]) => <Link key={href} href={href} className={path === href ? "active" : ""}>{label}</Link>)}
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">SOPH KATSIVELOS</div>
      <a className="contact-button" href="mailto:sophkatsivelos@gmail.com">Get in Touch</a>
      <div className="follow"><strong>FOLLOW</strong><a href="https://www.linkedin.com/in/soph-katsivelos/">LinkedIn</a><a href="https://skatsivelos.itch.io/">Itch.Io</a></div>
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dragStart = useRef(null);
  const justDragged = useRef(false);
  const motionTimer = useRef(null);
  const searchRef = useRef(null);
  const searchItems = useMemo(() => [
    { href: "/digital-sociology-study", title: "Digital Sociology Study", category: "Study" },
    ...Object.entries(data.projects).map(([href, project]) => ({
      href,
      title: project.title,
      category: href.startsWith("/physical") ? "Physical" : href.startsWith("/for-clients") ? "Client" : "Digital",
    })),
    { href: "/contact", title: "About + Contact", category: "Profile" },
  ], []);
  const searchResults = searchItems.filter(item => `${item.title} ${item.category}`.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 7);
  const nodes = [
    { href: "/digital-sociology-study", label: "Digital Sociology Study", code: "01", x: 13.1, y: 25.5, side: "right", image: data.study.images[0], meta: "Networked VR Installation · 2025" },
    { href: "/digital", label: "Digital Work", code: "02", x: 35.1, y: 49.8, side: "right", image: data.collections.digital[0].image, meta: "Interactive Worlds + Digital Systems" },
    { href: "/physical", label: "Physical Work", code: "03", x: 51.6, y: 49.8, side: "left", image: data.collections.physical[0].image, meta: "Sculpture + Physical Computing" },
    { href: "/for-clients", label: "Client Work", code: "04", x: 68.1, y: 49.8, side: "left", image: data.collections.clients[0].image, meta: "Selected Collaborations" },
    { href: "/contact", label: "About + Contact", code: "05", x: 75.9, y: 32.6, side: "left", image: data.about.images[0], meta: "Artist + Experience Designer" },
    { href: "/archive", label: "Project Archive", code: "06", x: 49.4, y: 84.6, side: "left", image: data.collections.digital[1].image, meta: "Complete Project Database" },
    { href: "/?search=1", label: "Search Archive", code: "07", x: 26, y: 90.9, side: "right", image: data.collections.physical[1].image, meta: "Search Projects + Studies", action: "search" },
  ];
  const moveNode = direction => {
    const current = Math.max(0, nodes.findIndex(node => node.href === activeNode?.href));
    setPanMotion(direction > 0 ? "pan-next" : "pan-prev");
    setActiveNode(nodes[(current + direction + nodes.length) % nodes.length]);
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
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("search") === "1") {
      setSearchOpen(true);
      window.setTimeout(() => searchRef.current?.focus(), 0);
    }
  }, []);
  const openSearch = () => {
    setMenuOpen(false);
    setSearchOpen(true);
    window.setTimeout(() => searchRef.current?.focus(), 0);
  };
  return (
    <main className={activeNode ? "home is-previewing" : "home"}>
      <header className="home-header">
        <Link href="/" className="home-wordmark">SOPH KATSIVELOS</Link>
        <p>Artist + Experience Designer<br />New York, 2026</p>
        <div className="home-controls">
          <form className={`home-search ${searchOpen ? "is-open" : ""}`} role="search" onSubmit={event => {
            if (!searchResults[0]) return;
            go(event, searchResults[0].href);
          }}>
            <button className="search-open-button" type="button" onClick={openSearch} aria-label="Open search">⌕</button>
            <input ref={searchRef} value={query} onFocus={() => setSearchOpen(true)} onChange={event => setQuery(event.target.value)} placeholder="SEARCH ARCHIVE" aria-label="Search the portfolio archive" />
            {searchOpen && <button type="button" onClick={() => { setQuery(""); setSearchOpen(false); }} aria-label="Close search">×</button>}
            {searchOpen && <div className="search-results" aria-live="polite">
              <span>{String(searchResults.length).padStart(2, "0")} SIGNALS FOUND</span>
              {searchResults.length ? searchResults.map((item, index) => (
                <Link href={item.href} key={item.href} className="search-result">
                  <b>{String(index + 1).padStart(2, "0")}</b><span>{item.title}</span><em>{item.category}</em>
                </Link>
              )) : <p>NO MATCHING SIGNAL</p>}
            </div>}
          </form>
          <div className="index-menu">
            <button className="index-toggle" type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen(value => !value)}>
              INDEX <span>{menuOpen ? "−" : "+"}</span>
            </button>
            {menuOpen && <nav className="index-dropdown" aria-label="Portfolio index">
              <Link href="/"><b>01</b> Home</Link>
              <button type="button" onClick={openSearch}><b>02</b> Search</button>
              <Link href="/archive"><b>03</b> Archive</Link>
              <Link href="/contact"><b>04</b> About</Link>
            </nav>}
          </div>
        </div>
      </header>
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
                <button key={node.href} type="button" onClick={() => setActiveNode(node)} className={`map-node node-${node.side} ${activeNode?.href === node.href ? "active" : ""}`} style={{ left: `${node.x}%`, top: `${node.y}%` }} aria-label={`Zoom into ${node.label}`} aria-pressed={activeNode?.href === node.href}>
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
          {activeNode.action === "search" ? (
            <button type="button" className="enter-node" onClick={() => { setActiveNode(null); openSearch(); }}>SEARCH ARCHIVE ↗</button>
          ) : (
            <Link href={activeNode.href} className="enter-node">VIEW PROJECTS ↗</Link>
          )}
        </aside>}
        {panMotion && <div className="scan-sweep" aria-hidden="true" />}
        {activeNode && <div className="drag-hint"><span className="drag-hint-horizontal">← DRAG TO PAN →</span><span className="drag-hint-vertical">SWIPE ↑ / ↓</span></div>}
        <div className="axis axis-x">0——— signal / matter / memory ———100</div>
        <div className="axis axis-y">LIVE ARCHIVE</div>
      </section>
      <footer className="home-footer">
        <span>CLICK / TAP A PULSING NODE</span>
        <a href="mailto:sophkatsivelos@gmail.com">SOPHKATSIVELOS@GMAIL.COM ↗</a>
        <span>© {new Date().getFullYear()}</span>
      </footer>
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

function Gallery({ images, title }) {
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [images]);
  if (!images?.length) return null;
  const previous = () => setIndex(value => (value - 1 + images.length) % images.length);
  const next = () => setIndex(value => (value + 1) % images.length);
  return (
    <section className="gallery" aria-label={`${title} gallery`}>
      <img src={images[index]} alt={`${title}, image ${index + 1} of ${images.length}`} />
      {images.length > 1 && <><button className="gallery-arrow previous" onClick={previous} aria-label="Previous slide">←</button><button className="gallery-arrow next" onClick={next} aria-label="Next slide">→</button></>}
      {images.length > 1 && <div className="gallery-count">{index + 1} / {images.length}</div>}
    </section>
  );
}

function ContentBlocks({ content }) {
  return <div className="project-copy">{content.map((item, index) => {
    if (item.tag === "h2") return <h1 key={index}>{item.text}</h1>;
    if (item.tag === "h3") return <h2 key={index}>{item.text}</h2>;
    return <p key={index}>{item.text}</p>;
  })}</div>;
}

function Project({ project }) {
  const media = project.media?.find(src => /\.(mp4|webm)$/i.test(src));
  return (
    <>
      <main className="project">
        {media ? <section className="media-intro"><ContentBlocks content={project.content} /><video className="project-video" controls preload="metadata"><source src={media} /></video></section> : <><Gallery images={project.images} title={project.title} /><ContentBlocks content={project.content} /></>}
        {media && <Gallery images={project.images} title={project.title} />}
      </main>
      <Footer />
    </>
  );
}

function Study() {
  return (
    <>
      <main className="study">
        <Gallery images={data.study.images} title="Digital Sociology Study" />
        <ContentBlocks content={data.study.content} />
      </main>
      <Footer />
    </>
  );
}

function About() {
  const biography = data.about.content.filter(item => item.tag === "p" && item.text !== "Areas of Expertise");
  const expertise = data.about.content.filter(item => item.tag !== "p");
  return (
    <>
      <main className="about">
        <div className="about-copy"><h1>SOPH KATSIVELOS</h1><div className="expertise"><p>Areas of Expertise</p>{expertise.map((item, index) => item.tag === "h2" ? <h2 key={index}>{item.text}</h2> : <h3 key={index}>{item.text}</h3>)}</div><div className="biography">{biography.map((item, index) => <p key={index}>{item.text}</p>)}</div><a className="resume" href={data.about.resume}>Resume</a></div>
        {data.about.images[0] && <img src={data.about.images[0]} alt="Portrait of Soph Katsivelos" />}
      </main>
      <Footer />
    </>
  );
}

function Archive() {
  const entries = [
    ...data.collections.digital.map(item => ({ ...item, category: "Digital" })),
    ...data.collections.physical.map(item => ({ ...item, category: "Physical" })),
    ...data.collections.clients.map(item => ({ ...item, category: "Client" })),
  ];
  return (
    <>
      <main className="archive-page">
        <header className="archive-heading"><span>LIVE DATABASE / {String(entries.length).padStart(2, "0")} ENTRIES</span><h1>PROJECT<br />ARCHIVE</h1><p>SELECT A RECORD TO ENTER</p></header>
        <div className="archive-list">
          {entries.map((item, index) => <Link href={item.href} className="archive-row" key={item.href}>
            <b>{String(index + 1).padStart(2, "0")}</b><span>{item.title}</span><em>{item.category}</em><i>↗</i>
          </Link>)}
        </div>
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
    if (path === "/digital-sociology-study") return <Study />;
    if (data.projects[path]) return <Project project={data.projects[path]} />;
    return <NotFound />;
  }, [path]);
  return <div className={path === "/" ? "app home-app" : "app"}>{path !== "/" && <Header path={path} />}{content}</div>;
}
