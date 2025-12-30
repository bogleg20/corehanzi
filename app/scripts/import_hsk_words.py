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


def is_surname_only_form(form: dict) -> bool:
    """Check if a form only contains surname meaning."""
    meanings = form.get("meanings", [])
    if not meanings:
        return False
    # Check if first meaning starts with "surname"
    return meanings[0].lower().startswith("surname ")


def select_best_form(forms: list[dict]) -> dict:
    """Select the best form, preferring common usage over surnames/archaic forms."""
    if not forms:
        return {}

    # First pass: find non-surname forms
    non_surname_forms = [f for f in forms if not is_surname_only_form(f)]

    if non_surname_forms:
        # Score each form:
        # - Prefer lowercase pinyin (common usage) over uppercase (proper nouns)
        # - Prefer non-archaic meanings
        # - Prefer forms with more meanings
        def score_form(form):
            pinyin = form.get("transcriptions", {}).get("pinyin", "")
            meanings = form.get("meanings", [])
            first_meaning = meanings[0] if meanings else ""

            score = 0
            # Lowercase pinyin = common pronunciation (+100)
            if pinyin and pinyin[0].islower():
                score += 100
            # Non-archaic/variant meanings (+50)
            if not first_meaning.startswith("(archaic)") and not first_meaning.startswith("variant of"):
                score += 50
            # More meanings = more useful (+count)
            score += len(meanings)
            return score

        return max(non_surname_forms, key=score_form)

    # Fallback to first form if all are surnames
    return forms[0]


def main():
    print(f"Loading HSK data from {HSK_FILE}...")
    with open(HSK_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    print(f"Total entries in dataset: {len(data)}")

    # Filter to target levels
    words_to_import = []
    for entry in data:
        levels = entry.get("level", [])
        if not any(lvl in TARGET_LEVELS for lvl in levels):
            continue

        # Get the best form (preferring non-surname forms)
        forms = entry.get("forms", [])
        if not forms:
            continue

        primary_form = select_best_form(forms)

        # Extract data
        hanzi = entry.get("simplified", "")
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
