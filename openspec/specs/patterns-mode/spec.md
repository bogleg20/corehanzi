# patterns-mode Specification

## Purpose
Grammar patterns browsing and learning interface for exploring Chinese grammar structures with example sentences.

## Requirements

### Requirement: Pattern Browsing

The system SHALL display all grammar patterns in a browsable grid with name, structure, and example.

#### Scenario: View patterns list

- **WHEN** user navigates to /patterns
- **THEN** the system displays all 26 grammar patterns in a 2-column grid
- **AND** each pattern card shows name, structure template, and curated example sentence

#### Scenario: Select pattern

- **WHEN** user clicks on a pattern card
- **THEN** the card highlights with a red border
- **AND** the page auto-scrolls to the detail panel below

### Requirement: Pattern Detail View

The system SHALL display detailed information and example sentences when a pattern is selected.

#### Scenario: Show pattern details

- **WHEN** a pattern is selected
- **THEN** the system displays the pattern name, structure, and description
- **AND** loads up to 10 example sentences containing that pattern

#### Scenario: Auto-scroll to detail

- **WHEN** a pattern is selected
- **THEN** the page smoothly scrolls to bring the detail panel into view

### Requirement: Pinyin Toggle

The system SHALL provide a toggle to show/hide pinyin on example sentences.

#### Scenario: Toggle pinyin visibility

- **WHEN** user clicks "Show Pinyin" / "Hide Pinyin" button
- **THEN** the system toggles pinyin display on all example sentences in the detail view

#### Scenario: Initialize pinyin setting

- **WHEN** pattern detail view loads
- **THEN** the pinyin toggle initializes from user's saved settings (showSentencePinyin)
