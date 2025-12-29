import { NextResponse } from "next/server";
import { getRandomSentenceForPractice } from "@/lib/db/queries";

export async function GET() {
  try {
    const sentence = await getRandomSentenceForPractice();
    if (!sentence) {
      return NextResponse.json(
        { error: "No sentences available for practice" },
        { status: 404 }
      );
    }
    return NextResponse.json(sentence);
  } catch (error) {
    console.error("Error fetching practice sentence:", error);
    return NextResponse.json(
      { error: "Failed to fetch sentence" },
      { status: 500 }
    );
  }
}
