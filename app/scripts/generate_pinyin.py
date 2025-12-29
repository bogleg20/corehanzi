#!/usr/bin/env python3
"""
Generate pinyin for all sentences in the database using pypinyin.
"""

import sqlite3
from pathlib import Path

try:
    from pypinyin import pinyin, Style
except ImportError:
    print("Please install pypinyin: pip install pypinyin")
    exit(1)

DB_FILE = Path(__file__).parent.parent / "chinese.db"


def chinese_to_pinyin(text: str) -> str:
    """Convert Chinese text to space-separated tonal pinyin."""
    result = pinyin(text, style=Style.TONE)
    return ' '.join([p[0] for p in result])


def main():
    print(f"Connecting to database at {DB_FILE}...")
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Get sentences without pinyin
    cursor.execute("SELECT id, chinese FROM sentences WHERE pinyin IS NULL")
    sentences = cursor.fetchall()
    print(f"Sentences to process: {len(sentences)}")

    if len(sentences) == 0:
        print("All sentences already have pinyin!")
        conn.close()
        return

    for i, (sentence_id, chinese) in enumerate(sentences):
        pinyin_text = chinese_to_pinyin(chinese)
        cursor.execute(
            "UPDATE sentences SET pinyin = ? WHERE id = ?",
            (pinyin_text, sentence_id)
        )

        if (i + 1) % 1000 == 0:
            print(f"  Processed {i + 1}/{len(sentences)} sentences...")
            conn.commit()

    conn.commit()

    # Stats
    cursor.execute("SELECT COUNT(*) FROM sentences WHERE pinyin IS NOT NULL")
    sentences_with_pinyin = cursor.fetchone()[0]

    print(f"\n=== Pinyin generation complete ===")
    print(f"  Sentences with pinyin: {sentences_with_pinyin}")

    # Show a sample
    cursor.execute("SELECT chinese, pinyin FROM sentences LIMIT 3")
    samples = cursor.fetchall()
    print("\nSample outputs:")
    for chinese, py in samples:
        print(f"  {chinese}")
        print(f"  → {py}\n")

    conn.close()


if __name__ == "__main__":
    main()
