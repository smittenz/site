import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import react from "@vitejs/plugin-react";
import { createServer } from "vite";

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
    assert.match(markup, /<article class="process-entry">/);
    assert.match(markup, /<time dateTime="2026-09-14">9\/14\/2026<\/time>/);
    assert.match(markup, /Generative AI was used to improve grammar, spelling, and clarity\./);
    assert.doesNotMatch(markup, /PAGE NOT FOUND/);
    assert.doesNotMatch(markup, /href="\/process-and-ideation-idm"/);
    assert.equal(searchItems.some(item => item.href === "/process-and-ideation-idm"), false);
  } finally {
    await vite.close();
    delete globalThis.window;
  }
});
