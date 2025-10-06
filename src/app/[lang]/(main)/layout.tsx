import { getDictionary } from "../dictionaries";
import { Header } from "@/components/header";

export default async function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "vi");

  return (
    <>
      <Header dict={dict} />
      {children}
    </>
  );
}
