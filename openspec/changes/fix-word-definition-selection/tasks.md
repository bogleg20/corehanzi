## 1. Update Import Script

- [x] 1.1 Replace `select_best_form()` with simplified first-suitable-form logic
- [x] 1.2 Add lowercase pinyin preference (common pronunciation over proper nouns)

## 2. Re-import Data

- [x] 2.1 Run `python scripts/import_hsk_words.py` to re-import all words
- [x] 2.2 Verify 没 shows méi/not have (not mò/drowned)
- [x] 2.3 Spot-check other words: 中 now shows zhōng/within (not Zhōng/China)

## Notes

- 吧 still shows bā (bar) instead of ba (modal particle) - both are lowercase so can't distinguish by case
- Could add overrides file for edge cases in future iteration
