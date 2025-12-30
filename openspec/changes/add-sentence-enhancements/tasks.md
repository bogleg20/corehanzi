# Tasks

## Phase 1: Schema & Data Generation

- [x] Add `pinyin` field to sentences table in schema.ts
- [x] Add `showSentencePinyin` setting to settings table in schema.ts
- [x] Run `drizzle-kit push` to update database schema
- [x] Create `scripts/generate_pinyin.py` using pypinyin library
- [x] Run pinyin generation script to populate all sentences

## Phase 2: UI Components

- [x] Update SentenceCard component to accept `showPinyin` prop
- [x] Display pinyin line (red text) below Chinese when enabled
- [x] Update SentenceCardInteractive with same pinyin support

## Phase 3: Settings Integration

- [x] Add pinyin toggle to Settings page UI
- [x] Update settings API route to handle showSentencePinyin
- [x] Update queries.ts with new setting field

## Phase 4: Wire Up to Pages

- [x] Update Learn page to fetch settings and pass showPinyin to SentenceCard
- [x] Update Review page to pass showPinyin to sentence cards
- [x] Update Patterns page to pass showPinyin to SentenceCard

## Phase 5: Audio Generation

- [x] Run existing generate_audio.py script (generates first 500 sentences)
- [x] Verify audio files created in public/audio/sentences/ (500 files)
- [x] Verify audio files created in public/audio/words/ (2225 files)

## Validation

- [x] Build passes without errors
- [x] Settings toggle persists and affects sentence display
- [x] Pinyin displays correctly on Learn, Review, and Patterns pages
- [x] Audio files generated for words and sentences
