import { getDictionary } from "@/app/[lang]/dictionaries";
import { SnippetList } from "@/components/snippet-list";

export default async function Page({ params }: { params: Promise<{ lang: "en" | "vi" }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <SnippetList dict={dict} lang={lang} />;
}
