## ADDED Requirements

### Requirement: Word Detail Display

The system SHALL display word details in a dialog with readable part-of-speech labels and example sentences.

#### Scenario: Display part-of-speech labels

- **WHEN** a word detail dialog is opened
- **THEN** the system displays full part-of-speech names (e.g., "adjective", "noun, verb") instead of codes (e.g., "a", "n,v")

#### Scenario: Display example sentences

- **WHEN** a word detail dialog is opened
- **THEN** the system displays up to 3 example sentences containing that word
- **AND** each sentence shows Chinese text, English translation, and optionally pinyin

#### Scenario: Toggle sentence pinyin

- **WHEN** viewing example sentences in the word detail dialog
- **THEN** the user can toggle pinyin visibility on/off for all sentences in the dialog
