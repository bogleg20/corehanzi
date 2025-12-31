# content-management Specification

## Purpose

Enable users to add and edit custom vocabulary words and sentences, with duplicate detection, automatic pinyin generation, and auto-translation.

## ADDED Requirements

### Requirement: Add Content Page

The system SHALL provide a dedicated page at `/add` for adding words and sentences.

#### Scenario: Navigate to add page

- **WHEN** user clicks "Add" in navigation
- **THEN** the system displays the content management page with tabs for Manual and OCR Import

#### Scenario: Switch input mode

- **WHEN** user clicks a tab (Manual/OCR Import)
- **THEN** the system displays the corresponding input form

### Requirement: Auto-detect Content Type

The system SHALL automatically detect whether input is a word or sentence.

#### Scenario: Detect word

- **WHEN** user enters Chinese text with 1-4 characters and no sentence-ending punctuation
- **THEN** the system classifies it as a "Word"
- **AND** displays a blue "Word" badge

#### Scenario: Detect sentence

- **WHEN** user enters Chinese text with 5+ characters OR with sentence-ending punctuation (。！？)
- **THEN** the system classifies it as a "Sentence"
- **AND** displays a green "Sentence" badge

#### Scenario: Save to correct table

- **WHEN** user submits content
- **THEN** the system saves to `/api/words` for words or `/api/sentences` for sentences based on detected type

### Requirement: Add Word

The system SHALL allow adding new vocabulary words with required and optional fields.

#### Scenario: Add word with required fields

- **WHEN** user submits word with hanzi and definition
- **THEN** the system creates the word record
- **AND** auto-generates pinyin if not provided

#### Scenario: Add word with all fields

- **WHEN** user submits word with hanzi, traditional, pinyin, definition, part of speech, and tags
- **THEN** the system creates the word record with all metadata

#### Scenario: Detect duplicate word

- **WHEN** user enters hanzi that already exists
- **THEN** the system shows a warning with the existing word
- **AND** offers to edit the existing word instead

### Requirement: Edit Word

The system SHALL allow editing existing vocabulary words.

#### Scenario: Edit word fields

- **WHEN** user modifies word fields and saves
- **THEN** the system updates the word record

#### Scenario: Edit word tags

- **WHEN** user adds or removes tags from a word
- **THEN** the system updates the word-tag associations

### Requirement: Add Sentence

The system SHALL allow adding new sentences with required and optional fields.

#### Scenario: Add sentence with required fields

- **WHEN** user submits sentence with Chinese text and English translation
- **THEN** the system creates the sentence record
- **AND** auto-generates pinyin
- **AND** tokenizes and links to existing vocabulary words

#### Scenario: Add sentence with tags

- **WHEN** user submits sentence with tags
- **THEN** the system creates sentence-tag associations

#### Scenario: Detect duplicate sentence

- **WHEN** user enters Chinese text that already exists
- **THEN** the system shows a warning with the existing sentence
- **AND** offers to edit the existing sentence instead

### Requirement: Edit Sentence

The system SHALL allow editing existing sentences.

#### Scenario: Edit sentence fields

- **WHEN** user modifies sentence fields and saves
- **THEN** the system updates the sentence record

#### Scenario: Re-tokenize edited sentence

- **WHEN** user modifies the Chinese text of a sentence
- **THEN** the system re-tokenizes and updates word links

### Requirement: Pinyin Generation

The system SHALL auto-generate pinyin with tone marks for Chinese text.

#### Scenario: Generate word pinyin

- **WHEN** user clicks "Generate Pinyin" for a word
- **THEN** the system generates pinyin using pinyin-pro library

#### Scenario: Generate sentence pinyin

- **WHEN** user clicks "Generate Pinyin" for a sentence
- **THEN** the system generates space-separated pinyin for the full sentence

#### Scenario: Manual pinyin override

- **WHEN** user provides custom pinyin
- **THEN** the system uses the user-provided pinyin instead of auto-generated

### Requirement: English Translation Generation

The system SHALL auto-generate English translations for Chinese text using Google Translate.

#### Scenario: Generate word definition

- **WHEN** user clicks "Generate" button next to English field for a word
- **THEN** the system calls `/api/translate` with the Chinese text
- **AND** populates the English field with the translation

#### Scenario: Generate sentence translation

- **WHEN** user clicks "Generate" button next to English field for a sentence
- **THEN** the system calls `/api/translate` with the Chinese text
- **AND** populates the English field with the translation

#### Scenario: Manual translation override

- **WHEN** user provides custom English translation
- **THEN** the system uses the user-provided translation instead of auto-generated
