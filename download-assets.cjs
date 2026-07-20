const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = __dirname;
const outDir = path.join(root, 'sophkatsivelos-static', 'public', 'assets');
fs.mkdirSync(outDir, { recursive: true });

const docs = ['source-pages.json', 'source-projects.json'].map(file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8')));
const urls = new Set(['https://www.sophkatsivelos.com/s/Sophie-Katsivelos-Resume-2025.pdf']);

function add(value) {
  if (!value || !/^https?:/i.test(value)) return;
  if (/p\.typekit\.net\/p\.gif/i.test(value)) return;
  urls.add(value.replace(/&amp;/g, '&'));
}

for (const pages of docs) {
  for (const page of pages) {
    for (const image of page.dom.images || []) add(image.src);
    for (const video of page.dom.videos || []) { add(video.src); add(video.poster); }
    for (const bg of page.dom.backgrounds || []) {
      const text = typeof bg === 'string' ? bg : bg.value;
      for (const match of String(text || '').matchAll(/url\(["']?(https?:[^"')]+)["']?\)/g)) add(match[1]);
    }
    for (const resource of page.resources || []) {
      if (['image', 'font', 'media'].includes(resource.type) && resource.status >= 200 && resource.status < 400) add(resource.url);
    }
  }
}

const byType = {
  'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif',
  'image/svg+xml': '.svg', 'video/mp4': '.mp4', 'video/webm': '.webm',
  'font/woff2': '.woff2', 'font/woff': '.woff', 'application/pdf': '.pdf',
};

function extFor(url, type) {
  if (byType[type]) return byType[type];
  try {
    const ext = path.extname(new URL(url).pathname).toLowerCase();
    if (ext && ext.length <= 6) return ext;
  } catch {}
  return '.bin';
}

(async () => {
  const map = {};
  let index = 0;
  for (const url of urls) {
    index += 1;
    try {
      const response = await fetch(url, { redirect: 'follow' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const type = (response.headers.get('content-type') || '').split(';')[0].trim();
      const bytes = Buffer.from(await response.arrayBuffer());
      const hash = crypto.createHash('sha256').update(url).digest('hex').slice(0, 12);
      const filename = `${String(index).padStart(3, '0')}-${hash}${extFor(url, type)}`;
      fs.writeFileSync(path.join(outDir, filename), bytes);
      map[url] = `/assets/${filename}`;
      process.stdout.write(`downloaded ${index}/${urls.size}\r`);
    } catch (error) {
      map[url] = { error: error.message };
    }
  }
  fs.writeFileSync(path.join(root, 'asset-map.json'), JSON.stringify(map, null, 2));
  process.stdout.write(`\nSaved ${Object.values(map).filter(v => typeof v === 'string').length}/${urls.size} assets.\n`);
})();
