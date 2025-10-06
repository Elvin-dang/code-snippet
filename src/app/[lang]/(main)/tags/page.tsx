import { getDictionary } from "@/app/[lang]/dictionaries";
import { TagList } from "@/components/tag-list";

export default async function Page({ params }: { params: Promise<{ lang: "en" | "vi" }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <TagList dict={dict} />;
}
