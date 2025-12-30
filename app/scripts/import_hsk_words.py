#!/usr/bin/env python3
"""
Import HSK 3.0 vocabulary from hsk-complete.json into SQLite database.
Filters to new-1, new-2, new-3 levels (~2,225 words).
"""

import json
import sqlite3
from pathlib import Path

# Paths
DATA_DIR = Path(__file__).parent.parent.parent / "data"
HSK_FILE = DATA_DIR / "hsk-complete.json"
OVERRIDES_FILE = DATA_DIR / "word_overrides.json"
DB_FILE = Path(__file__).parent.parent / "chinese.db"

# HSK levels to import
TARGET_LEVELS = {"new-1", "new-2", "new-3"}

def get_hsk_level_number(levels: list[str]) -> int:
    """Extract numeric HSK level from level tags."""
    for level in levels:
        if level.startswith("new-"):
            try:
                return int(level.replace("new-", "").replace("+", ""))
            except ValueError:
                continue
    return 0


def is_unsuitable_form(form: dict) -> bool:
    """Check if a form should be skipped (surname, archaic, variant, etc.)."""
    meanings = form.get("meanings", [])
    if not meanings:
        return True
    first_meaning = meanings[0].lower()
    # Skip surname-only, archaic, variant, and euphemistic forms
    skip_patterns = ["surname ", "(archaic)", "variant of", "old variant", "euphemistic"]
    return any(p in first_meaning for p in skip_patterns)


def load_overrides() -> dict:
    """Load word overrides from JSON file."""
    if OVERRIDES_FILE.exists():
        with open(OVERRIDES_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def select_best_form(forms: list[dict], hanzi: str, overrides: dict) -> dict:
    """Select the best form for HSK learning.

    Priority:
    1. Check overrides file for manual corrections
    2. First form with lowercase pinyin (common pronunciation)
    3. First form that isn't surname/archaic/variant
    4. Fallback to first form
    """
    if not forms:
        return {}

    # Check overrides first
    if hanzi in overrides:
        target_pinyin = overrides[hanzi].get("pinyin")
        for form in forms:
            pinyin = form.get("transcriptions", {}).get("pinyin", "")
            if pinyin == target_pinyin:
                return form

    # First pass: find first suitable form with lowercase pinyin
    for form in forms:
        if is_unsuitable_form(form):
            continue
        pinyin = form.get("transcriptions", {}).get("pinyin", "")
        if pinyin and pinyin[0].islower():
            return form

    # Second pass: any suitable form
    for form in forms:
        if is_unsuitable_form(form):
            continue
        return form

    # Fallback to first form if all are unsuitable
    return forms[0]


def main():
    print(f"Loading HSK data from {HSK_FILE}...")
    with open(HSK_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Load overrides
    overrides = load_overrides()
    if overrides:
        print(f"Loaded {len(overrides)} word overrides")

    print(f"Total entries in dataset: {len(data)}")

    # Filter to target levels
    words_to_import = []
    for entry in data:
        levels = entry.get("level", [])
        if not any(lvl in TARGET_LEVELS for lvl in levels):
            continue

        # Get the best form
        forms = entry.get("forms", [])
        if not forms:
            continue

        hanzi = entry.get("simplified", "")
        primary_form = select_best_form(forms, hanzi, overrides)

        # Extract data
        traditional = primary_form.get("traditional", hanzi)

        transcriptions = primary_form.get("transcriptions", {})
        pinyin = transcriptions.get("pinyin", "")
        pinyin_numeric = transcriptions.get("numeric", "")

        meanings = primary_form.get("meanings", [])
        definition = meanings[0] if meanings else ""

        hsk_level = get_hsk_level_number(levels)
        pos = ",".join(entry.get("pos", []))
        frequency = entry.get("frequency", 0)
        classifiers = primary_form.get("classifiers", [])

        words_to_import.append({
            "hanzi": hanzi,
            "traditional": traditional,
            "pinyin": pinyin,
            "pinyin_numeric": pinyin_numeric,
            "definition": definition,
            "definitions": json.dumps(meanings),
            "hsk_level": hsk_level,
            "pos": pos,
            "frequency": frequency,
            "classifiers": json.dumps(classifiers),
        })

    print(f"Words matching HSK 1-3: {len(words_to_import)}")

    # Create database and insert
    print(f"Creating database at {DB_FILE}...")
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Drop and recreate words table for clean import
    cursor.execute("DROP TABLE IF EXISTS words")
    cursor.execute("""
        CREATE TABLE words (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            hanzi TEXT NOT NULL,
            traditional TEXT,
            pinyin TEXT NOT NULL,
            pinyin_numeric TEXT,
            definition TEXT NOT NULL,
            definitions TEXT,
            hsk_level INTEGER NOT NULL,
            pos TEXT,
            frequency INTEGER,
            classifiers TEXT,
            audio_path TEXT
        )
    """)

    # Create index on hanzi for faster lookups
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_words_hanzi ON words(hanzi)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_words_hsk_level ON words(hsk_level)")

    # Insert words
    cursor.executemany("""
        INSERT INTO words (hanzi, traditional, pinyin, pinyin_numeric, definition, definitions, hsk_level, pos, frequency, classifiers)
        VALUES (:hanzi, :traditional, :pinyin, :pinyin_numeric, :definition, :definitions, :hsk_level, :pos, :frequency, :classifiers)
    """, words_to_import)

    conn.commit()

    # Verify
    cursor.execute("SELECT COUNT(*) FROM words")
    count = cursor.fetchone()[0]
    print(f"Imported {count} words into database")

    # Show breakdown by level
    cursor.execute("SELECT hsk_level, COUNT(*) FROM words GROUP BY hsk_level ORDER BY hsk_level")
    for level, cnt in cursor.fetchall():
        print(f"  HSK {level}: {cnt} words")

    conn.close()
    print("Done!")

if __name__ == "__main__":
    main()
