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

The system SHALL store Chinese sentences with Chinese text, English translation, **pinyin**, difficulty score, audio path, and tokenized word array.

#### Scenario: Store sentence with pinyin

- **WHEN** pinyin is generated for a sentence
- **THEN** the system stores the space-separated pinyin string in the pinyin field

#### Scenario: Retrieve sentence with pinyin

- **WHEN** requesting a sentence
- **THEN** the system returns chinese, english, pinyin, difficultyScore, audioPath, and tokens

### Requirement: Word-Sentence Linking

The system SHALL maintain links between words and sentences that contain them.

#### Scenario: Link sentence to words

- **WHEN** a sentence is imported
- **THEN** the system creates links to all HSK words found in its tokens

#### Scenario: Query sentences by word

- **WHEN** querying sentences for a specific word
- **THEN** the system returns all sentences linked to that word

### Requirement: Grammar Pattern Storage

The system SHALL store grammar patterns with name, structure template, example sentence (6-25 characters that demonstrates the full structure), and description.

#### Scenario: Store pattern

- **WHEN** a grammar pattern is defined
- **THEN** the system stores it with structure (e.g., "A 比 B + adj"), example_regex for validation, and example

#### Scenario: Select pattern example

- **WHEN** selecting an example sentence for a grammar pattern
- **THEN** the system selects the shortest sentence (6-25 characters) that matches the pattern's example_regex
- **AND** the example_regex validates the sentence demonstrates the full structure (e.g., `.+是.+` for "A 是 B")
- **AND** if no valid sentences exist, no example is set

#### Scenario: Tag sentence with pattern

- **WHEN** a sentence matches a grammar pattern rule
- **THEN** the system links the sentence to that pattern

### Requirement: Sentence Pinyin Generation

The system SHALL generate pinyin with tone marks for all imported sentences.

#### Scenario: Generate sentence pinyin

- **WHEN** sentences are imported or pinyin is missing
- **THEN** the system generates pinyin using pypinyin library with tone marks (e.g., "wǒ hěn hǎo")

#### Scenario: Handle punctuation in pinyin

- **WHEN** a sentence contains Chinese punctuation
- **THEN** the system preserves punctuation in the pinyin output

### Requirement: HSK Data Import

The system SHALL provide a Python script to import vocabulary from hsk-complete.json, filtering to new HSK 3.0 levels 1-3.

#### Scenario: Import HSK 3.0 words

- **WHEN** running the HSK import script
- **THEN** the system parses hsk-complete.json, filters to new-1/new-2/new-3 levels, and inserts ~2,225 words with all metadata

#### Scenario: Handle multiple forms

- **WHEN** a word has multiple pronunciation forms (e.g., 没 with méi/mò)
- **THEN** the system checks `data/word_overrides.json` for manual corrections first
- **AND** skips forms where the meaning contains "variant of", "old variant", "surname ", or "(archaic)"
- **AND** prefers the first remaining form with lowercase pinyin (common pronunciation)
- **AND** stores the selected form's pinyin and definitions

#### Scenario: Override form selection

- **WHEN** a word is listed in `data/word_overrides.json` with a specific pinyin
- **THEN** the system selects the form matching that pinyin
- **AND** uses the override to fix edge cases like modal particles (吧→ba, 吗→ma)

### Requirement: Sentence Import

The system SHALL provide a Python script to import and filter Tatoeba sentences based on HSK vocabulary coverage.

#### Scenario: Import and filter sentences

- **WHEN** running the sentence import script
- **THEN** the system tokenizes with jieba, calculates HSK coverage, filters to 80%+, and inserts passing sentences

#### Scenario: Calculate sentence difficulty

- **WHEN** importing a sentence
- **THEN** the system calculates difficulty score based on:
  - Sentence length (shorter = easier, 40% weight)
  - Average HSK level of words (lower = easier, 40% weight)
  - Non-HSK word ratio (lower = easier, 20% weight)
- **AND** stores the combined score so simpler sentences appear first in word dialogs

### Requirement: Audio Generation

The system SHALL generate TTS audio files for words and sentences using edge-tts.

#### Scenario: Generate word audio

- **WHEN** running the audio generation script
- **THEN** the system creates MP3 files for each HSK 1-3 word in public/audio/words/

#### Scenario: Generate sentence audio

- **WHEN** running the audio generation script
- **THEN** the system creates MP3 files for filtered sentences in public/audio/sentences/

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

### Requirement: Word Card Audio

The system SHALL display audio playback buttons on word cards in the vocabulary browser.

#### Scenario: Audio button on compact word card

- **WHEN** viewing the word grid on the Words page
- **AND** a word has an audio file
- **THEN** the system displays a small audio button on the word card
- **AND** clicking the button plays the word pronunciation without opening the detail modal

