import { NextResponse } from "next/server";
import {
  getLearnedWordsCount,
  getLearnedWordsByLevel,
  getTotalWordsByLevel,
  getDueReviews,
  getSettings,
  getTodayStats,
} from "@/lib/db/queries";

export async function GET() {
  try {
    const [
      learnedCount,
      learnedByLevel,
      totalByLevel,
      dueReviews,
      settings,
      todayStats,
    ] = await Promise.all([
      getLearnedWordsCount(),
      getLearnedWordsByLevel(),
      getTotalWordsByLevel(),
      getDueReviews(),
      getSettings(),
      getTodayStats(),
    ]);

    // Build level progress
    const levelProgress = totalByLevel.map((total) => {
      const learned = learnedByLevel.find((l) => l.level === total.level);
      return {
        level: total.level,
        learned: learned?.count || 0,
        total: total.count,
      };
    });

    return NextResponse.json({
      learnedCount,
      dueReviewsCount: dueReviews.length,
      streak: settings.currentStreak,
      levelProgress,
      todayStats,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
