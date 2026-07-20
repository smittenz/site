const { chromium } = require('C:/Users/sophi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const top = JSON.parse(fs.readFileSync(path.join(root, 'source-pages.json'), 'utf8'));
const origin = 'https://www.sophkatsivelos.com';
const routes = [...new Set(top.flatMap(page => page.dom.links || []).map(link => {
  try {
    const u = new URL(link.href);
    return u.origin === origin ? u.pathname : null;
  } catch { return null; }
}).filter(route => route && route !== '/cart' && route !== '/' && !['/digital','/physical','/for-clients','/contact','/digital-sociology-study'].includes(route)))];

const safeName = route => route.slice(1).replace(/[^a-z0-9]+/gi, '-');

async function settle(page) {
  await page.waitForTimeout(900);
  const initialHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < initialHeight; y += 600) {
    await page.evaluate(scrollY => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(90);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
  const outputPath = path.join('C:', 'tmp', 'source-projects-current.json');
  const output = [];

  for (const spec of [{ name: 'desktop', width: 1440, height: 1000 }, { name: 'mobile', width: 390, height: 844 }]) {
    for (const route of routes) {
      const page = await browser.newPage({ viewport: { width: spec.width, height: spec.height } });
      const resources = new Map();
      page.on('response', response => {
        const type = response.request().resourceType();
        if (['image','font','stylesheet','media'].includes(type)) resources.set(response.url(), { url: response.url(), type, status: response.status(), contentType: response.headers()['content-type'] || '' });
      });
      await page.goto(origin + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await settle(page);
      const screenshot = `source-project-${safeName(route)}-${spec.name}.png`;
      await page.screenshot({ path: path.join(root, screenshot), fullPage: true });
      const dom = await page.evaluate(() => ({
        title: document.title,
        url: location.href,
        pageHeight: document.documentElement.scrollHeight,
        bodyText: document.body.innerText,
        elements: [...document.querySelectorAll('h1,h2,h3,h4,p,a,button,figcaption')].map(el => ({ tag: el.tagName, text: (el.innerText || el.getAttribute('aria-label') || '').trim(), href: el.href || null, rect: el.getBoundingClientRect().toJSON() })).filter(x => x.text),
        images: [...document.images].map(img => ({
          src: img.currentSrc || img.src,
          originalSrc: img.getAttribute('data-src') || img.getAttribute('data-image') || img.src,
          srcset: img.srcset || img.getAttribute('data-srcset') || '',
          alt: img.alt,
          width: img.naturalWidth,
          height: img.naturalHeight,
          rect: img.getBoundingClientRect().toJSON(),
        })),
        videos: [...document.querySelectorAll('video')].map(v => ({
          src: v.currentSrc || v.src,
          poster: v.poster,
          sources: [...v.querySelectorAll('source')].map(source => ({ src: source.src, type: source.type })),
          rect: v.getBoundingClientRect().toJSON(),
        })),
        audio: [...document.querySelectorAll('audio')].map(a => ({
          src: a.currentSrc || a.src,
          sources: [...a.querySelectorAll('source')].map(source => ({ src: source.src, type: source.type })),
          rect: a.getBoundingClientRect().toJSON(),
        })),
        iframes: [...document.querySelectorAll('iframe')].map(frame => ({
          src: frame.src || frame.getAttribute('data-src') || '',
          title: frame.title || frame.getAttribute('aria-label') || '',
          allow: frame.allow || '',
          allowFullscreen: frame.allowFullscreen,
          rect: frame.getBoundingClientRect().toJSON(),
        })),
        embeds: [...document.querySelectorAll('embed,object')].map(embed => ({
          tag: embed.tagName,
          src: embed.src || embed.data || '',
          type: embed.type || '',
          rect: embed.getBoundingClientRect().toJSON(),
        })),
        backgrounds: [...document.querySelectorAll('*')].map(el => getComputedStyle(el).backgroundImage).filter(v => v && v !== 'none'),
        buttons: [...document.querySelectorAll('button,[role="button"]')].map(b => ({ text: (b.innerText || b.getAttribute('aria-label') || '').trim(), expanded: b.getAttribute('aria-expanded') })),
      }));
      output.push({ route, spec, screenshot, dom, resources: [...resources.values()] });
      fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
      await page.close();
    }
  }
  await browser.close().catch(() => {});
  process.exit(0);
})();
