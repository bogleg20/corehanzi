# progress-tracking Specification

## Purpose
TBD - created by archiving change add-chinese-learning-mvp. Update Purpose after archive.
## Requirements
### Requirement: Word Progress Storage

The system SHALL track learning progress for each word including ease factor, interval, next review date, and accuracy statistics.

#### Scenario: Initialize progress

- **WHEN** user sees a word for the first time
- **THEN** the system creates progress record with default ease_factor (2.5), interval (1), and next_review (tomorrow)

#### Scenario: Update progress after review

- **WHEN** user completes a word review
- **THEN** the system updates ease_factor, interval, next_review, times_seen, and times_correct

### Requirement: Progress Dashboard

The system SHALL display a dashboard summarizing overall learning progress.

#### Scenario: Show vocabulary progress

- **WHEN** user views dashboard
- **THEN** the system displays words learned per HSK level as progress bars (e.g., "HSK 1: 45/149")

#### Scenario: Show today's activity

- **WHEN** user views dashboard
- **THEN** the system displays new words learned today and reviews completed today

#### Scenario: Show upcoming reviews

- **WHEN** user views dashboard
- **THEN** the system displays count of reviews due today and total due this week

### Requirement: Streak Tracking

The system SHALL track consecutive days of study activity.

#### Scenario: Increment streak

- **WHEN** user completes at least one review or learns one new word
- **THEN** the system increments daily streak if last activity was yesterday

#### Scenario: Reset streak

- **WHEN** user misses a day of activity
- **THEN** the system resets streak to 0

#### Scenario: Display streak

- **WHEN** user views dashboard
- **THEN** the system displays current streak with flame icon

### Requirement: Vocabulary Browser

The system SHALL provide a searchable list of all vocabulary words with progress indicators.

#### Scenario: Browse by HSK level

- **WHEN** user selects an HSK level filter
- **THEN** the system displays only words from that level

#### Scenario: Search vocabulary

- **WHEN** user enters search query
- **THEN** the system filters words matching hanzi, pinyin, or English definition

#### Scenario: Show word status

- **WHEN** displaying word in browser
- **THEN** the system indicates if word is new, learning, or mastered (based on interval)

### Requirement: Pattern Reference

The system SHALL provide a reference page listing all grammar patterns with examples.

#### Scenario: Browse patterns

- **WHEN** user navigates to /patterns
- **THEN** the system displays all patterns with name, structure, and example sentence

#### Scenario: View pattern sentences

- **WHEN** user clicks a pattern
- **THEN** the system shows all sentences tagged with that pattern

### Requirement: User Preferences

The system SHALL store user preferences for daily limits and audio settings.

#### Scenario: Set daily word limit

- **WHEN** user changes daily new word limit in settings
- **THEN** the system stores preference and applies to future learn sessions

#### Scenario: Toggle audio

- **WHEN** user toggles audio setting
- **THEN** the system enables/disables automatic audio playback

#### Scenario: Persist preferences

- **WHEN** user sets preferences
- **THEN** the system stores them in localStorage for persistence across sessions

