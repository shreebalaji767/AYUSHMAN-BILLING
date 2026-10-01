# AYUSHMAN BILLING

DB-free Ayushman billing web application for hospital billing and package management.

## Current stack

- Python 3.14.8
- Flask 3.1.3
- Gunicorn 26.2.0
- HTML / CSS / JavaScript
- Browser `localStorage` for patient/billing drafts and package master
- No database and no server-side patient/billing storage

Python 3.14.8 is the current Python 3.14 maintenance release as of 30 September 2026. Flask 3.1.3 is the current stable Flask release; Flask 3.2 is still unreleased.

## Features

- Patient billing form
- Editable billing rows
- Ayushman package master loaded from `data/packages.json`
- Print / Save as PDF workflow
- Hospital letterhead print spacing
- Responsive screen layout
- No automatic patient-billing storage
- Health-check endpoint at `/health`

## Installation

Use Python 3.14.8.

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

`http://127.0.0.1:5000`

## Same-network use

Start the application on the hospital/server PC.

Find the server PC IPv4 address:

```text
ipconfig
```

For example:

`192.168.1.50`

Then another PC, tablet, or Android device on the same network can open:

`http://192.168.1.50:5000`

## Production server

For a production deployment, use Gunicorn instead of Flask's development server:

```text
gunicorn app:app --bind 0.0.0.0:5000
```

On Windows, use `python app.py` for local/server-PC operation because Gunicorn is designed for Unix-like production environments.

## Health check

Open:

`/health`

Expected response:

```json
{"status":"ok","service":"ayushman-billing"}
```

## PDF / printing

Use **Print / Save PDF** and select:

- Save as PDF
- Microsoft Print to PDF
- Your installed printer

The print stylesheet reserves blank space for the hospital letterhead.

Adjust these values in:

`static/css/print.css`

- `35mm` top header space
- `25mm` bottom footer space

## Browser-only storage

All patient, billing, draft, and package-master data used by the application is stored in the browser with `localStorage`. The Flask application does not receive or persist patient/billing data.

The package master is seeded into browser storage on first load. Package lookups then use browser storage only.

Browser storage is origin-specific and persists across browser sessions until the user clears site data.

## Package master

Package information is stored in:

`data/packages.json`

This is package-master information only; it is not a patient billing database.

## Upgrade notes

The 2026 upgrade:

- Pins Flask to the current stable 3.1.3 release.
- Pins Gunicorn to 26.2.0.
- Targets Python 3.14.8.
- Removes development-debug behavior from the default runtime.
- Adds a lightweight `/health` endpoint.
- Adds browser security headers including CSP and Permissions-Policy.
- Uses `pathlib` for cross-platform file handling.
- Seeds the package master into browser `localStorage` and uses browser storage for package lookup.
- Removes the package API; the browser does not request patient or package data from a server endpoint.
- Refreshes the PWA cache namespace so upgraded assets are picked up.
- Keeps the existing UI, billing workflow, and print layout intact.


## PWA / Installable App

This version includes optional Progressive Web App support:

- Web App Manifest: `static/manifest.webmanifest`
- Service Worker: `static/sw.js`
- Install button: shown when the browser exposes the PWA install prompt
- Offline app-shell caching for the main billing screen
- Package master uses network-first loading and can fall back to the last cached response
- Standalone app mode on supported browsers

### Installing

Open the application in a supported browser and use **Install App** when the browser offers installation.

For normal PWA installation, the app must be served from **HTTPS**. Browsers also allow installation during local development from `localhost` / `127.0.0.1`. A plain HTTP address on another device over a LAN is generally not an installable secure context.

PWA support is optional: the normal browser version and printing workflow continue to work without installation.
