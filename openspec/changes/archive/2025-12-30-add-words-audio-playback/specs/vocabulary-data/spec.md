# vocabulary-data Spec Delta

## MODIFIED Requirements

### Requirement: Word Detail Display

The system SHALL display word details in a dialog with readable part-of-speech labels, example sentences, **and audio playback for words and sentences**.

#### Scenario: Play word audio

- **WHEN** a word card or word detail modal is displayed
- **AND** the word has an audio file
- **THEN** the system displays an audio button
- **AND** clicking the button plays the word pronunciation

#### Scenario: Play sentence audio

- **WHEN** example sentences are displayed in the word detail modal
- **AND** a sentence has an audio file
- **THEN** the system displays an audio button for that sentence
- **AND** clicking the button plays the sentence audio

## ADDED Requirements

### Requirement: Word Card Audio

The system SHALL display audio playback buttons on word cards in the vocabulary browser.

#### Scenario: Audio button on compact word card

- **WHEN** viewing the word grid on the Words page
- **AND** a word has an audio file
- **THEN** the system displays a small audio button on the word card
- **AND** clicking the button plays the word pronunciation without opening the detail modal
