import { NextResponse } from "next/server";
import { getUnlearnedWords } from "@/lib/db/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "20");

  try {
    const words = await getUnlearnedWords(limit);
    return NextResponse.json(words);
  } catch (error) {
    console.error("Error fetching unlearned words:", error);
    return NextResponse.json(
      { error: "Failed to fetch words" },
      { status: 500 }
    );
  }
}
