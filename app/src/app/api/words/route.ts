import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { words, wordProgress } from "@/lib/db/schema";
import { eq, like, or, asc, count, and, inArray, notInArray } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level");
  const search = searchParams.get("search");
  const learned = searchParams.get("learned");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = (page - 1) * limit;

  try {
    // Get learned word IDs if filtering by learned status
    let learnedWordIds: number[] = [];
    if (learned && learned !== "all") {
      learnedWordIds = db
        .select({ wordId: wordProgress.wordId })
        .from(wordProgress)
        .all()
        .map((r) => r.wordId);
    }

    // Build where conditions
    const conditions = [];
    if (level && level !== "all") {
      conditions.push(eq(words.hskLevel, parseInt(level)));
    }
    if (search) {
      const pattern = `%${search}%`;
      conditions.push(
        or(
          like(words.hanzi, pattern),
          like(words.pinyin, pattern),
          like(words.definition, pattern)
        )
      );
    }
    if (learned === "learned" && learnedWordIds.length > 0) {
      conditions.push(inArray(words.id, learnedWordIds));
    } else if (learned === "learned" && learnedWordIds.length === 0) {
      // No learned words, return empty
      return NextResponse.json({ words: [], total: 0, learnedWordIds: [] });
    } else if (learned === "unlearned") {
      if (learnedWordIds.length > 0) {
        conditions.push(notInArray(words.id, learnedWordIds));
      }
      // If no learned words, no filter needed - all words are unlearned
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const countResult = db
      .select({ count: count() })
      .from(words)
      .where(whereClause)
      .get();
    const total = countResult?.count ?? 0;

    // Get paginated results
    const result = db
      .select()
      .from(words)
      .where(whereClause)
      .orderBy(asc(words.hskLevel), asc(words.frequency))
      .limit(limit)
      .offset(offset)
      .all();

    // Get all learned word IDs for the response (for UI indicators)
    const allLearnedIds = db
      .select({ wordId: wordProgress.wordId })
      .from(wordProgress)
      .all()
      .map((r) => r.wordId);

    return NextResponse.json({ words: result, total, learnedWordIds: allLearnedIds });
  } catch (error) {
    console.error("Error fetching words:", error);
    return NextResponse.json(
      { error: "Failed to fetch words" },
      { status: 500 }
    );
  }
}
