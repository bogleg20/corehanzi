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

The system SHALL display each word with hanzi, pinyin, definition, audio playback, and up to 20 example sentences navigable via carousel.

#### Scenario: Display word card

- **WHEN** presenting a word to learn
- **THEN** the system shows hanzi prominently, with pinyin, definition, and audio button

#### Scenario: Show example sentences in carousel

- **WHEN** presenting a word with example sentences
- **THEN** the system displays one sentence at a time in a carousel with navigation controls (arrows and dot indicators)

#### Scenario: Navigate sentences

- **WHEN** user clicks carousel arrows or dots
- **THEN** the system smoothly transitions to the selected sentence

#### Scenario: Keyboard navigation

- **WHEN** user presses left/right arrow keys while viewing sentences
- **THEN** the system navigates to previous/next sentence respectively

#### Scenario: Single sentence display

- **WHEN** a word has only one example sentence
- **THEN** the system displays the sentence without navigation controls

#### Scenario: No sentences available

- **WHEN** a word has no example sentences
- **THEN** the system does not display the sentence section

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

