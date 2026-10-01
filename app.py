from __future__ import annotations

import json
import os
from pathlib import Path

from flask import Flask, jsonify, render_template

BASE_DIR = Path(__file__).resolve().parent
PACKAGE_FILE = BASE_DIR / "data" / "packages.json"

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 1 * 1024 * 1024


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
        "script-src 'self'; "
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
    return response


@app.route("/")
def index():
    return render_template("index.html")


@app.get("/api/packages")
def packages():
    try:
        if not PACKAGE_FILE.is_file():
            return jsonify([])

        with PACKAGE_FILE.open("r", encoding="utf-8") as file:
            data = json.load(file)

        if not isinstance(data, list):
            return jsonify({"error": "Package master must contain a JSON array."}), 500

        return jsonify(data)

    except (OSError, json.JSONDecodeError) as exc:
        app.logger.exception("Unable to load package master")
        return jsonify({"error": f"Unable to load package master: {exc}"}), 500


@app.get("/health")
def health():
    return jsonify({"status": "ok", "service": "ayushman-billing"})


if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "").lower() in {"1", "true", "yes"}

    app.run(host=host, port=port, debug=debug)
