import { NextResponse } from "next/server";
import { getAllPatterns, getSentencesForPattern, getWordsByHanziList } from "@/lib/db/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patternId = searchParams.get("patternId");

  try {
    if (patternId) {
      // Get sentences for a specific pattern
      const sentences = await getSentencesForPattern(parseInt(patternId));

      // Collect unique tokens from all sentences
      const allTokens = new Set<string>();
      for (const sentence of sentences) {
        if (sentence.tokens) {
          for (const token of sentence.tokens) {
            allTokens.add(token);
          }
        }
      }

      // Look up word data for tokens
      const words = await getWordsByHanziList(Array.from(allTokens));
      const tokenData: Record<string, { pinyin: string; definition: string }> = {};
      for (const word of words) {
        tokenData[word.hanzi] = {
          pinyin: word.pinyin,
          definition: word.definition,
        };
      }

      return NextResponse.json({ sentences, tokenData });
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
