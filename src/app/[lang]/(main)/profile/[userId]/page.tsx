import { getDictionary } from "@/app/[lang]/dictionaries";
import { ProfilePage } from "@/components/profile-page";

export default async function Page({ params }: { params: Promise<{ lang: "en" | "vi" }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <ProfilePage dict={dict} lang={lang} />;
}
