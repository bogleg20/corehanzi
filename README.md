# CoreHanzi

A Chinese learning application focused on HSK vocabulary with spaced repetition, sentence practice, and grammar pattern recognition.

## Features

- **HSK 1-3 Vocabulary**: ~2,200 words with pinyin, definitions, and example sentences
- **Spaced Repetition**: SM-2 algorithm for efficient review scheduling
- **Sentence Practice**: Learn vocabulary in context with Tatoeba sentences
- **Grammar Patterns**: Sentences tagged with common grammar structures
- **Audio Support**: Optional TTS audio generation for words and sentences

## Project Structure

```
corehanzi/
├── app/                    # Next.js application
│   ├── src/
│   │   ├── app/           # Pages and API routes
│   │   ├── components/    # React components
│   │   └── lib/           # Database and utilities
│   ├── scripts/           # Python data import scripts
│   └── public/            # Static assets (audio files)
├── data/                   # Source data files
│   ├── hsk-complete.json  # HSK vocabulary dataset
│   ├── tatoeba-data.tsv   # Sentence pairs
│   └── cedict_ts.u8       # Chinese-English dictionary
└── openspec/              # Project specifications
```

## Prerequisites

- **Node.js** 18+
- **Python** 3.10+
- **npm** (comes with Node.js)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/bogleg20/corehanzi.git
cd corehanzi
```

### 2. Install Node.js dependencies

```bash
cd app
npm install
```

### 3. Set up Python environment (for data import)

```bash
cd app/scripts
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 4. Populate the database

Run the import script to create and populate the SQLite database:

```bash
cd app
python scripts/import_all.py
```

This will:
1. Import HSK 1-3 vocabulary (~2,200 words)
2. Import Tatoeba sentences filtered by HSK coverage
3. Tag sentences with grammar patterns

The database will be created at `app/chinese.db`.

### 5. Start the development server

```bash
cd app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Optional: Generate Audio

To generate TTS audio for words and sentences using Microsoft Edge TTS:

```bash
cd app/scripts
source venv/bin/activate
pip install edge-tts
python generate_audio.py
```

This creates MP3 files in `app/public/audio/`. Note: This can take a while as it processes thousands of entries with rate limiting.

## Database Schema

The app uses SQLite with the following main tables:

- **words**: HSK vocabulary (hanzi, pinyin, definition, HSK level, etc.)
- **sentences**: Example sentences with translations
- **word_sentences**: Links words to their example sentences
- **user_progress**: Tracks learning progress and SRS scheduling
- **user_settings**: User preferences

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite with better-sqlite3
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Data Sources

- **HSK Vocabulary**: [hsk-complete.json](https://github.com/elkmyr/hsk-vocabulary) - Comprehensive HSK 3.0 dataset
- **Sentences**: [Tatoeba](https://tatoeba.org/) - Chinese-English sentence pairs
- **Dictionary**: [CC-CEDICT](https://cc-cedict.org/) - Chinese-English dictionary

## License

MIT
