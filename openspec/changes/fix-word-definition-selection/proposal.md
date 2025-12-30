## Why

Words like 没 get imported with wrong primary definitions. The current scoring algorithm prioritizes number of meanings over HSK-appropriate usage, causing:
- 没 to show "mò/drowned" instead of "méi/not have"
- 44+ words to select "variant of X" forms instead of actual definitions
- Modal particles (吧, 吗, 着, 啊) to select wrong pronunciations

## What Changes

- Skip forms with "variant of", "old variant", or "euphemistic" in their meanings
- Add overrides file (`data/word_overrides.json`) for edge cases that can't be fixed automatically
- Prefer first suitable form with lowercase pinyin (common pronunciation)

## Impact

- Affected specs: vocabulary-data
- Affected code: `app/scripts/import_hsk_words.py`
- New file: `data/word_overrides.json`
- Fixed: ~50 words with wrong definitions
