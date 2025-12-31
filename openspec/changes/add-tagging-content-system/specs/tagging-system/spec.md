# tagging-system Specification

## Purpose

Provide a flexible tagging system for organizing words and sentences with custom labels, enabling filtered learning sessions and content bookmarking.

## ADDED Requirements

### Requirement: Tag Storage

The system SHALL store tags with unique names and optional colors for visual distinction.

#### Scenario: Create tag

- **WHEN** user creates a tag with name "chinesepod"
- **THEN** the system stores the tag with a unique ID and creation timestamp

#### Scenario: Prevent duplicate tags

- **WHEN** user attempts to create a tag with an existing name
- **THEN** the system rejects the creation and returns the existing tag

#### Scenario: Delete tag

- **WHEN** user deletes a tag
- **THEN** the system removes the tag and all word/sentence associations

### Requirement: Word Tagging

The system SHALL allow associating multiple tags with each word.

#### Scenario: Add tag to word

- **WHEN** user adds a tag to a word
- **THEN** the system creates a word-tag association

#### Scenario: Remove tag from word

- **WHEN** user removes a tag from a word
- **THEN** the system deletes the word-tag association

#### Scenario: View word tags

- **WHEN** displaying a word
- **THEN** the system shows all associated tags as colored badges

### Requirement: Sentence Tagging

The system SHALL allow associating multiple tags with each sentence.

#### Scenario: Add tag to sentence

- **WHEN** user adds a tag to a sentence
- **THEN** the system creates a sentence-tag association

#### Scenario: Remove tag from sentence

- **WHEN** user removes a tag from a sentence
- **THEN** the system deletes the sentence-tag association

#### Scenario: Bookmark sentence

- **WHEN** user clicks bookmark icon on a sentence
- **THEN** the system opens a tag selector for quick tagging
- **AND** includes a "saved" tag option for easy bookmarking

### Requirement: Tag Filtering

The system SHALL filter words and sentences by selected tags using OR logic.

#### Scenario: Filter by single tag

- **WHEN** user selects tag "HSK1" for filtering
- **THEN** the system returns only words/sentences having the "HSK1" tag

#### Scenario: Filter by multiple tags

- **WHEN** user selects tags ["HSK1", "chinesepod"]
- **THEN** the system returns words/sentences having ANY of the selected tags (OR logic)

#### Scenario: No tag filter

- **WHEN** no tags are selected for filtering
- **THEN** the system returns all words/sentences (no filtering applied)

### Requirement: HSK Tag Migration

The system SHALL migrate existing HSK level data to tags.

#### Scenario: Create HSK tags

- **WHEN** migration runs
- **THEN** the system creates tags "HSK1", "HSK2", "HSK3"

#### Scenario: Associate existing words

- **WHEN** migration runs
- **THEN** the system associates each word with its corresponding HSK tag based on hskLevel column

### Requirement: Tag UI Components

The system SHALL provide reusable UI components for tag display and selection.

#### Scenario: Display tag badge

- **WHEN** rendering a tag
- **THEN** the system displays a colored pill with the tag name and optional remove button

#### Scenario: Select tags

- **WHEN** user opens tag selector
- **THEN** the system displays all available tags with checkboxes for multi-select
- **AND** allows creating new tags inline
