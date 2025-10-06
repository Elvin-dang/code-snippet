import { SignupForm } from "@/components/signup-form";
import React from "react";
import { getDictionary } from "../../dictionaries";

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ lang: "en" | "vi" }>;
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const searchParamsResolved = await searchParams;

  return <SignupForm dict={dict} callbackUrl={searchParamsResolved?.callbackUrl} />;
};

export default Page;
