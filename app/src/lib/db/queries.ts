import { db } from "./index";
import {
  words,
  sentences,
  sentenceWords,
  patterns,
  sentencePatterns,
  wordProgress,
  settings,
  Word,
  Sentence,
  Pattern,
  WordProgress,
  Settings,
} from "./schema";
import { eq, and, lte, inArray, notInArray, like, or, sql, asc } from "drizzle-orm";

// ============ Words ============

export async function getWordById(id: number): Promise<Word | undefined> {
  const result = db.select().from(words).where(eq(words.id, id)).get();
  return result;
}

export async function getWordByHanzi(hanzi: string): Promise<Word | undefined> {
  const result = db.select().from(words).where(eq(words.hanzi, hanzi)).get();
  return result;
}

export async function getWordsByHskLevel(level: number): Promise<Word[]> {
  return db.select().from(words).where(eq(words.hskLevel, level)).all();
}

export async function searchWords(query: string): Promise<Word[]> {
  const pattern = `%${query}%`;
  return db
    .select()
    .from(words)
    .where(
      or(
        like(words.hanzi, pattern),
        like(words.pinyin, pattern),
        like(words.definition, pattern)
      )
    )
    .limit(50)
    .all();
}

export async function getWordsByHanziList(hanziList: string[]): Promise<Word[]> {
  if (hanziList.length === 0) return [];
  return db.select().from(words).where(inArray(words.hanzi, hanziList)).all();
}

export async function getUnlearnedWords(limit: number): Promise<Word[]> {
  // Get words that don't have progress records yet
  const learnedWordIds = db
    .select({ wordId: wordProgress.wordId })
    .from(wordProgress)
    .all()
    .map((r) => r.wordId);

  if (learnedWordIds.length === 0) {
    return db
      .select()
      .from(words)
      .orderBy(asc(words.hskLevel), asc(words.frequency))
      .limit(limit)
      .all();
  }

  return db
    .select()
    .from(words)
    .where(notInArray(words.id, learnedWordIds))
    .orderBy(asc(words.hskLevel), asc(words.frequency))
    .limit(limit)
    .all();
}

// ============ Sentences ============

export async function getSentenceById(
  id: number
): Promise<Sentence | undefined> {
  return db.select().from(sentences).where(eq(sentences.id, id)).get();
}

export async function getSentencesForWord(wordId: number): Promise<Sentence[]> {
  const sentenceIds = db
    .select({ sentenceId: sentenceWords.sentenceId })
    .from(sentenceWords)
    .where(eq(sentenceWords.wordId, wordId))
    .all()
    .map((r) => r.sentenceId);

  if (sentenceIds.length === 0) return [];

  return db
    .select()
    .from(sentences)
    .where(inArray(sentences.id, sentenceIds))
    .orderBy(asc(sentences.difficultyScore))
    .limit(20)
    .all();
}

export async function getRandomSentenceForPractice(): Promise<
  Sentence | undefined
> {
  // Get a random sentence that the user has seen words for
  const learnedWordIds = db
    .select({ wordId: wordProgress.wordId })
    .from(wordProgress)
    .all()
    .map((r) => r.wordId);

  if (learnedWordIds.length === 0) return undefined;

  // Find sentences containing learned words
  const eligibleSentenceIds = db
    .select({ sentenceId: sentenceWords.sentenceId })
    .from(sentenceWords)
    .where(inArray(sentenceWords.wordId, learnedWordIds))
    .all()
    .map((r) => r.sentenceId);

  if (eligibleSentenceIds.length === 0) return undefined;

  const randomId =
    eligibleSentenceIds[Math.floor(Math.random() * eligibleSentenceIds.length)];
  return db.select().from(sentences).where(eq(sentences.id, randomId)).get();
}

// ============ Patterns ============

export async function getAllPatterns(): Promise<Pattern[]> {
  return db.select().from(patterns).all();
}

export async function getPatternById(id: number): Promise<Pattern | undefined> {
  return db.select().from(patterns).where(eq(patterns.id, id)).get();
}

export async function getSentencesForPattern(
  patternId: number
): Promise<Sentence[]> {
  const sentenceIds = db
    .select({ sentenceId: sentencePatterns.sentenceId })
    .from(sentencePatterns)
    .where(eq(sentencePatterns.patternId, patternId))
    .all()
    .map((r) => r.sentenceId);

  if (sentenceIds.length === 0) return [];

  return db
    .select()
    .from(sentences)
    .where(inArray(sentences.id, sentenceIds))
    .limit(10)
    .all();
}

// ============ Word Progress ============

