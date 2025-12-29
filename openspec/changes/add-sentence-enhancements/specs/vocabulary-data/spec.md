# vocabulary-data Spec Deltas

## MODIFIED Requirements

### Requirement: Sentence Storage

The system SHALL store Chinese sentences with Chinese text, English translation, **pinyin**, difficulty score, audio path, and tokenized word array.

#### Scenario: Store sentence with pinyin

- **WHEN** pinyin is generated for a sentence
- **THEN** the system stores the space-separated pinyin string in the pinyin field

#### Scenario: Retrieve sentence with pinyin

- **WHEN** requesting a sentence
- **THEN** the system returns chinese, english, pinyin, difficultyScore, audioPath, and tokens

### Requirement: Pinyin Generation

The system SHALL provide a Python script to generate pinyin for all sentences using the pypinyin library.

#### Scenario: Generate pinyin for sentences

- **WHEN** running the pinyin generation script
- **THEN** the system converts each sentence's Chinese text to space-separated tonal pinyin and updates the database

#### Scenario: Handle punctuation in pinyin

- **WHEN** a sentence contains Chinese punctuation
- **THEN** the system preserves punctuation in the pinyin output
