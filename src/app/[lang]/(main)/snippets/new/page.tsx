import { getDictionary } from "@/app/[lang]/dictionaries";
import { SnippetForm } from "@/components/snippet-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewSnippetPage({
  params,
}: {
  params: Promise<{ lang: "en" | "vi" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="container p-4 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Snippet</CardTitle>
          <CardDescription>Share your code with the community</CardDescription>
        </CardHeader>
        <CardContent>
          <SnippetForm dict={dict} />
        </CardContent>
      </Card>
    </div>
  );
}
