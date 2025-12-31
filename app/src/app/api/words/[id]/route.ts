import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { words, wordTags } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const wordId = parseInt(id);
    const { hanzi, pinyin, definition, tagIds } = await request.json();

    if (!hanzi || !definition) {
      return NextResponse.json(
        { error: "Hanzi and definition are required" },
        { status: 400 }
      );
    }

    // Update word
    db.update(words)
      .set({
        hanzi: hanzi.trim(),
        pinyin: pinyin?.trim() || "",
        definition: definition.trim(),
      })
      .where(eq(words.id, wordId))
      .run();

    // Update tags if provided
    if (tagIds !== undefined) {
      // Remove existing tags
      db.delete(wordTags).where(eq(wordTags.wordId, wordId)).run();

      // Add new tags
      if (tagIds.length > 0) {
        for (const tagId of tagIds) {
          db.insert(wordTags)
            .values({ wordId, tagId })
            .run();
        }
      }
    }

    const updated = db.select().from(words).where(eq(words.id, wordId)).get();
    return NextResponse.json({ word: updated });
  } catch (error) {
    console.error("Error updating word:", error);
    return NextResponse.json(
      { error: "Failed to update word" },
      { status: 500 }
    );
  }
}
