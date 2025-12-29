/**
 * SM-2 Spaced Repetition Algorithm
 *
 * Quality ratings:
 * 0 - Complete blackout, no recall
 * 1 - Incorrect, but upon seeing correct answer, remembered
 * 2 - Incorrect, but correct answer seemed easy to recall
 * 3 - Correct with serious difficulty
 * 4 - Correct with some hesitation
 * 5 - Perfect response
 */

export interface SM2Result {
  easeFactor: number;
  interval: number;
  nextReview: string; // ISO date string
  repetition: number;
}

export interface SM2Input {
  quality: number; // 0-5
  easeFactor: number; // Current ease factor (default 2.5)
  interval: number; // Current interval in days
  repetition: number; // Number of successful reviews
}

/**
 * Calculate the next review parameters using SM-2 algorithm.
 */
export function calculateSM2({
  quality,
  easeFactor,
  interval,
  repetition,
}: SM2Input): SM2Result {
  // Clamp quality to 0-5
  quality = Math.max(0, Math.min(5, quality));

  let newEaseFactor = easeFactor;
  let newInterval = interval;
  let newRepetition = repetition;

  if (quality < 3) {
    // Failed review - reset
    newRepetition = 0;
    newInterval = 1;
  } else {
    // Successful review
    if (newRepetition === 0) {
      newInterval = 1;
    } else if (newRepetition === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * easeFactor);
    }
    newRepetition += 1;
  }

  // Update ease factor
  newEaseFactor =
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // Minimum ease factor is 1.3
  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3;
  }

  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);
  const nextReview = nextReviewDate.toISOString().split("T")[0];

  return {
    easeFactor: Math.round(newEaseFactor * 100) / 100,
    interval: newInterval,
    nextReview,
    repetition: newRepetition,
  };
}

/**
 * Map button labels to quality ratings
 */
export const QUALITY_RATINGS = {
  again: 0,
  hard: 3,
  good: 4,
  easy: 5,
} as const;

export type QualityLabel = keyof typeof QUALITY_RATINGS;

/**
 * Get the next interval preview for each rating option
 */
export function getIntervalPreviews(
  easeFactor: number,
  interval: number,
  repetition: number
): Record<QualityLabel, string> {
  const previews: Record<QualityLabel, string> = {
    again: "1d",
    hard: "",
    good: "",
    easy: "",
  };

  for (const [label, quality] of Object.entries(QUALITY_RATINGS)) {
    const result = calculateSM2({ quality, easeFactor, interval, repetition });
    previews[label as QualityLabel] = formatInterval(result.interval);
  }

  return previews;
}

/**
 * Format interval as human-readable string
 */
export function formatInterval(days: number): string {
  if (days === 1) return "1d";
  if (days < 7) return `${days}d`;
  if (days < 30) return `${Math.round(days / 7)}w`;
  if (days < 365) return `${Math.round(days / 30)}mo`;
  return `${Math.round(days / 365)}y`;
}

/**
 * Get word mastery status based on interval
 */
export function getMasteryStatus(
  interval: number
): "new" | "learning" | "mastered" {
  if (interval <= 1) return "new";
  if (interval < 21) return "learning";
  return "mastered";
}
