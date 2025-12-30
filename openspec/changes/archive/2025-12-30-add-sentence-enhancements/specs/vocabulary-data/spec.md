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

### Requirement: Sentence Pinyin Generation

The system SHALL generate pinyin with tone marks for all imported sentences.

#### Scenario: Generate sentence pinyin

- **WHEN** sentences are imported or pinyin is missing
- **THEN** the system generates pinyin using pypinyin library with tone marks (e.g., "wǒ hěn hǎo")

#### Scenario: Handle punctuation in pinyin

- **WHEN** a sentence contains Chinese punctuation
- **THEN** the system preserves punctuation in the pinyin output
