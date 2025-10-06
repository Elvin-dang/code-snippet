import { getDictionary } from "@/app/[lang]/dictionaries";
import { SnippetForm } from "@/components/snippet-form";
import { SnippetFormUpdate } from "@/components/snippet-form-update";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditSnippetPage({
  params,
}: {
  params: Promise<{ lang: "en" | "vi"; id: string }>;
}) {
  const { lang, id } = await params;
  const dict = await getDictionary(lang);

  const snippet = await prisma.snippet.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
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

  if (!snippet) notFound();

  return (
    <div className="container p-4 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{dict.updateSnippet.title}</CardTitle>
          <CardDescription>{dict.updateSnippet.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <SnippetFormUpdate
            dict={dict}
            snippet={{ ...snippet, tags: snippet.tags.map((t) => t.tag.name) }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
