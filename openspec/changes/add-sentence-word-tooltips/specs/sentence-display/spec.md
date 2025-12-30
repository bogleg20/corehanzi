# sentence-display Specification

## Purpose

Shared UI capability for displaying Chinese sentences with interactive word tooltips.

## ADDED Requirements

### Requirement: Word Tooltips

The system SHALL display word-level tooltips when hovering over words in Chinese sentences.

#### Scenario: Hover over known word

- **WHEN** the user hovers over a word that exists in the vocabulary database
- **THEN** the system displays a tooltip showing the word's pinyin and primary definition

#### Scenario: Hover over unknown word

- **WHEN** the user hovers over a word not in the vocabulary database
- **THEN** the system does not display a tooltip for that word

#### Scenario: Hover over punctuation

- **WHEN** the user hovers over Chinese punctuation (，。？！、；：""''（）【】…—)
- **THEN** the system does not display a tooltip

### Requirement: Tokenized Sentence Rendering

The system SHALL render sentences as individual word tokens to enable per-word interactions.

#### Scenario: Render sentence with tokens

- **WHEN** a sentence is displayed and token data is available
- **THEN** the system renders each token as a separate element with hover capability

#### Scenario: Highlight target word

- **WHEN** a sentence is displayed with a highlight word specified
- **THEN** the system highlights that word visually while still enabling tooltips on all words

### Requirement: Token Data API

The system SHALL provide word lookup data alongside sentence responses.

#### Scenario: Fetch sentences with token data

- **WHEN** requesting sentences for a word via API
- **THEN** the response includes a tokenData map with pinyin and definition for each known token

#### Scenario: Deduplicate token lookups

- **WHEN** multiple sentences share common tokens
- **THEN** the tokenData map contains each unique token only once
