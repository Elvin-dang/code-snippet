import { LoginForm } from "@/components/login-form";
import React from "react";
import { getDictionary } from "../../dictionaries";

const Page = async ({ params }: { params: Promise<{ lang: "en" | "vi" }> }) => {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <LoginForm dict={dict} />;
};

export default Page;
