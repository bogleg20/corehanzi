import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { words } from "@/lib/db/schema";
import { eq, like, or, asc } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = (page - 1) * limit;

  try {
    let query = db.select().from(words);

    // Filter by HSK level
    if (level && level !== "all") {
      query = query.where(eq(words.hskLevel, parseInt(level))) as typeof query;
    }

    // Search
    if (search) {
      const pattern = `%${search}%`;
      query = query.where(
        or(
          like(words.hanzi, pattern),
          like(words.pinyin, pattern),
          like(words.definition, pattern)
        )
      ) as typeof query;
    }

    const result = query
      .orderBy(asc(words.hskLevel), asc(words.frequency))
      .limit(limit)
      .offset(offset)
      .all();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching words:", error);
    return NextResponse.json(
      { error: "Failed to fetch words" },
      { status: 500 }
    );
  }
}
