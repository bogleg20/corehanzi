import { NextResponse } from "next/server";
import { getDueSentenceReviews, getTagByName } from "@/lib/db/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "20");
  const tagsParam = searchParams.get("tags");

  try {
    let tagIds: number[] | undefined;

    if (tagsParam) {
      const tagNames = tagsParam.split(",").map((t) => t.trim()).filter(Boolean);
      const tagPromises = tagNames.map((name) => getTagByName(name));
      const tags = await Promise.all(tagPromises);
      tagIds = tags.filter((t) => t !== undefined).map((t) => t!.id);
    }

    const sentences = await getDueSentenceReviews(limit, tagIds);
    return NextResponse.json(sentences);
  } catch (error) {
    console.error("Error fetching sentence reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch sentence reviews" },
      { status: 500 }
    );
  }
}
