import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sentences } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { chinese } = await request.json();

    if (!chinese) {
      return NextResponse.json(
        { error: "Chinese text is required" },
        { status: 400 }
      );
    }

    const existing = db
      .select()
      .from(sentences)
      .where(eq(sentences.chinese, chinese.trim()))
      .get();

    if (existing) {
      return NextResponse.json({
        exists: true,
        sentence: existing,
      });
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error("Error checking sentence:", error);
    return NextResponse.json(
      { error: "Failed to check sentence" },
      { status: 500 }
    );
  }
}
