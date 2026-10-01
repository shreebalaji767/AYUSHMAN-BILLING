from __future__ import annotations

import os
import secrets
from pathlib import Path

from flask import Flask, Response, jsonify, render_template, request, send_from_directory

BASE_DIR = Path(__file__).resolve().parent
app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 1 * 1024 * 1024


@app.before_request
def set_csp_nonce():
    request._csp_nonce = secrets.token_urlsafe(18)


@app.after_request
def add_security_headers(response):
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "SAMEORIGIN")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault(
        "Content-Security-Policy",
        "default-src 'self'; "
        "base-uri 'self'; "
        "form-action 'self'; "
        "frame-ancestors 'self'; "
        "object-src 'none'; "
        f"script-src 'self' 'nonce-{getattr(request, '_csp_nonce', '')}'; "
        "style-src 'self'; "
        "img-src 'self' data:; "
        "font-src 'self'; "
        "connect-src 'self'; "
        "manifest-src 'self'; "
        "worker-src 'self'"
    )
    response.headers.setdefault(
        "Permissions-Policy",
        "camera=(), microphone=(), geolocation=(), payment=()"
    )
    response.headers.setdefault("Cache-Control", "no-store")
    return response


@app.route("/")
def index():
    return render_template("index.html", csp_nonce=request._csp_nonce)


@app.get("/sw.js")
def service_worker():
    response = send_from_directory(BASE_DIR / "static", "sw.js")
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    return response


@app.get("/robots.txt")
def robots():
    return Response(
        "User-agent: *\nAllow: /\nSitemap: /sitemap.xml\n",
        mimetype="text/plain"
    )


@app.get("/sitemap.xml")
def sitemap():
    return Response(
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
        "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">"
        f"<url><loc>{request.url_root}</loc></url>"
        "</urlset>",
        mimetype="application/xml"
    )


@app.get("/health")
def health():
    return jsonify({
        "status": "ok",
        "service": "BLSSNVJ21",
        "version": "2026.10.8",
        "storage": "browser-only"
    })


if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "").lower() in {"1", "true", "yes"}

    app.run(host=host, port=port, debug=debug)
