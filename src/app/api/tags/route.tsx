import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const snippets = await prisma.snippet.findMany({
      select: {
        tags: {
          select: {
            tag: {
              select: {
                slug: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const tagCounts: Record<string, { count: number; name: string }> = {};

    snippets.forEach((snippet) => {
      snippet.tags.forEach(({ tag }) => {
        const { slug, name } = tag;
        if (!tagCounts[slug]) {
          tagCounts[slug] = { count: 0, name };
        }
        tagCounts[slug].count += 1;
      });
    });

    const tags = Object.entries(tagCounts)
      .map(([slug, { count, name }]) => ({ slug, name, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json({ code: "SERVER_ERROR" }, { status: 500 });
  }
}
