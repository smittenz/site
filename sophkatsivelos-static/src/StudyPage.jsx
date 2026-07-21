import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import "./study.css";

const asset = name => `/assets/${name}`;

const INSTALLATION_IMAGES = [
  { src: asset("006-0cb84c00d68b.jpg"), alt: "The white audience cabinet at the center of the installation", label: "Audience cabinet" },
  { src: asset("011-8d14913a524f.jpg"), alt: "An observer using the cabinet while participants play", label: "Observer input" },
  { src: asset("012-a41b65d4d467.jpg"), alt: "Close view of the physical controls on the installation cabinet", label: "Control surface" },
  { src: asset("015-2288fd951ef0.jpg"), alt: "Inter Labs identity detail on the installation", label: "Inter Labs" },
  { src: asset("016-736179cf20ff.jpg"), alt: "A side detail of the white installation cabinet", label: "Cabinet detail" },
  { src: asset("017-8009fe14679d.jpg"), alt: "A participant wearing a virtual-reality headset", label: "Participant study" },
  { src: asset("008-d51fa40b00fb.jpg"), alt: "Two headset participants standing on either side of the installation cabinet", label: "Installation view" },
  { src: asset("010-863bce195809.jpg"), alt: "Participants interacting inside the mixed-reality installation", label: "Participants" },
  { src: asset("005-b80ef2c9295e.jpg"), alt: "Two headset participants and two observers around the installation cabinet", label: "Installation film still" },
];

const LOBBY = {
  id: "lobby",
  code: "00",
  name: "Lobby",
  scene: asset("014-da22018d1cc0.jpg"),
  sceneAlt: "The purple lobby level used as the default view between worlds",
};

