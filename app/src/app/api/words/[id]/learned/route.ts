import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { wordProgress } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const wordId = parseInt(id);

  if (isNaN(wordId)) {
    return NextResponse.json({ error: "Invalid word ID" }, { status: 400 });
  }

  try {
    // Check if already learned
    const existing = db
      .select()
      .from(wordProgress)
      .where(eq(wordProgress.wordId, wordId))
      .get();

    if (existing) {
      return NextResponse.json({ learned: true, message: "Already learned" });
    }

    // Mark as mastered (set far-future review date)
    const farFuture = new Date();
    farFuture.setFullYear(farFuture.getFullYear() + 10);
    db.insert(wordProgress)
      .values({
        wordId,
        easeFactor: 2.5,
        interval: 365,
        nextReview: farFuture.toISOString().split("T")[0],
        timesCorrect: 1,
        timesSeen: 1,
        lastReview: new Date().toISOString(),
      })
      .run();

    return NextResponse.json({ learned: true });
  } catch (error) {
    console.error("Error marking word as learned:", error);
    return NextResponse.json(
      { error: "Failed to mark word as learned" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const wordId = parseInt(id);

  if (isNaN(wordId)) {
    return NextResponse.json({ error: "Invalid word ID" }, { status: 400 });
  }

  try {
    db.delete(wordProgress).where(eq(wordProgress.wordId, wordId)).run();
    return NextResponse.json({ learned: false });
  } catch (error) {
    console.error("Error unmarking word as learned:", error);
    return NextResponse.json(
      { error: "Failed to unmark word as learned" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const wordId = parseInt(id);

  if (isNaN(wordId)) {
    return NextResponse.json({ error: "Invalid word ID" }, { status: 400 });
  }

  try {
    const progress = db
      .select()
      .from(wordProgress)
      .where(eq(wordProgress.wordId, wordId))
      .get();

    return NextResponse.json({ learned: !!progress });
  } catch (error) {
    console.error("Error checking learned status:", error);
    return NextResponse.json(
      { error: "Failed to check learned status" },
      { status: 500 }
    );
  }
}
