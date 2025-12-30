## Why

The word detail dialog in the vocabulary browser shows raw part-of-speech codes (e.g., "a") instead of readable labels ("adjective"), and lacks example sentences which would help learners understand word usage in context.

## What Changes

- Display full part-of-speech names instead of codes in word detail dialog
- Show up to 3 example sentences for the selected word
- Add pinyin show/hide toggle for example sentences in the dialog

## Impact

- Affected specs: vocabulary-data
- Affected code: `app/src/app/words/page.tsx`
