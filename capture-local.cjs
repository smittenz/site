const { chromium } = require('C:/Users/sophi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const root = __dirname;

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
  const report = { consoleErrors: [], tests: [] };
  for (const spec of [{ name: 'desktop', width: 1440, height: 1000 }, { name: 'mobile', width: 390, height: 844 }]) {
    for (const route of ['/contact', '/physical/decay']) {
      const page = await browser.newPage({ viewport: { width: spec.width, height: spec.height } });
      page.on('console', msg => { if (msg.type() === 'error') report.consoleErrors.push({ route, mode: spec.name, text: msg.text() }); });
      page.on('pageerror', error => report.consoleErrors.push({ route, mode: spec.name, text: error.message }));
      const response = await page.goto(`http://127.0.0.1:4173${route}`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.screenshot({ path: path.join(root, `local-${route === '/' ? 'home' : route.slice(1).replace(/\//g, '-')}-${spec.name}.png`), fullPage: true });
      const body = await page.locator('body').innerText();
      report.tests.push({ route, mode: spec.name, status: response?.status(), title: await page.title(), bodyLength: body.length, width: await page.evaluate(() => document.documentElement.scrollWidth) });
      if (spec.name === 'mobile' && route === '/digital') {
        await page.locator('.menu-toggle').click();
        report.tests.push({ route, mode: spec.name, mobileMenuVisible: await page.locator('.nav.open').isVisible() });
      }
      if (route === '/digital/planetarium') {
        const counter = page.locator('.gallery-count');
        if (await counter.count()) {
          const before = await counter.innerText();
          await page.locator('.gallery-arrow.next').click();
          report.tests.push({ route, mode: spec.name, galleryBefore: before, galleryAfter: await counter.innerText() });
        }
      }
      await page.close();
    }
  }
  fs.writeFileSync(path.join(root, 'local-qa-results.json'), JSON.stringify(report, null, 2));
  await browser.close();
})();
