import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");
    const tag = searchParams.get("tag");
    const username = searchParams.get("username");
    const search = searchParams.get("search") || "";
    const language = searchParams.get("language");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const include = {
      user: { select: { username: true, image: true } },
      language: { select: { name: true, slug: true, icon: true } },
      tags: { select: { tag: true } },
    };

    const where: any = {};

    if (username) where.user = { username };
    if (userId) where.userId = userId;
    if (tag) where.tags = { some: { tag: { slug: tag } } };
    if (language && language !== "all") where.language = { slug: language };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { some: { tag: { name: { contains: search, mode: "insensitive" } } } } },
      ];
    }

    const [snippets, total] = await Promise.all([
      prisma.snippet.findMany({
        where,
        include,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.snippet.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      page,
      limit,
      total,
      totalPages,
      snippets: snippets.map((s) => ({
        ...s,
        tags: s.tags.map((t) => t.tag),
      })),
    });
  } catch (error) {
    console.error("Error fetching snippets:", error);
    return NextResponse.json({ code: "SERVER_ERROR" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ code: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, code, language, tags, complexity } = body;

    if (!title || !code || !language) {
      return NextResponse.json({ code: "MISSING_FIELDS" }, { status: 400 });
    }

    const languageId = await prisma.language
      .findUnique({
        where: { slug: language },
      })
      .then((lang) => lang?.id);

    if (!languageId) {
      return NextResponse.json({ code: "INVALID_LANGUAGE" }, { status: 400 });
    }

    const snippet = await prisma.snippet.create({
      data: {
        title,
        description,
        code,
        languageId,
        tags: {
          create: tags.map((tag: string) => ({
            tag: {
              connectOrCreate: {
                where: { slug: tag.toLowerCase().replace(/\s+/g, "-") },
                create: {
                  name: tag,
                  slug: tag.toLowerCase().replace(/\s+/g, "-"),
                },
              },
            },
          })),
        },
        complexity,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      id: snippet.id,
    });
  } catch (error) {
    console.error("Error creating snippet:", error);
    return NextResponse.json({ code: "SERVER_ERROR" }, { status: 500 });
  }
}
