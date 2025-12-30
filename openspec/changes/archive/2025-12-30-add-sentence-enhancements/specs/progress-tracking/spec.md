# progress-tracking Spec Deltas

## MODIFIED Requirements

### Requirement: User Preferences

The system SHALL store user preferences for daily limits, audio settings, **and sentence pinyin display preference**.

#### Scenario: Store pinyin preference

- **WHEN** a user toggles the sentence pinyin setting
- **THEN** the system persists the showSentencePinyin boolean in the settings table

#### Scenario: Retrieve pinyin preference

- **WHEN** loading sentence display components
- **THEN** the system returns showSentencePinyin setting (defaults to false)

