from flask import Flask, render_template, jsonify
import json
import os

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PACKAGE_FILE = os.path.join(BASE_DIR, "data", "packages.json")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/packages")
def packages():
    try:
        if os.path.exists(PACKAGE_FILE):
            with open(PACKAGE_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)

            return jsonify(data)

        return jsonify([])

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )