# BLSSNVJ21 — AYUSHMAN BILLING

Static browser-based Ayushman hospital billing application, published with GitHub Pages.

**Live site:** https://shreebalaji767.github.io/AYUSHMAN-BILLING/

## Static architecture
- HTML, CSS and vanilla JavaScript only.
- No Flask/Python server, backend, database, build step or paid API.
- Patient details, billing rows, totals and remarks stay in this browser's `localStorage`.
- Existing explicit **Save** workflow, patient fields, editable billing rows, manual totals, print/PDF layout and PWA support are retained.
- Relative asset and service-worker URLs support the GitHub Pages project subpath.
- Offline app-shell caching starts after the first successful online visit.

## Publish
1. Open repository **Settings → Pages**.
2. Set **Build and deployment → Source** to **GitHub Actions**.
3. Pushes to `main` run `.github/workflows/pages.yml` and publish the repository root.
4. Wait for the Pages workflow to succeed, then open the live site.

No Python, package installation or server process is required.

## Billing data and privacy
- The app does not upload patient or billing information.
- Saved bills remain in this browser profile and site origin.
- Clearing browser/site data can erase locally saved bills.
- Save before leaving; unsaved changes trigger a browser warning.
- Each browser/device has separate local data; this is not a shared multi-user database.

## Printing
Choose **Print / PDF**, then select a printer or “Save as PDF”. The A4 print stylesheet preserves the hospital letterhead spaces.

## Structure
```text
AYUSHMAN-BILLING/
├── index.html
├── robots.txt
├── sitemap.xml
├── sw.js
├── .github/workflows/pages.yml
├── data/packages.json
└── static/
    ├── css/ (screen and print styles)
    ├── icons/
    ├── js/app.js
    └── manifest.webmanifest
```

**BLSSNVJ21 — Static GitHub Pages · Browser Storage Only**
