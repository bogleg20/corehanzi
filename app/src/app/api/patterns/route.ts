import { NextResponse } from "next/server";
import { getAllPatterns, getSentencesForPattern } from "@/lib/db/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patternId = searchParams.get("patternId");

  try {
    if (patternId) {
      // Get sentences for a specific pattern
      const sentences = await getSentencesForPattern(parseInt(patternId));
      return NextResponse.json(sentences);
    }

    // Get all patterns
    const patterns = await getAllPatterns();
    return NextResponse.json(patterns);
  } catch (error) {
    console.error("Error fetching patterns:", error);
    return NextResponse.json(
      { error: "Failed to fetch patterns" },
      { status: 500 }
    );
  }
}
