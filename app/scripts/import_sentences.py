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
    """Load HSK words from database into a lookup dict {hanzi: id}."""
    cursor.execute("SELECT hanzi, id FROM words")
    return {row[0]: row[1] for row in cursor.fetchall()}


def load_hsk_levels(cursor) -> dict[str, int]:
    """Load HSK levels from database into a lookup dict {hanzi: level}."""
    cursor.execute("SELECT hanzi, hsk_level FROM words")
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


def calculate_difficulty(tokens: list[str], hsk_words: dict[str, int], hsk_levels: dict[str, int], coverage: float) -> float:
    """Calculate difficulty score using multiple factors.

    Factors:
    - Sentence length (ideal 4-10 tokens, 40% weight)
    - Average HSK level of words (lower = easier, 40% weight)
    - Non-HSK word ratio (lower = easier, 20% weight)

    Returns a score from 0.0 (easiest) to 1.0 (hardest).
    """
    # Factor 1: Sentence length (ideal range 4-10 tokens)
    # Too short (<4) or too long (>15) gets penalized
    token_count = len(tokens)
    if token_count < 4:
        # Too short - not useful as example (e.g., "是。")
        length_score = 0.8 + (4 - token_count) * 0.1  # 1.0 for 1 token, 0.9 for 2, etc.
    elif token_count <= 10:
        # Ideal range
        length_score = (token_count - 4) / 20.0  # 0.0 to 0.3
    else:
        # Getting longer
        length_score = min(token_count / 20.0, 1.0)

    # Factor 2: Average HSK level of words (normalized, 0-1)
    # HSK 1 = 0, HSK 2 = 0.5, HSK 3 = 1.0
    hsk_tokens = [t for t in tokens if t in hsk_levels]
    if hsk_tokens:
        avg_level = sum(hsk_levels[t] for t in hsk_tokens) / len(hsk_tokens)
        level_score = (avg_level - 1) / 2.0  # HSK 1=0, HSK 3=1
    else:
        level_score = 1.0  # No HSK words = hardest

    # Factor 3: Non-HSK word ratio (0-1)
    non_hsk_ratio = 1.0 - coverage

    # Combined score (weighted)
    difficulty = 0.4 * length_score + 0.4 * level_score + 0.2 * non_hsk_ratio
    return difficulty

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

    # Load HSK words and levels
    hsk_words = load_hsk_words(cursor)
    hsk_levels = load_hsk_levels(cursor)
    print(f"Loaded {len(hsk_words)} HSK words for filtering")

    # Clear existing data for clean re-import
    cursor.execute("DROP TABLE IF EXISTS sentence_words")
    cursor.execute("DROP TABLE IF EXISTS sentences")

    # Create sentences table
    cursor.execute("""
        CREATE TABLE sentences (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chinese TEXT NOT NULL,
            english TEXT NOT NULL,
            pinyin TEXT,
            difficulty_score REAL,
            audio_path TEXT,
            tokens TEXT
        )
    """)

    # Create sentence_words junction table
    cursor.execute("""
        CREATE TABLE sentence_words (
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

        # Calculate difficulty score using multiple factors
        difficulty_score = calculate_difficulty(tokens, hsk_words, hsk_levels, coverage)

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
