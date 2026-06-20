# Carbon Fiber Manufacturing Calculator

Mobile-first React SPA and PWA for carbon fiber manufacturing calculations, deployed to GitHub Pages.

## Features

- Instant calculation from input volume in cm^3
- JSON-driven resin/hardener presets
- Output values in grams for:
  - Total mass m
  - Carbon fiber mass m_cf
  - Resin + hardener mass m_rh
  - Resin mass m_r
  - Hardener mass m_h
- Progressive Web App support (installable, offline app-shell)
- GitHub Actions deployment to GitHub Pages

## Equations

- m = v * 1.4
- m_cf = m * 0.6
- m_rh = m_cf * 1.3
- m_r = m_rh * (R_r / (R_r + R_h))
- m_h = m_rh * (R_h / (R_r + R_h))

## Resin Presets

Presets are configured in src/config/resins.json.

Default presets:

- EL2 Laminating Resin: 100 / 30
- EL160 High Temp Laminating Resin: 100 / 35
- XCR Epoxy Coating Resin: 100 / 41

Each preset object must follow:

```json
{
  "id": "string",
  "name": "string",
  "resinRatio": 100,
  "hardenerRatio": 30
}
```

## Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

## Quality Checks

Run lint:

```bash
npm run lint
```

Run tests:

```bash
npm run test:run
```

Build production output:

```bash
npm run build
```

## GitHub Pages Deployment

This repository includes a workflow at .github/workflows/deploy.yml that deploys dist to GitHub Pages whenever main is updated.

To enable Pages:

1. In repository settings, set Pages source to GitHub Actions.
2. Push to main.
3. Wait for the Deploy to GitHub Pages workflow to complete.

The Vite base path is set automatically from GITHUB_REPOSITORY in GitHub Actions, which keeps asset paths correct for repo-based Pages URLs.

## PWA Notes

- Manifest and service worker are generated using vite-plugin-pwa.
- If stale assets are shown after deploy, refresh once to pick up the updated service worker cache.
