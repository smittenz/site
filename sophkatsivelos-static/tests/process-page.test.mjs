import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import react from "@vitejs/plugin-react";
import { createServer } from "vite";

test("Week 4 media stays within its deployment budget", async () => {
  const assetUrls = [
    new URL("../public/assets/process-ideation/week-04/context-web.jpg", import.meta.url),
    new URL("../public/assets/process-ideation/week-04/context-web-demo.mp4", import.meta.url),
  ];
  const sizes = await Promise.all(assetUrls.map(assetUrl => stat(assetUrl)));
  const totalBytes = sizes.reduce((total, asset) => total + asset.size, 0);

  assert.ok(totalBytes < 15 * 1024 * 1024, `Week 4 media is ${(totalBytes / 1024 / 1024).toFixed(1)} MiB`);
});

test("Entry 5 images stay within their deployment budget", async () => {
  const extensions = ["jpg", "jpg", "jpg", "webp", "jpg", "jpg", "webp", "jpg", "webp", "webp"];
  const assetUrls = extensions.map((extension, index) => (
    new URL(`../public/assets/process-ideation/entry-05/result-${String(index + 1).padStart(2, "0")}.${extension}`, import.meta.url)
  ));
  const sizes = await Promise.all(assetUrls.map(assetUrl => stat(assetUrl)));
  const totalBytes = sizes.reduce((total, asset) => total + asset.size, 0);

  assert.ok(totalBytes < 3 * 1024 * 1024, `Entry 5 images are ${(totalBytes / 1024 / 1024).toFixed(1)} MiB`);
});

test("Entry 6 source photographs stay within their deployment budget", async () => {
  const filenames = [
    "bracelets.jpg",
    "emerald-earrings.jpg",
    "cub-scouts-ring.jpg",
    "graduation-ring.jpg",
    "amber-earrings.jpg",
    "handmade-ring.jpg",
    "sketch-containers.jpg",
    "sketch-terrain.jpg",
    "final-impressions.jpg",
    "final-arrangement.jpg",
    "family-name-etching.jpg",
    "neighborhood-map.jpg",
  ];
  const assetUrls = filenames.map(filename => (
    new URL(`../public/assets/process-ideation/entry-06/${filename}`, import.meta.url)
  ));
  const sizes = await Promise.all(assetUrls.map(assetUrl => stat(assetUrl)));
  const totalBytes = sizes.reduce((total, asset) => total + asset.size, 0);

  assert.ok(totalBytes < 25 * 1024 * 1024, `Entry 6 images are ${(totalBytes / 1024 / 1024).toFixed(1)} MiB`);
});

