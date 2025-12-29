## Why

Build an MVP Chinese learning web app to teach Mandarin vocabulary (new HSK 3.0 levels 1-3, ~2,225 words) through spaced repetition flashcards, example sentences, and interactive exercises. This is a greenfield project with existing data files (complete HSK vocabulary JSON, Tatoeba sentences).

## What Changes

- **NEW** Data pipeline to import HSK vocabulary from hsk-complete.json and Tatoeba sentences
- **NEW** SQLite database with Drizzle ORM for words, sentences, patterns, and progress
- **NEW** Learn mode for introducing new vocabulary with example sentences
- **NEW** Review mode with SM-2 spaced repetition algorithm
- **NEW** Practice mode with build-a-sentence exercises
- **NEW** Progress tracking dashboard with statistics
- **NEW** Browse pages for vocabulary and grammar patterns

## Impact

- Affected specs: vocabulary-data, learn-mode, review-mode, practice-mode, progress-tracking (all new)
- Affected code: Entire application (greenfield)
- Tech stack: Next.js 14 + TypeScript + SQLite + Tailwind CSS

## Data Source

Using [complete-hsk-vocabulary](https://github.com/drkameleon/complete-hsk-vocabulary) dataset (`data/hsk-complete.json`) which includes:
- 11,494 total entries covering HSK 3.0 and HSK 2012
- New HSK 3.0 levels: 1 (511), 2 (755), 3 (959), 4 (972), 5 (1061), 6 (1126), 7+ (5609)
- Rich metadata: traditional characters, multiple pinyin formats, part of speech, frequency, classifiers
- No external dictionary lookup needed (definitions included)
