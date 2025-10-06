import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const snippet = await prisma.snippet.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            username: true,
            image: true,
          },
        },
        language: {
          select: {
            name: true,
            slug: true,
            icon: true,
          },
        },
        tags: {
          select: {
            tag: true,
          },
        },
      },
    });

    if (!snippet) {
      return NextResponse.json({ code: "SNIPPET_NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json({ ...snippet, tags: snippet.tags.map((t) => t.tag) });
  } catch (error) {
    console.error("Error fetching snippet:", error);
    return NextResponse.json({ code: "SERVER_ERROR" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ code: "UNAUTHORIZED" }, { status: 401 });
    }

    const snippet = await prisma.snippet.findUnique({
      where: {
        id,
      },
    });

    if (!snippet) {
      return NextResponse.json({ code: "SNIPPET_NOT_FOUND" }, { status: 404 });
    }

    if (snippet.userId !== session.user.id) {
      return NextResponse.json({ code: "FORBIDDEN" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, code, language, tags, complexity } = body;

    const languageId = await prisma.language
      .findUnique({
        where: { slug: language },
      })
      .then((lang) => lang?.id);

    if (!languageId) {
      return NextResponse.json({ code: "INVALID_LANGUAGE" }, { status: 400 });
    }

    const updatedSnippet = await prisma.snippet.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(code && { code }),
        languageId,
        ...(complexity !== undefined && { complexity }),
        tags: {
          deleteMany: {},
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
      },
    });

    return NextResponse.json({
      id: updatedSnippet.id,
    });
  } catch (error) {
    console.error("Error updating snippet:", error);
    return NextResponse.json({ code: "SERVER_ERROR" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ code: "UNAUTHORIZED" }, { status: 401 });
    }

    const snippet = await prisma.snippet.findUnique({
      where: {
        id,
      },
    });

    if (!snippet) {
      return NextResponse.json({ code: "SNIPPET_NOT_FOUND" }, { status: 404 });
    }

    if (snippet.userId !== session.user.id) {
      return NextResponse.json({ code: "FORBIDDEN" }, { status: 403 });
    }

    await prisma.snippet.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting snippet:", error);
    return NextResponse.json({ code: "SERVER_ERROR" }, { status: 500 });
  }
}
