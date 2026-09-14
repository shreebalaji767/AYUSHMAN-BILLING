# AYUSHMAN BILLING

DB-free Ayushman billing web application.

## TECHNOLOGY

- Python
- Flask
- HTML
- CSS
- JavaScript
- JSON package master

## DATABASE

This project does NOT use:

- MySQL
- SQLite
- PostgreSQL
- MongoDB

Patient billing information is not automatically stored by the Python server.

## INSTALLATION

Install Python 3.

Open Command Prompt inside:

AYUSHMAN BILLING

Run:

pip install -r requirements.txt

Then run:

python app.py

Open in the server PC:

http://127.0.0.1:5000

## SAME NETWORK

Find the server PC IP address:

ipconfig

Look for:

IPv4 Address

Example:

192.168.1.50

Then another PC/tablet/Android device on the same network can open:

http://192.168.1.50:5000

## PDF

Click:

Save PDF / Print

Then choose:

Save as PDF

or:

Microsoft Print to PDF

## LETTERHEAD

The print stylesheet reserves:

Top header:

38mm

Bottom footer:

28mm

Change these values inside:

static/css/print.css

if your hospital letterhead requires different spacing.

## PATIENT DATA

Patient information is held in the browser while creating the bill.

The server does not save the patient bill.

## PACKAGE MASTER

Package information is stored in:

data/packages.json

This is package master information only.

It does not contain patient billing records.

## 🚀 Live Demo

🌐 **[Open Ayushman Billing Online](https://ayushman-billing.onrender.com/)**

> Access the web-based Ayushman Billing application directly in your browser.
