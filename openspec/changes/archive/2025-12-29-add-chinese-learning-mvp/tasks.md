## 1. Project Setup

- [x] 1.1 Initialize Next.js 14 app with TypeScript and App Router
- [x] 1.2 Configure Tailwind CSS
- [x] 1.3 Set up Drizzle ORM with better-sqlite3
- [x] 1.4 Create database schema (words, sentences, patterns, progress tables)
- [x] 1.5 Set up project structure (src/app, src/components, src/lib, scripts)

## 2. Data Pipeline

- [x] 2.1 Write HSK word importer from hsk-complete.json (scripts/import_hsk_words.py)
  - Parse JSON, filter to new-1, new-2, new-3 levels
  - Extract: simplified, traditional, pinyin, definitions, POS, frequency, classifiers
- [x] 2.2 Write Tatoeba sentence importer with jieba tokenization (scripts/import_sentences.py)
- [x] 2.3 Implement sentence difficulty scoring and 80% HSK coverage filter
- [x] 2.4 Build word-sentence links (sentence_words table)
- [x] 2.5 Write grammar pattern tagger for top 25 patterns (scripts/tag_patterns.py)
- [x] 2.6 Generate audio for HSK 1-3 words via edge-tts (scripts/generate_audio.py)
- [x] 2.7 Generate audio for filtered sentences
- [x] 2.8 Create orchestrator script (scripts/import_all.py)

## 3. Core UI Components

- [x] 3.1 Create Layout component with header and navigation
- [x] 3.2 Create WordCard component (hanzi, traditional, pinyin, definition, POS, audio)
- [x] 3.3 Create SentenceCard component (chinese, english, audio)
- [x] 3.4 Create AudioButton component with playback
- [x] 3.5 Create ProgressBar component

## 4. Learn Mode

- [x] 4.1 Create /learn page with word queue
- [x] 4.2 Implement new word selection logic (daily limit, HSK order)
- [x] 4.3 Display word with example sentences
- [x] 4.4 Add self-grading UI ("Got it" / "Missed it")
- [x] 4.5 Initialize word_progress records on first view

## 5. Review Mode

- [x] 5.1 Implement SM-2 algorithm (src/lib/srs/sm2.ts)
- [x] 5.2 Create /review page with due card queue
- [x] 5.3 Implement card type: Word → Definition
- [x] 5.4 Implement card type: Definition → Word
- [x] 5.5 Implement card type: Sentence translation
- [x] 5.6 Implement card type: Cloze deletion
- [x] 5.7 Add quality rating UI (Again/Hard/Good/Easy)
- [x] 5.8 Update progress after each review

## 6. Practice Mode

- [x] 6.1 Create /practice page
- [x] 6.2 Implement Build-a-Sentence exercise component
- [x] 6.3 Add word arrangement UI (click-to-order)
- [x] 6.4 Validate user answer against tokenized sentence
- [x] 6.5 Show feedback on correct/incorrect

## 7. Progress Dashboard

- [x] 7.1 Create dashboard page (/) with stats summary
- [x] 7.2 Display words learned by HSK level (progress bars)
- [x] 7.3 Show today's stats (new words, reviews completed)
- [x] 7.4 Display review streak
- [x] 7.5 Show upcoming reviews count

## 8. Browse & Reference

- [x] 8.1 Create /words page with vocabulary list
- [x] 8.2 Add HSK level filter (1-3)
- [x] 8.3 Add search by hanzi, pinyin, or English
- [x] 8.4 Create /patterns page with grammar reference
- [x] 8.5 Display pattern examples and linked sentences

## 9. Settings

- [x] 9.1 Create /settings page
- [x] 9.2 Add daily new word limit preference
- [x] 9.3 Add audio on/off toggle
- [x] 9.4 Store preferences in SQLite database
