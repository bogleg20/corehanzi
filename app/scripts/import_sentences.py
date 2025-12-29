#!/usr/bin/env python3
"""
Import Tatoeba sentences, tokenize with jieba, filter by HSK coverage,
and build word-sentence links.
"""

import json
import sqlite3
import re
from pathlib import Path

try:
    import jieba
except ImportError:
    print("Please install jieba: pip install jieba")
    exit(1)

# Paths
DATA_DIR = Path(__file__).parent.parent.parent / "data"
TATOEBA_FILE = DATA_DIR / "tatoeba-data.tsv"
DB_FILE = Path(__file__).parent.parent / "chinese.db"

# Minimum HSK coverage (80%)
MIN_COVERAGE = 0.80

def load_hsk_words(cursor) -> dict[str, int]:
    """Load HSK words from database into a lookup dict."""
    cursor.execute("SELECT hanzi, id FROM words")
    return {row[0]: row[1] for row in cursor.fetchall()}

def clean_chinese(text: str) -> str:
    """Remove non-Chinese characters for tokenization."""
    # Keep Chinese characters only
    return re.sub(r'[^\u4e00-\u9fff]', '', text)

def calculate_coverage(tokens: list[str], hsk_words: dict[str, int]) -> float:
    """Calculate what percentage of tokens are in HSK vocabulary."""
    if not tokens:
        return 0.0
    matches = sum(1 for t in tokens if t in hsk_words)
    return matches / len(tokens)

def main():
    print(f"Loading Tatoeba data from {TATOEBA_FILE}...")

    # Load sentences
    sentences = []
    seen_chinese = set()  # Deduplicate

    with open(TATOEBA_FILE, "r", encoding="utf-8") as f:
        for line in f:
            parts = line.strip().split("\t")
            if len(parts) >= 4:
                group_id, chinese, eng_id, english = parts[0], parts[1], parts[2], parts[3]
                # Skip duplicates
                if chinese not in seen_chinese:
                    seen_chinese.add(chinese)
                    sentences.append({
                        "chinese": chinese,
                        "english": english,
                    })

    print(f"Loaded {len(sentences)} unique sentences")

    # Connect to database
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Load HSK words
    hsk_words = load_hsk_words(cursor)
    print(f"Loaded {len(hsk_words)} HSK words for filtering")

    # Create sentences table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sentences (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chinese TEXT NOT NULL,
            english TEXT NOT NULL,
            difficulty_score REAL,
            audio_path TEXT,
            tokens TEXT
        )
    """)

    # Create sentence_words junction table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sentence_words (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sentence_id INTEGER NOT NULL,
            word_id INTEGER NOT NULL,
            FOREIGN KEY (sentence_id) REFERENCES sentences(id),
            FOREIGN KEY (word_id) REFERENCES words(id)
        )
    """)

    cursor.execute("CREATE INDEX IF NOT EXISTS idx_sentences_chinese ON sentences(chinese)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_sentence_words_sentence ON sentence_words(sentence_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_sentence_words_word ON sentence_words(word_id)")

    # Process sentences
    imported_count = 0
    skipped_count = 0

    for sentence in sentences:
        chinese = sentence["chinese"]
        english = sentence["english"]

        # Clean and tokenize
        clean_text = clean_chinese(chinese)
        if not clean_text:
            skipped_count += 1
            continue

        tokens = list(jieba.cut(clean_text))

        # Calculate HSK coverage
        coverage = calculate_coverage(tokens, hsk_words)

        if coverage < MIN_COVERAGE:
            skipped_count += 1
            continue

        # Calculate difficulty score (inverse of coverage, lower = easier)
        difficulty_score = 1.0 - coverage

        # Insert sentence
        cursor.execute("""
            INSERT INTO sentences (chinese, english, difficulty_score, tokens)
            VALUES (?, ?, ?, ?)
        """, (chinese, english, difficulty_score, json.dumps(tokens)))

        sentence_id = cursor.lastrowid

        # Create word-sentence links
        for token in tokens:
            if token in hsk_words:
                word_id = hsk_words[token]
                cursor.execute("""
                    INSERT INTO sentence_words (sentence_id, word_id)
                    VALUES (?, ?)
                """, (sentence_id, word_id))

        imported_count += 1

        if imported_count % 1000 == 0:
            print(f"  Processed {imported_count} sentences...")
            conn.commit()

    conn.commit()

    print(f"\nImport complete:")
    print(f"  Imported: {imported_count} sentences")
    print(f"  Skipped: {skipped_count} sentences (< {MIN_COVERAGE*100}% HSK coverage)")

    # Verify
    cursor.execute("SELECT COUNT(*) FROM sentences")
    total_sentences = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM sentence_words")
    total_links = cursor.fetchone()[0]

    print(f"\nDatabase stats:")
    print(f"  Total sentences: {total_sentences}")
    print(f"  Word-sentence links: {total_links}")

    conn.close()
    print("Done!")

if __name__ == "__main__":
    main()
