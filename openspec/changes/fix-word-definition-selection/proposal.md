## Why

Words like 没 get imported with wrong primary definitions. The current scoring algorithm prioritizes number of meanings over HSK-appropriate usage, causing 没 to show "mò/drowned" (4 meanings) instead of "méi/not have" (1 meaning). This affects ~226 words.

## What Changes

- Simplify `select_best_form()` to always use the first form from source data (which is already ordered by commonality)
- Only skip forms that are surname-only or archaic
- Remove complex scoring logic that causes wrong selections

## Impact

- Affected specs: vocabulary-data
- Affected code: `app/scripts/import_hsk_words.py`
