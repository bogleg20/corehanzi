# practice-mode Specification

## Purpose
TBD - created by archiving change add-chinese-learning-mvp. Update Purpose after archive.
## Requirements
### Requirement: Build-a-Sentence Exercise

The system SHALL provide exercises where users arrange scrambled Chinese words into correct sentence order.

#### Scenario: Present scrambled sentence

- **WHEN** user starts a build-a-sentence exercise
- **THEN** the system displays English translation and Chinese words in randomized order

#### Scenario: Arrange words

- **WHEN** user clicks/taps words
- **THEN** the system adds them to the answer area in clicked order

#### Scenario: Remove word from answer

- **WHEN** user clicks a word in the answer area
- **THEN** the system returns it to the word bank

### Requirement: Answer Validation

The system SHALL validate user's word arrangement against the correct sentence.

#### Scenario: Correct answer

- **WHEN** user submits matching word order
- **THEN** the system shows success feedback and advances to next exercise

#### Scenario: Incorrect answer

- **WHEN** user submits non-matching word order
- **THEN** the system shows the correct answer with comparison

#### Scenario: Partial credit for minor errors

- **WHEN** user's answer differs only in punctuation or spacing
- **THEN** the system accepts as correct

### Requirement: Exercise Selection

The system SHALL select practice sentences based on user's learned vocabulary and difficulty preference.

#### Scenario: Select from learned words

- **WHEN** generating practice exercises
- **THEN** the system prioritizes sentences using words the user has studied

#### Scenario: Progressive difficulty

- **WHEN** user completes exercises successfully
- **THEN** the system gradually introduces sentences with higher difficulty scores

### Requirement: Practice Session

The system SHALL manage practice sessions with configurable length.

#### Scenario: Start practice session

- **WHEN** user navigates to /practice
- **THEN** the system loads a set of exercises (default 10)

#### Scenario: Track session progress

- **WHEN** user is in practice session
- **THEN** the system displays current exercise number and total

#### Scenario: Complete session

- **WHEN** user finishes all exercises
- **THEN** the system shows accuracy summary and offers to continue or exit

