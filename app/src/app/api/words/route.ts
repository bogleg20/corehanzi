import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { words } from "@/lib/db/schema";
import { eq, like, or, asc, count, and } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = (page - 1) * limit;

  try {
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

    return NextResponse.json({ words: result, total });
  } catch (error) {
    console.error("Error fetching words:", error);
    return NextResponse.json(
      { error: "Failed to fetch words" },
      { status: 500 }
    );
  }
}
