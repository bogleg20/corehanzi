## MODIFIED Requirements

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
