## 1. Part-of-Speech Display

- [x] 1.1 Add `posLabels` mapping and `formatPos()` function to words/page.tsx
- [x] 1.2 Update dialog to use `formatPos(selectedWord.pos)` instead of raw code

## 2. Example Sentences

- [x] 2.1 Add state for sentences, loading state, and pinyin toggle
- [x] 2.2 Add useEffect to fetch sentences when word is selected (limit to 3)
- [x] 2.3 Add sentences section UI to dialog with Chinese, pinyin, and English
- [x] 2.4 Add pinyin toggle button in sentences section header

## 3. Testing

- [x] 3.1 Verify POC codes display as full names (e.g., "n,v" → "noun, verb")
- [x] 3.2 Verify sentences load and display correctly
- [x] 3.3 Verify pinyin toggle works for sentence pinyin
