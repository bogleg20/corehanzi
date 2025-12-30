## MODIFIED Requirements

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
