import { cache } from "react";
import prisma from "./prisma";

export const getSnippet = cache(async (id: string) => {
  const res = await prisma.snippet.findFirst({ where: { id } });
  return res;
});
