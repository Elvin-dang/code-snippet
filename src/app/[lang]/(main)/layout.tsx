import { getDictionary } from "../dictionaries";
import { Header } from "@/components/header";

export default async function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: "en" | "vi" }>;
}>) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <Header dict={dict} />
      {children}
    </>
  );
}
