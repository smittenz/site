import { PORTFOLIO_RECORDS, SEARCH_ALIASES } from "./portfolio-tags.js";

const TAG_FIELDS = ["programs", "materials", "skills", "mediums", "platforms", "roles", "participants", "duration", "themes", "aliases"];
const FIELD_WEIGHTS = {
  title: 90,
  category: 22,
  programs: 62,
  materials: 58,
  skills: 54,
  mediums: 60,
  platforms: 48,
  roles: 46,
  participants: 44,
  duration: 38,
  themes: 34,
  aliases: 42,
  content: 12,
};

export function normalizeSearchValue(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function pageText(page) {
  return (page?.content || []).map(block => block.text || "").join(" ");
}

function categoryFor(href) {
  if (href.startsWith("/physical")) return "Physical";
  if (href.startsWith("/for-clients")) return "Client";
  return "Digital";
}

function prepareRecord(record, content = "") {
  const fields = {
    title: [record.title],
    category: [record.category],
    content: [content],
  };
  TAG_FIELDS.forEach(field => { fields[field] = record[field] || []; });
  if (record.year) fields.themes = [...fields.themes, String(record.year)];

  const normalizedFields = Object.fromEntries(
    Object.entries(fields).map(([field, values]) => [field, values.map(normalizeSearchValue).filter(Boolean)]),
  );

  return {
    ...record,
    fields: normalizedFields,
    tags: TAG_FIELDS.flatMap(field => record[field] || []),
  };
}

export function buildPortfolioSearchIndex(siteData) {
  const pagesByHref = {
    "/digital-sociology-study": siteData.study,
    ...siteData.projects,
  };
  const recordCountByHref = PORTFOLIO_RECORDS.reduce((counts, record) => {
    counts[record.href] = (counts[record.href] || 0) + 1;
    return counts;
  }, {});
  const indexedRoutes = new Set(PORTFOLIO_RECORDS.map(record => record.href));

  const taggedRecords = PORTFOLIO_RECORDS.map(record => prepareRecord(
    record,
    recordCountByHref[record.href] === 1 ? pageText(pagesByHref[record.href]) : "",
  ));

  // New pages remain searchable immediately even before their detailed tags
  // are added to portfolio-tags.js.
  const fallbackRecords = Object.entries(siteData.projects)
    .filter(([href]) => !indexedRoutes.has(href))
    .map(([href, project]) => prepareRecord({
      id: `fallback-${href}`,
      href,
      title: project.title,
      category: categoryFor(href),
    }, pageText(project)));

  const profile = prepareRecord({
    id: "about-contact",
    href: "/contact",
    title: "About + Contact",
    category: "Profile",
  }, pageText(siteData.about));

  return [...taggedRecords, ...fallbackRecords, profile];
}

function phraseScore(values, phrase, weight) {
  if (!phrase) return 0;
  let best = 0;
  values.forEach(value => {
    if (value === phrase) best = Math.max(best, weight * 3);
    else if (value.startsWith(`${phrase} `) || value.endsWith(` ${phrase}`)) best = Math.max(best, weight * 2.25);
    else if (value.includes(` ${phrase} `)) best = Math.max(best, weight * 1.8);
    else if (value.split(" ").some(word => word.startsWith(phrase))) best = Math.max(best, weight);
  });
  return best;
}

function scoreTerm(item, term) {
  return Object.entries(item.fields).reduce(
    (score, [field, values]) => Math.max(score, phraseScore(values, term, FIELD_WEIGHTS[field] || 10)),
    0,
  );
}

function aliasesFor(term) {
  return (SEARCH_ALIASES[term] || []).map(normalizeSearchValue);
}

export function searchPortfolio(index, query, limit = 7) {
  const phrase = normalizeSearchValue(query);
  if (!phrase) return [];

  const terms = [...new Set(phrase.split(" ").filter(Boolean))];
  return index
    .map((item, order) => {
      let score = phraseScore(item.fields.title, phrase, FIELD_WEIGHTS.title) * 1.35;
      let matchedTerms = 0;

      terms.forEach(term => {
        const direct = scoreTerm(item, term);
        const expanded = aliasesFor(term).reduce((best, alias) => Math.max(best, scoreTerm(item, alias) * .72), 0);
        const termScore = Math.max(direct, expanded);
        if (termScore > 0) matchedTerms += 1;
        score += termScore;
      });

      if (matchedTerms !== terms.length) return null;
      score += Object.entries(item.fields).reduce(
        (bonus, [field, values]) => bonus + phraseScore(values, phrase, (FIELD_WEIGHTS[field] || 10) * .35),
        0,
      );
      return { item, order, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, limit)
    .map(result => result.item);
}
