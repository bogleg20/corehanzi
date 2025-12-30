import { NextResponse } from "next/server";
import { getSentencesForWord, getWordsByHanziList } from "@/lib/db/queries";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const wordId = parseInt(params.id);

  if (isNaN(wordId)) {
    return NextResponse.json({ error: "Invalid word ID" }, { status: 400 });
  }

  try {
    const sentences = await getSentencesForWord(wordId);

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
  } catch (error) {
    console.error("Error fetching sentences:", error);
    return NextResponse.json(
      { error: "Failed to fetch sentences" },
      { status: 500 }
    );
  }
}
