import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sentences, sentenceTags } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sentenceId = parseInt(id);
    const { chinese, english, pinyin, tagIds } = await request.json();

    if (!chinese || !english) {
      return NextResponse.json(
        { error: "Chinese and English are required" },
        { status: 400 }
      );
    }

    // Update sentence
    db.update(sentences)
      .set({
        chinese: chinese.trim(),
        english: english.trim(),
        pinyin: pinyin?.trim() || null,
      })
      .where(eq(sentences.id, sentenceId))
      .run();

    // Update tags if provided
    if (tagIds !== undefined) {
      // Remove existing tags
      db.delete(sentenceTags).where(eq(sentenceTags.sentenceId, sentenceId)).run();

      // Add new tags
      if (tagIds.length > 0) {
        for (const tagId of tagIds) {
          db.insert(sentenceTags)
            .values({ sentenceId, tagId })
            .run();
        }
      }
    }

    const updated = db.select().from(sentences).where(eq(sentences.id, sentenceId)).get();
    return NextResponse.json({ sentence: updated });
  } catch (error) {
    console.error("Error updating sentence:", error);
    return NextResponse.json(
      { error: "Failed to update sentence" },
      { status: 500 }
    );
  }
}
