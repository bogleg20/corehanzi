## Why

Users currently see only 2 example sentences per word in Learn mode, limiting exposure to usage patterns. Increasing to 20 sentences with carousel navigation provides richer context without overwhelming the interface.

## What Changes

- Backend: Increase sentence fetch limit from 5 to 20
- Frontend: Remove 2-sentence slice, display all fetched sentences
- UI: Add carousel component for seamless sentence navigation (one at a time with arrows and dots)

## Impact

- Affected specs: learn-mode (Word Presentation requirement)
- Affected code:
  - `app/src/lib/db/queries.ts` - sentence limit
  - `app/src/app/learn/page.tsx` - sentence display logic
  - `app/src/components/SentenceCarousel.tsx` - new component
