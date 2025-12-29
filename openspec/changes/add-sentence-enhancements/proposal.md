# Proposal: Add Sentence Pinyin Display and TTS Audio

## Summary

Enhance example sentences with optional pinyin display and pre-generated TTS audio. Users can toggle pinyin visibility in settings.

## Motivation

Currently, sentences only show Chinese text and English translation. Learners benefit from:
- **Pinyin**: Helps with pronunciation, especially for intermediate learners who can't yet read all characters
- **Audio**: Provides correct pronunciation model and listening practice

## Scope

### In Scope
- Add `pinyin` field to sentences table and generate pinyin for all sentences
- Add `showSentencePinyin` user setting with toggle in Settings page
- Update SentenceCard component to optionally display pinyin below Chinese text
- Generate TTS audio for first 500 sentences (more can be generated later)

### Out of Scope
- Ruby annotation (pinyin above each character) - user chose line-below style
- Real-time browser TTS - user chose pre-generated files
- Audio for all 14,587 sentences - limited to 500 for initial iteration

## Affected Capabilities

| Capability | Change Type | Description |
|------------|-------------|-------------|
| vocabulary-data | MODIFIED | Add pinyin field to sentences, pinyin generation script |
| progress-tracking | MODIFIED | Add showSentencePinyin setting |

## Dependencies

- pypinyin Python library for pinyin generation
- Existing edge-tts setup for audio generation

## Risks

- **Low**: pypinyin may produce incorrect pinyin for rare characters or names
  - Mitigation: Accept library defaults; manual correction not needed for MVP
