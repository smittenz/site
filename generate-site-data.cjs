const fs = require('fs');
const path = require('path');

const root = __dirname;
const pages = JSON.parse(fs.readFileSync(path.join(root, 'source-pages.json'), 'utf8')).filter(page => page.spec.name === 'desktop');
const currentProjectsPath = path.join('C:', 'tmp', 'source-projects-current.json');
const projectsSource = fs.existsSync(currentProjectsPath) ? currentProjectsPath : path.join(root, 'source-projects.json');
const projects = JSON.parse(fs.readFileSync(projectsSource, 'utf8')).filter(page => page.spec.name === 'desktop' && !page.route.endsWith('.pdf'));
const assetMap = JSON.parse(fs.readFileSync(path.join(root, 'asset-map.json'), 'utf8'));
const siteDataPath = path.join(root, 'sophkatsivelos-static', 'src', 'site-data.json');
const existingSiteData = JSON.parse(fs.readFileSync(siteDataPath, 'utf8'));
const unique = values => [...new Set(values.filter(Boolean))];
const clean = value => String(value || '').replace(/\u00a0/g, ' ').trim();

function canonicalUrl(value) {
  if (!value || !/^https?:/i.test(value)) return null;
  try {
    const url = new URL(value.replace(/&amp;/g, '&'));
    url.search = '';
    url.hash = '';
    return url.href;
  } catch {
    return null;
  }
}

const mappedByCanonical = new Map();
for (const [url, destination] of Object.entries(assetMap)) {
  if (typeof destination !== 'string') continue;
  const canonical = canonicalUrl(url);
  if (!canonical) continue;
  const parsed = new URL(url);
  const width = Number(parsed.searchParams.get('format')?.match(/(\d+)/)?.[1] || 0);
  const score = parsed.search ? width : 100000;
  const current = mappedByCanonical.get(canonical);
  if (!current || score > current.score) mappedByCanonical.set(canonical, { destination, score });
}

function bestLocalAsset(...urls) {
  for (const value of urls) {
    const canonical = canonicalUrl(value);
    const mapped = canonical && mappedByCanonical.get(canonical)?.destination;
    if (mapped) return mapped;
  }
  for (const value of urls) {
    if (typeof assetMap[value] === 'string') return assetMap[value];
  }
  return null;
}

function imagesFor(page) {
  const seen = new Set();
  const images = [];
  for (const image of page?.dom?.images || []) {
    if (image.width <= 120 || image.height <= 80) continue;
    const source = [image.originalSrc, image.src].find(value => canonicalUrl(value));
    const canonical = canonicalUrl(source);
    if (!canonical || seen.has(canonical)) continue;
    seen.add(canonical);
    const mapped = bestLocalAsset(image.originalSrc, image.src);
    if (mapped) images.push(mapped);
  }
  return images;
}

function mediaFor(page) {
  const videoUrls = (page?.dom?.videos || []).flatMap(video => [video.src, ...(video.sources || []).map(source => source.src)]);
  const audioUrls = (page?.dom?.audio || []).flatMap(audio => [audio.src, ...(audio.sources || []).map(source => source.src)]);
  const resourceUrls = (page?.resources || []).filter(resource => resource.type === 'media').map(resource => resource.url);
  return unique([...videoUrls, ...audioUrls, ...resourceUrls].map(url => bestLocalAsset(url)));
}

function mediaPostersFor(page) {
  const urls = (page?.dom?.backgrounds || []).flatMap(background => {
    const value = typeof background === 'string' ? background : background.value;
    return [...String(value || '').matchAll(/url\(["']?(https?:[^"')]+)["']?\)/g)].map(match => match[1]);
  });
  return unique(urls.map(url => bestLocalAsset(url)));
}

function embedsFor(page) {
  const seen = new Set();
  return (page?.dom?.iframes || []).filter(frame => /^https?:/i.test(frame.src || '')).map(frame => ({
    type: 'iframe',
    src: frame.src,
    title: clean(frame.title) || 'Embedded project media',
    allow: frame.allow || 'autoplay; fullscreen; picture-in-picture',
  })).filter(frame => {
    if (seen.has(frame.src)) return false;
    seen.add(frame.src);
    return true;
  });
}

