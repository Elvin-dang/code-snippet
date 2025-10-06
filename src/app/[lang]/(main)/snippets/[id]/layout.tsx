import { getSnippet } from "@/lib/data";
import { notFound } from "next/navigation";
import React from "react";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const snippet = await getSnippet(id);

  return {
    title: snippet?.title,
    description: snippet?.description,
    og: {
      title: snippet?.title,
      description: snippet?.description,
      type: "article",
      url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/snippets/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: snippet?.title,
      description: snippet?.description,
    },
  };
}

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const snippet = await getSnippet(id);

  if (!snippet) notFound();

  return children;
};

export default Layout;
