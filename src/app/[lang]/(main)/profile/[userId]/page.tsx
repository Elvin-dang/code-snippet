"use client";

import { useEffect, useState } from "react";
import { SnippetCard } from "@/components/snippet-card";
import { Card, CardContent } from "@/components/ui/card";
import { User, Calendar, Code2 } from "lucide-react";
import { useParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { SnippetCardSkeleton } from "@/components/snippet-card-skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState<any>(null);
  const [snippets, setSnippets] = useState<any[]>([]);
  const [fetchingSnippets, setFetchingSnippets] = useState(true);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [renderPaginationBar, setRenderPaginationBar] = useState(false);
  const limit = 6;

  useEffect(() => {
    const fetchSnippets = async () => {
      setFetchingSnippets(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      const response = await fetch(`/api/snippets?userId=${userId}&${params.toString()}`);
      const data = await response.json();

      setSnippets(data.snippets);
      setTotalPages(data.totalPages);
      setTotal(data.total);
      setFetchingSnippets(false);
      setRenderPaginationBar(data.totalPages > 1);
    };

    fetchSnippets();
  }, [userId, page]);

  useEffect(() => {
    const fetchUser = async () => {
      setFetchingUser(true);
      const response = await fetch(`/api/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        setUser(null);
      }
      setFetchingUser(false);
    };

    fetchUser();
  }, [userId]);

  if (!user && !fetchingUser) {
    return (
      <div className="container py-8 mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">User not found</h2>
            <p className="text-muted-foreground mb-4">
              This user doesn't exist or hasn't shared any snippets yet.
            </p>
            <Button asChild>
              <Link href="/snippets">Browse Snippets</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="container py-8 mx-auto p-4">
      <div className="space-y-8">
        {fetchingUser ? (
          <Card>
            <CardContent>
              <div className="flex items-start gap-6">
                <Skeleton className="h-20 w-20 rounded-full" />

                <div className="flex-1 min-w-0 space-y-3">
                  <Skeleton className="h-8 w-40 rounded-md" />

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent>
              <div className="flex items-start gap-6">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {formatDate(user.createdAt)}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      <Code2 className="h-4 w-4" />
                      <span>
                        {snippets.length} {snippets.length === 1 ? "snippet" : "snippets"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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

        <div>
          {user && <h2 className="text-2xl font-bold mb-6">Snippets by {user.username}</h2>}
          {fetchingSnippets ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(limit)].map((_, i) => (
                <SnippetCardSkeleton key={i} />
              ))}
            </div>
          ) : snippets.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No snippets yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {snippets.map((snippet) => (
                <SnippetCard key={snippet.id} snippet={snippet} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
