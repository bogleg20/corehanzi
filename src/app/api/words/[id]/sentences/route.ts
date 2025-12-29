import { NextResponse } from "next/server";
import { getSentencesForWord } from "@/lib/db/queries";

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
    return NextResponse.json(sentences);
  } catch (error) {
    console.error("Error fetching sentences:", error);
    return NextResponse.json(
      { error: "Failed to fetch sentences" },
      { status: 500 }
    );
  }
}
