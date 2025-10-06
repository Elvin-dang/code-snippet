import { getDictionary } from "@/app/[lang]/dictionaries";
import { TagInfo } from "@/components/tag-info";

export default async function Page({ params }: { params: Promise<{ lang: "en" | "vi" }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <TagInfo dict={dict} lang={lang} />;
}
