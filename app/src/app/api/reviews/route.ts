import { NextResponse } from "next/server";
import { getDueReviews } from "@/lib/db/queries";

export async function GET() {
  try {
    const reviews = await getDueReviews();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
