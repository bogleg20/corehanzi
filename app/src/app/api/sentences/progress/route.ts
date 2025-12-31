import { NextResponse } from "next/server";
import {
  getSentenceProgress,
  createSentenceProgress,
  updateSentenceProgress,
} from "@/lib/db/queries";

export async function POST(request: Request) {
  try {
    const { sentenceId, quality } = await request.json();

    if (!sentenceId || quality === undefined) {
      return NextResponse.json(
        { error: "sentenceId and quality are required" },
        { status: 400 }
      );
    }

    const existing = await getSentenceProgress(sentenceId);
    const today = new Date().toISOString().split("T")[0];

    if (!existing) {
      // First review - create new progress record
      const easeFactor = quality >= 3 ? 2.5 : 2.0;
      const interval = quality >= 3 ? 1 : 0;
      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + interval);

      await createSentenceProgress(
        sentenceId,
        nextReview.toISOString().split("T")[0],
        { easeFactor, interval }
      );

      return NextResponse.json({
        success: true,
        isNew: true,
        nextReview: nextReview.toISOString().split("T")[0],
      });
    }

    // SM-2 algorithm for existing progress
    let { easeFactor, interval, timesCorrect } = existing;

    if (quality >= 3) {
      // Correct response
      timesCorrect = (timesCorrect || 0) + 1;

      if (interval === 0) {
        interval = 1;
      } else if (interval === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }

      // Update ease factor
      easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      if (easeFactor < 1.3) easeFactor = 1.3;
    } else {
      // Incorrect response - reset
      interval = 0;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
    }

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    await updateSentenceProgress(sentenceId, {
      easeFactor,
      interval,
      nextReview: nextReview.toISOString().split("T")[0],
      timesCorrect,
      lastReview: today,
    });

    return NextResponse.json({
      success: true,
      isNew: false,
      nextReview: nextReview.toISOString().split("T")[0],
      interval,
    });
  } catch (error) {
    console.error("Error recording sentence progress:", error);
    return NextResponse.json(
      { error: "Failed to record progress" },
      { status: 500 }
    );
  }
}
