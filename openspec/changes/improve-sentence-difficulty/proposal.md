## Why

Example sentences in word dialogs aren't sorted by true difficulty:
- 6,088 sentences have `difficulty_score = 0.0` (all 100% HSK coverage)
- No differentiation between short simple sentences and long complex ones
- HSK 1 words show complex sentences like "我的电视机出故障了，所以我不得不拿去修"

## What Changes

- Calculate difficulty using sentence length, average HSK level, and non-HSK ratio
- Short sentences with HSK 1 words score lowest (appear first)
- Re-import sentences with new difficulty scores

## Impact

- Affected specs: vocabulary-data
- Affected code: `app/scripts/import_sentences.py`
