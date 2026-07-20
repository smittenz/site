const { chromium } = require('C:/Users/sophi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const routes = ['/', '/digital-sociology-study', '/digital', '/physical', '/for-clients', '/contact'];

const safeName = route => route === '/' ? 'home' : route.slice(1).replace(/[^a-z0-9]+/gi, '-');

async function settle(page) {
  await page.waitForTimeout(1500);
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 450) {
      window.scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 140));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(500);
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  });
  const output = [];

  for (const spec of [
    { name: 'desktop', width: 1440, height: 1000 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    for (const route of routes) {
      const page = await browser.newPage({ viewport: { width: spec.width, height: spec.height } });
      const resources = new Map();
      page.on('response', response => {
        const type = response.request().resourceType();
        if (['image', 'font', 'stylesheet', 'media'].includes(type)) {
          resources.set(response.url(), { url: response.url(), type, status: response.status(), contentType: response.headers()['content-type'] || '' });
        }
      });
      const url = `https://www.sophkatsivelos.com${route}`;
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await settle(page);
      const filename = `source-${safeName(route)}-${spec.name}.png`;
      await page.screenshot({ path: path.join(root, filename), fullPage: true });

      const dom = await page.evaluate(() => {
        const style = el => {
          const s = getComputedStyle(el);
          return {
            fontFamily: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight,
            lineHeight: s.lineHeight, letterSpacing: s.letterSpacing, color: s.color,
            backgroundColor: s.backgroundColor, display: s.display, position: s.position,
          };
        };
        return {
          title: document.title,
          url: location.href,
          viewport: { width: innerWidth, height: innerHeight },
          pageHeight: document.documentElement.scrollHeight,
          bodyText: document.body.innerText,
          bodyStyle: style(document.body),
          elements: [...document.querySelectorAll('h1,h2,h3,h4,p,a,button,figcaption')].map(el => ({
            tag: el.tagName, text: (el.innerText || el.getAttribute('aria-label') || '').trim(),
            href: el.href || null, rect: el.getBoundingClientRect().toJSON(), style: style(el),
          })).filter(x => x.text),
          images: [...document.images].map(img => ({
            src: img.currentSrc || img.src, srcset: img.srcset, alt: img.alt,
            width: img.naturalWidth, height: img.naturalHeight,
            rect: img.getBoundingClientRect().toJSON(), loading: img.loading,
          })),
          videos: [...document.querySelectorAll('video')].map(v => ({ src: v.currentSrc || v.src, poster: v.poster, rect: v.getBoundingClientRect().toJSON() })),
          backgrounds: [...document.querySelectorAll('*')].map(el => ({ value: getComputedStyle(el).backgroundImage, rect: el.getBoundingClientRect().toJSON() })).filter(x => x.value && x.value !== 'none'),
          links: [...document.querySelectorAll('a')].map(a => ({ text: (a.innerText || a.getAttribute('aria-label') || '').trim(), href: a.href })),
          buttons: [...document.querySelectorAll('button,[role="button"]')].map(b => ({ text: (b.innerText || b.getAttribute('aria-label') || '').trim(), expanded: b.getAttribute('aria-expanded') })),
        };
      });
      output.push({ route, spec, screenshot: filename, dom, resources: [...resources.values()] });
      await page.close();
    }
  }
  fs.writeFileSync(path.join(root, 'source-pages.json'), JSON.stringify(output, null, 2));
  await browser.close();
})();
