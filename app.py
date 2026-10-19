import json
from datetime import date
from pathlib import Path

from flask import Flask, render_template

app = Flask(__name__)

BASE_DIR = Path(__file__).resolve().parent


def load_courses():
    with open(BASE_DIR / "content.json", encoding="utf-8") as file:
        return json.load(file)


@app.route("/")
def index():
    courses = load_courses()

    tag_counts = {}
    for course in courses:
        for tag in course["tags"]:
            tag_counts[tag] = tag_counts.get(tag, 0) + 1

    tags = sorted(tag_counts.items(), key=lambda item: (-item[1], item[0].lower()))

    return render_template(
        "index.html",
        courses=courses,
        tags=tags,
        current_year=date.today().year,
    )


if __name__ == "__main__":
    app.run(debug=True)
