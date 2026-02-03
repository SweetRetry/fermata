import { desc } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generations } from "@/lib/db/schema";

// Get all generations (library)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get("limit") || "50", 10);
    const offset = Number.parseInt(searchParams.get("offset") || "0", 10);

    const items = await db.query.generations.findMany({
      orderBy: desc(generations.createdAt),
      limit,
      offset,
    });

    return NextResponse.json({
      items: items.map((item) => ({
        id: item.id,
        title: item.title,
        status: item.status,
        audioUrl: item.audioUrl,
        duration: item.duration,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      total: items.length,
    });
  } catch (error) {
    console.error("Library fetch error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch library",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
