# sentence-learning Specification

## Purpose

Extend the learn mode to support sentence-level spaced repetition, allowing users to review sentences alongside vocabulary words.

## ADDED Requirements

### Requirement: Sentence Progress Tracking

The system SHALL track learning progress for sentences using the SM-2 spaced repetition algorithm.

#### Scenario: Initialize sentence progress

- **WHEN** user sees a sentence for the first time in learn mode
- **THEN** the system creates a progress record with default ease_factor (2.5), interval (1), and next_review (tomorrow)

#### Scenario: Update sentence progress after review

- **WHEN** user grades a sentence review
- **THEN** the system updates ease_factor, interval, next_review, times_seen, and times_correct

### Requirement: Learn Mode Toggle

The system SHALL allow switching between word and sentence learning modes.

#### Scenario: Display mode toggle

- **WHEN** user navigates to /learn
- **THEN** the system displays a toggle with options "Words" and "Sentences"

#### Scenario: Switch to sentence mode

- **WHEN** user selects "Sentences" mode
- **THEN** the system fetches unlearned sentences (optionally filtered by tags)
- **AND** displays sentence learning cards

#### Scenario: Persist mode preference

- **WHEN** user switches learning mode
- **THEN** the system remembers the selection for the session

### Requirement: Sentence Learning Cards

The system SHALL display sentences in a card format for learning.

#### Scenario: Present sentence for learning

- **WHEN** displaying a sentence in learn mode
- **THEN** the system shows Chinese text prominently
- **AND** audio button if available
- **AND** pinyin (if user preference enabled)

#### Scenario: Reveal sentence translation

- **WHEN** user taps the sentence card
- **THEN** the system reveals the English translation

#### Scenario: Grade sentence

- **WHEN** user grades as "Got it"
- **THEN** the system creates/updates progress with quality 4
- **AND** advances to next sentence

#### Scenario: Miss sentence

- **WHEN** user grades as "Missed it"
- **THEN** the system creates/updates progress with quality 2
- **AND** schedules earlier review

### Requirement: Sentence Reviews

The system SHALL include learned sentences in review sessions.

#### Scenario: Fetch due sentence reviews

- **WHEN** user navigates to /review
- **THEN** the system fetches sentences with nextReview <= today

#### Scenario: Mix sentence reviews

- **WHEN** displaying reviews
- **THEN** the system includes both word and sentence cards in the queue

## MODIFIED Requirements

### learn-mode: New Word Session

#### Scenario: Filter learn session by tags (ADDED)

- **WHEN** user selects tags before starting learn session
- **THEN** the system loads only unlearned words/sentences matching selected tags

### progress-tracking: Word Progress Storage

#### Scenario: Sentence progress storage (ADDED)

- **WHEN** tracking sentence learning progress
- **THEN** the system stores ease_factor, interval, next_review, times_correct, times_seen, last_review for sentences
