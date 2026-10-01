# BLSSNVJ21 — AYUSHMAN BILLING

Browser-based Ayushman billing application for creating, editing, saving, and printing hospital billing documents.

## Version

**2026.10.10**

## Storage model

This application uses **browser storage only** for patient and billing data.

- Patient data is stored in the browser with `localStorage`.
- Billing rows and totals are stored in the browser with `localStorage`.
- Package-master data is available to the browser and is cached locally for package lookup.
- The Flask server does **not** save patient or billing records to a database.
- There is **no database** for patient/billing persistence.
- There is **no automatic bill saving**.

### Manual Save workflow

1. Enter or edit the bill.
2. The status changes to **Unsaved changes**.
3. Press **Save** to explicitly write the current bill to browser storage.
4. The status changes to **Saved to browser storage**.
5. The saved bill is restored when the application is opened again in the same browser/origin.

You can also use **Ctrl+S** on Windows/Linux or **Cmd+S** on macOS.

If there are unsaved changes, the application warns before the page is closed or reloaded.

## Main features

- BLSSNVJ21 branding
- Patient information form
- Editable Ayushman billing table
- Add and delete billing rows
- Editable billing totals
- Manual Save button
- Browser-storage save verification
- Saved/unsaved status indicator
- Ctrl+S / Cmd+S manual save shortcut
- Unsaved-changes close/reload warning
- Print / Save as PDF
- Responsive desktop, tablet, and mobile layout
- PWA manifest and service worker
- Browser tab favicon and app icons
- Service-worker update and offline fallback handling
- Accessibility-friendly dynamic row actions
- SEO metadata
- Schema.org SoftwareApplication, WebSite and Organization structured data
- OpenGraph metadata
- Twitter metadata
- JSON-LD application metadata
- `/health`, `/robots.txt`, and `/sitemap.xml` endpoints

## Intentionally removed

The application no longer exposes:

- Export JSON
- Import JSON
- Clear Storage
- Export Bill
- Import Bill
- Copy JSON
- Browser storage management/history controls

The normal **Save** action is the single explicit way to save the current bill.

## Installation

Use **Python 3.14.8** or another supported Python release. Python 3.14.8 is the current 3.14 maintenance release as of this version.

```text
python -m venv .venv
```

### Windows

```text
.venv\\Scripts\\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
python app.py
```

Open:

```text
http://127.0.0.1:5000
```

## Same-network use

Start the application on the server PC and find its IPv4 address:

```text
ipconfig
```

Then open the server address from another device on the same network, for example:

```text
http://192.168.1.50:5000
```

## Production

For Unix-like production environments:

```text
gunicorn app:app --bind 0.0.0.0:5000
```

For Windows local/server-PC use:

```text
python app.py
```

## Health check

Open:

```text
/health
```

The health response reports:

```json
{"status":"ok","service":"BLSSNVJ21","version":"2026.10.10","storage":"browser-only"}
```

## Printing / PDF

Use **Print / PDF** and select:

- Save as PDF
- Microsoft Print to PDF
- An installed printer

The print stylesheet reserves blank space for the hospital letterhead.

Print layout is controlled by:

```text
static/css/print.css
```

## PWA

PWA files:

- `static/manifest.webmanifest`
- `static/sw.js`
- `static/icons/favicon.svg`
- `static/icons/icon-192.svg`
- `static/icons/icon-512.svg`

Supported browsers can install the application as a standalone app.

PWA installation normally requires HTTPS, except for local development through `localhost` / `127.0.0.1`.

## Security

The Flask application includes security response headers including:

- Content Security Policy
- X-Content-Type-Options
- X-Frame-Options
- Referrer-Policy
- Permissions-Policy

Patient and billing persistence remains entirely on the browser side.

## Project structure

```text
AYUSHMAN-BILLING/
├── app.py
├── requirements.txt
├── README.md
├── data/
├── static/
│   ├── css/
│   ├── icons/
│   ├── js/
│   ├── manifest.webmanifest
│   └── sw.js
└── templates/
    └── index.html
```

## Important storage note

Browser `localStorage` is tied to the browser and origin. Clearing the site's browser data can remove saved bills. The application intentionally does not upload those bills to a server or database.

**BLSSNVJ21 — Browser Storage Only.**
