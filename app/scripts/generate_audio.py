#!/usr/bin/env python3
"""
Generate TTS audio for HSK words and sentences using edge-tts.
"""

import asyncio
import sqlite3
import hashlib
from pathlib import Path

try:
    import edge_tts
except ImportError:
    print("Please install edge-tts: pip install edge-tts")
    exit(1)

DB_FILE = Path(__file__).parent.parent / "chinese.db"
AUDIO_DIR = Path(__file__).parent.parent / "public" / "audio"
WORDS_AUDIO_DIR = AUDIO_DIR / "words"
SENTENCES_AUDIO_DIR = AUDIO_DIR / "sentences"

# Chinese voice
VOICE = "zh-CN-XiaoxiaoNeural"

# Rate limiting
DELAY_BETWEEN_REQUESTS = 0.5  # seconds

async def generate_audio(text: str, output_path: Path) -> bool:
    """Generate audio for text using edge-tts."""
    try:
        communicate = edge_tts.Communicate(text, VOICE)
        await communicate.save(str(output_path))
        return True
    except Exception as e:
        print(f"  Error generating audio for '{text}': {e}")
        return False

def get_audio_filename(text: str) -> str:
    """Generate a safe filename from text using hash."""
    hash_val = hashlib.md5(text.encode()).hexdigest()[:12]
    return f"{hash_val}.mp3"

async def main():
    # Create directories
    WORDS_AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    SENTENCES_AUDIO_DIR.mkdir(parents=True, exist_ok=True)

    print(f"Connecting to database at {DB_FILE}...")
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Generate word audio
    print("\n=== Generating word audio ===")
    cursor.execute("SELECT id, hanzi FROM words WHERE audio_path IS NULL")
    words = cursor.fetchall()
    print(f"Words to process: {len(words)}")

    for i, (word_id, hanzi) in enumerate(words):
        filename = get_audio_filename(hanzi)
        output_path = WORDS_AUDIO_DIR / filename
        relative_path = f"/audio/words/{filename}"

        if output_path.exists():
            # Already generated, just update path
            cursor.execute("UPDATE words SET audio_path = ? WHERE id = ?", (relative_path, word_id))
            continue

        success = await generate_audio(hanzi, output_path)
        if success:
            cursor.execute("UPDATE words SET audio_path = ? WHERE id = ?", (relative_path, word_id))

        if (i + 1) % 50 == 0:
            print(f"  Processed {i + 1}/{len(words)} words...")
            conn.commit()

        await asyncio.sleep(DELAY_BETWEEN_REQUESTS)

    conn.commit()
    print(f"Word audio complete!")

    # Generate sentence audio
    print("\n=== Generating sentence audio ===")
    cursor.execute("SELECT id, chinese FROM sentences WHERE audio_path IS NULL LIMIT 500")  # Limit for initial run
    sentences = cursor.fetchall()
    print(f"Sentences to process: {len(sentences)}")

    for i, (sentence_id, chinese) in enumerate(sentences):
        filename = get_audio_filename(chinese)
        output_path = SENTENCES_AUDIO_DIR / filename
        relative_path = f"/audio/sentences/{filename}"

        if output_path.exists():
            cursor.execute("UPDATE sentences SET audio_path = ? WHERE id = ?", (relative_path, sentence_id))
            continue

        success = await generate_audio(chinese, output_path)
        if success:
            cursor.execute("UPDATE sentences SET audio_path = ? WHERE id = ?", (relative_path, sentence_id))

        if (i + 1) % 50 == 0:
            print(f"  Processed {i + 1}/{len(sentences)} sentences...")
            conn.commit()

        await asyncio.sleep(DELAY_BETWEEN_REQUESTS)

    conn.commit()

    # Stats
    cursor.execute("SELECT COUNT(*) FROM words WHERE audio_path IS NOT NULL")
    words_with_audio = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM sentences WHERE audio_path IS NOT NULL")
    sentences_with_audio = cursor.fetchone()[0]

    print(f"\n=== Audio generation complete ===")
    print(f"  Words with audio: {words_with_audio}")
    print(f"  Sentences with audio: {sentences_with_audio}")

    conn.close()

if __name__ == "__main__":
    asyncio.run(main())
