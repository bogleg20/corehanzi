## Context

Building a single-user Chinese learning web app optimized for eventual migration to React Native iOS. Data sources include complete HSK vocabulary (11.5k entries with HSK 3.0 levels) and Tatoeba sentence pairs (75k).

## Goals / Non-Goals

**Goals:**
- Import HSK 3.0 vocabulary (levels 1-3 for MVP, ~2,225 words)
- Link vocabulary with example sentences from Tatoeba
- Implement effective spaced repetition (SM-2 algorithm)
- Provide interactive exercises for active recall
- Track learning progress
- Generate audio pronunciation via TTS

**Non-Goals:**
- Multi-user support (single-user MVP)
- Authentication system
- Server deployment (local development only)
- Dialogue completion exercises (deferred)
- Handwriting practice (future)

## Decisions

### Data Source: hsk-complete.json
- **Why:** Comprehensive dataset with HSK 3.0 levels, definitions, traditional characters, multiple pinyin formats, POS, frequency, and classifiers. Eliminates need for CC-CEDICT lookup.
- **Source:** https://github.com/drkameleon/complete-hsk-vocabulary
- **Format:** JSON array with rich word objects

### Database: SQLite with Drizzle ORM
- **Why:** Simplest setup, no Docker/Postgres needed. Directly portable to React Native with better-sqlite3 → expo-sqlite migration path. Drizzle provides type-safe queries with minimal overhead.
- **Alternatives:** PostgreSQL (overkill for single-user), Prisma (heavier ORM), raw SQL (loses type safety).

### Data Pipeline: Python Scripts
- **Why:** jieba (Chinese tokenizer) and edge-tts are Python-native. One-time batch processing, not runtime dependency. JSON parsing is trivial.
- **Alternatives:** Node.js (less mature Chinese NLP tooling).

### Spaced Repetition: SM-2 Algorithm
- **Why:** Well-understood, proven effective (Anki uses it), simple to implement.
- **Alternatives:** SM-5/SM-17 (more complex, marginal gains), Leitner (less adaptive).

### Sentence Filtering: 80% HSK 1-3 Coverage
- **Why:** Ensures example sentences are comprehensible for learners. Allows some unknown words for context without overwhelming.
- **Alternatives:** 100% coverage (too restrictive), 50% (too many unknown words).

### HSK Version: New HSK 3.0
- **Why:** Current standard (2021+), more comprehensive vocabulary progression.
- **Levels for MVP:** new-1 (511), new-2 (755), new-3 (959) = 2,225 words total

## Data Model

```
words (
  id,
  hanzi,           -- simplified
  traditional,     -- traditional characters
  pinyin,          -- tonal pinyin (e.g., "nǐ hǎo")
  pinyin_numeric,  -- numeric tones (e.g., "ni3 hao3")
  definition,      -- primary meaning
  definitions,     -- JSON array of all meanings
  hsk_level,       -- 1-7 (new HSK 3.0)
  pos,             -- part of speech
  frequency,       -- frequency rank
  classifiers,     -- JSON array of measure words
  audio_path
)

sentences (id, chinese, english, difficulty_score, audio_path, tokens)
sentence_words (sentence_id, word_id)
patterns (id, name, structure, example, description)
sentence_patterns (sentence_id, pattern_id)
word_progress (word_id, ease_factor, interval, next_review, times_correct, times_seen)
```

## Risks / Trade-offs

- **Risk:** jieba tokenization may not perfectly match HSK word boundaries
  - Mitigation: Manual review of common mismatches, allow fuzzy matching

- **Risk:** Edge TTS rate limiting during batch generation
  - Mitigation: Add delays between requests, cache generated audio

- **Risk:** 75k Tatoeba sentences may yield fewer after 80% filter with larger vocabulary
  - Mitigation: Should actually improve coverage with 2,225 words vs 600

- **Risk:** 2,225 words is significantly more than original 600 plan
  - Mitigation: User can set daily limits; HSK 1 alone (511 words) is a reasonable starting point

## Open Questions

None blocking for MVP.