export async function getWordProgress(
  wordId: number
): Promise<WordProgress | undefined> {
  return db
    .select()
    .from(wordProgress)
    .where(eq(wordProgress.wordId, wordId))
    .get();
}

export async function createWordProgress(
  wordId: number,
  nextReview: string
): Promise<void> {
  db.insert(wordProgress)
    .values({
      wordId,
      nextReview,
      easeFactor: 2.5,
      interval: 1,
      timesCorrect: 0,
      timesSeen: 1,
    })
    .run();
}

export async function updateWordProgress(
  wordId: number,
  data: Partial<{
    easeFactor: number;
    interval: number;
    nextReview: string;
    timesCorrect: number;
    timesSeen: number;
    lastReview: string;
  }>
): Promise<void> {
  db.update(wordProgress)
    .set(data)
    .where(eq(wordProgress.wordId, wordId))
    .run();
}

export async function getDueReviews(): Promise<
  (Word & { progress: WordProgress })[]
> {
  const today = new Date().toISOString().split("T")[0];

  const dueProgress = db
    .select()
    .from(wordProgress)
    .where(lte(wordProgress.nextReview, today))
    .all();

  if (dueProgress.length === 0) return [];

  const wordIds = dueProgress.map((p) => p.wordId);
  const dueWords = db
    .select()
    .from(words)
    .where(inArray(words.id, wordIds))
    .all();

  return dueWords.map((word) => ({
    ...word,
    progress: dueProgress.find((p) => p.wordId === word.id)!,
  }));
}

export async function getLearnedWordsCount(): Promise<number> {
  const result = db
    .select({ count: sql<number>`count(*)` })
    .from(wordProgress)
    .get();
  return result?.count ?? 0;
}

export async function getLearnedWordIds(): Promise<Set<number>> {
  const learned = db
    .select({ wordId: wordProgress.wordId })
    .from(wordProgress)
    .all();
  return new Set(learned.map((r) => r.wordId));
}

export async function getLearnedWordsByLevel(): Promise<
  { level: number; count: number }[]
> {
  const learned = db
    .select({ wordId: wordProgress.wordId })
    .from(wordProgress)
    .all()
    .map((r) => r.wordId);

  if (learned.length === 0) return [];

  return db
    .select({
      level: words.hskLevel,
      count: sql<number>`count(*)`,
    })
    .from(words)
    .where(inArray(words.id, learned))
    .groupBy(words.hskLevel)
    .all();
}

export async function getTotalWordsByLevel(): Promise<
  { level: number; count: number }[]
> {
  return db
    .select({
      level: words.hskLevel,
      count: sql<number>`count(*)`,
    })
    .from(words)
    .groupBy(words.hskLevel)
    .all();
}

// ============ Settings ============

export async function getSettings(): Promise<Settings> {
  let result = db.select().from(settings).get();
  if (!result) {
    db.insert(settings).values({}).run();
    result = db.select().from(settings).get()!;
  }
  return result;
}

export async function updateSettings(
  data: Partial<{
    dailyNewWordLimit: number;
    audioEnabled: boolean;
    showSentencePinyin: boolean;
    currentStreak: number;
    lastStudyDate: string;
  }>
): Promise<void> {
  const current = await getSettings();
  db.update(settings).set(data).where(eq(settings.id, current.id)).run();
}

export async function updateStreak(): Promise<number> {
  const current = await getSettings();
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  let newStreak = current.currentStreak;

  if (current.lastStudyDate === today) {
    // Already studied today, no change
  } else if (current.lastStudyDate === yesterday) {
    // Consecutive day
    newStreak = current.currentStreak + 1;
  } else {
    // Streak broken
    newStreak = 1;
  }

  await updateSettings({ currentStreak: newStreak, lastStudyDate: today });
  return newStreak;
}

// ============ Stats ============

export async function getTodayStats(): Promise<{
  newWordsToday: number;
  reviewsToday: number;
}> {
  const today = new Date().toISOString().split("T")[0];

  // Words learned today (first seen today)
  const newWordsToday = db
    .select({ count: sql<number>`count(*)` })
    .from(wordProgress)
    .where(like(wordProgress.lastReview, `${today}%`))
    .get();

  // Reviews done today
  const reviewsToday = db
    .select({ count: sql<number>`count(*)` })
    .from(wordProgress)
    .where(
      and(
        like(wordProgress.lastReview, `${today}%`),
        sql`${wordProgress.timesSeen} > 1`
      )
    )
    .get();

  return {
    newWordsToday: newWordsToday?.count ?? 0,
    reviewsToday: reviewsToday?.count ?? 0,
  };
}
