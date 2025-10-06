import { getTag } from "@/lib/data";
import { notFound } from "next/navigation";
import React from "react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tag = await getTag(slug);

  return {
    title: tag?.slug,
    description: tag?.name,
    og: {
      title: tag?.slug,
      description: tag?.name,
      type: "article",
      url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/tags/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: tag?.slug,
      description: tag?.name,
    },
  };
}

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const tag = await getTag(slug);

  if (!tag) notFound();

  return children;
};

export default Layout;
