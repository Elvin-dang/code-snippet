"use client";

import { useEffect, useState } from "react";
import { SnippetCard } from "@/components/snippet-card";
import { SnippetCardSkeleton } from "@/components/snippet-card-skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { languages } from "@/lib/utils";
import { da } from "zod/v4/locales";

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [renderPaginationBar, setRenderPaginationBar] = useState(false);
  const limit = 6;

  useEffect(() => {
    const handler = setTimeout(() => {
      const fetchSnippets = async () => {
        setFetching(true);

        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        if (search) params.set("search", search);
        if (languageFilter !== "all") params.set("language", languageFilter);

        const response = await fetch(`/api/snippets?${params}`);
        const data = await response.json();

        setSnippets(data.snippets);
        setTotalPages(data.totalPages);
        setFetching(false);
        setRenderPaginationBar(data.totalPages > 1);
      };

      fetchSnippets();
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const fetchSnippets = async () => {
      setFetching(true);

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (search) params.set("search", search);
      if (languageFilter !== "all") params.set("language", languageFilter);

      const response = await fetch(`/api/snippets?${params}`);
      const data = await response.json();

      setSnippets(data.snippets);
      setTotalPages(data.totalPages);
      setFetching(false);
      setRenderPaginationBar(data.totalPages > 1);
    };

    fetchSnippets();
  }, [page, languageFilter]);

  return (
    <div className="container py-8 mx-auto px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Explore Snippets</h1>
          <p className="text-muted-foreground">Discover code snippets shared by the community</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search snippets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={languageFilter} onValueChange={setLanguageFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="all" value="all">
                All Languages
              </SelectItem>
              {languages.map((lang) => (
                <SelectItem key={lang.slug} value={lang.slug}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
          <div className="text-center py-12">
            <p className="text-muted-foreground">No snippets found. Be the first to share one!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {snippets.map((snippet) => (
              <SnippetCard key={snippet.id} snippet={snippet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
