# Sophie Katsivelos portfolio

An editable, self-contained static frontend rebuilt from the public Squarespace site.

## Local development

```bash
pnpm install
pnpm dev
```

## Production build

```bash
pnpm build
```

The static output is written to `dist/`. The build automatically removes source-only media, unused prototypes, and superseded asset variants from that folder. Deploy only `dist/`; the repository root, `public/`, `node_modules/`, and local source-media archive are not server files. The repository-level `netlify.toml` enforces that publish boundary on Netlify.

Run `pnpm audit:assets` to preview how much source media will be omitted from the production output. The project includes a Netlify-compatible SPA redirect file so direct links to portfolio routes work after deployment.

Content and route metadata live in `src/site-data.json`. Background search tags live in `src/portfolio-tags.js`; add one record per distinct work, even when several works share the same page URL. Untagged new project pages still receive a basic title-and-content search entry automatically. Layout and interactions are in `src/App.jsx`; all visual styling is in `src/styles.css`. Images, videos, fonts, the interactive homepage artwork, and the résumé are stored under `public/`.
