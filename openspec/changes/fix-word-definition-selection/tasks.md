## 1. Update Import Script

- [x] 1.1 Add `is_unsuitable_form()` to skip variant/archaic/surname forms
- [x] 1.2 Add `load_overrides()` to read manual corrections from JSON
- [x] 1.3 Update `select_best_form()` to check overrides first

## 2. Create Overrides File

- [x] 2.1 Create `data/word_overrides.json` with modal particle corrections
- [x] 2.2 Add overrides: 吧→ba, 吗→ma, 着→zhe, 啊→a

## 3. Re-import and Verify

- [x] 3.1 Run `python scripts/import_hsk_words.py` to re-import all words
- [x] 3.2 Verify modal particles: 吧=ba, 吗=ma, 着=zhe, 啊=a
- [x] 3.3 Verify "variant of" words fixed: 布=cloth, 草=grass, 船=boat, etc.
- [x] 3.4 Verify original fix still works: 没=méi (not mò)
