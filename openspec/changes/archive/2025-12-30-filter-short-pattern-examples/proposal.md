# filter-short-pattern-examples

## Summary

Filter grammar pattern example sentences to short, single-line sentences (≤50 characters) instead of including long paragraphs.

## Problem

The current `tag_patterns.py` script selects the first matching sentence for each grammar pattern without any length filtering. This results in some patterns displaying very long multi-sentence paragraphs as examples (e.g., 168+ characters), making the UI cluttered and the examples less useful for learning.

## Solution

Modify the example selection query in `tag_patterns.py` to:
1. Filter sentences to those ≤50 characters
2. Order by length ascending to prefer shorter, more concise examples

## Scope

- **File**: `app/scripts/tag_patterns.py`
- **Capability**: vocabulary-data (Grammar Pattern Storage requirement)

## Impact

- Improves readability of grammar pattern cards in the UI
- Provides more appropriate example sentences for language learning
- Requires re-running the import script to update existing data
