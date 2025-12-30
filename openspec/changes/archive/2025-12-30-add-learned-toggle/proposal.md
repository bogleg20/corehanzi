# add-learned-toggle

## Summary
Add manual learned status toggle and filter controls to the vocabulary browser, allowing users to mark words as mastered and filter the word list by learned status.

## Motivation
Currently, words are only marked as learned through the spaced repetition system (learn/review flow). Users may already know certain words and want to mark them as mastered directly from the vocabulary browser without going through the learning flow.

## Scope
- Add toggle button in word detail modal to mark/unmark words as learned
- Add filter buttons (All / Learned / Unlearned) to vocabulary browser header
- Create API endpoint for toggling learned status
- Extend words API to support filtering by learned status

## Affected Specs
- `progress-tracking` - Adds new requirements for manual learning toggle and learned status filtering
