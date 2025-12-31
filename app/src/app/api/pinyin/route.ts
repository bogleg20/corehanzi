import { NextResponse } from "next/server";
import { pinyin } from "pinyin-pro";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const result = pinyin(text, {
      toneType: "symbol",
      type: "string",
    });

    return NextResponse.json({ pinyin: result });
  } catch (error) {
    console.error("Error generating pinyin:", error);
    return NextResponse.json(
      { error: "Failed to generate pinyin" },
      { status: 500 }
    );
  }
}
