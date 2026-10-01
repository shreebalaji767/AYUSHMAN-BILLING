# AYUSHMAN BILLING

DB-free Ayushman billing web application for hospital billing and package management.

## Current stack

- Python 3.14.8
- Flask 3.1.3
- Gunicorn 23.0.0
- HTML / CSS / JavaScript
- JSON package master
- No database

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

## Patient data

Patient billing information is kept in the browser while creating the bill. The current application does **not** save patient billing records on the Python server.

## Package master

Package information is stored in:

`data/packages.json`

This is package-master information only; it is not a patient billing database.

## Upgrade notes

The 2026 upgrade:

- Pins Flask to the current stable 3.1.3 release.
- Pins Gunicorn to 23.0.0.
- Targets Python 3.14.8.
- Removes development-debug behavior from the default runtime.
- Adds a lightweight `/health` endpoint.
- Adds basic HTTP security headers.
- Uses `pathlib` for cross-platform file handling.
- Validates that the package master is a JSON array.
- Keeps the existing UI, billing workflow, and print layout intact.
