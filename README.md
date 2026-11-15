# BLSSNVJ21 — AYUSHMAN BILLING

Static browser-based Ayushman hospital billing application, published with GitHub Pages.

**Live site:** https://shreebalaji767.github.io/AYUSHMAN-BILLING/

## Static architecture
- HTML, CSS and vanilla JavaScript only.
- No Flask/Python server, backend, database, build step or paid API.
- Patient details, billing rows, totals and remarks stay in this browser's `localStorage`.
- Existing explicit **Save** workflow, patient fields, editable billing rows, manual totals, print/PDF layout and PWA support are retained.
- **Export JSON**, **Import JSON**, **Copy JSON**, and **Clear Saved Data** are available again as browser-only controls. Import validates the backup before replacing the current bill.
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
- Use **Export JSON** regularly to keep an independent backup. **Import JSON** restores a previously exported bill; imported changes remain unsaved until you press **Save**.
- **Clear Saved Data** removes only this app's saved bill keys, not unrelated website data in the browser.

## Backup and restore

- **Export JSON** downloads the current bill, including patient details, billing rows, totals and remarks.
- **Import JSON** accepts a valid BLSSNVJ21 bill backup (maximum 2 MB) and asks before replacing unsaved edits.
- **Copy JSON** copies the current bill data to the clipboard where browser permissions allow.
- **Clear Saved Data** clears only this application's saved draft keys; it does not clear the browser's entire local storage.
- Keep exported JSON files secure because they can contain sensitive patient information.

## Printing
Choose **Print / PDF**, then select a printer or “Save as PDF”. The A4 print stylesheet preserves the hospital letterhead spaces.

## Feature preservation

The static version keeps the billing form, editable rows, manual totals, Save/restore, keyboard shortcuts, unsaved-change warning, print/PDF, responsive styling, PWA installation/offline shell, icons and metadata. Server-only routes such as `/health` are not available on GitHub Pages; the application does not need them to create, save, import, export or print bills.

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
