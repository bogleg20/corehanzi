import { NextResponse } from "next/server";
import {
  createWordProgress,
  updateWordProgress,
  getWordProgress,
  updateStreak,
} from "@/lib/db/queries";
import { calculateSM2, QUALITY_RATINGS, QualityLabel } from "@/lib/srs/sm2";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { wordId, quality } = body;

    if (!wordId || quality === undefined) {
      return NextResponse.json(
        { error: "wordId and quality are required" },
        { status: 400 }
      );
    }

    // Get existing progress or create new
    const existing = await getWordProgress(wordId);

    if (!existing) {
      // First time seeing this word
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      await createWordProgress(wordId, tomorrow.toISOString().split("T")[0]);

      // Update streak
      await updateStreak();

      return NextResponse.json({ success: true, isNew: true });
    }

    // Calculate new SM-2 values
    const qualityValue =
      typeof quality === "string"
        ? QUALITY_RATINGS[quality as QualityLabel]
        : quality;

    const result = calculateSM2({
      quality: qualityValue,
      easeFactor: existing.easeFactor,
      interval: existing.interval,
      repetition: existing.timesSeen,
    });

    // Update progress
    await updateWordProgress(wordId, {
      easeFactor: result.easeFactor,
      interval: result.interval,
      nextReview: result.nextReview,
      timesSeen: existing.timesSeen + 1,
      timesCorrect:
        qualityValue >= 3 ? existing.timesCorrect + 1 : existing.timesCorrect,
      lastReview: new Date().toISOString(),
    });

    // Update streak
    await updateStreak();

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}