const WORLDS = [
  {
    id: "build",
    code: "01",
    name: "Build",
    model: "/models/digital-sociology/dice_low.fbx",
    scene: asset("007-5cf4f903cd89.jpg"),
    sceneAlt: "The colorful Build world",
    rotation: [-0.32, 0.62, 0.08],
    maxPoints: 12000,
    displayScale: 0.78,
    wireOpacity: 0.52,
  },
  {
    id: "dance",
    code: "02",
    name: "Dance",
    model: "/models/digital-sociology/dance-vinyl-wireframe.glb",
    scene: asset("009-864bb9972f31.jpg"),
    sceneAlt: "The kinetic Dance world represented by a vinyl record",
    rotation: [0.35, -0.11, -0.12],
    maxPoints: 14000,
    displayScale: 1,
    wireOpacity: 0.52,
  },
  {
    id: "play",
    code: "03",
    name: "Play",
    model: "/models/digital-sociology/tennis_ball.fbx",
    scene: asset("018-5cc4eafa34c0.jpg"),
    sceneAlt: "The open green Play world",
    rotation: [-0.18, 0.34, -0.08],
    maxPoints: 5000,
    displayScale: 0.92,
    wireOpacity: 0.52,
  },
  {
    id: "paint",
    code: "04",
    name: "Paint",
    model: "/models/digital-sociology/brush.fbx",
    scene: asset("013-7d03410caba4.jpg"),
    sceneAlt: "The green Paint world with a large blank canvas",
    rotation: [0.1, -0.12, 0.72],
    maxPoints: 5000,
    displayScale: 1.24,
    wireOpacity: 0.52,
    corrected: true,
  },
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

function PointCloudModel({ world, active }) {
  const mountRef = useRef(null);
  const invalidateRef = useRef(null);
  const stateRef = useRef({ active, pointerX: 0, pointerY: 0 });
  const [failed, setFailed] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    stateRef.current.active = active;
    invalidateRef.current?.();
  }, [active]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(31, 1, 0.01, 40);
    camera.position.set(0, 0, 4.35);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !window.matchMedia("(max-width: 700px)").matches,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1 : 1.6));
    renderer.setClearColor(0xffffff, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.rotation.set(...world.rotation);
    scene.add(group);

    let cloud = null;
    let material = null;
    const wireMaterials = [];
    let frame = null;
    let inViewport = true;
    let cancelled = false;
    const restingColor = new THREE.Color("#000000");
    const activeColor = new THREE.Color("#68c45b");
    const currentColor = restingColor.clone();

    const resize = () => {
      const rect = mount.getBoundingClientRect();
      renderer.setSize(Math.max(rect.width, 1), Math.max(rect.height, 1), false);
      camera.aspect = rect.width / Math.max(rect.height, 1);
      camera.updateProjectionMatrix();
      renderStatic();
    };

    const updateObject = (time = 0, snap = false) => {
      if (!cloud || !material) return;
      const state = stateRef.current;
      const baseScale = world.displayScale || 1;
      const targetScale = baseScale * (state.active ? 1.08 : 1);
      const scale = snap ? targetScale : THREE.MathUtils.lerp(group.scale.x, targetScale, 0.075);
      group.scale.setScalar(scale);
      if (!reducedMotion) {
        if (world.id === "dance") {
          group.rotation.y = world.rotation[1] + Math.sin(time * 0.00034) * 0.16 + state.pointerX * 0.1;
          group.rotation.x += (world.rotation[0] - state.pointerY * 0.08 - group.rotation.x) * 0.045;
          group.rotation.z = world.rotation[2] + time * 0.00007;
        } else {
          group.rotation.y = world.rotation[1] + time * 0.00013 + state.pointerX * 0.16;
          group.rotation.x += (world.rotation[0] - state.pointerY * 0.11 - group.rotation.x) * 0.045;
          group.rotation.z = world.rotation[2] + Math.sin(time * 0.00042) * 0.025;
        }
      }
      currentColor.lerp(state.active ? activeColor : restingColor, snap ? 1 : 0.075);
      material.color.copy(currentColor);
      material.opacity = state.active ? 0.34 : 0.18;
      wireMaterials.forEach(wireMaterial => {
        wireMaterial.color.copy(currentColor);
        const baseWireOpacity = world.wireOpacity ?? 0.72;
        wireMaterial.opacity = state.active ? Math.min(1, baseWireOpacity + 0.24) : baseWireOpacity;
      });
    };

    const renderStatic = () => {
      updateObject(0, true);
      renderer.render(scene, camera);
    };
    invalidateRef.current = renderStatic;

    const animate = time => {
      if (cancelled || reducedMotion || !inViewport || document.hidden) {
        frame = null;
        return;
      }
      updateObject(time);
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };

    const start = () => {
      if (!reducedMotion && inViewport && !document.hidden && frame === null) {
        frame = window.requestAnimationFrame(animate);
      } else if (reducedMotion) {
        renderStatic();
      }
    };

    const buildPointCloud = source => {
      if (cancelled) return;
      source.updateMatrixWorld(true);
      const meshes = [];
      const sourceBounds = new THREE.Box3();
      let totalVertices = 0;
      source.traverse(object => {
        const position = object.geometry?.attributes?.position;
        if (!object.isMesh || !position) return;
        const transformedGeometry = object.geometry.clone();
        transformedGeometry.applyMatrix4(object.matrixWorld);
        transformedGeometry.computeBoundingBox();
        sourceBounds.union(transformedGeometry.boundingBox);
        meshes.push({ geometry: transformedGeometry, position: transformedGeometry.attributes.position });
        totalVertices += transformedGeometry.attributes.position.count;
      });

      const stride = Math.max(1, Math.ceil(totalVertices / world.maxPoints));
      const positions = [];
      const point = new THREE.Vector3();
      let cursor = 0;
      meshes.forEach(({ position }) => {
        for (let index = 0; index < position.count; index += 1) {
          if (cursor % stride === 0) {
            point.fromBufferAttribute(position, index);
            positions.push(point.x, point.y, point.z);
          }
          cursor += 1;
        }
      });

      source.traverse(object => {
        object.geometry?.dispose?.();
        if (Array.isArray(object.material)) object.material.forEach(item => item.dispose?.());
        else object.material?.dispose?.();
      });

      if (!positions.length) {
        setFailed(true);
        return;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      const center = sourceBounds.getCenter(new THREE.Vector3());
      const size = sourceBounds.getSize(new THREE.Vector3());
      const maxDimension = Math.max(size.x, size.y, size.z, 0.0001);
      geometry.translate(-center.x, -center.y, -center.z);
      geometry.scale(2 / maxDimension, 2 / maxDimension, 2 / maxDimension);
      geometry.computeBoundingSphere();

      meshes.forEach(({ geometry: wireGeometry }) => {
        wireGeometry.translate(-center.x, -center.y, -center.z);
        wireGeometry.scale(2 / maxDimension, 2 / maxDimension, 2 / maxDimension);
        const wireMaterial = new THREE.MeshBasicMaterial({ color: restingColor, wireframe: true, transparent: true, opacity: world.wireOpacity ?? 0.72, depthWrite: false });
        wireMaterials.push(wireMaterial);
        group.add(new THREE.Mesh(wireGeometry, wireMaterial));
      });

      material = new THREE.PointsMaterial({
        color: restingColor,
        size: 0.014,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
        sizeAttenuation: true,
      });
      cloud = new THREE.Points(geometry, material);
      group.add(cloud);
      renderStatic();
      start();
    };

    const onLoad = loaded => buildPointCloud(loaded.scene || loaded);
    const onError = () => {
      if (!cancelled) setFailed(true);
    };
    if (world.model.endsWith(".glb")) new GLTFLoader().load(world.model, onLoad, undefined, onError);
    else new FBXLoader().load(world.model, onLoad, undefined, onError);

    const pointerMove = event => {
      const rect = mount.getBoundingClientRect();
      stateRef.current.pointerX = ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
      stateRef.current.pointerY = ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
    };
    const pointerLeave = () => {
      stateRef.current.pointerX = 0;
      stateRef.current.pointerY = 0;
    };
    const visibilityChange = () => start();
    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(entries => {
      inViewport = entries[0]?.isIntersecting ?? true;
      start();
    }, { rootMargin: "180px" });
    resizeObserver.observe(mount);
    intersectionObserver.observe(mount);
    mount.addEventListener("pointermove", pointerMove, { passive: true });
    mount.addEventListener("pointerleave", pointerLeave, { passive: true });
    document.addEventListener("visibilitychange", visibilityChange);
    resize();

    return () => {
      cancelled = true;
      if (frame !== null) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      mount.removeEventListener("pointermove", pointerMove);
      mount.removeEventListener("pointerleave", pointerLeave);
      document.removeEventListener("visibilitychange", visibilityChange);
      invalidateRef.current = null;
      group.traverse(object => {
        object.geometry?.dispose?.();
        if (Array.isArray(object.material)) object.material.forEach(item => item.dispose?.());
        else object.material?.dispose?.();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reducedMotion, world]);

  return (
    <div className="study-point-cloud" ref={mountRef} aria-hidden="true">
      {failed && <span className="study-model-error">MODEL SIGNAL LOST</span>}
    </div>
  );
}

function WorldNetworkCanvas({ activeId }) {
  const canvasRef = useRef(null);
  const activeRef = useRef(activeId);
  const reducedMotion = useReducedMotion();
  useEffect(() => { activeRef.current = activeId; }, [activeId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let frame = null;
    let visible = true;
    const rows = [0.33, 0.49, 0.65, 0.81];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(0);
    };

    const draw = time => {
      context.clearRect(0, 0, width, height);
      const ink = "0,0,0";
      const trunkX = width * 0.16;
      const branchEnd = width * 0.46;
      context.lineCap = "square";
      context.lineJoin = "miter";
      context.lineWidth = 2;
      context.strokeStyle = `rgba(${ink},.76)`;
      context.beginPath();
      context.moveTo(width * 0.46, 0);
      context.bezierCurveTo(width * 0.46, height * 0.08, trunkX * 1.9, height * 0.12, trunkX * 1.45, height * 0.22);
      context.bezierCurveTo(trunkX * 0.82, height * 0.32, trunkX * 1.1, height * 0.64, trunkX, height * 0.92);
      context.stroke();

      const drawNode = (x, y, active, radius = 6) => {
        if (active) {
          context.fillStyle = "rgba(245,233,58,.98)";
          context.beginPath();
          context.arc(x, y, radius + 5, 0, Math.PI * 2);
          context.fill();
        }

        context.fillStyle = "rgba(255,255,255,.98)";
        context.strokeStyle = `rgba(${ink},.96)`;
        context.lineWidth = 2;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();

        context.fillStyle = active ? "rgba(245,233,58,1)" : `rgba(${ink},1)`;
        context.strokeStyle = `rgba(${ink},1)`;
        context.lineWidth = active ? 1 : 0;
        context.beginPath();
        context.arc(x, y, active ? 3 : 2.2, 0, Math.PI * 2);
        context.fill();
        if (active) context.stroke();
      };

      const lobbyActive = activeRef.current === LOBBY.id;
      drawNode(trunkX * 1.45, height * 0.22, lobbyActive, 6.5);

      rows.forEach((row, index) => {
        const y = height * row;
        const active = WORLDS[index].id === activeRef.current;
        context.lineWidth = active ? 4 : 1.5;
        context.strokeStyle = active ? "rgba(104,196,91,.95)" : `rgba(${ink},.62)`;
        context.beginPath();
        context.moveTo(trunkX, y);
        context.bezierCurveTo(width * 0.24, y - height * 0.018, width * 0.34, y + height * 0.015, branchEnd, y);
        context.stroke();

        if (active) {
          context.lineWidth = 1.25;
          context.strokeStyle = `rgba(${ink},.95)`;
          context.beginPath();
          context.moveTo(trunkX, y);
          context.bezierCurveTo(width * 0.24, y - height * 0.018, width * 0.34, y + height * 0.015, branchEnd, y);
          context.stroke();
        }

        drawNode(trunkX, y, active);
        context.fillStyle = active ? "rgba(104,196,91,1)" : `rgba(${ink},.82)`;
        context.beginPath();
        context.arc(branchEnd, y, active ? 3.5 : 2.5, 0, Math.PI * 2);
        context.fill();
      });

      const particleCount = 12;
      for (let index = 0; index < particleCount; index += 1) {
        const progress = reducedMotion ? index / particleCount : ((time * 0.000035 + index / particleCount) % 1);
        const y = height * (0.02 + progress * 0.9);
        const curve = Math.sin(progress * Math.PI * 1.4) * width * 0.12;
        const x = width * 0.39 - progress * width * 0.23 + curve;
        context.fillStyle = index % 4 === 0 ? "rgba(104,196,91,.62)" : `rgba(${ink},.24)`;
        context.beginPath();
        context.arc(x, y, index % 4 === 0 ? 2.1 : 1.1, 0, Math.PI * 2);
        context.fill();
      }
    };

    const animate = time => {
      if (!visible || document.hidden) {
        frame = null;
        return;
      }
      draw(time);
      if (!reducedMotion) frame = window.requestAnimationFrame(animate);
    };
    const start = () => {
      if (reducedMotion) draw(0);
      else if (visible && !document.hidden && frame === null) frame = window.requestAnimationFrame(animate);
    };
    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? true;
      start();
    }, { rootMargin: "180px" });
    const visibilityChange = () => start();
    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    document.addEventListener("visibilitychange", visibilityChange);
    resize();
    start();
    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", visibilityChange);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="study-world-network" aria-hidden="true" />;
}

function InstallationArchive() {
  const [index, setIndex] = useState(0);
  const pointerStart = useRef(null);
  const count = INSTALLATION_IMAGES.length;
  const previousIndex = (index - 1 + count) % count;
  const nextIndex = (index + 1) % count;
  const move = direction => setIndex(current => (current + direction + count) % count);

  const onKeyDown = event => {
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  };

  return (
    <section className="study-archive study-reveal" data-study-reveal aria-labelledby="study-archive-title">
      <div className="study-section-heading">
        <h2 id="study-archive-title">Installation archive</h2>
        <span aria-live="polite">{String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
        <i aria-hidden="true" />
      </div>
      <div
        className="study-carousel"
        role="group"
        aria-roledescription="carousel"
        aria-label="Mixed-reality installation photographs"
        tabIndex="0"
        onKeyDown={onKeyDown}
        onPointerDown={event => { pointerStart.current = event.clientX; }}
        onPointerUp={event => {
          if (pointerStart.current === null) return;
          const distance = event.clientX - pointerStart.current;
          pointerStart.current = null;
          if (Math.abs(distance) > 45) move(distance < 0 ? 1 : -1);
        }}
        onPointerCancel={() => { pointerStart.current = null; }}
      >
        <button type="button" className="study-carousel-side is-previous" onClick={() => move(-1)} aria-label="Previous installation image">
          <img src={INSTALLATION_IMAGES[previousIndex].src} alt="" draggable="false" />
          <span aria-hidden="true">PREV</span>
        </button>
        <figure className="study-carousel-current" key={INSTALLATION_IMAGES[index].src}>
          <img src={INSTALLATION_IMAGES[index].src} alt={INSTALLATION_IMAGES[index].alt} draggable="false" />
          <figcaption>{INSTALLATION_IMAGES[index].label}</figcaption>
        </figure>
        <button type="button" className="study-carousel-side is-next" onClick={() => move(1)} aria-label="Next installation image">
          <img src={INSTALLATION_IMAGES[nextIndex].src} alt="" draggable="false" />
          <span aria-hidden="true">NEXT</span>
        </button>
      </div>
    </section>
  );
}

function WorldNavigation() {
  const [hoveredWorld, setHoveredWorld] = useState(null);
  const [selectedWorld, setSelectedWorld] = useState(null);
  const activeWorld = useMemo(
    () => WORLDS.find(world => world.id === (hoveredWorld || selectedWorld)) || LOBBY,
    [hoveredWorld, selectedWorld],
  );

  return (
    <section className="study-worlds study-reveal" data-study-reveal aria-labelledby="study-worlds-title">
      <WorldNetworkCanvas activeId={activeWorld.id} />
      <header className="study-worlds-heading">
        <h2 id="study-worlds-title">In-game world navigation</h2>
        <p>Hover or tap a world to enter</p>
      </header>
      <div className="study-worlds-layout">
        <div className="study-world-list" onMouseLeave={() => setHoveredWorld(null)}>
          {WORLDS.map(world => {
            const active = activeWorld.id === world.id;
            const selected = selectedWorld === world.id;
            return (
              <button
                type="button"
                className={`study-world-node ${active ? "is-active" : ""}`}
                key={world.id}
                aria-pressed={selected}
                aria-label={`${selected ? "Return from" : "Enter"} ${world.name} world`}
                onMouseEnter={() => setHoveredWorld(world.id)}
                onFocus={() => setHoveredWorld(world.id)}
                onBlur={() => setHoveredWorld(null)}
                onClick={() => setSelectedWorld(current => current === world.id ? null : world.id)}
              >
                <PointCloudModel world={world} active={active} />
                <span className="study-world-name">{world.name}</span>
                <span className="study-world-code">[{world.code}]</span>
                {world.corrected && <span className="study-world-source">THESIS SCAN</span>}
              </button>
            );
          })}
        </div>
        <figure className={`study-scene is-${activeWorld.id}`} key={activeWorld.id} aria-live="polite">
          <div className="study-scene-heading">
            <span>Current view</span>
            <h3>{activeWorld.name} <small>[{activeWorld.code}]</small></h3>
          </div>
          <div className="study-scene-image-wrap">
            <img src={activeWorld.scene} alt={activeWorld.sceneAlt} />
            <span className="study-scene-scan" aria-hidden="true" />
          </div>
          <figcaption>{activeWorld.id === "lobby" ? "Default lobby level" : "World signal decoded"}</figcaption>
        </figure>
      </div>
    </section>
  );
}

function StudyPage({ Footer }) {
  useEffect(() => {
    document.body.classList.add("study-page-active");
    const root = document.querySelector(".study-page");
    const targets = root ? [...root.querySelectorAll("[data-study-reveal]")] : [];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8%" });
    targets.forEach(target => observer.observe(target));
    window.requestAnimationFrame(() => root?.classList.add("is-ready"));
    return () => {
      observer.disconnect();
      document.body.classList.remove("study-page-active");
    };
  }, []);

  useEffect(() => {
    [...WORLDS, LOBBY].forEach(world => {
      const image = new Image();
      image.src = world.scene;
    });
  }, []);

  return (
    <div className="study-shell">
      <main className="study-page">
        <section className="study-hero" aria-labelledby="study-title">
          <img className="study-cabinet-ghost" src={asset("study-cabinet-ascii.png")} alt="" aria-hidden="true" />
          <div className="study-title-block">
            <p className="study-kicker">Networked mixed-reality installation</p>
            <h1 id="study-title">Digital<br />Sociology<br />Study <span>/ 2025</span></h1>
            <p className="study-lede">Two players enter four virtual worlds while up to five observers quietly alter the system around them.</p>
          </div>
          <aside className="study-statement study-reveal" data-study-reveal aria-labelledby="artist-statement-title">
            <h2 id="artist-statement-title">Artist statement</h2>
            <p>Digital Sociology Study explores the invisible systems that shape behavior online and in shared digital spaces. Through a networked VR installation, it examines how presence, attention, and power move between two players and up to five hidden observers.</p>
            <p>The audience changes lighting, sound, tools, and avatars through a physical cabinet, turning the piece into a live experiment in how people perform, adapt, and relate under unseen influence.</p>
          </aside>
          <section className="study-film study-reveal" data-study-reveal aria-label="Installation film">
            <div className="study-film-bar"><span>Installation video</span><b>02:14</b></div>
            <iframe
              src="https://www.youtube.com/embed/KhGpayY6c3g?rel=0&modestbranding=1"
              title="Digital Sociology Study installation video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="eager"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </section>
          <div className="study-hero-data" aria-hidden="true">
            <span>SYS://AUDIENCE_LINK</span><span>PLAYERS:02</span><span>OBSERVER:LIVE</span>
          </div>
        </section>

        <InstallationArchive />
        <WorldNavigation />

        <section className="study-project-note study-reveal" data-study-reveal aria-label="Project overview">
          <h2>A study of behavior<br />across four<br />simulated worlds.</h2>
          <div>
            <p>Digital Sociology Study is a networked VR installation that examines how digital environments influence behavior through feedback systems.</p>
            <p>Up to five hidden observers can influence each world in real time using lighting, sound, tools, and avatar controls.</p>
          </div>
          <dl>
            <div><dt>Year</dt><dd>2025</dd></div>
            <div><dt>Participants</dt><dd>2 players / up to 5 observers</dd></div>
            <div><dt>Duration</dt><dd>Approx. 5-minute minimum</dd></div>
          </dl>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default StudyPage;
