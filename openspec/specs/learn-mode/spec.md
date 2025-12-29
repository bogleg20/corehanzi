# learn-mode Specification

## Purpose
TBD - created by archiving change add-chinese-learning-mvp. Update Purpose after archive.
## Requirements
### Requirement: New Word Session

The system SHALL present new vocabulary words in daily learning sessions with a configurable limit (default 15-20 words).

#### Scenario: Start learn session

- **WHEN** user navigates to /learn
- **THEN** the system loads unlearned words up to the daily limit, ordered by HSK level

#### Scenario: No new words available

- **WHEN** user has learned all available words
- **THEN** the system displays a completion message and suggests review mode

### Requirement: Word Presentation

The system SHALL display each word with hanzi, pinyin, definition, audio playback, and 1-2 example sentences.

#### Scenario: Display word card

- **WHEN** presenting a word to learn
- **THEN** the system shows hanzi prominently, with pinyin, definition, and audio button

#### Scenario: Show example sentences

- **WHEN** presenting a word
- **THEN** the system displays up to 2 example sentences containing that word with translations and optional pinyin (toggled via inline button)

### Requirement: Self-Grading

The system SHALL allow users to self-grade their familiarity with each word as "Got it" or "Missed it".

#### Scenario: Mark word as known

- **WHEN** user clicks "Got it"
- **THEN** the system creates a progress record with default SM-2 values and advances to next word

#### Scenario: Mark word as missed

- **WHEN** user clicks "Missed it"
- **THEN** the system creates a progress record with lower initial ease and schedules earlier review

### Requirement: Session Progress

The system SHALL display progress through the current learning session.

#### Scenario: Show session progress

- **WHEN** user is in a learn session
- **THEN** the system displays current word number and total (e.g., "5 / 15")

#### Scenario: Complete session

- **WHEN** user finishes all words in session
- **THEN** the system shows summary of words learned and offers to start review

