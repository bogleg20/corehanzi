#!/usr/bin/env python3
"""
Master orchestrator script to run all data import steps.
"""

import subprocess
import sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).parent

def run_script(name: str, description: str):
    """Run a Python script and handle errors."""
    script_path = SCRIPTS_DIR / name
    print(f"\n{'='*60}")
    print(f"Step: {description}")
    print(f"{'='*60}")

    result = subprocess.run([sys.executable, str(script_path)], cwd=SCRIPTS_DIR.parent)

    if result.returncode != 0:
        print(f"\nError: {name} failed with exit code {result.returncode}")
        sys.exit(1)

def main():
    print("Chinese Learning App - Data Import Pipeline")
    print("=" * 60)

    # Step 1: Import HSK words
    run_script("import_hsk_words.py", "Import HSK 1-3 vocabulary from hsk-complete.json")

    # Step 2: Import sentences
    run_script("import_sentences.py", "Import Tatoeba sentences with HSK coverage filtering")

    # Step 3: Tag patterns
    run_script("tag_patterns.py", "Tag sentences with grammar patterns")

    # Step 4: Generate audio (optional - can be slow)
    print(f"\n{'='*60}")
    print("Step: Audio generation")
    print("=" * 60)
    print("Audio generation can take a long time.")
    print("Run 'python scripts/generate_audio.py' separately if needed.")

    print(f"\n{'='*60}")
    print("Data import complete!")
    print("=" * 60)
    print("\nNext steps:")
    print("  1. Run 'npm run dev' to start the development server")
    print("  2. (Optional) Run 'python scripts/generate_audio.py' for TTS audio")

if __name__ == "__main__":
    main()
