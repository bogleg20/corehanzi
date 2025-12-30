# progress-tracking Specification Delta

## ADDED Requirements

### Requirement: Manual Learned Toggle

The system SHALL allow users to manually mark words as learned (mastered) from the vocabulary browser.

#### Scenario: Mark word as learned

- **WHEN** user clicks the learned toggle for an unlearned word
- **THEN** the system creates a progress record marking the word as mastered
- **AND** the toggle displays as "learned" state

#### Scenario: Unmark word as learned

- **WHEN** user clicks the learned toggle for a learned word
- **THEN** the system removes the progress record for that word
- **AND** the toggle displays as "unlearned" state

#### Scenario: Display learned status in modal

- **WHEN** user opens word detail modal
- **THEN** the system displays the current learned status with a toggle button

## MODIFIED Requirements

### Requirement: Vocabulary Browser

The system SHALL provide a searchable, paginated list of all vocabulary words with progress indicators.

#### Scenario: Filter by learned status

- **WHEN** user selects a learned status filter (All, Learned, Unlearned)
- **THEN** the system displays only words matching the filter
- **AND** resets to the first page
