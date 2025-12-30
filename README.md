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
pip install jieba         # Required for sentence tokenization
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

## Optional: Generate Sentence Pinyin

To generate pinyin for all sentences (enables "Show Pinyin" feature):

```bash
cd app/scripts
source venv/bin/activate
pip install pypinyin
python generate_pinyin.py
```

## Optional: Generate Audio

To generate TTS audio for words and sentences using Microsoft Edge TTS:

```bash
cd app/scripts
source venv/bin/activate
pip install edge-tts
python generate_audio.py
```

This creates MP3 files in `app/public/audio/`. Note: This can take a while as it processes thousands of entries with rate limiting.

## Upgrading an Existing Database

If you have an existing database and pull new changes that include schema updates, you have two options:

### Option 1: Fresh Import (Recommended if you don't need to preserve progress)

Delete the database and re-run the import:

```bash
cd app
rm chinese.db
python scripts/import_all.py
python scripts/generate_pinyin.py  # Optional
```

### Option 2: Manual Migration (Preserves your learning progress)

If you want to keep your existing progress data, apply schema changes manually:

```bash
cd app
sqlite3 chinese.db
```

Then run the appropriate ALTER TABLE statements for any new columns. Recent schema additions:

```sql
-- Added: Pinyin for sentences (for "Show Pinyin" toggle)
ALTER TABLE sentences ADD COLUMN pinyin TEXT;

-- Added: Setting to show/hide sentence pinyin
ALTER TABLE settings ADD COLUMN show_sentence_pinyin INTEGER NOT NULL DEFAULT 0;
```

After adding the `pinyin` column, run the pinyin generator to populate it:

```bash
python scripts/generate_pinyin.py
```

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
