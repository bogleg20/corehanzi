# vocabulary-data Specification Delta

## MODIFIED Requirements

### Requirement: Grammar Pattern Storage

The system SHALL store grammar patterns with name, structure template, example sentence (6-25 characters that demonstrates the full structure), and description.

#### Scenario: Store pattern

- **WHEN** a grammar pattern is defined
- **THEN** the system stores it with structure (e.g., "A 比 B + adj"), example_regex for validation, and example

#### Scenario: Select pattern example

- **WHEN** selecting an example sentence for a grammar pattern
- **THEN** the system selects the shortest sentence (6-25 characters) that matches the pattern's example_regex
- **AND** the example_regex validates the sentence demonstrates the full structure (e.g., `.+是.+` for "A 是 B")
- **AND** if no valid sentences exist, no example is set

#### Scenario: Tag sentence with pattern

- **WHEN** a sentence matches a grammar pattern rule
- **THEN** the system links the sentence to that pattern
