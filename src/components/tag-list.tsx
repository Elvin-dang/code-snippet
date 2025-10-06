"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tags } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function TagList({ dict }: { dict: any }) {
  const [tags, setTags] = useState<{ slug: string; name: string; count: number }[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      setFetching(true);
      try {
        const response = await fetch("/api/tags");
        const data = await response.json();
        console.log(data);
        setTags(data);
      } finally {
        setFetching(false);
      }
    };

    fetchTags();
  }, []);

  return (
    <div className="container py-8 mx-auto p-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{dict.tagList.title}</h1>
          <p className="text-muted-foreground">{dict.tagList.description}</p>
        </div>

        {tags.length === 0 ? (
          fetching ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <Skeleton className="h-5 w-24 rounded-md" />
                      <Skeleton className="h-5 w-8 rounded-md" />
                    </CardTitle>
                    <CardDescription>
                      <Skeleton className="h-4 w-32 mt-2 rounded-md" />
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Tags className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">{dict.tagList.noTags}</p>
              </CardContent>
            </Card>
          )
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tags.map(({ slug, name, count }) => (
              <Link key={slug} href={`/tags/${encodeURIComponent(slug)}`}>
                <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span className="truncate">{name}</span>
                      <Badge variant="secondary" className="ml-2 shrink-0">
                        {count}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {count} {count === 1 ? "snippet" : "snippets"}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
