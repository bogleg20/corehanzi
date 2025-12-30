# Tasks: add-words-audio-playback

## Implementation Tasks

- [x] Add AudioButton to WordCardCompact component
  - File: `app/src/components/WordCard.tsx`
  - Add small audio button in the action row (next to learned toggle)
  - Conditionally render if `word.audioPath` exists
  - Use `size="sm"` for compact layout

- [x] Add AudioButton to word detail modal
  - File: `app/src/app/words/page.tsx`
  - Import AudioButton component
  - Add button next to hanzi character in modal
  - Conditionally render if `selectedWord.audioPath` exists
  - Use `size="lg"` for modal visibility

- [x] Add AudioButton to example sentences
  - File: `app/src/app/words/page.tsx`
  - Add small audio button at start of each sentence block
  - Conditionally render if `sentence.audioPath` exists
  - Use `size="sm"` to fit sentence layout

## Validation
- [ ] Manual test: Browse Words tab, verify audio buttons on word cards
- [ ] Manual test: Open word modal, verify audio button next to hanzi
- [ ] Manual test: Verify audio buttons on example sentences
- [ ] Verify audio playback works for words and sentences
