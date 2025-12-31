# ocr-input Specification

## Purpose

Enable users to extract Chinese text from images (screenshots, photos) for easy content import using browser-based OCR.

## ADDED Requirements

### Requirement: Image Input

The system SHALL accept images for OCR processing via multiple input methods.

#### Scenario: Paste image from clipboard

- **WHEN** user pastes an image in the OCR input area
- **THEN** the system displays the image preview
- **AND** enables the "Extract Text" button

#### Scenario: Upload image file

- **WHEN** user clicks upload and selects an image file
- **THEN** the system displays the image preview
- **AND** enables the "Extract Text" button

#### Scenario: Clear image

- **WHEN** user clicks clear button
- **THEN** the system removes the image preview
- **AND** resets the OCR input area

### Requirement: OCR Processing

The system SHALL extract Chinese text from images using Tesseract.js.

#### Scenario: Process image

- **WHEN** user uploads or pastes an image
- **THEN** the system initializes Tesseract worker with Chinese (chi_sim) language
- **AND** displays progress indicator (0-50% for OCR phase)
- **AND** shows extracted text when complete

#### Scenario: Handle OCR failure

- **WHEN** OCR processing fails
- **THEN** the system displays an error message
- **AND** allows retry

### Requirement: Auto-generate Translations

The system SHALL automatically generate pinyin and English translations for extracted sentences.

#### Scenario: Generate translations after OCR

- **WHEN** OCR extraction completes
- **THEN** the system generates pinyin and English translation for each sentence
- **AND** displays progress indicator (50-100% for translation phase)
- **AND** shows editable fields for each sentence with pre-filled values

#### Scenario: Edit generated translations

- **WHEN** system displays extracted sentences with generated pinyin/English
- **THEN** user can edit any pinyin or English field before saving
- **AND** changes are preserved when saving

### Requirement: Text Parsing

The system SHALL parse extracted text into individual sentences.

#### Scenario: Split by punctuation

- **WHEN** OCR completes
- **THEN** the system splits text by Chinese sentence-ending punctuation (。！？)
- **AND** displays each sentence as a separate item

#### Scenario: Edit extracted text

- **WHEN** OCR produces incorrect text
- **THEN** the user can manually edit the extracted text before parsing

### Requirement: Sentence Import

The system SHALL allow importing parsed sentences to the database.

#### Scenario: Select sentences for import

- **WHEN** sentences are displayed with generated translations
- **THEN** user can select/deselect individual sentences via checkboxes
- **AND** "Select All" and "Clear" buttons allow bulk selection

#### Scenario: Save selected sentences

- **WHEN** user clicks "Save Selected" button
- **THEN** the system saves all selected sentences with their pinyin and English
- **AND** displays count of saved vs skipped (duplicates)
- **AND** removes saved sentences from the list

#### Scenario: Skip duplicate sentence

- **WHEN** a sentence already exists in the database during save
- **THEN** the system skips the duplicate
- **AND** increments the skipped count in the result message

#### Scenario: Bulk tag imported sentences

- **WHEN** user selects tags before importing
- **THEN** the system applies selected tags to all imported sentences
