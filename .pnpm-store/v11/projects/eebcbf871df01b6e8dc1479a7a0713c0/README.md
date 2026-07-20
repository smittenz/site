# Soph Katsivelos portfolio

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

The static output is written to `dist/`. The project includes a Netlify-compatible SPA redirect file so direct links to portfolio routes work after deployment.

Content and route metadata live in `src/site-data.json`. Layout and interactions are in `src/App.jsx`; all visual styling is in `src/styles.css`. Images, videos, fonts, the interactive homepage artwork, and the résumé are stored under `public/`.
