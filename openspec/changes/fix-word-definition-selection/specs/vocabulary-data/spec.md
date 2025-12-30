## MODIFIED Requirements

### Requirement: HSK Data Import

The system SHALL provide a Python script to import vocabulary from hsk-complete.json, filtering to new HSK 3.0 levels 1-3.

#### Scenario: Import HSK 3.0 words

- **WHEN** running the HSK import script
- **THEN** the system parses hsk-complete.json, filters to new-1/new-2/new-3 levels, and inserts ~2,225 words with all metadata

#### Scenario: Handle multiple forms

- **WHEN** a word has multiple pronunciation forms (e.g., 没 with méi/mò)
- **THEN** the system selects the first form from source data (which is ordered by commonality)
- **AND** skips forms where the first meaning starts with "surname" or "archaic"
- **AND** stores the selected form's pinyin and definitions
