# review-mode Specification

## Purpose
TBD - created by archiving change add-chinese-learning-mvp. Update Purpose after archive.
## Requirements
### Requirement: SM-2 Spaced Repetition

The system SHALL implement the SM-2 algorithm to schedule word reviews based on user performance.

#### Scenario: Calculate next interval

- **WHEN** user rates a review
- **THEN** the system calculates the next review date using SM-2 formula with ease factor adjustment

#### Scenario: Handle failed review

- **WHEN** user rates quality as 0-2 (failed)
- **THEN** the system resets interval to 1 day and decreases ease factor

#### Scenario: Handle successful review

- **WHEN** user rates quality as 3-5 (passed)
- **THEN** the system multiplies interval by ease factor and optionally increases ease

### Requirement: Review Queue

The system SHALL build a queue of words due for review based on their next_review date.

#### Scenario: Load due reviews

- **WHEN** user navigates to /review
- **THEN** the system loads all words where next_review <= today, ordered by due date

#### Scenario: No reviews due

- **WHEN** no words are due for review
- **THEN** the system displays message with next review time and suggests learn mode

### Requirement: Multiple Card Types

The system SHALL present reviews using different card formats to test various recall skills.

#### Scenario: Word to definition card

- **WHEN** showing recognition card
- **THEN** the system displays hanzi and user must recall/reveal definition

#### Scenario: Definition to word card

- **WHEN** showing recall card
- **THEN** the system displays definition and user must recall/reveal hanzi

#### Scenario: Sentence translation card

- **WHEN** showing context card
- **THEN** the system displays Chinese sentence with optional pinyin (based on user setting) and user must recall/reveal English translation

#### Scenario: Cloze deletion card

- **WHEN** showing cloze card
- **THEN** the system displays sentence with target word blanked (e.g., "我___咖啡") with optional pinyin (blanked for target word) and user fills in

### Requirement: Quality Rating

The system SHALL allow users to rate review quality on a scale that maps to SM-2 grades.

#### Scenario: Rate as Again

- **WHEN** user clicks "Again"
- **THEN** the system records quality 0 and reschedules for same session

#### Scenario: Rate as Hard

- **WHEN** user clicks "Hard"
- **THEN** the system records quality 3 and calculates next interval

#### Scenario: Rate as Good

- **WHEN** user clicks "Good"
- **THEN** the system records quality 4 and calculates next interval

#### Scenario: Rate as Easy

- **WHEN** user clicks "Easy"
- **THEN** the system records quality 5 and calculates extended interval

### Requirement: Review Statistics

The system SHALL track and display review statistics including times seen, times correct, and current streak.

#### Scenario: Update statistics after review

- **WHEN** user completes a review
- **THEN** the system increments times_seen and times_correct (if passed)

#### Scenario: Display session summary

- **WHEN** user completes all due reviews
- **THEN** the system shows cards reviewed, accuracy percentage, and streak

