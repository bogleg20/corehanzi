# Tasks

## Backend

- [x] Add `getLearnedWordIds()` query function to return Set of learned word IDs (`app/src/lib/db/queries.ts`)
- [x] Create POST/DELETE endpoint at `/api/words/[id]/learned` to toggle learned status (`app/src/app/api/words/[id]/learned/route.ts`)
- [x] Add `learned` query param to words API for filtering (`app/src/app/api/words/route.ts`)

## Frontend

- [x] Add learned status filter buttons (All/Learned/Unlearned) to vocabulary browser header (`app/src/app/words/page.tsx`)
- [x] Add learned toggle button to word detail modal with visual indicator (`app/src/app/words/page.tsx`)
- [x] Wire up toggle to call learned API endpoint and refresh word list
