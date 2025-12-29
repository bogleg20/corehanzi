# vocabulary-data Specification

## Purpose
TBD - created by archiving change add-chinese-learning-mvp. Update Purpose after archive.
## Requirements
### Requirement: Word Storage

The system SHALL store Chinese vocabulary words with simplified hanzi, traditional characters, pinyin (tonal and numeric), definitions, HSK 3.0 level, part of speech, frequency rank, classifiers, and audio file path.

#### Scenario: Store HSK word

- **WHEN** a word is imported from hsk-complete.json
- **THEN** the system stores all metadata including traditional characters, multiple pinyin formats, POS, and classifiers

#### Scenario: Retrieve word by ID

- **WHEN** requesting a word by its ID
- **THEN** the system returns hanzi, traditional, pinyin, pinyin_numeric, definition, definitions array, hsk_level, pos, frequency, classifiers, and audio_path

### Requirement: Sentence Storage

The system SHALL store Chinese sentences with Chinese text, English translation, pinyin, difficulty score, audio path, and tokenized word array.

#### Scenario: Store filtered sentence

- **WHEN** a Tatoeba sentence passes the 80% HSK coverage filter
- **THEN** the system stores the sentence with its tokens, difficulty score, and generated pinyin

#### Scenario: Retrieve sentences for word

- **WHEN** requesting example sentences for a word
- **THEN** the system returns sentences containing that word, ordered by difficulty

### Requirement: Word-Sentence Linking

The system SHALL maintain links between words and sentences that contain them.

#### Scenario: Link sentence to words

- **WHEN** a sentence is imported
- **THEN** the system creates links to all HSK words found in its tokens

#### Scenario: Query sentences by word

- **WHEN** querying sentences for a specific word
- **THEN** the system returns all sentences linked to that word

### Requirement: Grammar Pattern Storage

The system SHALL store grammar patterns with name, structure template, example sentence, and description.

#### Scenario: Store pattern

- **WHEN** a grammar pattern is defined
- **THEN** the system stores it with structure (e.g., "A 比 B + adj") and example

#### Scenario: Tag sentence with pattern

- **WHEN** a sentence matches a grammar pattern rule
- **THEN** the system links the sentence to that pattern

### Requirement: HSK Data Import

The system SHALL provide a Python script to import vocabulary from hsk-complete.json, filtering to new HSK 3.0 levels 1-3.

#### Scenario: Import HSK 3.0 words

- **WHEN** running the HSK import script
- **THEN** the system parses hsk-complete.json, filters to new-1/new-2/new-3 levels, and inserts ~2,225 words with all metadata

#### Scenario: Handle multiple forms

- **WHEN** a word has multiple pronunciation forms (e.g., 啊 with tones a1/a2/a3)
- **THEN** the system stores the primary form and all meanings

### Requirement: Sentence Import

The system SHALL provide a Python script to import and filter Tatoeba sentences based on HSK vocabulary coverage.

#### Scenario: Import and filter sentences

- **WHEN** running the sentence import script
- **THEN** the system tokenizes with jieba, calculates HSK coverage, filters to 80%+, and inserts passing sentences

#### Scenario: Build word-sentence links

- **WHEN** sentences are imported
- **THEN** the system creates entries in sentence_words junction table

### Requirement: Audio Generation

The system SHALL generate TTS audio files for words and sentences using edge-tts.

#### Scenario: Generate word audio

- **WHEN** running the audio generation script
- **THEN** the system creates MP3 files for each HSK 1-3 word in public/audio/words/

#### Scenario: Generate sentence audio

- **WHEN** running the audio generation script
- **THEN** the system creates MP3 files for filtered sentences in public/audio/sentences/

