import { getDictionary } from "@/app/[lang]/dictionaries";
import { SnippetInfo } from "@/components/snippet-info";

export default async function Page({ params }: { params: Promise<{ lang: "en" | "vi" }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <SnippetInfo dict={dict} lang={lang} />;
}
