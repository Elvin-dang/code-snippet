import { authOptions } from "@/lib/auth";
import { getSnippet } from "@/lib/data";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const snippet = await getSnippet(id);
  const session = await getServerSession(authOptions);

  if (!snippet || session?.user?.id !== snippet?.userId) notFound();

  return children;
};

export default Layout;
