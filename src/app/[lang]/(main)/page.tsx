import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Tags, Users, Zap } from "lucide-react";
import { getDictionary } from "../dictionaries";

export default async function HomePage({ params }: { params: Promise<{ lang: "en" | "vi" }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="container mx-auto p-4">
      <section className="text-center space-y-6 py-12 md:py-20">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
          {dict.home.title} <span className="text-primary">{dict.home.titleHighlight}</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
          {dict.home.subtitle}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button asChild size="lg">
            <Link href="/signup">{dict.home.getStarted}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/snippets">{dict.home.exploreSnippets}</Link>
          </Button>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <h2 className="text-3xl font-bold text-center mb-12">{dict.home.featuresTitle}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Code2 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{dict.home.codeSnippets}</CardTitle>
              <CardDescription>{dict.home.codeSnippetsDesc}</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Tags className="h-10 w-10 mb-2" />
              <CardTitle>{dict.home.smartTagging}</CardTitle>
              <CardDescription>{dict.home.smartTaggingDesc}</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{dict.home.userProfiles}</CardTitle>
              <CardDescription>{dict.home.userProfilesDesc}</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 mb-2" />
              <CardTitle>{dict.home.complexityAnalysis}</CardTitle>
              <CardDescription>{dict.home.complexityAnalysisDesc}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="py-12 md:py-20 text-center">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="py-12 space-y-4">
            <h2 className="text-3xl font-bold">{dict.home.ctaTitle}</h2>
            <p className="text-lg opacity-90 max-w-xl mx-auto">{dict.home.ctaSubtitle}</p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/signup">{dict.home.createAccount}</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
