# Tasks

## Phase 1: Core Components

- [x] Create Tooltip component (`app/src/components/Tooltip.tsx`)
  - CSS-based hover tooltip using Tailwind group-hover
  - Props: children, content, disabled

- [x] Create TokenizedSentence component (`app/src/components/TokenizedSentence.tsx`)
  - Renders tokens with tooltips for known words
  - Skips tooltips for punctuation and unknown words
  - Supports word highlighting

## Phase 2: Data Layer

- [x] Add getWordsByHanziList query (`app/src/lib/db/queries.ts`)
  - Batch lookup words by hanzi list

- [x] Update sentences API endpoint (`app/src/app/api/words/[id]/sentences/route.ts`)
  - Return `{ sentences, tokenData }` response shape
  - Include pinyin and definition for each token

## Phase 3: Component Integration

- [x] Update SentenceCard component (`app/src/components/SentenceCard.tsx`)
  - Accept tokenData prop
  - Use TokenizedSentence when token data available

## Phase 4: Page Updates

- [x] Update Learn page (`app/src/app/learn/page.tsx`)
  - Handle new API response shape
  - Pass tokenData to SentenceCard

- [x] Update Words page modal (`app/src/app/words/page.tsx`)
  - Use TokenizedSentence for modal sentences

- [x] Update Patterns page (`app/src/app/patterns/page.tsx`)
  - Include tokenData in sentence fetches
  - Pass to SentenceCard

- [x] Update Review page (`app/src/app/review/page.tsx`)
  - Add tooltips to sentence card types

- [x] Update Practice page (`app/src/app/practice/page.tsx`)
  - Add tooltips to word bank tokens
