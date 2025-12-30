## MODIFIED Requirements

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
