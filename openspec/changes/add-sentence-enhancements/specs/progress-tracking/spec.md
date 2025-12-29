# progress-tracking Spec Deltas

## MODIFIED Requirements

### Requirement: User Settings

The system SHALL store user preferences including daily word limit, audio enabled, streak count, last study date, **and sentence pinyin display preference**.

#### Scenario: Store pinyin preference

- **WHEN** a user toggles the sentence pinyin setting
- **THEN** the system persists the showSentencePinyin boolean in the settings table

#### Scenario: Retrieve pinyin preference

- **WHEN** loading sentence display components
- **THEN** the system returns showSentencePinyin setting (defaults to false)

### Requirement: Settings UI

The system SHALL provide a settings page with toggles for audio and **sentence pinyin display**.

#### Scenario: Toggle sentence pinyin

- **WHEN** a user toggles "Show pinyin on sentences" in settings
- **THEN** the system saves the preference and sentence cards reflect the change
