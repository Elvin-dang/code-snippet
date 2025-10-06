import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Braces } from "lucide-react";
import Link from "next/link";
import React from "react";
import { getDictionary } from "../../dictionaries";
import { cookies } from "next/headers";
import { defaultLocale } from "@/lib/utils";

const NotFound = async () => {
  const resolvedCookies = await cookies();
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as "en" | "vi") || defaultLocale;
  const dict = await getDictionary(lang);

  return (
    <div className="container py-8 mx-auto p-4">
      <Card>
        <CardContent className="py-5 text-center">
          <Braces className="mx-auto h-20 w-20 mb-5 opacity-50" />
          <p className="text-muted-foreground">{dict.notFound.message}</p>
          <Button asChild className="mt-4">
            <Link href="/snippets">{dict.notFound.button}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
