const fs = require('fs');
const path = require('path');

const root = __dirname;
const pages = JSON.parse(fs.readFileSync(path.join(root, 'source-pages.json'), 'utf8')).filter(p => p.spec.name === 'desktop');
const projects = JSON.parse(fs.readFileSync(path.join(root, 'source-projects.json'), 'utf8')).filter(p => p.spec.name === 'desktop' && !p.route.endsWith('.pdf'));
const assetMap = JSON.parse(fs.readFileSync(path.join(root, 'asset-map.json'), 'utf8'));
const local = url => typeof assetMap[url] === 'string' ? assetMap[url] : null;
const unique = values => [...new Set(values.filter(Boolean))];
const clean = value => String(value || '').replaceAll('â€™', '’').replaceAll('â€œ', '“').replaceAll('â€', '”').replaceAll('â€”', '—').replaceAll('Â', '');

function imagesFor(page) {
  return unique((page.dom.images || []).filter(img => img.width > 120 && img.height > 80).map(img => local(img.src)));
}

function mediaFor(page) {
  return unique((page.resources || []).filter(r => r.type === 'media').map(r => local(r.url)));
}

const pageByRoute = Object.fromEntries(pages.map(page => [page.route, page]));

const collections = {
  digital: [
    ['/digital/planetarium','PLANETARIUM'], ['/digital/merimnao','MERIMNAO'], ['/digital/simulation','SIMULATION'],
    ['/digital/shasta-animated-short','SHASTA'], ['/digital/collection','OTHER SMALL SCALE WORK'],
    ['/digital/digital-planetarium','DIGITAL PLANETARIUM'], ['/digital/biotic-gallery','BIOTIC GALLERY'],
    ['/digital/witches-flight-3d','WITCHES FLIGHT 3D'], ['/digital/identity-automaton','IDENTITY AUTOMATON'], ['/digital/deficit','DEFICIT'],
  ],
  physical: [
    ['/physical/storiesonskin','STORIES ON SKIN'], ['/physical/decay','DECAY'], ['/physical/the-industrial-woman','THE INDUSTRIAL WOMAN'],
    ['/physical/coyness','COYNESS'], ['/physical/theater-production-work','THEATER PRODUCTION WORK'], ['/physical/african-bullfrog','AFRICAN BULLFROG'],
  ],
  clients: [
    ['/for-clients/mcadxellwas','MCAD X ELLWAS'], ['/for-clients/aippy','AIPPY'], ['/for-clients/black-luminaries','BLACK LUMINARIES'],
  ],
};

for (const [key, cards] of Object.entries(collections)) {
  const route = key === 'clients' ? '/for-clients' : `/${key}`;
  const images = imagesFor(pageByRoute[route]);
  const imageIndexes = key === 'digital' ? [0, 1, 2, 3, null, 4, 5, 6, 7, 8] : cards.map((_, i) => i);
  collections[key] = cards.map(([href, title], i) => ({ href, title, image: imageIndexes[i] === null ? null : images[imageIndexes[i]] || null }));
}

const projectData = {};
const localVideos = {
  '/physical/decay': '/assets/decay.mp4',
  '/physical/the-industrial-woman': '/assets/industrial-woman.mp4',
  '/for-clients/black-luminaries': '/assets/black-luminaries.mp4',
};
for (const page of projects) {
  const elements = page.dom.elements || [];
  const firstTitleIndex = elements.findIndex(el => el.tag === 'H2' && el.text !== 'SOPH KATSIVELOS');
  const afterTitle = elements.slice(Math.max(0, firstTitleIndex));
  const navBoundary = afterTitle.findIndex((el, index) => index > 0 && el.tag === 'A' && /^(Next|Previous)/i.test(el.text));
  const contentElements = navBoundary > 0 ? afterTitle.slice(0, navBoundary) : afterTitle;
  const content = contentElements.filter(el =>
    ['H2','H3','P'].includes(el.tag) && !['SOPH KATSIVELOS','FOLLOW','LinkedIn','Itch.Io'].includes(el.text)
  ).map(el => ({ tag: el.tag.toLowerCase(), text: clean(el.text) }));
  projectData[page.route] = {
    route: page.route,
    title: content.find(el => el.tag === 'h2')?.text || page.dom.title,
    content,
    images: imagesFor(page),
    media: localVideos[page.route] ? [localVideos[page.route]] : mediaFor(page),
  };
}

const homeImage = local(pageByRoute['/'].dom.images[0]?.src);
const study = pageByRoute['/digital-sociology-study'];
const contact = pageByRoute['/contact'];
const output = {
  homeImage,
  collections,
  projects: projectData,
  study: {
    images: imagesFor(study),
    content: (study.dom.elements || []).filter(el => ['H2','H3','P'].includes(el.tag) && !['SOPH KATSIVELOS','FOLLOW','LinkedIn','Itch.Io'].includes(el.text)).map(el => ({ tag: el.tag.toLowerCase(), text: clean(el.text) })),
  },
  about: {
    images: imagesFor(contact),
    content: (contact.dom.elements || []).filter(el => ['H1','H2','H3','P'].includes(el.tag) && !['SOPH KATSIVELOS','FOLLOW','LinkedIn','Itch.Io'].includes(el.text)).map(el => ({ tag: el.tag.toLowerCase(), text: clean(el.text) })),
    resume: local('https://www.sophkatsivelos.com/s/Sophie-Katsivelos-Resume-2025.pdf'),
  },
};

fs.writeFileSync(path.join(root, 'sophkatsivelos-static', 'src', 'site-data.json'), JSON.stringify(output, null, 2));
