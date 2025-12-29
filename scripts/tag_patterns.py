#!/usr/bin/env python3
"""
Tag sentences with grammar patterns using rule-based matching.
Focuses on top 25 patterns for MVP.
"""

import json
import sqlite3
import re
from pathlib import Path

DB_FILE = Path(__file__).parent.parent / "chinese.db"

# Top 25 grammar patterns with regex rules
PATTERNS = [
    # Basic Sentence Structure
    {"name": "是 equivalence", "structure": "A 是 B", "regex": r"是", "description": "Expresses equivalence or identity"},
    {"name": "有 possession", "structure": "A 有 B", "regex": r"有", "description": "Expresses possession or existence"},
    {"name": "在 location", "structure": "A 在 B", "regex": r"在", "description": "Expresses location"},
    {"name": "很 + adjective", "structure": "A 很 adj", "regex": r"很[^\s，。！？]+", "description": "Adjective predicate with 很"},

    # Negation
    {"name": "不 negation", "structure": "不 + verb/adj", "regex": r"不[^\s，。！？]+", "description": "General negation"},
    {"name": "没有 negation", "structure": "没有", "regex": r"没有", "description": "Negation of 有 or past actions"},
    {"name": "没 past negation", "structure": "没 + verb", "regex": r"没[^\s有，。！？]+", "description": "Negation of past actions"},

    # Questions
    {"name": "吗 yes/no", "structure": "statement + 吗", "regex": r"吗[？\?]?$", "description": "Yes/no question particle"},
    {"name": "什么 what", "structure": "什么", "regex": r"什么", "description": "What question word"},
    {"name": "谁 who", "structure": "谁", "regex": r"谁", "description": "Who question word"},
    {"name": "哪里 where", "structure": "哪里/哪儿", "regex": r"哪[里儿]", "description": "Where question word"},
    {"name": "为什么 why", "structure": "为什么", "regex": r"为什么", "description": "Why question word"},
    {"name": "怎么 how", "structure": "怎么", "regex": r"怎么", "description": "How question word"},

    # Tense & Aspect
    {"name": "了 completed", "structure": "verb + 了", "regex": r"[^\s，。！？]+了", "description": "Completed action marker"},
    {"name": "过 experience", "structure": "verb + 过", "regex": r"[^\s，。！？]+过", "description": "Experience marker"},
    {"name": "在 ongoing", "structure": "在 + verb", "regex": r"在[^\s，。！？]+", "description": "Ongoing action marker"},
    {"name": "正在 right now", "structure": "正在 + verb", "regex": r"正在", "description": "Currently in progress"},

    # Desire, Ability, Obligation
    {"name": "想 want to", "structure": "想 + verb", "regex": r"想[^\s，。！？]+", "description": "Want to do something"},
    {"name": "要 want/need", "structure": "要 + verb/noun", "regex": r"要[^\s，。！？]+", "description": "Want or need"},
    {"name": "能 can", "structure": "能 + verb", "regex": r"能[^\s，。！？]+", "description": "Can (circumstance)"},
    {"name": "可以 may", "structure": "可以 + verb", "regex": r"可以", "description": "Can (permission)"},
    {"name": "会 can/will", "structure": "会 + verb", "regex": r"会[^\s，。！？]+", "description": "Can (skill) or will (future)"},

    # Modifiers
    {"name": "的 possession", "structure": "N + 的 + N", "regex": r"[^\s，。！？]+的[^\s，。！？]+", "description": "Possessive or attributive marker"},
    {"name": "也 also", "structure": "也 + verb", "regex": r"也[^\s，。！？]+", "description": "Also/too"},
    {"name": "都 all", "structure": "都 + verb", "regex": r"都[^\s，。！？]+", "description": "All/both"},

    # Comparison
    {"name": "比 comparison", "structure": "A 比 B + adj", "regex": r"比[^\s，。！？]+", "description": "Comparison marker"},
]

def main():
    print(f"Connecting to database at {DB_FILE}...")
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Create patterns table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS patterns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            structure TEXT NOT NULL,
            example TEXT,
            description TEXT
        )
    """)

    # Create sentence_patterns junction table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sentence_patterns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sentence_id INTEGER NOT NULL,
            pattern_id INTEGER NOT NULL,
            FOREIGN KEY (sentence_id) REFERENCES sentences(id),
            FOREIGN KEY (pattern_id) REFERENCES patterns(id)
        )
    """)

    cursor.execute("CREATE INDEX IF NOT EXISTS idx_sentence_patterns_sentence ON sentence_patterns(sentence_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_sentence_patterns_pattern ON sentence_patterns(pattern_id)")

    # Insert patterns
    print(f"Inserting {len(PATTERNS)} grammar patterns...")
    pattern_ids = {}

    for pattern in PATTERNS:
        cursor.execute("""
            INSERT INTO patterns (name, structure, description)
            VALUES (?, ?, ?)
        """, (pattern["name"], pattern["structure"], pattern["description"]))
        pattern_ids[pattern["name"]] = cursor.lastrowid

    # Load sentences
    cursor.execute("SELECT id, chinese FROM sentences")
    sentences = cursor.fetchall()
    print(f"Tagging {len(sentences)} sentences...")

    # Tag sentences
    tags_added = 0
    for sentence_id, chinese in sentences:
        for pattern in PATTERNS:
            if re.search(pattern["regex"], chinese):
                pattern_id = pattern_ids[pattern["name"]]
                cursor.execute("""
                    INSERT INTO sentence_patterns (sentence_id, pattern_id)
                    VALUES (?, ?)
                """, (sentence_id, pattern_id))
                tags_added += 1

    conn.commit()

    # Update pattern examples
    print("Adding example sentences to patterns...")
    for pattern_name, pattern_id in pattern_ids.items():
        cursor.execute("""
            SELECT s.chinese FROM sentences s
            JOIN sentence_patterns sp ON s.id = sp.sentence_id
            WHERE sp.pattern_id = ?
            LIMIT 1
        """, (pattern_id,))
        result = cursor.fetchone()
        if result:
            cursor.execute("UPDATE patterns SET example = ? WHERE id = ?", (result[0], pattern_id))

    conn.commit()

    # Stats
    print(f"\nTagging complete:")
    print(f"  Total tags added: {tags_added}")

    cursor.execute("""
        SELECT p.name, COUNT(sp.id) as cnt
        FROM patterns p
        LEFT JOIN sentence_patterns sp ON p.id = sp.pattern_id
        GROUP BY p.id
        ORDER BY cnt DESC
    """)
    print("\nPattern usage:")
    for name, count in cursor.fetchall():
        print(f"  {name}: {count} sentences")

    conn.close()
    print("\nDone!")

if __name__ == "__main__":
    main()
