import { NextResponse } from "next/server";
import { getRandomSentenceForPractice, getWordsByHanziList } from "@/lib/db/queries";

export async function GET() {
  try {
    const sentence = await getRandomSentenceForPractice();
    if (!sentence) {
      return NextResponse.json(
        { error: "No sentences available for practice" },
        { status: 404 }
      );
    }

    // Look up word data for tokens
    const tokens = sentence.tokens || [];
    const words = await getWordsByHanziList(tokens);
    const tokenData: Record<string, { pinyin: string; definition: string }> = {};
    for (const word of words) {
      tokenData[word.hanzi] = {
        pinyin: word.pinyin,
        definition: word.definition,
      };
    }

    return NextResponse.json({ sentence, tokenData });
  } catch (error) {
    console.error("Error fetching practice sentence:", error);
    return NextResponse.json(
      { error: "Failed to fetch sentence" },
      { status: 500 }
    );
  }
}
