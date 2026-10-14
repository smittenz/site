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
    assert.equal((markup.match(/<details class="process-entry"/g) || []).length, 4);
    assert.equal((markup.match(/<summary class="process-entry-meta">/g) || []).length, 4);
    assert.match(markup, /ENTRY_001/);
    assert.match(markup, /<time dateTime="2026-09-14">9\/14\/2026<\/time>/);
    assert.match(markup, /ENTRY_002/);
    assert.match(markup, /<time dateTime="2026-09-21">9\/21\/2026<\/time>/);
    assert.match(markup, /ENTRY_004/);
    assert.match(markup, /<time dateTime="2026-10-12">10\/12\/2026<\/time>/);
    assert.match(markup, /Threading Context/);
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
