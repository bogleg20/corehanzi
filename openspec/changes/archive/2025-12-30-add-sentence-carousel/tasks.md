## 1. Backend
- [x] 1.1 Update `getSentencesForWord()` in `queries.ts` to fetch 20 sentences instead of 5

## 2. Frontend Component
- [x] 2.1 Create `SentenceCarousel.tsx` component with:
  - Single-sentence display with slide transitions
  - Left/right arrow navigation buttons
  - Dot indicators (clickable)
  - Keyboard arrow key support
  - Auto-reset to first sentence when word changes

## 3. Learn Page Integration
- [x] 3.1 Remove `.slice(0, 2)` from sentence fetch in `learn/page.tsx`
- [x] 3.2 Replace sentence list rendering with `SentenceCarousel` component
- [x] 3.3 Pass required props (sentences, highlightWord, showPinyin, tokenData, onPinyinToggle)

## 4. Validation
- [ ] 4.1 Test with 0 sentences (should show nothing)
- [ ] 4.2 Test with 1 sentence (no navigation controls)
- [ ] 4.3 Test with multiple sentences (full carousel)
- [ ] 4.4 Test keyboard navigation (arrow keys)
- [ ] 4.5 Verify no overlap with fixed bottom buttons on mobile
