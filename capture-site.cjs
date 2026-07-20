const { chromium } = require('C:/Users/sophi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const url = 'https://www.sophkatsivelos.com/';

async function scrollPage(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 180));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(700);
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  });
  const captures = [];
  for (const spec of [
    { name: 'desktop', width: 1440, height: 1000 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport: { width: spec.width, height: spec.height } });
    const responses = [];
    page.on('response', response => {
      const type = response.request().resourceType();
      if (['image', 'font', 'stylesheet', 'media'].includes(type)) {
        responses.push({ url: response.url(), type, status: response.status() });
      }
    });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
    await scrollPage(page);
    await page.screenshot({ path: path.join(root, `source-${spec.name}.png`), fullPage: true });
    const dom = await page.evaluate(() => ({
      title: document.title,
      url: location.href,
      viewport: { width: innerWidth, height: innerHeight },
      pageHeight: document.documentElement.scrollHeight,
      bodyClass: document.body.className,
      text: document.body.innerText,
      links: [...document.querySelectorAll('a')].map(a => ({
        text: (a.innerText || a.getAttribute('aria-label') || '').trim(),
        href: a.href,
      })),
      headings: [...document.querySelectorAll('h1,h2,h3,h4')].map(el => ({
        tag: el.tagName,
        text: el.innerText.trim(),
        rect: el.getBoundingClientRect().toJSON(),
        style: (() => { const s = getComputedStyle(el); return { fontFamily: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight, lineHeight: s.lineHeight, color: s.color }; })(),
      })),
      images: [...document.images].map(img => ({
        src: img.currentSrc || img.src,
        alt: img.alt,
        width: img.naturalWidth,
        height: img.naturalHeight,
        rect: img.getBoundingClientRect().toJSON(),
      })),
      nav: [...document.querySelectorAll('header a, nav a')].map(a => ({ text: (a.innerText || a.getAttribute('aria-label') || '').trim(), href: a.href })),
      buttons: [...document.querySelectorAll('button,[role="button"]')].map(b => ({ text: (b.innerText || b.getAttribute('aria-label') || '').trim(), ariaExpanded: b.getAttribute('aria-expanded') })),
      stylesheets: [...document.styleSheets].map(s => s.href).filter(Boolean),
    }));
    captures.push({ spec, dom, resources: responses });
    await page.close();
  }
  fs.writeFileSync(path.join(root, 'source-site-data.json'), JSON.stringify(captures, null, 2));
  await browser.close();
})();
