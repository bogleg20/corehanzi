# Proposal: Add Words Tab Pagination

## Problem

The Words tab currently only displays the first 50 words due to the API's default pagination limit. Users cannot browse the remaining ~2,175 HSK words (out of ~2,225 total across HSK 1-3).

## Solution

Add pagination controls to the Words page so users can navigate through all vocabulary words.

## Scope

- **API**: Return total count alongside word results for page calculation
- **Frontend**: Add pagination state, controls, and page-aware fetching

## Affected Specs

- `progress-tracking` - Modify Vocabulary Browser requirement to specify pagination behavior

## Files to Modify

- `/app/src/app/api/words/route.ts` - Return `{ words: [], total: N }` response format
- `/app/src/app/words/page.tsx` - Add pagination state and controls