function linksFor(elements) {
  const seen = new Set();
  return elements.filter(element => element.tag === 'A' && /^https?:/i.test(element.href || '')).filter(element => {
    try {
      const url = new URL(element.href);
      if (url.origin === 'https://www.sophkatsivelos.com') return false;
      if (url.hostname === 'www.linkedin.com' || url.hostname === 'smittenz.itch.io') return false;
      return clean(element.text);
    } catch {
      return false;
    }
  }).map(element => ({ href: element.href, label: clean(element.text) })).filter(link => {
    const key = `${link.href}|${link.label}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const pageByRoute = Object.fromEntries(pages.map(page => [page.route, page]));

const collections = {
  digital: [
    ['/digital/planetarium', 'PLANETARIUM'], ['/digital/merimnao', 'MERIMNAO'], ['/digital/simulation', 'SIMULATION'],
    ['/digital/shasta-animated-short', 'SHASTA'], ['/digital/collection', 'OTHER SMALL SCALE WORK'],
    ['/digital/digital-planetarium', 'DIGITAL PLANETARIUM'], ['/digital/biotic-gallery', 'BIOTIC GALLERY'],
    ['/digital/witches-flight-3d', 'WITCHES FLIGHT 3D'], ['/digital/identity-automaton', 'IDENTITY AUTOMATON'], ['/digital/deficit', 'DEFICIT'],
  ],
  physical: [
    ['/physical/storiesonskin', 'STORIES ON SKIN'], ['/physical/decay', 'DECAY'], ['/physical/the-industrial-woman', 'THE INDUSTRIAL WOMAN'],
    ['/physical/coyness', 'COYNESS'], ['/physical/theater-production-work', 'THEATER PRODUCTION WORK'], ['/physical/african-bullfrog', 'AFRICAN BULLFROG'],
  ],
  clients: [
    ['/for-clients/mcadxellwas', 'MCAAD X ELLWAS'], ['/for-clients/aippy', 'AIPPY'], ['/for-clients/black-luminaries', 'BLACK LUMINARIES'],
  ],
};

for (const [key, cards] of Object.entries(collections)) {
  const route = key === 'clients' ? '/for-clients' : `/${key}`;
  const images = imagesFor(pageByRoute[route]);
  const imageIndexes = key === 'digital' ? [0, 1, 2, 3, null, 4, 5, 6, 7, 8] : cards.map((_, index) => index);
  collections[key] = cards.map(([href, title], index) => ({
    href,
    title,
    image: imageIndexes[index] === null ? null : images[imageIndexes[index]] || null,
  }));
}

const projectData = {};
const localVideos = {
  '/physical/decay': '/assets/decay.mp4',
  '/physical/the-industrial-woman': '/assets/industrial-woman.mp4',
  '/for-clients/black-luminaries': '/assets/black-luminaries.mp4',
};

for (const page of projects) {
  const elements = page.dom.elements || [];
  const firstTitleIndex = elements.findIndex(element => element.tag === 'H2' && element.text !== 'SOPH KATSIVELOS');
  const afterTitle = elements.slice(Math.max(0, firstTitleIndex));
  const navBoundary = afterTitle.findIndex((element, index) => index > 0 && element.tag === 'A' && /^(Next|Previous)/i.test(element.text));
  const contentElements = navBoundary > 0 ? afterTitle.slice(0, navBoundary) : afterTitle;
  const content = contentElements.filter(element =>
    ['H2', 'H3', 'P'].includes(element.tag) && !['SOPH KATSIVELOS', 'FOLLOW', 'LinkedIn', 'Itch.Io'].includes(element.text)
  ).map(element => ({ tag: element.tag.toLowerCase(), text: clean(element.text) }));
  projectData[page.route] = {
    route: page.route,
    title: content.find(element => element.tag === 'h2')?.text || page.dom.title,
    content,
    images: imagesFor(page),
    media: localVideos[page.route] ? [localVideos[page.route]] : mediaFor(page),
    mediaPosters: mediaPostersFor(page),
    embeds: embedsFor(page),
    links: linksFor(contentElements),
  };
}

const homeImage = bestLocalAsset(pageByRoute['/'].dom.images[0]?.src);
const contact = pageByRoute['/contact'];
const output = {
  homeImage,
  collections,
  projects: projectData,
  study: existingSiteData.study,
  about: {
    images: imagesFor(contact),
    content: (contact.dom.elements || []).filter(element => ['H1', 'H2', 'H3', 'P'].includes(element.tag) && !['SOPH KATSIVELOS', 'FOLLOW', 'LinkedIn', 'Itch.Io'].includes(element.text)).map(element => ({ tag: element.tag.toLowerCase(), text: clean(element.text) })),
    resume: bestLocalAsset('https://www.sophkatsivelos.com/s/Sophie-Katsivelos-Resume-2025.pdf'),
  },
};

fs.writeFileSync(siteDataPath, JSON.stringify(output, null, 2));
