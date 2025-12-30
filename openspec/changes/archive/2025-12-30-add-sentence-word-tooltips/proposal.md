## Why

When viewing Chinese sentences, learners cannot quickly check the meaning or pronunciation of unfamiliar words without leaving the current context. This breaks the learning flow and makes sentence comprehension harder.

## What Changes

- Add word-level tooltips to all sentence displays
- Hovering over a word shows its pinyin and definition
- Works across all pages: Learn, Review, Practice, Words, Patterns

## Impact

- New spec: sentence-display (shared UI capability)
- Affected code: SentenceCard component, API endpoints, page components
- New components: Tooltip, TokenizedSentence
