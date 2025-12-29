import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Words table - HSK vocabulary
export const words = sqliteTable("words", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  hanzi: text("hanzi").notNull(),
  traditional: text("traditional"),
  pinyin: text("pinyin").notNull(),
  pinyinNumeric: text("pinyin_numeric"),
  definition: text("definition").notNull(),
  definitions: text("definitions", { mode: "json" }).$type<string[]>(),
  hskLevel: integer("hsk_level").notNull(),
  pos: text("pos"),
  frequency: integer("frequency"),
  classifiers: text("classifiers", { mode: "json" }).$type<string[]>(),
  audioPath: text("audio_path"),
});

// Sentences table - Tatoeba sentences
export const sentences = sqliteTable("sentences", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  chinese: text("chinese").notNull(),
  english: text("english").notNull(),
  pinyin: text("pinyin"),
  difficultyScore: real("difficulty_score"),
  audioPath: text("audio_path"),
  tokens: text("tokens", { mode: "json" }).$type<string[]>(),
});

// Junction table for words <-> sentences
export const sentenceWords = sqliteTable("sentence_words", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sentenceId: integer("sentence_id")
    .notNull()
    .references(() => sentences.id),
  wordId: integer("word_id")
    .notNull()
    .references(() => words.id),
});

// Grammar patterns
export const patterns = sqliteTable("patterns", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  structure: text("structure").notNull(),
  example: text("example"),
  description: text("description"),
});

// Junction table for sentences <-> patterns
export const sentencePatterns = sqliteTable("sentence_patterns", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sentenceId: integer("sentence_id")
    .notNull()
    .references(() => sentences.id),
  patternId: integer("pattern_id")
    .notNull()
    .references(() => patterns.id),
});

// Word progress tracking (single user, no user_id needed)
export const wordProgress = sqliteTable("word_progress", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  wordId: integer("word_id")
    .notNull()
    .unique()
    .references(() => words.id),
  easeFactor: real("ease_factor").notNull().default(2.5),
  interval: integer("interval").notNull().default(1),
  nextReview: text("next_review").notNull(), // ISO date string
  timesCorrect: integer("times_correct").notNull().default(0),
  timesSeen: integer("times_seen").notNull().default(0),
  lastReview: text("last_review"), // ISO date string
});

// Sentence progress tracking
export const sentenceProgress = sqliteTable("sentence_progress", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sentenceId: integer("sentence_id")
    .notNull()
    .unique()
    .references(() => sentences.id),
  timesSeen: integer("times_seen").notNull().default(0),
  lastSeen: text("last_seen"), // ISO date string
});

// User settings (single row for single user)
export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  dailyNewWordLimit: integer("daily_new_word_limit").notNull().default(20),
  audioEnabled: integer("audio_enabled", { mode: "boolean" })
    .notNull()
    .default(true),
  showSentencePinyin: integer("show_sentence_pinyin", { mode: "boolean" })
    .notNull()
    .default(false),
  currentStreak: integer("current_streak").notNull().default(0),
  lastStudyDate: text("last_study_date"), // ISO date string
});

// Type exports
export type Word = typeof words.$inferSelect;
export type NewWord = typeof words.$inferInsert;
export type Sentence = typeof sentences.$inferSelect;
export type NewSentence = typeof sentences.$inferInsert;
export type Pattern = typeof patterns.$inferSelect;
export type WordProgress = typeof wordProgress.$inferSelect;
export type Settings = typeof settings.$inferSelect;
