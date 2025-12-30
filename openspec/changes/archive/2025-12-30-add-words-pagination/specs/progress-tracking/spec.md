# progress-tracking Spec Delta

## MODIFIED Requirements

### Requirement: Vocabulary Browser

The system SHALL provide a searchable, paginated list of all vocabulary words with progress indicators.

#### Scenario: Browse by HSK level

- **WHEN** user selects an HSK level filter
- **THEN** the system displays only words from that level
- **AND** resets to the first page

#### Scenario: Search vocabulary

- **WHEN** user enters search query
- **THEN** the system filters words matching hanzi, pinyin, or English definition
- **AND** resets to the first page

#### Scenario: Show word status

- **WHEN** displaying word in browser
- **THEN** the system indicates if word is new, learning, or mastered (based on interval)

#### Scenario: Paginate word list

- **WHEN** viewing the vocabulary browser
- **THEN** the system displays 50 words per page with pagination controls
- **AND** shows current page and total pages
- **AND** allows navigation to previous/next pages
