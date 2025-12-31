import { NextResponse } from "next/server";
import translate from "google-translate-api-x";

export async function POST(request: Request) {
  try {
    const { text, from = "zh", to = "en" } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const result = await translate(text, { from, to, forceFrom: true });

    return NextResponse.json({
      translation: result.text,
      from: result.from.language.iso,
    });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Failed to translate" },
      { status: 500 }
    );
  }
}
