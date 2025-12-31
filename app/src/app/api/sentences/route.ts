import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sentences, sentenceTags } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { chinese, english, pinyin, tagIds } = await request.json();

    if (!chinese || !english) {
      return NextResponse.json(
        { error: "Chinese and English are required" },
        { status: 400 }
      );
    }

    // Check if sentence already exists
    const existing = db
      .select()
      .from(sentences)
      .where(eq(sentences.chinese, chinese.trim()))
      .get();

    if (existing) {
      return NextResponse.json(
        { error: "Sentence already exists", existingId: existing.id },
        { status: 409 }
      );
    }

    // Insert new sentence
    const result = db
      .insert(sentences)
      .values({
        chinese: chinese.trim(),
        english: english.trim(),
        pinyin: pinyin?.trim() || null,
        difficultyScore: 0,
      })
      .returning()
      .get();

    // Add tags if provided
    if (tagIds && tagIds.length > 0 && result) {
      for (const tagId of tagIds) {
        db.insert(sentenceTags)
          .values({ sentenceId: result.id, tagId })
          .run();
      }
    }

    return NextResponse.json({ sentence: result });
  } catch (error) {
    console.error("Error creating sentence:", error);
    return NextResponse.json(
      { error: "Failed to create sentence" },
      { status: 500 }
    );
  }
}