test("the unlisted Process and Ideation IDM link resolves without being indexed", async () => {
  globalThis.window = {
    location: { pathname: "/process-and-ideation-idm", search: "" },
    addEventListener() {},
    removeEventListener() {},
  };

  const vite = await createServer({
    appType: "custom",
    configFile: false,
    optimizeDeps: { noDiscovery: true },
    plugins: [react()],
    root: process.cwd(),
    server: { middlewareMode: true, hmr: { port: 0 } },
  });

  try {
    const { App } = await vite.ssrLoadModule("/src/App.jsx");
    const data = (await vite.ssrLoadModule("/src/site-data.json")).default;
    const { buildPortfolioSearchIndex } = await vite.ssrLoadModule("/src/portfolio-search.js");
    const markup = renderToStaticMarkup(createElement(App));
    const searchItems = buildPortfolioSearchIndex(data);

    assert.match(markup, /<h1>Process and Ideation IDM<\/h1>/);
    assert.equal((markup.match(/<details class="process-entry"/g) || []).length, 6);
    assert.equal((markup.match(/<summary class="process-entry-meta">/g) || []).length, 6);
    assert.match(markup, /ENTRY_001/);
    assert.match(markup, /<time dateTime="2026-09-14">9\/14\/2026<\/time>/);
    assert.match(markup, /ENTRY_002/);
    assert.match(markup, /<time dateTime="2026-09-21">9\/21\/2026<\/time>/);
    assert.match(markup, /ENTRY_004/);
    assert.match(markup, /<time dateTime="2026-10-12">10\/12\/2026<\/time>/);
    assert.match(markup, /ENTRY_005/);
    assert.match(markup, /ENTRY_006/);
    assert.match(markup, /<time dateTime="2026-10-26">10\/26\/2026<\/time>/);
    assert.equal((markup.match(/<time dateTime=/g) || []).length, 5);
    assert.match(markup, /Threading Context/);
    assert.match(markup, /The Uncanny Valley of Generative AI/);
    assert.equal((markup.match(/src="\/assets\/process-ideation\/entry-05\/result-/g) || []).length, 10);
    assert.equal((markup.match(/class="process-ai-model"/g) || []).length, 9);
    assert.equal((markup.match(/ARTLIST<\/span>/g) || []).length, 3);
    assert.equal((markup.match(/CHATGPT<\/span>/g) || []).length, 2);
    assert.equal((markup.match(/NANO BANANA<\/span>/g) || []).length, 2);
    assert.equal((markup.match(/DEEPAI<\/span>/g) || []).length, 1);
    assert.equal((markup.match(/DEEPSEEK<\/span>/g) || []).length, 1);
    assert.match(markup, /What We Carry/);
    assert.match(markup, /TIME CAPSULE \/ PART I/);
    assert.equal((markup.match(/<details class="process-object-card"/g) || []).length, 6);
    assert.match(markup, /The Inheritance/);
    assert.match(markup, /The Found Lineage/);
    assert.match(markup, /Friendship bracelets/);
    assert.match(markup, /The Impression Remains/);
    assert.match(markup, /A Treasure Box for a Living Lineage/);
    assert.match(markup, /only two women/i);
    assert.match(markup, /neighborhood/i);
    assert.match(markup, /treasure box/i);
    assert.match(markup, /href="https:\/\/wp\.nyu\.edu\/ideationandprototyping\/time-capsule\/"/);
    assert.match(markup, /hover, focus, or tap/i);
    assert.equal((markup.match(/src="\/assets\/process-ideation\/entry-06\//g) || []).length, 12);
    assert.match(markup, /AI was used to edit this writing for grammar, spelling, clarity, and web presentation/);
    assert.doesNotMatch(markup, /Collage by Sophie Katsivelos/);
    assert.doesNotMatch(markup, /IMAGE TO BE ADDED/);
    assert.doesNotMatch(markup, /src="\/assets\/process-ideation\/week-05\//);
    assert.match(markup, /The Miseducation of the Doodle/);
    assert.match(markup, /SOURCE OBJECT/);
    assert.match(markup, /50 ITERATIONS/);
    assert.match(markup, /src="\/assets\/process-ideation\/week-02\/source-object\.jpg"/);
    assert.match(markup, /src="\/assets\/process-ideation\/week-02\/source-object-blender\.png"/);
    assert.match(markup, /src="\/assets\/process-ideation\/week-02\/iterations-paint\.jpg"/);
    assert.match(markup, /src="\/assets\/process-ideation\/week-02\/iterations-mixed\.jpg"/);
    assert.match(markup, /src="\/assets\/process-ideation\/week-04\/context-web\.jpg"/);
    assert.match(markup, /src="\/assets\/process-ideation\/week-04\/context-web-demo\.mp4"/);
    assert.match(markup, /preload="metadata"/);
    assert.doesNotMatch(markup, /20261014_114314/);
    assert.equal((markup.match(/loading="lazy"/g) || []).length, (markup.match(/<img /g) || []).length);
    assert.match(markup, /Generative AI was used to improve grammar, spelling, and clarity\./);
    assert.doesNotMatch(markup, /PAGE NOT FOUND/);
    assert.doesNotMatch(markup, /href="\/process-and-ideation-idm"/);
    assert.doesNotMatch(markup, /href="https:\/\/alistapart\.com\/article\/the-miseducation-of-the-doodle\/"/);
    assert.equal(searchItems.some(item => item.href === "/process-and-ideation-idm"), false);
  } finally {
    await vite.close();
    delete globalThis.window;
  }
});
