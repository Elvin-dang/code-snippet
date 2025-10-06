"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SnippetCard } from "@/components/snippet-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Share } from "lucide-react";
import { useParams } from "next/navigation";
import { SnippetCardSkeleton } from "@/components/snippet-card-skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";

export function TagInfo({ dict, lang }: { dict: any; lang: string }) {
  const { slug } = useParams();
  const [snippets, setSnippets] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [renderPaginationBar, setRenderPaginationBar] = useState(false);
  const limit = 6;

  useEffect(() => {
    const fetchSnippets = async () => {
      setFetching(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      const response = await fetch(`/api/snippets?tag=${slug}&${params.toString()}`);
      const data = await response.json();
      setSnippets(data.snippets);
      setTotalPages(data.totalPages);
      setTotal(data.total);
      setFetching(false);
      setRenderPaginationBar(data.totalPages > 1);
    };

    fetchSnippets();
  }, [slug, page]);

  const link = `${process.env.NEXT_PUBLIC_SITE_URL}/tags/${slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    toast.success("Copied 🎉", {
      position: "top-center",
      duration: 2000,
    });
  };

  return (
    <div className="container py-8 mx-auto p-4">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/tags">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {dict.tagInfo.backAction}
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{dict.tagInfo.tag}:</h1>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {slug}
          </Badge>
          <Button variant="outline" size="sm" onClick={handleCopyLink}>
            <Share className="h-4 w-4 md:mr-2" />
            <span className="md:block hidden">{dict.snippet.share}</span>
          </Button>
        </div>

        <p className="text-muted-foreground">
          {total} {total === 1 ? dict.tagInfo.oneTag : dict.tagInfo.manyTags}{" "}
          {dict.tagInfo.taggedWith} &quot;{slug}&quot;
        </p>

        {renderPaginationBar && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage((prev) => prev - 1);
                  }}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(i + 1);
                    }}
                    isActive={page === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {totalPages > 5 && <PaginationEllipsis />}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) setPage((prev) => prev + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        {fetching ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(limit)].map((_, i) => (
              <SnippetCardSkeleton key={i} />
            ))}
          </div>
        ) : snippets.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">{dict.tagInfo.noSnippets}</p>
              <Button asChild>
                <Link href="/snippets">{dict.tagInfo.browseAllSnippets}</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {snippets.map((snippet) => (
              <SnippetCard key={snippet.id} snippet={snippet} dict={dict} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
