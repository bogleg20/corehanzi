# Proposal: add-words-audio-playback

## Summary
Add audio playback buttons to the Words tab, enabling users to hear word and sentence pronunciations directly from the vocabulary browser.

## Motivation
Audio support infrastructure already exists (AudioButton component, audio files, audioPath database fields) but the Words tab doesn't expose this functionality. Users should be able to hear pronunciations while browsing vocabulary.

## Scope
- Add audio buttons to WordCardCompact (main word grid)
- Add audio button to word detail modal (next to hanzi)
- Add audio buttons to example sentences in modal

## Out of Scope
- Audio generation (already exists)
- Settings for audio enable/disable (future enhancement)
- Audio for other pages (Learn, Review, Practice)

## Affected Capabilities
- vocabulary-data (modifying Word Detail Display requirement)

## Dependencies
None - builds on existing infrastructure

## Risks
None identified - straightforward UI integration
